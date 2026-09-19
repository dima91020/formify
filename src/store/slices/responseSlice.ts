import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AnswerValue} from "@/schemas/response.schema";

export interface ResponseState {
    answers: Record<string, AnswerValue>,
    currentQuestionId: string | null,
    history: string[],
}

const initialState: ResponseState = {
    answers: {},
    currentQuestionId: null,
    history: [],
};

export const responseSlice = createSlice({
    name: "response",
    initialState,
    reducers: {
        updateAnswer: (state, action: PayloadAction<{questionId: string, value: AnswerValue}>) => {
            if (!state.currentQuestionId) return;

            const isEmpty = 
                action.payload.value === "" ||
                (Array.isArray(action.payload.value) && action.payload.value.length === 0);

            if (isEmpty) {
                delete state.answers[action.payload.questionId];
                return;
            }

            state.answers[action.payload.questionId] = action.payload.value;
        },
        setCurrentQuestionId: (state, action: PayloadAction<string | null>) => {
            state.currentQuestionId = action.payload;
        },
        togglePrevQuestion: (state) => {
            const prevQuestion = state.history.pop();
            if (!prevQuestion) return;

            state.currentQuestionId = prevQuestion;
        },
        toggleNextQuestion: (state, action: PayloadAction<string>) => {
            state.history.push(action.payload);
        },
        restoreProgress: (_, action: PayloadAction<ResponseState>) => {
            return action.payload;
        }
    },
    selectors: {
        selectResponseAnswers: (state) => state.answers,
        selectResponseCurrentQuestionId: (state) => state.currentQuestionId,
        selectResponseHistory: (state) => state.history,
    }
})

export const {
    updateAnswer,
    setCurrentQuestionId,
    togglePrevQuestion,
    toggleNextQuestion,
    restoreProgress } = responseSlice.actions;

export const { 
    selectResponseAnswers,
    selectResponseCurrentQuestionId,
    selectResponseHistory,
} = responseSlice.selectors;

export default responseSlice.reducer;