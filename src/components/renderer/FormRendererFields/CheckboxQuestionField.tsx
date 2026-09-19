import { QuestionOption } from "@/schemas/form.schema";

interface CheckboxQuestionFieldProps {
    questionId: string;
    options?: QuestionOption[];
    selectedValues: string[];
    onChange: (value: string) => void;
}

export default function CheckboxQuestionField({ questionId, options, selectedValues, onChange }: CheckboxQuestionFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            {options?.map(({ id, value }, index) => (
                <div key={id || index} className="flex items-center gap-3">
                    <input
                        name={questionId}
                        type="checkbox"
                        id={`${questionId}-checkbox-${index}`}
                        className="accent-black w-4 h-4 cursor-pointer"
                        checked={selectedValues.includes(value)}
                        onChange={() => onChange(value)}
                    />
                    <label htmlFor={`${questionId}-checkbox-${index}`} className="cursor-pointer text-gray-700">{value}</label>
                </div>
            ))}
        </div>
    )
}