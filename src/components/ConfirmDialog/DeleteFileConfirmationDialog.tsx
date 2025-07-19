import React from 'react';
import ConfirmDialog from './ConfirmDialog';
import { Track } from '../../types/track';

interface DeleteFileConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  trackToDeleteFile: Track | null;
  isLoading?: boolean;
}

export const DeleteFileConfirmationDialog: React.FC<DeleteFileConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  trackToDeleteFile,
  isLoading = false,
}) => {
  if (!trackToDeleteFile) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Track File"
      message={
        <span>
          Are you sure you want to delete the audio file for{' '}
          <strong>“{trackToDeleteFile.title}”</strong>?
          The track metadata will be kept.
        </span>
      }
      confirmText="Delete File"
      cancelText="Cancel"
      isLoading={isLoading}
      data-testid="delete-file-dialog"
    />
  );
};