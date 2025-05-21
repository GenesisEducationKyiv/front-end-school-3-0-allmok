import React from 'react';
import ConfirmDialog from './ConfirmDialog'; 
import { Track } from '../../types/track';

interface DeleteConfirmationDialogProps {
     isOpen: boolean;
     onClose: () => void;
     onConfirm: (id: string) => void;
     trackToDelete: Track | null;
     isLoading: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
    isOpen, onClose, onConfirm, trackToDelete, isLoading
}) => {
    const handleConfirm = () => {
        if (trackToDelete) {
            onConfirm(trackToDelete.id);
        }
    };

    if (!trackToDelete) return null;

    return (
        <ConfirmDialog
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirm} 
            title="Confirm deletion"
            message={
                <>
                Are you sure you want to delete the track: <br />
                <strong>{trackToDelete.title} - {trackToDelete.artist}</strong>?
                </>
            }
            isLoading={isLoading}
            confirmText="Yes, delete"
            cancelText="No, cancel"
        />
    );
};