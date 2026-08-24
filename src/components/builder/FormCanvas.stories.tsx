import type { Meta, StoryObj } from '@storybook/react';
import FormCanvas from './FormCanvas';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import formReducer, { type FormBuilderState } from '@/store/slices/formSlice';
import responseReducer from '@/store/slices/responseSlice';
import type { Question } from '@/schemas/form.schema';
import React from 'react';

const mockQuestions: Question[] = [
  {
    id: 'q-choice',
    title: 'How did you hear about Formify?',
    type: 'CHOICE',
    required: true,
    options: [
      { id: 'opt-1', value: 'Social Media (Twitter/X, LinkedIn)' },
      { id: 'opt-2', value: 'Search Engine (Google)' },
      { id: 'opt-3', value: 'Colleague recommendation' },
      { id: 'opt-4', value: 'Other' },
    ],
  },
  {
    id: 'q-rating',
    title: 'How would you rate your overall experience?',
    type: 'RATING',
    required: true,
  },
  {
    id: 'q-nps',
    title: 'How likely are you to recommend Formify to others?',
    type: 'NPS',
    required: true,
  },
  {
    id: 'q-text',
    title: 'What is the main improvement you would like to see?',
    type: 'TEXT',
    required: false,
  },
  {
    id: 'q-email',
    title: 'What is your primary contact email?',
    type: 'EMAIL',
    required: true,
  },
  {
    id: 'q-date',
    title: 'When did your project start?',
    type: 'DATE',
    required: false,
  },
];

const createMockStore = (initialFormState?: Partial<FormBuilderState>) => {
  return configureStore({
    reducer: {
      form: formReducer,
      response: responseReducer,
    },
    preloadedState: {
      form: {
        title: 'Customer Feedback Survey',
        questions: mockQuestions,
        logic: [],
        activeQuestionId: 'q-choice',
        ...initialFormState,
      },
    },
  });
};

const meta = {
  title: 'Builder/FormCanvas',
  component: FormCanvas,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FormCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChoiceQuestion: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createMockStore({
          activeQuestionId: 'q-choice',
        })}
      >
        <div className="bg-muted/10 min-h-screen">
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const RatingQuestion: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createMockStore({
          activeQuestionId: 'q-rating',
        })}
      >
        <div className="bg-muted/10 min-h-screen">
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const NPSQuestion: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createMockStore({
          activeQuestionId: 'q-nps',
        })}
      >
        <div className="bg-muted/10 min-h-screen">
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const TextQuestion: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createMockStore({
          activeQuestionId: 'q-text',
        })}
      >
        <div className="bg-muted/10 min-h-screen">
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const EmailQuestion: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createMockStore({
          activeQuestionId: 'q-email',
        })}
      >
        <div className="bg-muted/10 min-h-screen">
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const DateQuestion: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createMockStore({
          activeQuestionId: 'q-date',
        })}
      >
        <div className="bg-muted/10 min-h-screen">
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export const EmptyState: Story = {
  decorators: [
    (Story) => (
      <Provider
        store={createMockStore({
          questions: [],
          activeQuestionId: null,
        })}
      >
        <div className="bg-muted/10 min-h-screen">
          <Story />
        </div>
      </Provider>
    ),
  ],
};
