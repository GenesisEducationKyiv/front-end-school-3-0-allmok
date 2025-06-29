import React from 'react';

interface CreateTrackButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const CreateTrackButton: React.FC<CreateTrackButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      className="fab-create-track"
      onClick={onClick}
      disabled={disabled}
      data-testid="create-track-button"
      title="Create new track"
    >
      <span className="fab-icon" aria-hidden="true">+</span>
      <span className="fab-text">Add Track</span>
    </button>
  );
};