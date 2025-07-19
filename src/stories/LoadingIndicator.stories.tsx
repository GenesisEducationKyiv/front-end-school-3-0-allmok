import type { Meta, StoryObj } from '@storybook/react';
import LoadingIndicator from '../components/LoadingIndicator';

const meta: Meta<typeof LoadingIndicator> = {
  title: 'Components/LoadingIndicator',
  component: LoadingIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    'data-testid': {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
};