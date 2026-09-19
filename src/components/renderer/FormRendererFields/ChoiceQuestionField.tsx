import { QuestionOption } from "@/schemas/form.schema";

interface ChoiceQuestionFieldProps {
    questionId: string;
    options?: QuestionOption[];
    selectedValue: string;
    onChange: (value: string) => void;
}

export default function ChoiceQuestionField({ questionId, options, selectedValue, onChange }: ChoiceQuestionFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            {options?.map(({id, value }, index) => (
                <div key={id || index} className="flex items-center gap-3">
                    <input
                        name={questionId}
                        type="radio"
                        id={`${questionId}-choice-${index}`}
                        className="accent-black w-4 h-4 cursor-pointer"
                        checked={selectedValue === value}
                        onChange={() => onChange(value)}
                    />
                    <label htmlFor={`${questionId}-choice-${index}`} className="cursor-pointer text-gray-700">{value}</label>
                </div>
            ))}
        </div>
    );
}