import React, { useRef, useEffect } from 'react';
import { NewTrackData } from '../../../../types/track';
import TrackForm from '../TrackForm';
import '../../../../css/TrackForm.css';

interface CreateTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewTrackData) => void;
  availableGenres: string[];
  isLoading: boolean;
}

export const CreateTrackModal: React.FC<CreateTrackModalProps> = ({
  isOpen, onClose, onSubmit, availableGenres, isLoading,
}) => {
  const dialogRef = useRef<HTMLElement & { show: () => void; close: () => void }>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        dialog.show();
      } else {
        dialog.close();
      }
    }
  }, [isOpen]);

  return (
    <md-dialog
      ref={dialogRef}
      onClosed={onClose}
      data-testid="create-track-modal"
    >
      <div slot="headline">Create a new track</div>
      
     <div slot="content" className="dialog-content-with-margin">
        <TrackForm
          formId="create-track-form"
          onSubmit={onSubmit}
          onCancel={onClose}
          availableGenres={availableGenres}
          isLoading={isLoading}
        />
      </div>
    </md-dialog>
  );
};