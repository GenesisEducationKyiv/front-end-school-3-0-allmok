import React from 'react';

interface CreateTrackButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const CreateTrackButton: React.FC<CreateTrackButtonProps> = ({ onClick, disabled }) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <md-fab
      variant="primary"
      size="medium"
      label="Add Track"
      disabled={disabled}
      onClick={handleClick}
      data-testid="create-track-button"
      title="Create new track"
    >
      <md-icon slot="icon">add</md-icon>
    </md-fab>
  );
};