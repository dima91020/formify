'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateQuestion } from "@/store/slices/formSlice";
import FormOptions from "@/components/builder/FormOptions";
import { QuestionType } from "@/schemas/form.schema";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Calendar, Mail, Plus, Sparkles, Star } from "lucide-react";

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
                options: [...activeQuestion.options, { id: crypto.randomUUID(), value: `Option ${activeQuestion.options.length + 1}` }],
            }
        }));
    };

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
            }));
        }
    }

    const renderQuestions = () => {
        if (!activeQuestion || !activeQuestion.options) return null;

        return (
            <DndContext onDragEnd={handleDragEnd}>
                <SortableContext
                    items={activeQuestion.options.map((option) => option.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="w-full space-y-2">
                        {activeQuestion.options.map(({ id, value }, index) => (
                            <FormOptions
                                key={id}
                                optionId={id}
                                optionValue={value}
                                index={index}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        );
    };

    return (
        <main className="flex-1 flex overflow-y-auto items-center justify-center p-4 pb-28 sm:p-12 min-h-[calc(100vh-4rem)]">
            {questions.length > 0 && activeQuestion ? (
                <div className="w-full max-w-xl bg-white p-6 sm:p-12 rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-200/80 transition-all">
                    <div className="flex items-center justify-between mb-4 h-6">
                        <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                            Question {questions.indexOf(activeQuestion) + 1} of {questions.length}
                        </span>
                        {activeQuestion.required && (
                            <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200/60 text-[10px] font-semibold text-red-600 animate-in fade-in duration-150">
                                Required
                            </span>
                        )}
                    </div>

                    <div className="mb-8">
                        <input
                            type="text"
                            className="text-lg sm:text-2xl font-bold text-zinc-900 bg-transparent hover:bg-zinc-50 focus:bg-white focus:ring-1 focus:ring-zinc-900 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 transition-all w-full leading-tight placeholder:text-zinc-300"
                            value={activeQuestion.title}
                            placeholder="Enter your question title here..."
                            onChange={(e) =>
                                dispatch(updateQuestion({ id: activeQuestion.id, updates: { title: e.target.value } }))
                            }
                        />
                    </div>

                    {activeQuestion.type === QuestionType.TEXT && (
						<div className="w-full h-12 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/60 px-4 flex items-center text-xs text-zinc-400">
						    Respondent types an open-ended answer here...
						</div>
                    )}

                    {(activeQuestion.type === QuestionType.CHOICE || activeQuestion.type === QuestionType.CHECKBOX) && (
                        <div className="w-full space-y-3">
                            <div className="w-full max-h-[300px] overflow-y-auto pr-1.5 space-y-2 scrollbar-thin scrollbar-thumb-zinc-200">
                                {renderQuestions()}
                            </div>

                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-900 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer bg-zinc-50/40 hover:bg-zinc-50"
                                onClick={handleAddOption}
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add Choice Option</span>
                            </button>
                        </div>
                    )}

                    {activeQuestion.type === QuestionType.RATING && (
                        <div className="w-full flex flex-col items-center gap-3 pt-2">
                            <div className="flex items-center gap-2 sm:gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="p-2 rounded-2xl hover:bg-amber-50 text-amber-400 transition-all"
                                    >
                                        <Star className="h-8 w-8 sm:h-9 sm:w-9 fill-amber-400 stroke-amber-400 drop-shadow-xs" />
                                    </button>
                                ))}
                            </div>
                            <div className="w-full flex items-center justify-between text-xs text-zinc-400 px-2 font-medium">
                                <span>1 - Poor</span>
                                <span>5 - Excellent</span>
                            </div>
                        </div>
                    )}

                    {activeQuestion.type === QuestionType.NPS && (
                        <div className="w-full flex flex-col gap-3 pt-2">
                            <div className="grid grid-cols-11 gap-1 sm:gap-1.5">
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        className="aspect-square flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50/60 hover:bg-zinc-900 hover:text-white text-zinc-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-zinc-400 font-medium px-1">
                                <span>0 - Not likely at all</span>
                                <span>10 - Extremely likely</span>
                            </div>
                        </div>
                    )}

                    {activeQuestion.type === QuestionType.EMAIL && (
                        <div className="w-full relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                <Mail className="h-4 w-4" />
                            </div>
                            <input
                                type="email"
                                disabled
                                placeholder="name@company.com"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-500 shadow-2xs cursor-not-allowed"
                            />
                        </div>
                    )}

                    {activeQuestion.type === QuestionType.DATE && (
                        <div className="w-full relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                <Calendar className="h-4 w-4" />
                            </div>
                            <input
                                type="date"
                                disabled
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-500 shadow-2xs cursor-not-allowed"
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="max-w-md text-center space-y-3 p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-sm transition-all">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-900">No question selected</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Select a question from the sidebar on the left to edit its content and options, or click &quot;Add Question&quot; to create a new one.
                    </p>
                </div>
            )}
        </main>
    );
}