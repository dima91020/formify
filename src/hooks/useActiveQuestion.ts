import { useAppSelector } from "@/store/hooks"
import { selectActiveQuestion, selectActiveQuestionIndex, selectQuestions } from "@/store/slices/formSlice"

export const useActiveQuestion = () => {
    const questions = useAppSelector(selectQuestions);
    const activeQuestion = useAppSelector(selectActiveQuestion);
    const activeQuestionIndex = useAppSelector(selectActiveQuestionIndex);
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
        nextQuestion
    }
}