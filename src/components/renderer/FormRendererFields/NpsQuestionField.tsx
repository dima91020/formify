import clsx from "clsx";

interface NpsQuestionFieldProps {
    selectedValue: number;
    onChange: (value: number) => void;
}

export default function NpsQuestionField({ selectedValue, onChange }: NpsQuestionFieldProps) {
    return (
    <div className="w-full flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between gap-1">
            {[0, 1, 2, 3, 4, 5].map((value) => {
                const isSelected = selectedValue === value;

                return (
                    <button
                        key={value}
                        type="button"
                        className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center border text-xs font-mono font-semibold transition-all cursor-pointer select-none",
                        isSelected
                            ? "border-zinc-900 bg-zinc-900 text-white shadow-2xs scale-105"
                            : "border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300 text-zinc-700"
                        )}
                        onClick={() => onChange(value)}
                    >
                        {value}
                    </button>
                );
            })}
        </div>
                            
        <div className="flex items-center justify-center gap-2">
            {[6, 7, 8, 9, 10].map((value) => {
                const isSelected = selectedValue === value;
                return (
                    <button
                        key={value}
                        type="button"
                        className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center border text-xs font-mono font-semibold transition-all cursor-pointer select-none",
                            isSelected
                                ? "border-zinc-900 bg-zinc-900 text-white shadow-2xs scale-105"
                                : "border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300 text-zinc-700"
                        )}
                        onClick={() => onChange(value)}
                    >
                        {value}
                    </button>
                );
            })}
        </div>
                            
        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium px-1 pt-0.5">
            <span>0 - Not likely</span>
            <span>10 - Very likely</span>
        </div>
    </div>        
    )
}