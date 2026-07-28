import responseReducer, { updateAnswer, ResponseState, toggleNextQuestion, togglePrevQuestion } from '../responseSlice';

describe('responseSlice', () => {
    const initialState: ResponseState = {
        answers: {},
        currentQuestionId: null,
        history: [],
    };

    it('повинен оновлювати відповідь для поточного питання', () => {
        const startingState = { ...initialState, currentQuestionId: 'q1' };

        const action = updateAnswer({ questionId: 'q1', value: 'Тестова відповідь' });
        const newState = responseReducer(startingState, action);

        expect(newState.answers['q1']).toBe('Тестова відповідь');
    });

    it('не повинен записувати відповідь, якщо поточне питання не встановлено', () => {
        const action = updateAnswer({ questionId: 'q1', value: 'Тестова відповідь' });
        const newState = responseReducer(initialState, action);

        expect(newState.answers['q1']).toBeUndefined();
    });

    it('повинен додавати питання в історію при русі вперед', () => {
        const action = toggleNextQuestion('q1');
        const newState = responseReducer(initialState, action);
        
        expect(newState.history).toContain('q1');
        expect(newState.history).toHaveLength(1);
    });

    it('повинен повертатися назад, дістаючи останнє питання з історії', () => {
        const startingState: ResponseState = {
            answers: {},
            history: ['q1', 'q2'],
            currentQuestionId: 'q3',
        };

        const action = togglePrevQuestion();
        const newState = responseReducer(startingState, action);

        expect(newState.currentQuestionId).toBe('q2');
        expect(newState.history).toEqual(['q1']);
    });

    it('не повинен ламатися при спробі повернутися назад з порожньою історією', () => {
        const startingState: ResponseState = {
            answers: {},
            history: [],
            currentQuestionId: 'q1',
        };

        const action = togglePrevQuestion();
        const newState = responseReducer(startingState, action);

        expect(newState.currentQuestionId).toBe('q1');
        expect(newState.history).toHaveLength(0);
    });
});
