import React, { useCallback } from 'react';

interface TrackFormActionsProps {
  onCancel: (() => void) | undefined;
  isLoading?: boolean;
  isEditing: boolean;
  formId: string;
}

export const TrackFormActions: React.FC<TrackFormActionsProps> = ({
  onCancel,
  isLoading,
  isEditing,
  formId,
}) => {
  const isDisabled = isLoading ?? false;

  const handleFormSubmit = useCallback(() => {
    const formElement = document.getElementById(formId) as HTMLFormElement | null;
    if (formElement) {
      formElement.requestSubmit();
    }
  }, [formId]); 

  return (
    <div className="form-actions">
      {onCancel && (
        <md-text-button
          type="button"
          onClick={onCancel}
          disabled={isDisabled}
          data-testid="track-form-cancel-button"
        >
          Cancel
        </md-text-button>
      )}
      <md-filled-button
        type="button"
        onClick={handleFormSubmit}
        disabled={isDisabled}
        data-testid="track-form-submit-button" 
      >
        {isEditing
          ? (isDisabled ? 'Saving...' : 'Save')
          : (isDisabled ? 'Creating...' : 'Create')}
        {isDisabled && <md-circular-progress indeterminate slot="icon"></md-circular-progress>}
      </md-filled-button>
    </div>
  );
};