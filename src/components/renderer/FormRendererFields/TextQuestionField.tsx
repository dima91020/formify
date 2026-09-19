interface TextQuestionFieldProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TextQuestionField({ value, onChange }: TextQuestionFieldProps) {
    return (
        <input
            type="text"
            placeholder="Type your answer"
            className="text-gray-800 text-lg border-b-2 border-gray-200 bg-transparent focus:border-black focus:outline-none transition-colors py-2 w-full"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}