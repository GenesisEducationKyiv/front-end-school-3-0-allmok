import React from 'react';
import '../css/CreateTrackButton.css'

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
      <md-icon slot="icon">add</md-icon>
      </md-fab>
    </div>
      );
};