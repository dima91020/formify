import { QuestionType } from "@/schemas/form.schema";

export default function getDefaultExpectedValue(type?: QuestionType): string | number | string[] {
    switch (type) {
        case QuestionType.CHECKBOX:
            return [];
        case QuestionType.RATING:
            return 1;
        case QuestionType.NPS:
            return 10;
        default:
            return "";
    }
}