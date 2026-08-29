import {Question, LogicRule, CreateFormInput, QuestionType} from "@/schemas/form.schema";
import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {arrayMove} from "@dnd-kit/sortable";
import getDefaultExpectedValue from "@/utils/getDefaultExpectedValue";

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

            state.questions.forEach((q) => {
                if (q.condition?.targetQuestionId === action.payload) {
                    q.condition = undefined;
                }
            })
        },
        updateQuestion: (state, action: PayloadAction<{id: string, updates: Partial<Question>}>) => {
            const questionToUpdateIndex = state.questions.findIndex(
                (question) => question.id === action.payload.id
            );

            if (questionToUpdateIndex !== -1) {
                Object.assign(state.questions[questionToUpdateIndex], action.payload.updates);
            }
        },
        changeQuestionType: (state, action: PayloadAction<QuestionType>) => {
            const newType = action.payload;

            const activeQuestion = state.questions.find((q) => q.id === state.activeQuestionId);
            if (!activeQuestion) return;

            activeQuestion.type = newType;

            const isOptionsType = newType === QuestionType.CHOICE || newType === QuestionType.CHECKBOX;

            if (isOptionsType && (!activeQuestion.options || activeQuestion.options.length === 0)) {
                activeQuestion.options = [{ id: crypto.randomUUID(), value: "Option 1" }];
            } else if (!isOptionsType) {
                activeQuestion.options = undefined;
            }

            state.questions.forEach((q) => {
                if (q.condition?.targetQuestionId === activeQuestion.id) {
                    q.condition.expectedValue = getDefaultExpectedValue(newType);
                }
            });
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

            const movedQuestion = state.questions[overQuestionsIndex];

            if (movedQuestion && movedQuestion.condition) {
                if (overQuestionsIndex === 0) {
                    movedQuestion.condition = undefined;
                } else {
                    const targetIndex = state.questions.findIndex((q) => q.id === movedQuestion.condition?.targetQuestionId);

                    if (targetIndex >= overQuestionsIndex) {
                        movedQuestion.condition.targetQuestionId = state.questions[overQuestionsIndex - 1].id;
                    }
                }
            }
        }
    },
    selectors: {
        selectQuestions: (state) => state.questions,
        selectActiveQuestionId: (state) => state.activeQuestionId,
        selectActiveQuestion: (state) => state.questions.find((q) => q.id === state.activeQuestionId) ?? null,
        selectActiveQuestionIndex: (state) => {
            if (!state.activeQuestionId) return null;
            const index = state.questions.findIndex((q) => q.id === state.activeQuestionId);
            return index === -1 ? null : index;
        }
    }
});

export const {
    selectQuestions,
    selectActiveQuestionId,
    selectActiveQuestion,
    selectActiveQuestionIndex,
} = formBuilderSlice.selectors;

export const {
    setActiveQuestion,
    addQuestion,
    deleteQuestion,
    updateQuestion,
    changeQuestionType,
    setFullForm,
    resetForm,
    setTitle,
    reorderQuestions,
} = formBuilderSlice.actions;
export default formBuilderSlice.reducer;