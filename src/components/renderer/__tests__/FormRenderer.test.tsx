import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FormRenderer from '../FormRenderer';
import responseReducer from '@/store/slices/responseSlice';
import formReducer from '@/store/slices/formSlice';
import { Options } from '@/components/builder/FormOptions';
import { Question } from '@/schemas/form.schema';
import { submitFormResponse } from '@/actions/response.actions';
import userEvent from '@testing-library/user-event';

vi.mock('@/actions/response.actions', () => ({
    submitFormResponse: vi.fn().mockResolvedValue({ success: true }),
}));

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mockQuestions: Question[] = [
    {
        id: 'q1',
        title: 'Як вас звати?',
        type: Options.TEXT,
        required: true,
    },
    {
        id: 'q2',
        title: 'Оберіть вашу роль',
        type: Options.CHOICE,
        required: false,
        options: [{ id: 'opt1', value: 'Developer' }, { id: 'opt2', value: 'Designer' }],
    }
];

const createTestStore = () =>
    configureStore({
        reducer: {
            response: responseReducer,
            form: formReducer,
        },
    });

type TestStore = ReturnType<typeof createTestStore>;

describe('FormRenderer Component', () => {
    let store: TestStore;

    beforeEach(() => {
        window.localStorage.clear();
        
        store = createTestStore();
    });

    const renderWithProvider = (component: React.ReactNode) => {
        return render(<Provider store={store}>{component}</Provider>);
    };

    it('повинен рендерити перше питання при ініціалізації', () => {
        renderWithProvider(<FormRenderer questions={mockQuestions} formId="form-123" />);

        expect(screen.getByText(/Як вас звати\?/i)).toBeInTheDocument();
        
        expect(screen.getByPlaceholderText('Type your answer')).toBeInTheDocument();
        
        const prevButton = screen.getByRole('button', { name: 'Go back' }); 
        expect(prevButton).toBeDisabled();
    });

    it('повинен показувати помилку валідації, якщо обов\'язкове поле порожнє', async () => {
        const user = userEvent.setup();

        renderWithProvider(<FormRenderer questions={mockQuestions} formId="form-123" />);

        const nextButton = screen.getByRole('button', { name: 'Go forward' });
        
        await user.click(nextButton);

        expect(await screen.findByText('This field is required')).toBeInTheDocument();
    });

    it('повинен переходити на наступне питання після заповнення обов\'язкового поля', async () => {
        const user = userEvent.setup();

        renderWithProvider(<FormRenderer questions={mockQuestions} formId="form-123" />);

        const input = screen.getByPlaceholderText('Type your answer');
        await user.type(input, 'Олександр');

        const nextButton = screen.getByRole('button', { name: 'Go forward' });
        await user.click(nextButton);

        expect(await screen.findByText(/Оберіть вашу роль/i)).toBeInTheDocument();
        
        const prevButton = screen.getByRole('button', { name: 'Go back' });
        expect(prevButton).not.toBeDisabled();
    });

    it('повинен відправляти дані на сервер та показувати екран успіху', async () => {
        const user = userEvent.setup();

        renderWithProvider(<FormRenderer questions={mockQuestions} formId="form-123" />);

        const input = screen.getByPlaceholderText('Type your answer');
        await user.type(input, 'Олександр');
        
        const firstNextButton = screen.getByRole('button', { name: 'Go forward' });
        await user.click(firstNextButton);

        expect(await screen.findByText(/Оберіть вашу роль/i)).toBeInTheDocument();

        const radioOption = screen.getByLabelText('Developer');
        await user.click(radioOption);

        const submitButton = screen.getByText('Submit');
        await user.click(submitButton);

        expect(submitFormResponse).toHaveBeenCalledTimes(1);
        expect(submitFormResponse).toHaveBeenCalledWith('form-123', {
            'q1': 'Олександр',
            'q2': 'Developer'
        });

        expect(await screen.findByText('Thank you!')).toBeInTheDocument();
    });

    it('повинен повертатися на перше питання при натисканні кнопки Назад', async () => {
        const user = userEvent.setup();

        renderWithProvider(<FormRenderer questions={mockQuestions} formId="form-123" />);
        
        const input = screen.getByPlaceholderText('Type your answer');
        await user.type(input, 'Олександр');
        
        const firstStepNextButton = screen.getByRole('button', { name: 'Go forward' });
        await user.click(firstStepNextButton);

        expect(await screen.findByText(/Оберіть вашу роль/i)).toBeInTheDocument();

        const secondStepPrevButton = screen.getByRole('button', { name: 'Go back' });
        await user.click(secondStepPrevButton);

        const questionTitle = await screen.findByText(/Як вас звати\?/i);
        expect(questionTitle).toBeInTheDocument();
        
        const finalPrevButton = screen.getByRole('button', { name: 'Go back' });
        expect(finalPrevButton).toBeDisabled();
    });
});