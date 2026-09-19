import { Question } from "@/schemas/form.schema";
import { AnswerValue } from "@/schemas/response.schema";

export function isConditionMet(condition: Question["condition"], actualAnswer: AnswerValue | undefined) {
    if (!condition || actualAnswer === undefined || condition?.expectedValue === undefined) return false;

    if (Array.isArray(condition.expectedValue) && Array.isArray(actualAnswer)) {
        return condition.expectedValue.every((option: string) => actualAnswer.includes(option));
    } else {
        return condition.expectedValue === actualAnswer;
    }
}