'use client'

import { Question } from "@/schemas/form.schema";
import { useState } from "react";
import { Answers, submitFormResponse } from "@/actions/response.actions";
import { FaSpinner } from "react-icons/fa";

export default function FormRenderer({ questions, formId }: { questions: Question[], formId: string }) {
    const [answers, setAnswers] = useState<Answers>({});
    const [errors, setErrors] = useState<string[]>([]);

    const [globalError, setGlobalError] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCheckboxChange = (questionId: string, optionValue: string) => {
        setErrors(prev => prev.filter((v) => v !== questionId));
        setGlobalError(null);

        setAnswers((prev) => {
            const currentSelected = (prev[questionId] as string[]) || [];

            if (currentSelected.includes(optionValue)) {
                return { ...prev, [questionId]: currentSelected.filter((item) => item !== optionValue) }
            } else {
                return { ...prev, [questionId]: [...currentSelected, optionValue] };
            }
        });
    }

    const handleTextChange = (questionId: string, value: string) => {
        setErrors(prev => prev.filter((v) => v !== questionId));
        setGlobalError(null);

        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }

    const handleChoiceChange = (questionId: string, value: string) => {
        setErrors(prev => prev.filter((v) => v !== questionId));
        setGlobalError(null);

        setAnswers((prev) => {
            return { ...prev, [questionId]: value };
        });
    }

    async function handleSubmit() {
        setErrors([]);
        setGlobalError(null);

        const requiredQuestions = questions.filter((question) => {
            if (!question.required) return false;

            const answer = answers[question.id];

            if (!answer) return true;
            return Array.isArray(answer) && answer.length === 0;
        });

        if (requiredQuestions.length > 0) {
            setErrors(requiredQuestions.map((question) => question.id));
            return;
        }

        try {
            setIsSubmitting(true);
            const result = await submitFormResponse(formId, answers);

            if (result.success) {
                setIsSuccess(true);
            } else {
                setGlobalError("Failed to save your response. Please try again.");
            }
        } catch (error) {
            setGlobalError("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

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
            {questions.map((question, index) => (
                <div key={question.id} className="flex flex-col gap-3">
                    <label className="text-lg text-gray-500">
                        {index + 1}. {question.title} {question.required && (<span className="text-red-500">*</span>)}
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
                            {question.options?.map(({ id, value }, index) => (
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
                            {question.options?.map(({ id, value }, index) => (
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

            <div className="flex flex-col gap-3 self-start w-full sm:w-auto mt-4">
                {globalError && (
                    <p className="text-red-500 text-sm">{globalError}</p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-black hover:bg-gray-800 text-white rounded-md py-3 px-6 w-full transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
            </div>
        </div>
    );
}