import { AnswerValue } from "@/schemas/response.schema";

export const getStringAnswer = (val: AnswerValue | undefined, fallback = ""): string => {
    return typeof val === "string" ? val : fallback;
}

export const getNumberAnswer = (val: AnswerValue | undefined, fallback = 0): number => {
    return typeof val === "number" ? val : fallback;
}

export const getArrayAnswer = (val: AnswerValue | undefined, fallback: string[] = []): string[] => {
    return Array.isArray(val) ? val : fallback;
}