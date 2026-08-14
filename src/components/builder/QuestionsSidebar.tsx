'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addQuestion, reorderQuestions, setActiveQuestion, updateQuestion } from "@/store/slices/formSlice";
import { Question } from "@/schemas/form.schema";
import SidebarItem from "@/components/builder/SidebarItem";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export default function QuestionsSidebar() {
    const dispatch = useAppDispatch();
    const questions = useAppSelector(state => state.form.questions);


    function handleAddQuestion() {
        const newQuestion: Question = {
            id: crypto.randomUUID(),
            title: "New Question",
            required: true,
            type: "TEXT",
        };

        dispatch(addQuestion(newQuestion));
        dispatch(setActiveQuestion(newQuestion.id));
    }

    function handleDragEnd({ active, over }: DragEndEvent) {
        if (over && active.id !== over.id) {
            dispatch(reorderQuestions({
                activeId: active.id as string,
                overId: over.id as string,
            }))
        }
    }

    return (
        <aside className="w-72 bg-white border-r border-zinc-200/80 flex flex-col h-[calc(100vh-4rem)] select-none">
            <div className="p-4 border-b border-zinc-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        Questions ({questions.length})
                    </span>
                </div>
                <Button
                    size="lg"
                    className="border-none w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                    onClick={handleAddQuestion}
                >
                    <Plus className="w-4 h-4" />
                    Add Question
                </Button>
            </div>

            <div className="p-3 flex-1 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-200">
                {questions.length > 0 ? (
                    <DndContext onDragEnd={handleDragEnd} >
                        <SortableContext
                            items={questions.map((q) => q.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {questions.map((question: Question) => (
                                <SidebarItem key={question.id} question={question} />
                            ))}
                        </SortableContext>
                    </DndContext>
                ) : (
                    <p className="py-12 text-center text-xs text-zinc-400 px-4">
                        No questions yet. Click &quot;Add Question&quot; above to get started.
                    </p>
                )}
            </div>
        </aside>
    );
};