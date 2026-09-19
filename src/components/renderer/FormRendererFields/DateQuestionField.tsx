import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO, isValid } from "date-fns";

interface DateQuestionFieldProps {
    selectedValue: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function DateQuestionField({ selectedValue, onChange, className }: DateQuestionFieldProps) {
    const parsedDate = selectedValue ? parseISO(selectedValue) : undefined;
    const isDateValid = parsedDate && isValid(parsedDate);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className={className}>
                    {isDateValid ? format(parsedDate, "PPP") : <span className="">Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Calendar
                    mode="single"
                    selected={isDateValid ? parsedDate : undefined}
                    onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
                    defaultMonth={isDateValid ? parsedDate : undefined}
                />
            </PopoverContent>
        </Popover>        
    )
}