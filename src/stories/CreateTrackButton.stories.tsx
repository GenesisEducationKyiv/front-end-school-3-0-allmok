import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { CreateTrackButton } from '../components/CreateTrackButton';

const meta: Meta<typeof CreateTrackButton> = {
  title: 'Components/Buttons/CreateTrackButton',
  component: CreateTrackButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      description: 'The function that is called when you click on the button',
      control: false,
    },
    disabled: {
      control: 'boolean',
      description: 'Makes the button inactive',
    },
  },
  args: {
    onClick: fn(),
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};