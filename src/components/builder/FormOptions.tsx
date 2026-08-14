import { updateQuestion } from "@/store/slices/formSlice";
import { ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, X } from "lucide-react";

export enum Options {
    TEXT = "TEXT",
    CHOICE = "CHOICE",
    CHECKBOX = "CHECKBOX",
    RATING = "RATING",
    NPS = "NPS",
    EMAIL = "EMAIL",
    DATE = "DATE",
}

export default function FormOptions({ optionId, optionValue, index }: { optionId: string; optionValue: string; index: number }) {
    const dispatch = useAppDispatch();
    const questions = useAppSelector(state => state.form.questions);
    const activeQuestionId = useAppSelector(state => state.form.activeQuestionId);
    const activeQuestion = questions.find((question) => question.id === activeQuestionId);

    const chars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const charIndex = chars[index] || String(index + 1);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: optionId });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: isDragging ? 'none' : transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    const handleUpdateOption = (e: ChangeEvent<HTMLInputElement>) => {
        if (!activeQuestion || !activeQuestion.options) return;

        const currentOptions = [...activeQuestion.options];

        dispatch(updateQuestion({
            id: activeQuestion.id,
            updates: {
                options: currentOptions.map((option) =>
                    option.id === optionId ? { ...option, value: e.target.value } : option,
                ),
            },
        }));
    };

    function handleDeleteOption() {
        if (!activeQuestion) return;

        let options = activeQuestion.options || [];
        options = options.filter((option) => option.id !== optionId);

        dispatch(updateQuestion({ id: activeQuestion.id, updates: { options } }));
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group w-full flex items-center gap-2.5 p-1.5 rounded-xl bg-white border border-zinc-200/80 hover:border-zinc-300 shadow-2xs transition-all"
        >
            <button
                type="button"
                className="cursor-grab active:cursor-grabbing p-1 text-zinc-400 hover:text-zinc-600 opacity-40 group-hover:opacity-100 transition-opacity"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="h-3.5 w-3.5" />
            </button>

            <span className="h-6 w-6 rounded-lg bg-zinc-100 text-zinc-600 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                {charIndex}
            </span>

            <input
                type="text"
                value={optionValue}
                onChange={handleUpdateOption}
                placeholder={`Option ${index + 1}`}
                className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none px-1"
            />

            {activeQuestion?.options && activeQuestion.options.length > 1 && (
                <button
                    type="button"
                    onClick={handleDeleteOption}
                    className="p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Remove Option"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}