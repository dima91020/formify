import { useAppSelector } from "@/store/hooks"
import {
    selectFormActiveQuestion,
    selectFormActiveQuestionIndex,
    selectFormQuestions
} from "@/store/slices/formSlice"

export const useActiveQuestion = () => {
    const questions = useAppSelector(selectFormQuestions);
    const activeQuestion = useAppSelector(selectFormActiveQuestion);
    const activeQuestionIndex = useAppSelector(selectFormActiveQuestionIndex);
    const questionNumber = activeQuestionIndex !== null ? activeQuestionIndex + 1 : 0;

    const previousQuestions = (activeQuestionIndex !== null && activeQuestionIndex > 0)
        ? questions.slice(0, activeQuestionIndex)
        : [];

    const isFirstQuestion = activeQuestionIndex === 0;
    const isLastQuestion = activeQuestionIndex === questions.length - 1;

    const previousQuestion = (activeQuestionIndex !== null && activeQuestionIndex > 0)
        ? questions[activeQuestionIndex - 1]
        : null;

    const nextQuestion = (activeQuestionIndex !== null && activeQuestionIndex < questions.length - 1)
        ? questions[activeQuestionIndex + 1]
        : null;

    // const findQuestionIndexById = (questionId: string) => {
    //     const index = questions.findIndex((q) => q.id === questionId);
    //     return index === -1 ? null : index;
    // }

    return {
        questions,
        activeQuestion,
        activeQuestionIndex,
        questionNumber,
        previousQuestions,
        activeQuestionHasCondition: Boolean(activeQuestion?.condition),
        isFirstQuestion,
        isLastQuestion,
        previousQuestion,
        nextQuestion,
        // findQuestionIndexById,
    }
}