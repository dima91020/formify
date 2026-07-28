import {RxCross2} from "react-icons/rx";
import {updateQuestion} from "@/store/slices/formSlice";
import {ChangeEvent} from "react";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {useSortable} from "@dnd-kit/sortable";
import {TbGridDots} from "react-icons/tb";

export enum Options {
    TEXT = "TEXT",
    CHOICE = "CHOICE",
    CHECKBOX = "CHECKBOX",
}

export default function FormOptions({ optionId, optionValue, index }: { optionId: string, optionValue: string, index: number}) {
    const dispatch = useAppDispatch();
    const questions = useAppSelector(state => state.form.questions);
    const activeQuestionId = useAppSelector(state => state.form.activeQuestionId);
    const activeQuestion = questions.find((question) => question.id === activeQuestionId);

    const chars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const charIndex = chars[index];

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
    }

    function handleDeleteOption() {
        if (!activeQuestion) return;

        let options = activeQuestion.options || [];

        options = options.filter((option) => option.id !== optionId);

        dispatch(updateQuestion({id: activeQuestion.id, updates: {options}}));
    }

    const deleteEmptyOption = () => {
        if (!activeQuestion || !activeQuestion.options) return;

        if (!optionValue) {
            const currentOptions = [...activeQuestion.options];

            dispatch(updateQuestion({
                id: activeQuestion.id,
                updates: {
                    options: currentOptions.filter((option) => option.id !== optionId),
                },
            }));
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative flex items-center gap-3 my-2 text-gray-500 w-full min-h-[44px] transition-all"
        >
            <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
                <button
                    {...attributes}
                    {...listeners}
                    className={`cursor-grab text-gray-400 hover:text-gray-600 transition-all text-lg
                        opacity-0 scale-90 pointer-events-none 
                        group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                        ${isDragging ? "!opacity-100 !scale-100 !pointer-events-auto" : ""}
                    `}
                >
                    <TbGridDots />
                </button>
            </div>

            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-100 rounded-md shadow-sm text-sm font-semibold select-none text-gray-500 border border-transparent">
                {charIndex}
            </div>

            <div className="flex flex-1 items-center gap-3 bg-slate-100 rounded-md shadow-sm h-10 px-3 border border-transparent focus-within:border-gray-300 focus-within:bg-white focus-within:text-gray-800 transition-all">
                <input
                    disabled
                    type={activeQuestion?.type === Options.CHOICE ? "radio" : "checkbox"}
                    name={`question-${activeQuestion?.id}`}
                    id={`opt-${optionId}`}
                    className="flex-shrink-0 cursor-not-allowed accent-indigo-600"
                />

                <input
                    type="text"
                    value={optionValue}
                    className="w-full bg-transparent outline-none leading-none text-gray-700 focus:text-gray-900"
                    onChange={(e) => handleUpdateOption(e)}
                    onBlur={deleteEmptyOption}
                />
            </div>

            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <button
                    className={`hover:text-red-500 transition-all cursor-pointer text-lg text-gray-400 p-0.5 rounded hover:bg-slate-200
                    opacity-0 scale-90 pointer-events-none 
                    group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                    ${isDragging ? "!opacity-0 !pointer-events-none" : ""} 
                `}
                    onClick={handleDeleteOption}
                >
                    <RxCross2 />
                </button>
            </div>
        </div>
    );
}