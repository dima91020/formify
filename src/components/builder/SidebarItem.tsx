import { Question } from "@/schemas/form.schema";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteQuestion, setActiveQuestion } from "@/store/slices/formSlice";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { MouseEvent } from "react";
import { Calendar, CheckSquare, GripVertical, Hash, ListFilter, Mail, Star, Trash2, Type } from "lucide-react";

const TYPE_ICONS: Record<string, typeof Type> = {
    TEXT: Type,
    CHOICE: ListFilter,
    CHECKBOX: CheckSquare,
    RATING: Star,
    NPS: Hash,
    EMAIL: Mail,
    DATE: Calendar,
};

export default function SidebarItem({ question }: { question: Question }) {
    const questions = useAppSelector((state) => state.form.questions);
    const activeQuestionId = useAppSelector(state => state.form.activeQuestionId);
    const dispatch = useAppDispatch();

    const { attributes, transform, transition, setNodeRef, listeners, isDragging } = useSortable({ id: question.id });
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: isDragging ? 'none' : transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    const isActive = question.id === activeQuestionId;
    const Icon = TYPE_ICONS[question.type] || Type;

    const handleDeleteQuestion = (e: MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();
        dispatch(deleteQuestion(id));
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => dispatch(setActiveQuestion(question.id))}
            className={clsx(
                "group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-medium transition-all select-none",
                isActive
                    ? "bg-zinc-950 text-white shadow-xs font-semibold"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            )}
        >
            <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                <button
                    type="button"
                    className={clsx(
                        "cursor-grab active:cursor-grabbing p-0.5 rounded transition-opacity",
                        isActive ? "text-zinc-400 hover:text-white" : "text-zinc-400 hover:text-zinc-600 opacity-40 group-hover:opacity-100"
                    )}
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-3.5 w-3.5" />
                </button>

                <div className={clsx(
                    "p-1 rounded-md",
                    isActive ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-500"
                )}>
                    <Icon className="h-3.5 w-3.5" />
                </div>

                <span className="truncate">
                    {questions.indexOf(question) + 1}. {question.title || "Untitled Question"}
                </span>
            </div>

            <button
                type="button"
                className={clsx(
                    "p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer",
                    isActive
                        ? "text-zinc-400 hover:text-red-400 hover:bg-white/10"
                        : "text-zinc-400 hover:text-red-500 hover:bg-red-50"
                )}
                onClick={(e) => handleDeleteQuestion(e, question.id)}
                title="Delete Question"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}
