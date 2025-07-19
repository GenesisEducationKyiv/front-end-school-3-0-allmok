import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RemovableChip } from '../components/RemovableChip';

const meta: Meta<typeof RemovableChip> = {
  title: 'Components/Chips/RemovableChip',
  component: RemovableChip,
  tags: ['autodocs'],
  argTypes: {
    genre: {
      control: 'text',
      description: 'Text displayed on the chip',
    },
    onRemove: {
      description: 'Function called when deleting',
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    genre: 'Rock',
    onRemove: fn(),
  },
};

export const LongGenreName: Story = {
  args: {
    genre: 'Space Rock',
    onRemove: fn(),
  },
};