import * as z from 'zod';

const questionSchema = z.object({
    id: z.string(),
    title: z.string().min(3, 'Title should be at least 3 characters')
        .max(100, "Title should be less than 100 characters"),
    required: z.boolean(),
    type: z.enum(["TEXT", "CHOICE", "CHECKBOX"]),
    options: z.array(z.object({ id: z.string(), value: z.string() })).optional(),
    condition: z.object({
        targetQuestionId: z.string(),
        expectedValue: z.string(),
    }).optional(),
});

const logicRuleSchema = z.object({
    questionId: z.string(),
    operator: z.enum(["EQUALS", "NOT_EQUALS", "INCLUDES"]),
    value: z.string(),
    targetId: z.string(),
});

const formContentSchema = z.object({
    questions: z.array(questionSchema),
    logic: z.array(logicRuleSchema).optional(),
});

export const createFormSchema = z.object({
   title: z.string().min(1, 'Title should be at least 1 characters')
       .max(100, "Title should be less than 100 characters"),
   schema: formContentSchema,
});

export const saveAnswersSchema = z.record(
    z.string(),
    z.union([
        z.string().min(1, 'Answers should be at least 1 character'),
        z.array(z.string())
    ])
);

export type Question = z.infer<typeof questionSchema>;
export type LogicRule = z.infer<typeof logicRuleSchema>;
export type FormContent = z.infer<typeof formContentSchema>;
export type CreateFormInput = z.infer<typeof createFormSchema>;