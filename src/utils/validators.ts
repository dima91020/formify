import { Question } from "@/schemas/form.schema";
import { answerItemSchema, AnswerValue } from "@/schemas/response.schema";

export const hasDuplicateOptions = (options?: Array<{ id: string, value: string }>) => {
    if (!options || !options.length) return false;

    const optionsValues = options.map(option => option.value);

    return new Set(optionsValues).size !== options.length;
}

export const validatedAnswers = (question: Question, answer: AnswerValue | undefined): string | null => {
    if (answer === undefined) {
        if (question.required) {
            return "This field is required";
        }

        return null;
    }

    const answerData = {
        questionId: question.id,
        type: question.type,
        value: answer,
    }

    const result = answerItemSchema.safeParse(answerData);
        
    if (!result.success) {
        return result.error.issues[0].message;
    }

    return null;
}