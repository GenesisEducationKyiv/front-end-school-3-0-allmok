import React from 'react';

interface CreateTrackButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const CreateTrackButton: React.FC<CreateTrackButtonProps> = ({ onClick, disabled }) => {
  return (
    <div className="fab-container">
      <md-fab
        variant="primary"
        label="Add Track"
        aria-label="Add Track" 
        onClick={onClick}
        disabled={disabled}
        data-testid="create-track-button"
      >

        <span slot="icon" className="material-symbols-outlined">add</span>
      </md-fab>
    </div>
  );
};