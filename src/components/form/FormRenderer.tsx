'use client'

import { Question } from "@/schemas/form.schema";
import {useEffect, useState} from "react";
import { submitFormResponse } from "@/actions/response.actions";
import { FaSpinner } from "react-icons/fa";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {
    restoreProgress,
    setCurrentQuestionId,
    toggleNextQuestion,
    togglePrevQuestion,
    updateAnswer,
} from "@/store/slices/responseSlice";
import {IoIosArrowBack} from "react-icons/io";
import {Options} from "@/components/form/FormOptions";
import {Answers} from "@/schemas/response.schema";

export default function FormRenderer({ questions, formId }: { questions: Question[], formId: string }) {
    const currentQuestionId = useAppSelector((state) => state.response.currentQuestionId);
    const answers = useAppSelector((state) => state.response.answers);
    const history = useAppSelector((state) => state.response.history);
    const dispatch = useAppDispatch();

    const [errors, setErrors] = useState<string[]>([]);

    const [globalError, setGlobalError] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const progress = window.localStorage.getItem("surveyProgress");

        if (progress) {
            dispatch(restoreProgress(JSON.parse(progress)));
        } else {
            dispatch(setCurrentQuestionId(questions[0].id))
        }
    }, []);

    const handleCheckboxChange = (questionId: string, optionValue: string) => {
        setErrors(prev => prev.filter((v) => v !== questionId));
        setGlobalError(null);

        const currentSelected = (answers[questionId] as string[]) || [];

        if (currentSelected.includes(optionValue)) {
            dispatch(updateAnswer({ questionId, value: currentSelected.filter((item) => item !== optionValue) }));
        } else {
            dispatch(updateAnswer({ questionId, value: [...currentSelected, optionValue]}));
        }
    }

    const handleTextChange = (questionId: string, value: string) => {
        setErrors(prev => prev.filter((v) => v !== questionId));
        setGlobalError(null);

        dispatch(updateAnswer({ questionId, value: value.trim() }));
    }

    const handleChoiceChange = (questionId: string, value: string) => {
        setErrors(prev => prev.filter((v) => v !== questionId));
        setGlobalError(null);

        dispatch(updateAnswer({ questionId, value: value.trim() }));
    }

    async function handleSubmit() {
        setErrors([]);
        setGlobalError(null);

        if (!currentQuestionId) return;

        if (questions[findQuestionIndexById(currentQuestionId)!].required) {
            if (!answers[currentQuestionId] || !answers[currentQuestionId].length) {
                setErrors((prev) => [...prev, currentQuestionId]);

                return;
            }
        }

        try {
            setIsSubmitting(true);

            const validIds = [...history, currentQuestionId];

            const answersToSave = Object.fromEntries(
                Object.entries(answers).filter(([key]) => validIds.includes(key))
            ) as Answers;

            const result = await submitFormResponse(formId, answersToSave);

            if (result.success) {
                setIsSuccess(true);
                window.localStorage.removeItem("surveyProgress");
            } else {
                setGlobalError("Failed to save your response. Please try again.");
            }
        } catch (error) {
            setGlobalError("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function findQuestionIndexById(questionId: string) {
        const index = questions.findIndex((q) => q.id === questionId);

        return index === -1 ? null : index;
    }

    function getNextQuestion() {
        if (!currentQuestionId) return null;

        const currentIndex = findQuestionIndexById(currentQuestionId);
        if (currentIndex === null) return null;

        for (let i = currentIndex + 1; i < questions.length; i++) {
            const question = questions[i];

            if (!question.condition) {
                return question.id;
            }

            const targetAnswers = answers[question.condition.targetQuestionId];
            const expectedValues = question.condition.expectedValue;
            const targetQuestion = questions.find((q) => q.id === question.condition?.targetQuestionId);

            if (targetQuestion?.type === Options.CHECKBOX) {
                if (!Array.isArray(targetAnswers) || !Array.isArray(expectedValues)) {
                    continue;
                }

                if (targetAnswers.length !== expectedValues.length) {
                    continue;
                }

                const isMatch = expectedValues.every((option: string) =>
                    targetAnswers.map(String).includes(String(option))
                );

                if (isMatch) {
                    return question.id;
                }
            } else if (targetQuestion?.type === Options.TEXT || targetQuestion?.type === Options.CHOICE) {
                if (String(targetAnswers) === String(expectedValues)) {
                    return question.id;
                }
            }
        }

        return null;
    }

    const nextId = getNextQuestion();

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center mt-8 bg-black/5 rounded-xl border border-gray-100">
                <h2 className="text-2xl text-gray-800 mb-2">Thank you!</h2>
                <p className="text-gray-500">Your response has been recorded successfully.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 mt-8">
            {questions
                .filter((q) => q.id === currentQuestionId)
                .map((question) => (
                <div key={question.id} className="flex flex-col gap-3">
                    <label className="text-lg text-gray-500">
                        {findQuestionIndexById(question.id)! + 1}. {question.title} {question.required && (<span className="text-red-500">*</span>)}
                    </label>

                    {question.type === "TEXT" && (
                        <input
                            type="text"
                            placeholder="Type your answer"
                            className="text-gray-800 text-lg border-b-2 border-gray-200 bg-transparent focus:border-black focus:outline-none transition-colors py-2 w-full"
                            value={(answers[question.id] as string) || ""}
                            onChange={(e) => handleTextChange(question.id, e.target.value)}
                        />
                    )}

                    {question.type === "CHOICE" && (
                        <div className="flex flex-col gap-2">
                            {question.options?.map(({ value }, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input
                                        name={question.id}
                                        type="radio"
                                        id={`${question.id}-choice-${index}`}
                                        className="accent-black w-4 h-4 cursor-pointer"
                                        checked={answers[question.id] === value}
                                        onChange={() => handleChoiceChange(question.id, value)}
                                    />
                                    <label htmlFor={`${question.id}-choice-${index}`} className="cursor-pointer text-gray-700">{value}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    {question.type === "CHECKBOX" && (
                        <div className="flex flex-col gap-2">
                            {question.options?.map(({ value }, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input
                                        name={question.id}
                                        type="checkbox"
                                        id={`${question.id}-checkbox-${index}`}
                                        className="accent-black w-4 h-4 cursor-pointer"
                                        checked={((answers[question.id] as string[]) || []).includes(value)}
                                        onChange={() => handleCheckboxChange(question.id, value)}
                                    />
                                    <label htmlFor={`${question.id}-checkbox-${index}`} className="cursor-pointer text-gray-700">{value}</label>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.includes(question.id) && (
                        <p className="text-sm text-red-500 mt-1">This field is required</p>
                    )}
                </div>
            ))}

            {globalError && (
                <p className="text-red-500 text-sm">{globalError}</p>
            )}

            <div className="flex flex-row gap-3 justify-between w-full sm:w-auto mt-4 md:px-8 lg:px-14 xl:px-22">
                <button
                    className="bg-black hover:bg-gray-800 text-white rounded-md py-3 px-6 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => dispatch(togglePrevQuestion())}
                    disabled={!history.length}
                >
                    <IoIosArrowBack />
                </button>

                {!nextId ? (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-black hover:bg-gray-800 text-white rounded-md py-3 px-6 flex-1 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            "Submit"
                        )}
                    </button>
                ) : (
                    <button
                        className="bg-black hover:bg-gray-800 text-white rounded-md py-3 px-6 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={() => {
                            if (!currentQuestionId) return;

                            if (questions[findQuestionIndexById(currentQuestionId)!].required) {
                                if (!answers[currentQuestionId] || !answers[currentQuestionId].length) {
                                    setErrors((prev) => [...prev, currentQuestionId]);

                                    return;
                                }
                            }

                            dispatch(setCurrentQuestionId(nextId));
                            dispatch(toggleNextQuestion(currentQuestionId));
                        }}
                        disabled={!nextId}
                    >
                        <IoIosArrowBack className="rotate-180" />
                    </button>
                )}
            </div>
        </div>
    );
}