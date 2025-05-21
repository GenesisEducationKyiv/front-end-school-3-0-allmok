import React from 'react';
import Modal from '../../../../components/modal/Modal'; 
import TrackForm, { TrackFormData } from '../TrackForm'; 
import { Track, UpdateTrackData } from '../../../../types/track'; 

interface EditTrackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, data: UpdateTrackData) => Promise<any>; 
    trackToEdit: Track | null;
    availableGenres: string[];
    isLoading: boolean;
}

export const EditTrackModal: React.FC<EditTrackModalProps> = ({
    isOpen, onClose, onSubmit, trackToEdit, availableGenres, isLoading
}) => {
    const handleSubmit = (formData: TrackFormData) => {
        if (trackToEdit) {
            onSubmit(trackToEdit.id, formData as UpdateTrackData);
        }
    };

    if (!trackToEdit) return null; 

    return (
        <Modal isOpen={isOpen} onClose={onClose} data-testid="edit-track-modal">
            <h2 style={{ marginBottom: '1.5rem' }}>Edit track: {trackToEdit.title}</h2>
            <TrackForm
                onSubmit={handleSubmit}
                onCancel={onClose}
                availableGenres={availableGenres}
                isLoading={isLoading}
                initialData={trackToEdit} 
            />
        </Modal>
    );
};