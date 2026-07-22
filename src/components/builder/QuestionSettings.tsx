'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateQuestion } from "@/store/slices/formSlice";
import { hasDuplicateOptions } from "@/utils/validators";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ChangeEvent } from "react";
import { Question } from "@/schemas/form.schema";
import { Options } from "@/components/form/FormOptions";

export default function QuestionSettings() {
    const questions = useAppSelector(state => state.form.questions);
    const activeQuestionId = useAppSelector(state => state.form.activeQuestionId);
    const dispatch = useAppDispatch();

    const activeQuestion = questions.find((question) => question.id === activeQuestionId);
    const activeQuestionIndex = questions.findIndex((question) => question.id === activeQuestionId);
    const activeQuestionHasCondition = Boolean(activeQuestion?.condition);

    if (!activeQuestion) {
        return (
            <div className="w-80 bg-white border-l border-gray-200 p-4 flex h-full items-center justify-center text-gray-400 text-sm">
                No question selected
            </div>
        );
    }

    function handleChangeQuestionType(e: ChangeEvent<HTMLSelectElement>) {
        if (!activeQuestion) return;

        const newType = e.target.value as Options;

        const updates: Partial<Question> = { type: newType };

        if (!activeQuestion.options && (newType === Options.CHOICE || newType === Options.CHECKBOX)) {
            updates.options = [{ id: crypto.randomUUID(), value: "Option" }];
        }

        if (activeQuestion.options && newType === Options.TEXT) {
            updates.options = undefined;
        }

        dispatch(updateQuestion({
            id: activeQuestion.id,
            updates,
        }));
    }

    function handleToggleCondition() {
        if (!activeQuestion) return;

        if (activeQuestionHasCondition) {
            dispatch(updateQuestion({
                id: activeQuestion.id,
                updates: {
                    condition: undefined,
                }
            }));
        } else {
            const previousQuestion = questions[activeQuestionIndex - 1];

            dispatch(updateQuestion({
                id: activeQuestion.id,
                updates: {
                    condition: {
                        targetQuestionId: previousQuestion.id,
                        expectedValue: previousQuestion.type === Options.CHECKBOX ? [] : "",
                    }
                }
            }))
        }
    }

    return (
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 h-full flex flex-col gap-6">
            <div>
                <label className="text-md font-medium text-gray-700">Question Title</label>
                <input
                    type="text"
                    className="w-full border p-2.5 rounded-md mt-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
                    value={activeQuestion.title}
                    onChange={(e) =>
                        dispatch(updateQuestion({ id: activeQuestion.id, updates: { title: e.target.value } }))
                    }
                />
            </div>

            <div className="flex justify-between items-center text-md font-medium text-gray-700">
                <label htmlFor="required-checkbox" className="cursor-pointer select-none">
                    Required
                </label>

                <div className="relative inline-block w-11 h-5">
                    <input
                        id="required-checkbox"
                        type="checkbox"
                        className="peer appearance-none w-11 h-5 bg-slate-200 border border-slate-300 rounded-full checked:bg-slate-800 checked:border-slate-800 cursor-pointer transition-colors duration-300"
                        checked={activeQuestion.required}
                        onChange={e =>
                            dispatch(updateQuestion({ id: activeQuestion.id, updates: { required: e.target.checked } }))
                        }
                    />
                    <span
                        className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 pointer-events-none"
                    />
                </div>
            </div>

            <hr className="border-t border-gray-400 my-1"/>

            <div>
                <label className="text-md font-medium text-gray-700">Question Type</label>
                <select
                    className="w-full border p-2.5 rounded-md mt-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                    value={activeQuestion.type}
                    onChange={(e) => handleChangeQuestionType(e)}
                >
                    <option value={Options.TEXT}>Text Answer</option>
                    <option value={Options.CHOICE}>Multiple Choice</option>
                    <option value={Options.CHECKBOX}>Checkboxes</option>
                </select>
            </div>

            <hr className="border-t border-gray-400 my-1"/>

            <div className="text-md font-medium text-gray-700">
                <p className="mb-2">Logic & Branching</p>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="switch-component" className="cursor-pointer select-none">
                        Enable condition for this question
                    </label>

                    <div className="relative inline-block w-11 h-5">
                        <input
                            id="switch-component"
                            type="checkbox"
                            className="peer appearance-none w-11 h-5 bg-slate-200 border border-slate-300 rounded-full checked:bg-slate-800 checked:border-slate-800 cursor-pointer transition-colors duration-300"
                            checked={activeQuestionHasCondition}
                            onChange={handleToggleCondition}
                            disabled={activeQuestionIndex === 0}
                        />
                        <span
                            className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 pointer-events-none"
                        />
                    </div>
                </div>

                {activeQuestionHasCondition && (
                    <div className="flex flex-col gap-3 bg-gray-100 p-4 rounded-md border border-gray-200 mt-4">
                        <label className="text-md font-medium text-gray-700">Show this question ONLY IF</label>
                        <select
                            className="w-full border p-2.5 rounded-md mt-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black bg-white"
                            value={activeQuestion.condition?.targetQuestionId}
                            onChange={(e) => {
                                if (!activeQuestion.condition) return;

                                const newTargetId = e.target.value;
                                const targetQuestion = questions.find(q => q.id === newTargetId);
                                const isTargetCheckbox = targetQuestion?.type === Options.CHECKBOX;

                                dispatch(updateQuestion({
                                    id: activeQuestion.id,
                                    updates: {
                                        condition: {
                                            ...activeQuestion.condition,
                                            targetQuestionId: newTargetId,
                                            expectedValue: isTargetCheckbox ? [] : "",
                                        }
                                    }
                                }))
                            }}
                        >
                            {questions
                                .slice(0, activeQuestionIndex)
                                .map((question) => (
                                    <option key={question.id} value={question.id}>{question.title}</option>
                                ))
                            }
                        </select>

                        <label className="text-md font-medium text-gray-700">equals to</label>
                        {questions
                            .filter((q) => q.id === activeQuestion.condition?.targetQuestionId)
                            .map((question) => {
                                if (question.type === Options.CHOICE) {
                                    return (
                                        <div key={question.id} className="flex flex-col gap-2">
                                            {question.options?.map(({ id, value }, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <input
                                                        name={question.id}
                                                        type="radio"
                                                        id={`${question.id}-choice-${index}`}
                                                        className="accent-black w-4 h-4 cursor-pointer"
                                                        checked={activeQuestion.condition?.expectedValue === value}
                                                        onChange={() => {
                                                            if (!activeQuestion.condition) return;

                                                            dispatch(updateQuestion({
                                                                id: activeQuestion.id,
                                                                updates: {
                                                                    condition: {
                                                                        ...activeQuestion.condition,
                                                                        expectedValue: value,
                                                                    }
                                                                }
                                                            }))
                                                        }}
                                                    />
                                                    <label htmlFor={`${question.id}-choice-${index}`} className="cursor-pointer text-gray-700">{value}</label>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                } else if (question.type === Options.CHECKBOX) {
                                    const currentExpectedValue = activeQuestion.condition?.expectedValue;
                                    const isExpectedValueArray = Array.isArray(currentExpectedValue);

                                    return (
                                        <div key={question.id} className="flex flex-col gap-2">
                                            {question.options?.map(({ id, value }, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <input
                                                        name={question.id}
                                                        type="checkbox"
                                                        id={`${question.id}-checkbox-${index}`}
                                                        className="accent-black w-4 h-4 cursor-pointer"
                                                        checked={isExpectedValueArray ? currentExpectedValue.includes(value) : false}
                                                        onChange={() => {
                                                            if (!activeQuestion.condition) return;

                                                            let currentValue = Array.isArray(activeQuestion.condition.expectedValue)
                                                                ? activeQuestion.condition.expectedValue
                                                                : [];

                                                            if (currentValue.includes(value)) {
                                                                currentValue = currentValue.filter((v) => v !== value);
                                                            } else {
                                                                currentValue = [...currentValue, value];
                                                            }

                                                            dispatch(updateQuestion({
                                                                id: activeQuestion.id,
                                                                updates: {
                                                                    condition: {
                                                                        ...activeQuestion.condition,
                                                                        expectedValue: currentValue,
                                                                    }
                                                                }
                                                            }))
                                                        }}
                                                    />
                                                    <label htmlFor={`${question.id}-checkbox-${index}`} className="cursor-pointer text-gray-700">{value}</label>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <input
                                            key={question.id}
                                            type="text"
                                            className="w-full border p-2.5 rounded-md mt-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-black"
                                            value={typeof activeQuestion.condition?.expectedValue === "string" ? activeQuestion.condition.expectedValue : ""}
                                            onChange={(e) => {
                                                if (!activeQuestion.condition) return;

                                                dispatch(updateQuestion({
                                                    id: activeQuestion.id,
                                                    updates: {
                                                        condition: {
                                                            ...activeQuestion.condition,
                                                            expectedValue: e.target.value,
                                                        }
                                                    }
                                                }))
                                            }}
                                        />
                                    );
                                }
                            })}

                        <button
                            className="flex flex-row items-center justify-center gap-2 text-red-400 cursor-pointer"
                            onClick={handleToggleCondition}
                        >
                            <RiDeleteBin5Line />
                            Delete rule
                        </button>
                    </div>
                )}
            </div>

            {hasDuplicateOptions(activeQuestion.options) && <span className="text-xs text-red-500">Options must be unique.</span>}
        </div>
    );
}