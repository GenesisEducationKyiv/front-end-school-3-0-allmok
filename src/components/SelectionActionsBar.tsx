import React from 'react';
import '../css/SelectionActionsBar.css';

interface SelectionActionsBarProps {
  count: number;
  isDeleting: boolean;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

export const SelectionActionsBar: React.FC<SelectionActionsBarProps> = ({
  count,
  isDeleting,
  onSelectAll,
  onDeleteSelected,
  onClearSelection,
}) => {
  if (count === 0) {
    return null;
  }

  return (
    <div className="selection-actions-bar" data-testid="selection-actions-bar">
      <span className="selection-count">{count} selected</span>
      <div className="selection-actions-buttons">
        <md-text-button onClick={onClearSelection}>
          Clear
        </md-text-button>

        <md-text-button onClick={onSelectAll}>
          Select all
        </md-text-button>

        <md-filled-button onClick={onDeleteSelected} disabled={isDeleting}>
          <md-icon slot="icon">delete</md-icon>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </md-filled-button>
      </div>
    </div>
  );
};