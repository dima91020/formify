import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from './card';
import { Button } from './button';
import { MoreVertical, Sparkles } from 'lucide-react';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
      description: 'Розмір відступів та шрифту картки',
    },
  },
  args: {
    size: 'default',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-[380px]">
      <CardHeader>
        <CardTitle>Customer Feedback Survey</CardTitle>
        <CardDescription>Created 2 days ago • 142 responses</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-xs" aria-label="Card options">
            <MoreVertical className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Collect detailed feedback about the latest release to improve UX and conversion.
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-xs text-muted-foreground">Status: Active</span>
        <Button size="sm">Edit Form</Button>
      </CardFooter>
    </Card>
  ),
};

export const SmallSize: Story = {
  render: (args) => (
    <Card {...args} size="sm" className="w-[320px]">
      <CardHeader>
        <CardTitle>Quick Poll</CardTitle>
        <CardDescription>3 questions</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          Compact card layout for sidebars and overview widgets.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="xs">
          Dismiss
        </Button>
        <Button size="xs">View</Button>
      </CardFooter>
    </Card>
  ),
};

export const FeatureCard: Story = {
  render: (args) => (
    <Card {...args} className="w-[380px] border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary font-medium text-xs mb-1">
          <Sparkles className="size-3.5" />
          <span>AI Logic Builder</span>
        </div>
        <CardTitle>Conditional Branches</CardTitle>
        <CardDescription>
          Automate dynamic flow according to user input.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80">
          Connect nodes seamlessly on the visual canvas.
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" size="sm">
          Docs
        </Button>
        <Button size="sm">Try Now</Button>
      </CardFooter>
    </Card>
  ),
};
