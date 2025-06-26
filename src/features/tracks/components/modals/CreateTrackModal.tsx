import React from 'react';
import Modal from '../../../../components/modal/Modal';
import TrackForm, { TrackFormData } from '../TrackForm';

interface CreateTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TrackFormData) => void; 
  availableGenres: string[];
  isLoading: boolean;
}

export const CreateTrackModal: React.FC<CreateTrackModalProps> = ({
  isOpen, onClose, onSubmit, availableGenres, isLoading
}) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose} data-testid="create-track-modal">
      <h2 style={{ marginBottom: '1.5rem' }}>Create a new track</h2>
      <TrackForm
        onSubmit={onSubmit}
        onCancel={onClose}
        availableGenres={availableGenres}
        isLoading={isLoading}
      />
    </Modal>
  );
};