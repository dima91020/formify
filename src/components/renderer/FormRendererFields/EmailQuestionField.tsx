interface EmailQuestionFieldProps {
    selectedValue: string;
    onChange: (value: string) => void;
}

export default function EmailQuestionField({ selectedValue, onChange }: EmailQuestionFieldProps) {
    return (
        <input
            type="email"
            placeholder="e.g. alex@company.com"
            className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all shadow-2xs"
            value={selectedValue}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}