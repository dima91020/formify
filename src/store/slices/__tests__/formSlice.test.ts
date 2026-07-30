import formReducer, { FormBuilderState, setActiveQuestion } from "../formSlice";

describe('formSlice', () => {
    const initialState: FormBuilderState = {
        questions: [],
        logic: [],
        activeQuestionId: null,
        title: "Untitled Form",
    };

    it('should set activeQuestionId to the specified ID', () => {
        const action = setActiveQuestion('q1');
        const newState = formReducer(initialState, action);

        expect(newState.activeQuestionId).toBe('q1');
    });

    it('should set activeQuestionId to the null', () => {
        const startingState = { ...initialState, activeQuestionId: 'q1' };
        const action = setActiveQuestion(null);
        const newState = formReducer(startingState, action);

        expect(newState.activeQuestionId).toBeNull();
    });
});