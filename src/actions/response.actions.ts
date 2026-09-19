'use server'

import { RawAnswers, saveAnswersSchema } from "@/schemas/response.schema";
import { prisma } from "@/lib/prisma";
import { FormContent } from "@/schemas/form.schema";
import { isConditionMet } from "@/utils/isConditionMet";

export async function submitFormResponse(formId: string, answers: RawAnswers) {
    const form = await prisma.form.findUnique({
        where: {
            id: formId,
            published: true,
        }
    })

    if (!form) return { success: false, error: "Form not found or not published" };

    const validatedAnswers = saveAnswersSchema.safeParse(answers);

    if (!validatedAnswers.success) return {
        success: false,
        error: validatedAnswers.error.flatten().fieldErrors,
        message: `${formId} validation error.`,
    }

    const formSchema = form.schema as unknown as FormContent;

    const questions = formSchema?.questions || [];

    for (const question of questions) {
        if (question.condition) {
            const targetAnswer = validatedAnswers.data.find((answer) => answer.questionId === question.condition?.targetQuestionId);
            const conditionMet = isConditionMet(question.condition, targetAnswer?.value);

            if (!conditionMet) continue;
        }

        const isAnswered = validatedAnswers.data.some((answer) => answer.questionId === question.id && answer.value !== undefined);

        if (question.required && !isAnswered) {
            return {
                success: false,
                error: { [question.id]: "This field is required." },
                message: "This field is required."
            }
        }
    }

    try {
        const data = await prisma.response.create({
            data: {
                formId: formId,
                answers: validatedAnswers.data,
            }
        });

        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Failed to submit form" };
    }
}