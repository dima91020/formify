import {Question} from "@/schemas/form.schema";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {TbGridDots} from "react-icons/tb";
import {deleteQuestion, setActiveQuestion} from "@/store/slices/formSlice";
import clsx from "clsx";
import {RxCross2} from "react-icons/rx";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {MouseEvent} from "react";

export default function SidebarItem({ question }: {question: Question}) {
    const questions = useAppSelector((state) => state.form.questions);

    const { attributes, transform, transition, setNodeRef, listeners } = useSortable({ id: question.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const dispatch = useAppDispatch();
    const activeQuestionId = useAppSelector(state => state.form.activeQuestionId);

    const handleDeleteQuestion = (e: MouseEvent<HTMLButtonElement>, id: string) => {
        e.stopPropagation();
        dispatch(deleteQuestion(id));
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => dispatch(setActiveQuestion(question.id))}
            className={clsx(
                "flex justify-between px-3 py-2 rounded-md cursor-pointer text-sm transition-colors",
                question.id === activeQuestionId
                    ? "bg-gray-100 font-medium text-gray-700"
                    : "hover:bg-gray-50 text-gray-600"
            )}
        >
            <div className="flex flex-1 gap-2">
                <button className="cursor-grab" {...attributes} {...listeners}>
                    <TbGridDots />
                </button>
                <div>{questions.indexOf(question) + 1}.</div>
                {question.title}
            </div>
            <button
                className="hover:text-red-500 cursor-pointer transition-colors"
                onClick={(e) => handleDeleteQuestion(e, question.id)}
            >
                <RxCross2 />
            </button>
        </div>
    );
}
