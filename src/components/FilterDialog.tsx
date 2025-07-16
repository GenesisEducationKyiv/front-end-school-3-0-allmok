import React, { useEffect, useState, useRef } from 'react';

interface FilterDialogProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
  title: string;
  items: string[];
  selectedValue: string;
  onConfirm: (value: string) => void;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  title,
  items,
  selectedValue,
  onConfirm
}) => {
  const dialogRef = useRef<HTMLDialogElement & { open: boolean, close: () => void }>(null);
  const [tempSelectedValue, setTempSelectedValue] = useState(selectedValue);

  useEffect(() => {
    if (open) {
      setTempSelectedValue(selectedValue);
      dialogRef.current?.show();
    } else {
      dialogRef.current?.close();
    }
  }, [open, selectedValue]);
  
  const handleConfirm = () => {
    onConfirm(tempSelectedValue);
    onClose(true);
  };

  const handleCancel = () => {
    onClose(false);
  };

  return (
    <md-dialog ref={dialogRef} onClosed={handleCancel}>
      <div slot="headline">{title}</div>
      <div slot="content">
        <md-chip-set>
          <md-filter-chip
            label="All"
            selected={tempSelectedValue === ''}
            onClick={() => setTempSelectedValue('')}
          />
          {items.map(item => (
            <md-filter-chip
              key={item}
              label={item}
              selected={tempSelectedValue === item}
              onClick={() => setTempSelectedValue(item)}
            />
          ))}
        </md-chip-set>
      </div>
      <div slot="actions">
        <md-text-button onClick={handleCancel}>Cancel</md-text-button>
        <md-text-button onClick={handleConfirm}>Apply</md-text-button>
      </div>
    </md-dialog>
  );
};