import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Answers} from "@/schemas/response.schema";

export interface ResponseState {
    answers: Answers,
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
        updateAnswer: (state, action: PayloadAction<{questionId: string, value: string | string[]}>) => {
            if (!state.currentQuestionId) return;

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
        restoreProgress: (state, action: PayloadAction<ResponseState>) => {
            return action.payload;
        }
    }
})

export const { updateAnswer, setCurrentQuestionId, togglePrevQuestion, toggleNextQuestion, restoreProgress } = responseSlice.actions;
export default responseSlice.reducer;