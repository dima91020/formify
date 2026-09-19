import * as z from "zod";
import { QuestionType } from "./form.schema";

export const textAnswerSchema = z.object({
    questionId: z.string(),
    type: z.literal(QuestionType.TEXT),
    value: z.string().trim().min(1, "Answer should be at least 1 character"),
});

export const choiceAnswerSchema = z.object({
    questionId: z.string(),
    type: z.literal(QuestionType.CHOICE),
    value: z.string().trim().min(1, "Answer should be at least 1 character"),
});

export const checkboxAnswerSchema = z.object({
    questionId: z.string(),
    type: z.literal(QuestionType.CHECKBOX),
    value: z.array(z.string().trim().min(1, "Answer should be at least 1 character")),
});

export const ratingAnswerSchema = z.object({
    questionId: z.string(),
    type: z.literal(QuestionType.RATING),
    value: z.number().int().min(1, "Rating should be at least 1").max(5, "Rating should be at most 5"),
});

export const npsAnswerSchema = z.object({
    questionId: z.string(),
    type: z.literal(QuestionType.NPS),
    value: z.number().int().min(0, "NPS should be at least 0").max(10, "NPS should be at most 10"),
});

export const emailAnswerSchema = z.object({
    questionId: z.string(),
    type: z.literal(QuestionType.EMAIL),
    value: z.string().email("Invalid email address. Use example@domain.com format"),
});

export const dateAnswerSchema = z.object({
    questionId: z.string(),
    type: z.literal(QuestionType.DATE),
    value: z.string().date("Invalid date"),
});

export const answerItemSchema = z.discriminatedUnion("type", [
    textAnswerSchema,
    choiceAnswerSchema,
    checkboxAnswerSchema,
    ratingAnswerSchema,
    npsAnswerSchema,
    emailAnswerSchema,
    dateAnswerSchema,
]);

export const saveAnswersSchema = z.array(answerItemSchema);

export type AnswerItem = z.infer<typeof answerItemSchema>;

export type AnswerValue = AnswerItem["value"];

export type RawAnswerItem = {
    questionId: string,
    type: QuestionType,
    value: AnswerValue,
};

export type RawAnswers = RawAnswerItem[];
export type Answers = z.infer<typeof saveAnswersSchema>;
