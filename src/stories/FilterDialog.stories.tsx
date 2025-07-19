import type { Meta, StoryObj } from '@storybook/react';
import { FilterDialog } from '../components/FilterDialog';
import { useState } from 'react';

type FilterDialogStoryProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  items: string[];
  multiple?: boolean;
  selectedValue?: string;
  selectedValues?: string[];
  onConfirm?: (value: any) => void;
};

const meta: Meta<FilterDialogStoryProps> = {
  title: 'Components/FilterDialog',
  component: FilterDialog as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable filter dialog component. Uses Material Design components for consistent UI.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the dialog is open'
    },
    title: {
      control: 'text',
      description: 'Title displayed in the dialog header'
    },
    items: {
      control: 'object',
      description: 'Array of items to display as filter chips'
    },
    multiple: {
      control: 'boolean',
      description: 'Enable multiple selection mode'
    },
    onClose: {
      action: 'onClose',
      description: 'Callback fired when dialog is closed'
    },
    onConfirm: {
      action: 'onConfirm',
      description: 'Callback fired when selection is confirmed'
    }
  }
};

export default meta;
type Story = StoryObj<FilterDialogStoryProps>;

const SingleSelectWrapper = (args: FilterDialogStoryProps) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(args.selectedValue || '');

  return (
    <div>
      <button 
        onClick={() => setOpen(true)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Open Single Select Filter
      </button>
      <FilterDialog
        open={open}
        title={args.title}
        items={args.items}
        multiple={false}
        selectedValue={selectedValue}
        onClose={() => setOpen(false)}
        onConfirm={(value: string) => {
          setSelectedValue(value);
          args.onConfirm?.(value);
        }}
      />
      <div style={{ marginTop: '16px', fontSize: '14px' }}>
        Selected: <strong>{selectedValue || 'All'}</strong>
      </div>
    </div>
  );
};


const MultiSelectWrapper = (args: FilterDialogStoryProps) => {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(args.selectedValues || []);

  return (
    <div>
      <button 
        onClick={() => setOpen(true)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Open Multi Select Filter
      </button>
      <FilterDialog
        open={open}
        title={args.title}
        items={args.items}
        multiple={true}
        selectedValues={selectedValues}
        onClose={() => setOpen(false)}
        onConfirm={(values: string[]) => {
          setSelectedValues(values);
          args.onConfirm?.(values);
        }}
      />
      <div style={{ marginTop: '16px', fontSize: '14px' }}>
        Selected: <strong>{selectedValues.length > 0 ? selectedValues.join(', ') : 'None'}</strong>
      </div>
    </div>
  );
};

export const SingleSelectDefault: Story = {
  render: (args) => <SingleSelectWrapper {...args} />,
  args: {
    title: 'Select Category',
    items: ['Jazz', 'Vocal', 'Traditional', 'Pop', 'Rock', 'Progressive'],
    selectedValue: '',
    multiple: false
  }
};


export const MultiSelectDefault: Story = {
  render: (args) => <MultiSelectWrapper {...args} />,
  args: {
    title: 'Select Tags',
    items: ['Hip-Hop', 'Rock', 'Electronic', 'Pop', 'Classical','Flamenco', 'Jazz', 'Indie'],
    selectedValues: [],
    multiple: true
  }
};


export const LongItemsList: Story = {
  render: (args) => <SingleSelectWrapper {...args} />,
  args: {
    title: 'Select Country',
    items: [
       'Hip-Hop', 'Rock', 'Electronic', 'Pop', 'Classical',
       'Flamenco', 'Jazz', 'Indie', 'J-Pop', 'K-Pop',
       'Mandopop', 'Bollywood', 'Samba', 'Mariachi', 'Tango',
       'Trance', 'Death Metal', 'Black Metal', 'Nordic Folk', 'Finnish Metal'
    ],
    selectedValue: '',
    multiple: false
  }
};
