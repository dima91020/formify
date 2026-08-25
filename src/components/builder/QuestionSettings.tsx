'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateQuestion } from "@/store/slices/formSlice";
import { hasDuplicateOptions } from "@/utils/validators";
import { Question } from "@/schemas/form.schema";
import { Options } from "@/components/builder/FormOptions";
import { AlertCircle, Calendar, CheckSquare, Hash, ListFilter, Mail, SlidersHorizontal, Star, Type } from "lucide-react";
import clsx from "clsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function QuestionSettings({ className }: { className?: string }) {
    const questions = useAppSelector(state => state.form.questions);
    const activeQuestionId = useAppSelector(state => state.form.activeQuestionId);
    const dispatch = useAppDispatch();

    const activeQuestion = questions.find((question) => question.id === activeQuestionId);
    const activeQuestionIndex = questions.findIndex((question) => question.id === activeQuestionId);
    const activeQuestionHasCondition = Boolean(activeQuestion?.condition);

    if (!activeQuestion) {
        return (
            <aside className={className || "w-80 bg-white border-l border-zinc-200/80 p-8 flex flex-col items-center justify-center text-center select-none h-[calc(100vh-4rem)]"}>
                <div className="w-full flex flex-col items-center justify-center text-center py-12 px-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                        <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-bold text-zinc-900 mb-1">No Question Selected</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed max-w-[200px]">
                        Select a question from the sidebar to edit its title, type, and branching logic.
                    </p>
                </div>
            </aside>
        );
    }

    function handleChangeQuestionType(newType: Options) {
        if (!activeQuestion) return;

        const updates: Partial<Question> = { type: newType };

        if (!activeQuestion.options && (newType === Options.CHOICE || newType === Options.CHECKBOX)) {
            updates.options = [{ id: crypto.randomUUID(), value: "Option 1" }];
        }

        if (activeQuestion.options && newType !== Options.CHECKBOX && newType !== Options.CHOICE) {
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
            let initialExpectedValue: string | number | string[] = "";

            if (previousQuestion.type === Options.CHECKBOX) {
                initialExpectedValue = [];
            } else if (previousQuestion.type === Options.RATING) {
                initialExpectedValue = 1;
            } else if (previousQuestion.type === Options.NPS) {
                initialExpectedValue = 10;
            }

            dispatch(updateQuestion({
                id: activeQuestion.id,
                updates: {
                    condition: {
                        targetQuestionId: previousQuestion.id,
                        expectedValue: initialExpectedValue,
                    }
                }
            }));
        }
    }

    function handleChangeTargetQuestion(newTargetId: string) {
        if (!activeQuestion?.condition) return;

        const targetQuestion = questions.find(q => q.id === newTargetId);
        let newExpectedValue: string | number | string[] = "";

        if (targetQuestion?.type === Options.CHECKBOX) {
            newExpectedValue = [];
        } else if (targetQuestion?.type === Options.RATING) {
            newExpectedValue = 1;
        } else if (targetQuestion?.type === Options.NPS) {
            newExpectedValue = 10;
        }

        dispatch(updateQuestion({
            id: activeQuestion.id,
            updates: {
                condition: {
                    ...activeQuestion.condition,
                    targetQuestionId: newTargetId,
                    expectedValue: newExpectedValue,
                }
            }
        }));
    }

    return (
        <aside className={className || "w-80 bg-white border-l border-zinc-200/80 p-6 h-[calc(100vh-4rem)] overflow-y-auto flex flex-col gap-6 select-none scrollbar-thin scrollbar-thumb-zinc-200"}>
            {/* Header / Title & Active Question Badge */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Question Settings
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                    Q{activeQuestionIndex + 1} of {questions.length}
                </span>
            </div>

            {/* Question Title */}
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Question Title</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all shadow-2xs"
                    value={activeQuestion.title}
                    onChange={(e) =>
                        dispatch(updateQuestion({ id: activeQuestion.id, updates: { title: e.target.value } }))
                    }
                />
            </div>

            {/* Required Switch */}
            <div className="flex justify-between items-center py-2 border-y border-zinc-100">
                <label htmlFor="required-checkbox" className="text-xs font-semibold text-zinc-700 cursor-pointer select-none">
                    Required Field
                </label>

                <div className="relative inline-block w-10 h-5">
                    <input
                        id="required-checkbox"
                        type="checkbox"
                        className="peer appearance-none w-10 h-5 bg-zinc-200 border border-zinc-300 rounded-full checked:bg-zinc-900 checked:border-zinc-900 cursor-pointer transition-colors duration-200"
                        checked={activeQuestion.required}
                        onChange={e =>
                            dispatch(updateQuestion({ id: activeQuestion.id, updates: { required: e.target.checked } }))
                        }
                    />
                    <span
                        className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-xs transition-transform duration-200 peer-checked:translate-x-5 pointer-events-none"
                    />
                </div>
            </div>

            {/* Question Type */}
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700">Question Type</label>
                <Select value={activeQuestion.type} onValueChange={(val) => handleChangeQuestionType(val as Options)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={Options.TEXT}>
                            <span className="flex items-center gap-2">
                                <Type className="h-3.5 w-3.5 text-zinc-500" />
                                <span>Text Answer</span>
                            </span>
                        </SelectItem>
                        <SelectItem value={Options.CHOICE}>
                            <span className="flex items-center gap-2">
                                <ListFilter className="h-3.5 w-3.5 text-zinc-500" />
                                <span>Single Choice (Radio)</span>
                            </span>
                        </SelectItem>
                        <SelectItem value={Options.CHECKBOX}>
                            <span className="flex items-center gap-2">
                                <CheckSquare className="h-3.5 w-3.5 text-zinc-500" />
                                <span>Multiple Choice (Checkbox)</span>
                            </span>
                        </SelectItem>
                        <SelectItem value={Options.RATING}>
                            <span className="flex items-center gap-2">
                                <Star className="h-3.5 w-3.5 text-zinc-500" />
                                <span>Rating (1-5 Stars)</span>
                            </span>
                        </SelectItem>
                        <SelectItem value={Options.NPS}>
                            <span className="flex items-center gap-2">
                                <Hash className="h-3.5 w-3.5 text-zinc-500" />
                                <span>NPS Scale (0-10)</span>
                            </span>
                        </SelectItem>
                        <SelectItem value={Options.EMAIL}>
                            <span className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-zinc-500" />
                                <span>Email Address</span>
                            </span>
                        </SelectItem>
                        <SelectItem value={Options.DATE}>
                            <span className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                                <span>Date Picker</span>
                            </span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Logic & Branching Section */}
            <div className="space-y-3 pt-2 border-t border-zinc-100">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs font-semibold text-zinc-900">Conditional Logic</p>
                        <p className="text-[11px] text-zinc-400">
                            {activeQuestionIndex === 0
                                ? "Available from question #2"
                                : "Show only if condition is met"
                            }
                        </p>
                    </div>

                    <div className="relative inline-block w-10 h-5">
                        <input
                            id="switch-component"
                            type="checkbox"
                            className="peer appearance-none w-10 h-5 bg-zinc-200 border border-zinc-300 rounded-full checked:bg-zinc-900 checked:border-zinc-900 cursor-pointer transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            checked={activeQuestionHasCondition}
                            onChange={handleToggleCondition}
                            disabled={activeQuestionIndex === 0}
                        />
                        <span
                            className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-xs transition-transform duration-200 peer-checked:translate-x-5 pointer-events-none"
                        />
                    </div>
                </div>

                {activeQuestionHasCondition && (
                    <div className="flex flex-col gap-3 bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/80 text-xs">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-zinc-900">Rule Definition</p>
                            <button
                                className="flex flex-row items-center justify-center gap-2 text-red-400 cursor-pointer"
                                onClick={handleToggleCondition}
                            >
                                Remove Rule
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-700">If answer to</label>
                            <Select value={activeQuestion.condition?.targetQuestionId} onValueChange={handleChangeTargetQuestion}>
                                <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="Select a question" />
                                </SelectTrigger>
                                <SelectContent>
                                    {questions
                                        .slice(0, activeQuestionIndex)
                                        .map((question) => (
                                            <SelectItem key={question.id} value={question.id}>{question.title || `Question ${questions.indexOf(question) + 1}`}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        {questions
                            .filter((q) => q.id === activeQuestion.condition?.targetQuestionId)
                            .map((question) => {
                                if (question.type === Options.TEXT) {
                                    return (
                                        <div key={question.id} className="space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-700">Is equal to</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all shadow-2xs cursor-pointer"
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
                                                placeholder="Expected answer..."
                                            />
                                        </div>
                                    );
                                } else if (question.type === Options.CHOICE) {
                                    const chars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
                                    return (
                                        <div key={question.id} className="space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-700">Is equal to option</label>
                                            <div className="flex flex-col gap-1.5 pt-0.5">
                                                {question.options?.map(({ id, value }, index) => {
                                                    const isChecked = activeQuestion.condition?.expectedValue === value;
                                                    const charLabel = chars[index] || String(index + 1);

                                                    return (
                                                        <button
                                                            key={id || index}
                                                            type="button"
                                                            onClick={() => {
                                                                if (!activeQuestion.condition) return;

                                                                dispatch(updateQuestion({
                                                                    id: activeQuestion.id,
                                                                    updates: {
                                                                        condition: {
                                                                            ...activeQuestion.condition,
                                                                            expectedValue: value,
                                                                        }
                                                                    }
                                                                }));
                                                            }}
                                                            className={clsx(
                                                                "flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs text-left transition-all cursor-pointer select-none",
                                                                isChecked
                                                                    ? "border-zinc-900 bg-zinc-900 text-white shadow-2xs font-medium"
                                                                    : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700"
                                                            )}
                                                        >
                                                            <span className={clsx(
                                                                "h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0",
                                                                isChecked ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                                                            )}>
                                                                {charLabel}
                                                            </span>
                                                            <span className="truncate">{value || `Option ${index + 1}`}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                } else if (question.type === Options.CHECKBOX) {
                                    const chars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
                                    const currentExpectedValue = activeQuestion.condition?.expectedValue;
                                    const isExpectedValueArray = Array.isArray(currentExpectedValue);

                                    return (
                                        <div key={question.id} className="space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-700">Includes option(s)</label>
                                            <div className="flex flex-col gap-1.5 pt-0.5">
                                                {question.options?.map(({ id, value }, index) => {
                                                    const isChecked = isExpectedValueArray ? currentExpectedValue.includes(value) : false;
                                                    const charLabel = chars[index] || String(index + 1);

                                                    return (
                                                        <button
                                                            key={id || index}
                                                            type="button"
                                                            onClick={() => {
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
                                                                }));
                                                            }}
                                                            className={clsx(
                                                                "flex items-center justify-between px-3 py-2 rounded-xl border text-xs text-left transition-all cursor-pointer select-none",
                                                                isChecked
                                                                    ? "border-zinc-900 bg-zinc-900 text-white shadow-2xs font-medium"
                                                                    : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                                <span className={clsx(
                                                                    "h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0",
                                                                    isChecked ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                                                                )}>
                                                                    {charLabel}
                                                                </span>
                                                                <span className="truncate">{value || `Option ${index + 1}`}</span>
                                                            </div>
                                                            {isChecked && <span className="text-xs font-bold shrink-0">✓</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                } else if (question.type === Options.RATING) {
                                    const currentRating = typeof activeQuestion.condition?.expectedValue === "number"
                                        ? activeQuestion.condition.expectedValue
                                        : 1;

                                    return (
                                        <div key={question.id} className="space-y-2">
                                            <label className="text-xs font-semibold text-zinc-700">Is equal to rating</label>
                                            <div className="w-full flex flex-col items-center gap-2 pt-1">
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star, index) => {
                                                        const isSelected = index <= currentRating - 1;
                                                        return (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                className="p-1 rounded-md hover:bg-amber-50/80 transition-colors cursor-pointer"
                                                                onClick={() => {
                                                                    if (!activeQuestion.condition) return;

                                                                    dispatch(updateQuestion({
                                                                        id: activeQuestion.id,
                                                                        updates: {
                                                                            condition: {
                                                                                ...activeQuestion.condition,
                                                                                expectedValue: index + 1,
                                                                            }
                                                                        }
                                                                    }));
                                                                }}
                                                            >
                                                                <Star className={clsx(
                                                                    "h-5 w-5 transition-all duration-150 ease-in-out",
                                                                    isSelected ? "fill-amber-400 stroke-amber-400 drop-shadow-xs" : "stroke-zinc-300 fill-transparent hover:stroke-amber-300"
                                                                )} />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <div className="w-full flex items-center justify-between text-[10px] text-zinc-400 font-medium px-1">
                                                    <span>1 - Poor</span>
                                                    <span>5 - Excellent</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (question.type === Options.NPS) {
                                    return (
                                        <div key={question.id} className="space-y-2">
                                            <label className="text-xs font-semibold text-zinc-700">Is equal to score</label>
                                            <div className="w-full flex flex-col gap-2 pt-1">
                                                {/* Row 1: 0 - 5 */}
                                                <div className="flex items-center justify-between gap-1">
                                                    {[0, 1, 2, 3, 4, 5].map((val) => {
                                                        const isSelected = activeQuestion.condition?.expectedValue === val;
                                                        return (
                                                            <button
                                                                key={val}
                                                                type="button"
                                                                className={clsx(
                                                                    "w-8 h-8 rounded-full flex items-center justify-center border text-xs font-mono font-semibold transition-all cursor-pointer select-none",
                                                                    isSelected
                                                                        ? "border-zinc-900 bg-zinc-900 text-white shadow-2xs scale-105"
                                                                        : "border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300 text-zinc-700"
                                                                )}
                                                                onClick={() => {
                                                                    if (!activeQuestion.condition) return;

                                                                    dispatch(updateQuestion({
                                                                        id: activeQuestion.id,
                                                                        updates: {
                                                                            condition: {
                                                                                ...activeQuestion.condition,
                                                                                expectedValue: val,
                                                                            }
                                                                        }
                                                                    }));
                                                                }}
                                                            >
                                                                {val}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Row 2: 6 - 10 */}
                                                <div className="flex items-center justify-center gap-2">
                                                    {[6, 7, 8, 9, 10].map((val) => {
                                                        const isSelected = activeQuestion.condition?.expectedValue === val;
                                                        return (
                                                            <button
                                                                key={val}
                                                                type="button"
                                                                className={clsx(
                                                                    "w-8 h-8 rounded-full flex items-center justify-center border text-xs font-mono font-semibold transition-all cursor-pointer select-none",
                                                                    isSelected
                                                                        ? "border-zinc-900 bg-zinc-900 text-white shadow-2xs scale-105"
                                                                        : "border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300 text-zinc-700"
                                                                )}
                                                                onClick={() => {
                                                                    if (!activeQuestion.condition) return;

                                                                    dispatch(updateQuestion({
                                                                        id: activeQuestion.id,
                                                                        updates: {
                                                                            condition: {
                                                                                ...activeQuestion.condition,
                                                                                expectedValue: val,
                                                                            }
                                                                        }
                                                                    }));
                                                                }}
                                                            >
                                                                {val}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Labels */}
                                                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium px-1 pt-0.5">
                                                    <span>0 - Not likely</span>
                                                    <span>10 - Very likely</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else if (question.type === Options.EMAIL) {
                                    return (
                                        <div key={question.id} className="space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-700">Is equal to email</label>
                                            <input
                                                type="email"
                                                placeholder="e.g. alex@company.com"
                                                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all shadow-2xs"
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
                                                    }));
                                                }}
                                            />
                                        </div>
                                    );
                                } else if (question.type === Options.DATE) {
                                    return (
                                        <div key={question.id} className="space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-700">Is equal to date</label>
                                            <input
                                                type="date"
                                                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all shadow-2xs cursor-pointer"
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
                                        </div>
                                    );
                                }
                            })}
                    </div>
                )}
            </div>

            {hasDuplicateOptions(activeQuestion.options) && (
                <div className="p-3 rounded-xl bg-red-50/80 border border-red-200/80 text-red-600 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                    <span className="font-medium text-[11px]">Option labels must be unique.</span>
                </div>
            )}
        </aside>
    );
}