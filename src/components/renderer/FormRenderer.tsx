'use client'

import { Question, QuestionType } from "@/schemas/form.schema";
import { useEffect, useState } from "react";
import { submitFormResponse } from "@/actions/response.actions";
import { FaSpinner } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    restoreProgress,
    selectResponseAnswers,
    selectResponseCurrentQuestionId,
    selectResponseHistory,
    setCurrentQuestionId,
    toggleNextQuestion,
    togglePrevQuestion,
    updateAnswer,
} from "@/store/slices/responseSlice";
import { IoIosArrowBack } from "react-icons/io";
import { RawAnswers, } from "@/schemas/response.schema";
import { isConditionMet } from "@/utils/isConditionMet";
import TextQuestionField from "./FormRendererFields/TextQuestionField";
import { getArrayAnswer, getNumberAnswer, getStringAnswer } from "@/utils/answerGetters";
import ChoiceQuestionField from "./FormRendererFields/ChoiceQuestionField";
import CheckboxQuestionField from "./FormRendererFields/CheckboxQuestionField";
import RatingQuestionField from "./FormRendererFields/RatingQuestionField";
import NpsQuestionField from "./FormRendererFields/NpsQuestionField";
import EmailQuestionField from "./FormRendererFields/EmailQuestionField";
import DateQuestionField from "./FormRendererFields/DateQuestionField";
import { validatedAnswers } from "@/utils/validators";

export default function FormRenderer({ questions, formId }: { questions: Question[], formId: string }) {
    const currentResponseQuestionId = useAppSelector(selectResponseCurrentQuestionId);
    const answers = useAppSelector(selectResponseAnswers);
    const history = useAppSelector(selectResponseHistory);
    const dispatch = useAppDispatch();

    // const { findQuestionIndexById } = useActiveQuestion();

    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const currentQuestion = questions.find((q) => q.id === currentResponseQuestionId);
    if (!currentQuestion) return null;

    const removeError = (questionId: string) => {
        setErrors(prev => {
            const { [questionId]: _, ...rest } = prev;
            return rest;
        });
        setGlobalError(null);
    }

    const handleTextChange = (questionId: string, value: string) => {
        removeError(questionId);

        dispatch(updateAnswer({ questionId, value: value.trim() }));
    }

    const handleCheckboxChange = (questionId: string, optionValue: string) => {
        removeError(questionId);

        const currentSelected = getArrayAnswer(answers[questionId]);

        if (currentSelected.includes(optionValue)) {
            dispatch(updateAnswer({ questionId, value: currentSelected.filter((item) => item !== optionValue) }));
        } else {
            dispatch(updateAnswer({ questionId, value: [...currentSelected, optionValue] }));
        }
    }

    const handleChoiceChange = (questionId: string, value: string) => {
        removeError(questionId);

        dispatch(updateAnswer({ questionId, value: value.trim() }));
    }

    const handleStarChange = (questionId: string, star: number) => {
        removeError(questionId);

        dispatch(updateAnswer({questionId, value: star}));
    }

    const handleNpsChange = (questionId: string, val: number) => {
        removeError(questionId);

        dispatch(updateAnswer({questionId, value: val}));
    }

    const handleEmailChange = (questionId: string, val: string) => {
        removeError(questionId);

        dispatch(updateAnswer({questionId, value: val}));
    }

    const handleDateChange = (questionId: string, date: string) => {
        removeError(questionId);

        dispatch(updateAnswer({questionId, value: date}));
    }

    async function handleSubmit() {
        setErrors({});
        setGlobalError(null);

        if (!currentQuestion) return;

        const error = validatedAnswers(currentQuestion, answers[currentQuestion.id]);

        if (error) {
            setErrors((prev) => ({ ...prev, [currentQuestion.id]: error }));

            return;
        }

        try {
            setIsSubmitting(true);

            const validIds = [...history, currentQuestion.id];

            const answersToSave: RawAnswers = validIds
                .filter((id) => answers[id] !== undefined)
                .map((id) => ({
                    questionId: id,
                    type: questions.find((q) => q.id === id)?.type as QuestionType,
                    value: answers[id],
                }));

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

    const findQuestionIndexById = (questionId: string) => {
        const index = questions.findIndex((q) => q.id === questionId);
        return index === -1 ? null : index;
    }

    function getNextQuestion() {
        if (!currentQuestion) return null;

        const currentIndex = findQuestionIndexById(currentQuestion.id);
        if (currentIndex === null) return null;

        for (const q of questions.slice(currentIndex + 1)) {
            if (!q.condition) return q.id;

            if (isConditionMet(q.condition, answers[q.condition.targetQuestionId])) {
                return q.id;
            }
        }
        return null;
    }

    const nextId = getNextQuestion();
    const currentStep = currentQuestion ? history.length + 1 : 0;
    const totalQuestions = questions.length;
    const progressPercentage = totalQuestions > 0 ? Math.min(100, Math.max(0, Math.round((currentStep / totalQuestions) * 100))) : 0;

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
            {totalQuestions > 0 && (
                <div className="w-full flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                        <span>Question {currentStep} of {totalQuestions}</span>
                        <span className="font-semibold text-gray-900">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden border border-gray-200/50">
                        <div
                            className="bg-black h-2.5 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}


            <div key={currentQuestion.id} className="flex flex-col gap-3">
                <label className="text-lg text-gray-500">
                    {findQuestionIndexById(currentQuestion.id)! + 1}. {currentQuestion.title} {currentQuestion.required && (<span className="text-red-500">*</span>)}
                </label>

                {currentQuestion.type === QuestionType.TEXT && (
                    <TextQuestionField
                        value={getStringAnswer(answers[currentQuestion.id])}
                        onChange={(value) => handleTextChange(currentQuestion.id, value)}
                    />
                )}

                {currentQuestion.type === QuestionType.CHOICE && (
                    <ChoiceQuestionField
                        questionId={currentQuestion.id}
                        options={currentQuestion.options}
                        selectedValue={getStringAnswer(answers[currentQuestion.id])}
                        onChange={(value) => handleChoiceChange(currentQuestion.id, value)}
                    />
                )}

                {currentQuestion.type === QuestionType.CHECKBOX && (
                    <CheckboxQuestionField
                        questionId={currentQuestion.id}
                        options={currentQuestion.options}
                        selectedValues={getArrayAnswer(answers[currentQuestion.id])}
                        onChange={(value) => handleCheckboxChange(currentQuestion.id, value)}
                    />
                )}

                {currentQuestion.type === QuestionType.RATING && (
                    <RatingQuestionField
                        selectedValue={getNumberAnswer(answers[currentQuestion.id])}
                        onChange={(value) => handleStarChange(currentQuestion.id, value)}
                    />
                )}

                {currentQuestion.type === QuestionType.NPS && (
                    <NpsQuestionField
                        selectedValue={getNumberAnswer(answers[currentQuestion.id])}
                        onChange={(value) => handleNpsChange(currentQuestion.id, value)}
                    />
                )}

                {currentQuestion.type === QuestionType.EMAIL && (
                    <EmailQuestionField
                        selectedValue={getStringAnswer(answers[currentQuestion.id])}
                        onChange={(value) => handleEmailChange(currentQuestion.id, value)}
                    />
                )}

                {currentQuestion.type === QuestionType.DATE && (
                    <DateQuestionField
                        selectedValue={getStringAnswer(answers[currentQuestion.id])}
                        onChange={(value) => handleDateChange(currentQuestion.id, value)}
                    />
                )}

                {errors[currentQuestion.id] && (
                    <p className="text-sm text-red-500 mt-1">{errors[currentQuestion.id]}</p>
                )}
            </div>

            {globalError && (
                <p className="text-red-500 text-sm">{globalError}</p>
            )}

            <div className="flex flex-row gap-3 justify-between w-full sm:w-auto mt-4 md:px-8 lg:px-14 xl:px-22">
                <button
                    className="h-12 bg-black hover:bg-gray-800 text-white rounded-md py-3 px-6 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => dispatch(togglePrevQuestion())}
                    disabled={!history.length}
                    aria-label="Go back"
                >
                    <IoIosArrowBack />
                </button>

                {findQuestionIndexById(currentQuestion.id) === questions.length - 1 ? (
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
                        className="h-12 bg-black hover:bg-gray-800 text-white rounded-md py-3 px-6 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={() => {
                            if (nextId) {
                                if (!currentQuestion) return;

                                const error = validatedAnswers(currentQuestion, answers[currentQuestion.id]);

                                if (error) {
                                    setErrors((prev) => ({ ...prev, [currentQuestion.id]: error }));

                                    return;
                                }

                                dispatch(setCurrentQuestionId(nextId));
                                dispatch(toggleNextQuestion(currentQuestion.id));
                            } else {
                                handleSubmit();
                            }
                        }}
                        aria-label="Go forward"
                    >
                        <IoIosArrowBack className="rotate-180" />
                    </button>
                )}
            </div>
        </div>
    );
}