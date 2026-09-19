import { Star } from "lucide-react";
import clsx from "clsx";

interface RatingQuestionFieldProps {
    selectedValue: number;
    onChange: (value: number) => void;
}

export default function RatingQuestionField({ selectedValue, onChange }: RatingQuestionFieldProps) {
    return (
        <div className="w-full flex flex-col items-center gap-3 pt-2">
            <div className="flex items-center gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((star) => {
                    const isSelected = star <= selectedValue;
                    return (
                        <button
                            key={star}
                            type="button"
                            className="p-2 rounded-2xl hover:bg-amber-50 text-amber-400 transition-all"
                            onClick={() => onChange(star)}
                        >
                            <Star
                                className={clsx(
                                    "h-10 w-10 transition-all duration-150 ease-in-out",
                                    isSelected ? "fill-amber-400 stroke-amber-400 drop-shadow-xs" : "stroke-zinc-300 fill-transparent hover:stroke-amber-300"
                                )}
                            />
                        </button>
                    )}
                )}
            </div>
            <div className="w-full flex items-center justify-between text-xs text-zinc-400 px-2 font-medium">
                <span>1 - Poor</span>
                <span>5 - Excellent</span>
            </div>
        </div>
    )
}