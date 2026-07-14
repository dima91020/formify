'use client'

import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {Question} from "@/schemas/form.schema";
import {updateQuestion} from "@/store/slices/formSlice";
import FormOptions, {Options} from "@/components/form/FormOptions";
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";

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
                options: [...activeQuestion.options, { id: crypto.randomUUID(), value: 'Option'}],
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
                    {activeQuestion.options.map(({ id, value }, index)  => {
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
                    <div className="mt-6 flex gap-2 flex-col items-start w-full max-w-md mx-auto">
                        {(activeQuestion.type === Options.CHOICE || activeQuestion.type === Options.CHECKBOX) && (activeQuestion.options?.length === 0) && (
                            <h2 className="text-xl font-medium text-gray-500">
                                Add new choice option here...
                            </h2>
                        )}

                        {activeQuestion.type === Options.TEXT ? (
                            <h2 className="text-xl font-medium text-gray-500">
                                Type your answer here...
                            </h2>
                        ) : renderQuestions()}

                        {(activeQuestion.type === Options.CHOICE|| activeQuestion.type === Options.CHECKBOX) && (
                            <button
                                className="cursor-pointer underline text-gray-500 py-1 mt-2 text-sm hover:text-gray-800 transition-colors"
                                onClick={handleAddOption}
                            >
                                Add choice
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <h2 className="text-2xl font-medium text-gray-800">
                    Select a question from the sidebar to edit it or create a new one.
                </h2>
            )}
        </div>
    );
}