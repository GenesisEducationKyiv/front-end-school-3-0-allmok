import React, { useEffect, useState, useRef } from 'react';

interface BaseFilterProps {
  open: boolean;
  onClose: () => void;
  title: string;
  items: string[];
}

interface SingleSelectProps extends BaseFilterProps {
  multiple?: false;
  selectedValue: string;
  onConfirm: (value: string) => void;
}

interface MultiSelectProps extends BaseFilterProps {
  multiple: true;
  selectedValues: string[];
  onConfirm: (values: string[]) => void;
}

type FilterDialogProps = SingleSelectProps | MultiSelectProps;


export const FilterDialog: React.FC<FilterDialogProps> = (props) => {
  const { open, onClose, title, items } = props;

  const dialogRef = useRef<HTMLElement & { show: () => void; close: () => void }>(null);
  const activeSelectedValue = props.multiple ? props.selectedValues : props.selectedValue;
  const [tempValue, setTempValue] = useState(activeSelectedValue);

  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (dialogNode) {
      if (open) {
        dialogNode.show();
      } else {
        dialogNode.close();
      }
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setTempValue(activeSelectedValue);
    }
  }, [open, activeSelectedValue]);

  useEffect(() => {
    const dialogNode = dialogRef.current;

    const handleDialogCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    if (dialogNode) {
      dialogNode.addEventListener('cancel', handleDialogCancel);
    }
    return () => {
      if (dialogNode) {
        dialogNode.removeEventListener('cancel', handleDialogCancel);
      }
    };
  }, [onClose]); 


  const handleChipClick = (item: string) => {
    if (props.multiple) {
      const currentValues = tempValue as string[];
      const newValues = currentValues.includes(item)
        ? currentValues.filter(v => v !== item)
        : [...currentValues, item];
      setTempValue(newValues);
    } else {
      setTempValue(item);
    }
  };

  const handleConfirm = () => {
    onClose();
    if (props.multiple) {
      props.onConfirm(tempValue as string[]);
    } else {
      props.onConfirm(tempValue as string);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const isAllSelected = !props.multiple && tempValue === '';

  return (
    <md-dialog ref={dialogRef} onClosed={handleCancel}>
      <div slot="headline">{title}</div>
      <div slot="content" style={{ minWidth: '300px' }}>
        <md-chip-set>
          {!props.multiple && (
            <md-filter-chip
              label="All"
              selected={isAllSelected}
              onClick={() => setTempValue('')}
            />
          )}
          {items.map(item => (
            <md-filter-chip
              key={item}
              label={item}
              selected={
                props.multiple
                  ? (tempValue as string[]).includes(item)
                  : tempValue === item
              }
              onClick={() => handleChipClick(item)}
            />
          ))}
        </md-chip-set>
      </div>
      <div slot="actions">
        <md-text-button type="button" onClick={onClose}>Cancel</md-text-button>
        <md-text-button type="button" onClick={handleConfirm}>Apply</md-text-button>
      </div>
    </md-dialog>
  );
};