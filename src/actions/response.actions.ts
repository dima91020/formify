'use server'

import {saveAnswersSchema} from "@/schemas/response.schema";
import {prisma} from "@/lib/prisma";

export type Answers = Record<string, string | string[]>;

export async function submitFormResponse(formId: string, answers: Answers) {
    const validatedAnswers = saveAnswersSchema.safeParse(answers);

    if (!validatedAnswers.success) return {
        success: false,
        error: validatedAnswers.error.flatten().fieldErrors,
        message: `${formId} validation error.`,
    }

    try {
        const data = await prisma.response.create({
            data: {
                formId: formId,
                answers: validatedAnswers.data,
            }
        });

        return {success: true, data};
    } catch (error) {
        return { success: false, error: "Failed to submit form" };
    }
}