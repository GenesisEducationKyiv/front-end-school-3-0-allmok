import React from 'react';
import ConfirmDialog from './ConfirmDialog';
import { Track } from '../../types/track';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  trackToDelete: Track | null;
  isLoading?: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  trackToDelete,
  isLoading = false,
}) => {
  if (!trackToDelete) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Track"
      message={
        <span>
          Are you sure you want to delete the track{' '}
          <strong>“{trackToDelete.title}” by {trackToDelete.artist}</strong>?
          This action cannot be undone.
        </span>
      }
      confirmText="Delete"
      cancelText="Cancel"
      isLoading={isLoading}
      data-testid="delete-track-dialog"
    />
  );
};