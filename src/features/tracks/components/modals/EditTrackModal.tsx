import React, { useRef, useEffect, useState } from 'react'; 
import { Track, NewTrackData } from '../../../../types/track';
import TrackForm from '../TrackForm';

interface EditTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewTrackData) => void;
  trackToEdit: Track | null;
  availableGenres: string[];
  isLoading: boolean;
}

export const EditTrackModal: React.FC<EditTrackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  trackToEdit,
  availableGenres,
  isLoading,
}) => {
  const dialogRef = useRef<HTMLElement & { show: () => void; close: () => void }>(null);

  const [latchedTrack, setLatchedTrack] = useState<Track | null>(trackToEdit);

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

  useEffect(() => {
    if (trackToEdit) {
      setLatchedTrack(trackToEdit);
    }
  }, [trackToEdit]);

  if (!latchedTrack) {
    return null;
  }

  return (
    <md-dialog
      ref={dialogRef}
      onClosed={onClose}
      data-testid="edit-track-modal"
      
    >
      <div slot="headline">Edit track: {latchedTrack.title}</div>
      <div slot="content">
        <TrackForm
          formId="edit-track-form"
          onSubmit={onSubmit}
          onCancel={onClose}
          availableGenres={availableGenres}
          isLoading={isLoading}
          initialData={latchedTrack} 
        />
      </div>
    </md-dialog>
  );
};