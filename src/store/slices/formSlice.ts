import {Question, LogicRule, CreateFormInput} from "@/schemas/form.schema";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {arrayMove} from "@dnd-kit/sortable";

export interface FormBuilderState {
    questions: Question[];
    logic: LogicRule[];
    activeQuestionId: string | null;
    title: string;
}

const initialState: FormBuilderState = {
    questions: [],
    logic: [],
    activeQuestionId: null,
    title: "Untitled Form",
}

export const formBuilderSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setActiveQuestion: (state, action: PayloadAction<string | null>) => {
            state.activeQuestionId = action.payload;
        },
        addQuestion: (state, action: PayloadAction<Question>) => {
            state.questions.push(action.payload);
        },
        deleteQuestion: (state, action: PayloadAction<string>) => {
            state.questions = state.questions.filter((question) => question.id !== action.payload);

            if (state.activeQuestionId === action.payload) {
                state.activeQuestionId = null;
            }
        },
        updateQuestion: (state, action: PayloadAction<{id: string, updates: Partial<Question>}>) => {
            const questionToUpdateIndex = state.questions.findIndex(
                (question) => question.id === action.payload.id
            );

            if (questionToUpdateIndex !== -1) {
                Object.assign(state.questions[questionToUpdateIndex], action.payload.updates);
            }
        },
        setFullForm: (state, action: PayloadAction<Pick<CreateFormInput, "title" | "schema">>) => {
            state.title = action.payload.title;
            state.questions = action.payload.schema.questions;
            state.logic = action.payload.schema.logic || [];
        },
        resetForm: () => initialState,
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        reorderQuestions: (state, action: PayloadAction<{activeId: string, overId: string}>) => {
            const activeQuestionsIndex = state.questions.findIndex((q) => q.id === action.payload.activeId);
            const overQuestionsIndex = state.questions.findIndex((q) => q.id === action.payload.overId);

            if (activeQuestionsIndex === -1 || overQuestionsIndex === -1) return;

            state.questions = arrayMove(state.questions, activeQuestionsIndex, overQuestionsIndex);

            if (state.questions[0] && state.questions[0].condition) {
                state.questions[0].condition = undefined;
            }
        }
    },
});

export const {
    setActiveQuestion,
    addQuestion,
    deleteQuestion,
    updateQuestion,
    setFullForm,
    resetForm,
    setTitle,
    reorderQuestions,
} = formBuilderSlice.actions;
export default formBuilderSlice.reducer;