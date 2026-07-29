import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import responseReducer, { updateAnswer, toggleNextQuestion, ResponseState } from '@/store/slices/responseSlice';
import { localStorageMiddleware } from '../localStorageMiddleware';

describe('localStorageMiddleware', () => {
    let store: ReturnType<typeof createTestStore>;

    const createTestStore = () => configureStore({
        reducer: {
            response: responseReducer,
        },
        middleware: (getDefault) => getDefault().concat(localStorageMiddleware),
    });

    beforeEach(() => {
        vi.useFakeTimers();
        store = createTestStore();
        window.localStorage.clear();
        vi.spyOn(Storage.prototype, 'setItem');
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('повинен робити debounce для updateAnswer (не зберігати негайно)', () => {
        store.dispatch({ type: 'response/setCurrentQuestionId', payload: 'q1' });
        window.localStorage.clear();

        store.dispatch(updateAnswer({ questionId: 'q1', value: 'Hello' }));

        expect(localStorage.getItem('surveyProgress')).toBeNull();

        vi.advanceTimersByTime(500);

        const saved = JSON.parse(localStorage.getItem('surveyProgress') || '{}') as ResponseState;
        expect(saved.answers?.['q1']).toBe('Hello');
    });

    it('повинен зберігати миттєво для дій навігації (наприклад, toggleNextQuestion)', () => {
        store.dispatch(toggleNextQuestion('q1'));

        expect(localStorage.getItem('surveyProgress')).not.toBeNull();
        const saved = JSON.parse(localStorage.getItem('surveyProgress') || '{}') as ResponseState;
        expect(saved.history).toContain('q1');
    });
});
