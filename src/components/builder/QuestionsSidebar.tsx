'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {addQuestion, reorderQuestions, setActiveQuestion, updateQuestion} from "@/store/slices/formSlice";
import { Question } from "@/schemas/form.schema";
import SidebarItem from "@/components/builder/SidebarItem";
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";

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

    function handleDragEnd({ active, over}: DragEndEvent) {
        if (over && active.id !== over.id) {
            dispatch(reorderQuestions({
                activeId: active.id as string,
                overId: over.id as string,
            }))
        }
    }

    return (
        <div className="w-64 bg-gray-50 border-r flex flex-col">
            <div className="p-4 border-b">
                <button
                    className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    onClick={handleAddQuestion}
                >
                    Add Question
                </button>
            </div>

            <DndContext onDragEnd={handleDragEnd} >
                <SortableContext
                    items={questions.map((q) => q.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="p-2 flex-1 overflow-y-auto space-y-1">
                        {questions.map((question: Question) => (
                            <SidebarItem key={question.id} question={question} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

        </div>
    );
};