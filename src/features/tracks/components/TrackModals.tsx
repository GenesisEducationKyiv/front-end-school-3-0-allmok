import React from 'react';
import { CreateTrackModal } from './modals/CreateTrackModal';
import { EditTrackModal } from './modals/EditTrackModal';
import { TrackUploadModal } from './modals/UploadTrackModal';
import { DeleteConfirmationDialog } from '../../../components/ConfirmDialog/DeleteConfirmationDialog';
import { DeleteFileConfirmationDialog } from '../../../components/ConfirmDialog/DeleteFileConfirmationDialog';

import { Track, NewTrackData, UpdateTrackData } from '../../../types/track';
import { ModalType, ModalPayload } from '../../../features/tracks/components/hooks/useModalState';
import { MutationLoadingState } from '../../../features/tracks/components/hooks/useTrackOperations'; 

interface TrackModalsProps {
  activeModal: ModalType;
  modalPayload: ModalPayload | null;
  closeModal: () => void;
  findTrackById: (id: string | null | undefined) => Track | null;
  availableGenres: string[];
  mutationLoading: MutationLoadingState; 
  onCreate: (data: NewTrackData) => Promise<void>;
  onUpdate: (id: string, data: UpdateTrackData) => Promise<void>;
  onDelete: (trackId: string) => Promise<void>;
  onUploadFile: (id: string, file: File) => Promise<void>;
  onDeleteFile: (trackId: string) => Promise<void>;
}

export const TrackModals: React.FC<TrackModalsProps> = ({
  activeModal,
  modalPayload,
  closeModal,
  findTrackById,
  availableGenres,
  mutationLoading,
  onCreate,
  onUpdate,
  onDelete,
  onUploadFile,
  onDeleteFile,
}) => {
  const trackIdForModal = modalPayload?.trackId;

  if (!activeModal) return null;

  return (
    <>
      <CreateTrackModal
        isOpen={activeModal === 'createTrack'}
        onClose={closeModal}
        onSubmit={onCreate}
        availableGenres={availableGenres}
        isLoading={mutationLoading.isSubmitting}
      />
      <EditTrackModal
        isOpen={activeModal === 'editTrack'}
        onClose={closeModal}
        trackToEdit={findTrackById(trackIdForModal)}
        onSubmit={(id, data) => onUpdate(id, data)} 
        availableGenres={availableGenres}
        isLoading={mutationLoading.isSubmitting}
      />
      <TrackUploadModal
        isOpen={activeModal === 'uploadTrackFile'}
        onClose={closeModal}
        trackToUpload={findTrackById(trackIdForModal)}
        onUpload={(id, file) => onUploadFile(id, file)}
        isLoading={mutationLoading.isUploading}
      />
      <DeleteConfirmationDialog
        isOpen={activeModal === 'deleteTrack'}
        onClose={closeModal}
        trackToDelete={findTrackById(trackIdForModal)}
        onConfirm={(id) => onDelete(id)}
        isLoading={mutationLoading.isDeleting}
      />
      <DeleteFileConfirmationDialog
        isOpen={activeModal === 'deleteTrackFile'}
        onClose={closeModal}
        trackToDeleteFile={findTrackById(trackIdForModal)}
        onConfirm={(id) => onDeleteFile(id)}
        isLoading={mutationLoading.isDeletingFile}
      />
    </>
  );
};