import React from 'react';
import ConfirmDialog from './ConfirmDialog'; 
import { Track } from '../../types/track';

interface DeleteFileConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (trackId: string) => Promise<void> | void;
  trackToDeleteFile: Track | null; 
  isLoading: boolean;
}

export const DeleteFileConfirmationDialog: React.FC<DeleteFileConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  trackToDeleteFile,
  isLoading
}) => {


  const handleConfirm = () => {
    if (trackToDeleteFile) {
      onConfirm(trackToDeleteFile.id);
    } else {
    
      console.error("Attempted to confirm file deletion without a track.");
      onClose(); 
    }
  };

  if (!isOpen || !trackToDeleteFile) {
    return null;
  }

 
  if (!trackToDeleteFile.audioFile) {
       console.warn(`Attempted to open delete file dialog for track "${trackToDeleteFile.title}" which has no audio file.`);
       return null; 
  }


  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm} 
      title="Confirm File Deletion"
      message={
        <>
          Are you sure you want to delete the audio file for the track: <br />
          <strong>{trackToDeleteFile.title} - {trackToDeleteFile.artist}</strong>?
          <br />
          <span style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
            (Track metadata will remain.)
          </span>
        </>
      }
      isLoading={isLoading}
      confirmText="Yes, delete file"
      cancelText="No, cancel"
      data-testid="delete-file-confirm-dialog"
    />
  );
};
