import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Mail, ArrowRight, Trash2, Plus } from 'lucide-react';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Візуальний стиль кнопки',
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
      description: 'Розмір кнопки',
    },
    disabled: {
      control: 'boolean',
      description: 'Стан блокування',
    },
    asChild: {
      control: false,
    },
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Primary Action',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Action',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <Trash2 className="size-4" />
        Delete Form
      </>
    ),
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Style Button',
  },
};

export const WithIcons: Story = {
  args: {
    children: (
      <>
        <Mail className="size-4" />
        Send Message
        <ArrowRight className="size-4" />
      </>
    ),
  },
};

export const IconButton: Story = {
  args: {
    size: 'icon',
    variant: 'outline',
    children: <Plus className="size-4" />,
    'aria-label': 'Add new question',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};
