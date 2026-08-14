'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateQuestion } from "@/store/slices/formSlice";
import FormOptions, { Options } from "@/components/builder/FormOptions";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Star } from "lucide-react";
import clsx from "clsx";

export default function FormCanvas() {
    const dispatch = useAppDispatch();
    const questions = useAppSelector(state => state.form.questions);
    const activeQuestionId = useAppSelector(state => state.form.activeQuestionId);
    const activeQuestion = questions.find((question) => question.id === activeQuestionId);

    const handleAddOption = () => {
        if (!activeQuestion || !activeQuestion.options) return;

        dispatch(updateQuestion({
            id: activeQuestion.id,
            updates: {
                options: [...activeQuestion.options, { id: crypto.randomUUID(), value: 'Option' }],
            }
        }));
    }

    function handleDragEnd({ active, over }: DragEndEvent) {
        if (!activeQuestion || !activeQuestion.options) return;

        if (over && active.id !== over.id) {
            const oldIndex = activeQuestion.options.findIndex((option) => option.id === active.id);
            const newIndex = activeQuestion.options.findIndex((option) => option.id === over.id);

            dispatch(updateQuestion({
                id: activeQuestion.id,
                updates: {
                    options: arrayMove(activeQuestion.options, oldIndex, newIndex),
                }
            }))
        }
    }

    const renderQuestions = () => {
        if (!activeQuestion || !activeQuestion.options) return;

        return (
            <DndContext onDragEnd={handleDragEnd}>
                <SortableContext
                    items={activeQuestion.options.map((option) => option.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {activeQuestion.options.map(({ id, value }, index) => {
                        return <FormOptions
                            key={id}
                            optionId={id}
                            optionValue={value}
                            index={index}
                        />
                    })}
                </SortableContext>
            </DndContext>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto items-center justify-center min-h-[80vh]">
            {questions.length > 0 && activeQuestion ? (
                <div className="w-full max-w-2xl bg-gray-50 p-8 rounded-xl shadow-sm border text-center min-h-[400px]">
                    <div className="flex justify-center items-center gap-2">
                        <input
                            type="text"
                            className="text-2xl font-medium text-gray-800 bg-transparent focus:outline-none leading-none text-center"
                            value={activeQuestion.title}
                            size={Math.max(activeQuestion.title.length, 1)}
                            onChange={(e) =>
                                dispatch(updateQuestion({ id: activeQuestion.id, updates: { title: e.target.value } }))
                            }
                        />

                        {activeQuestion.required && (<span className="text-red-500 text-2xl">*</span>)}
                    </div>

                    {activeQuestion.type === Options.TEXT && (
                        <h2 className="text-xl font-medium text-gray-500">
                            Type your answer here...
                        </h2>
                    )}

                    {(activeQuestion.type === Options.CHOICE || activeQuestion.type === Options.CHECKBOX) && (
                        <div className="w-full space-y-3">
                            {renderQuestions()}

                            {(activeQuestion.type === Options.CHOICE || activeQuestion.type === Options.CHECKBOX) && (
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-900 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer bg-zinc-50/40 hover:bg-zinc-50"
                                    onClick={handleAddOption}
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Choice Option</span>
                                </button>
                            )}
                        </div>
                    )}

                    {(activeQuestion.type === Options.CHOICE || activeQuestion.type === Options.CHECKBOX) && (activeQuestion.options?.length === 0) && (
                        <h2 className="text-xl font-medium text-gray-500">
                            Add new choice option here...
                        </h2>
                    )}

                    {activeQuestion.type === Options.RATING && (
                        <div className="w-full max-w-md mx-auto flex flex-col gap-3 mt-10">
                            <div className="flex w-full justify-between items-center">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <span key={index}>
                                        <Star className={clsx("w-10 h-10", index <= 2 ? "text-yellow-300/90 fill-yellow-300/90" : "text-zinc-300/90 fill-zinc-300/90")} />
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Not satisfied</span>
                                <span>Very satisfied</span>
                            </div>
                        </div>
                    )}

                    {activeQuestion.type === Options.NPS && (
                        <div className="w-full mt-10">
                            <div className="flex gap-2 items-center justify-between">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value, index) => (
                                    <span key={index} className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-300/90">
                                        {value}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-5">
                                <span>Not Likely</span>
                                <span>Very Likely</span>
                            </div>
                        </div>
                    )}

                    {activeQuestion.type === Options.EMAIL && (
                        <div className="mt-10 w-full">
                            <input
                                type="email"
                                className="w-full h-12 rounded-lg px-4 border border-zinc-300"
                                placeholder="[EMAIL_ADDRESS]"
                            />
                        </div>
                    )}

                    {activeQuestion.type === Options.DATE && (
                        <div className="mt-8 w-full max-w-md mx-auto">
                            <div className="relative">
                                <input
                                    type="date"
                                    disabled
                                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-500 shadow-2xs cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-zinc-400 mt-2 text-left">
                                Respondents will pick a date from an interactive calendar.
                            </p>
                        </div>
                    )}

                </div>
            ) : (
                <h2 className="text-2xl font-medium text-gray-800">
                    Select a question from the sidebar to edit it or create a new one.
                </h2>
            )}
        </div>
    );
}