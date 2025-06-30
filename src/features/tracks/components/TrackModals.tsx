import React from 'react';
import { CreateTrackModal } from './modals/CreateTrackModal';
import { EditTrackModal } from './modals/EditTrackModal';
import TrackUploadModal from '../components/TrackUploadModal';
import { DeleteConfirmationDialog } from '../../../components/ConfirmDialog/DeleteConfirmationDialog';
import { DeleteFileConfirmationDialog } from '../../../components/ConfirmDialog/DeleteFileConfirmationDialog';
import { Track, NewTrackData, UpdateTrackData } from '../../../types/track';
import { ModalType, ModalPayload } from '../../../stores/useModalStore';
import { MutationLoadingState } from './hooks/useTrackMutations';

interface TrackModalsProps {
  activeModal: ModalType;
  modalPayload: ModalPayload | null;
  closeModal: () => void;
  findTrackById: (id: string | null | undefined) => Track | null;
  availableGenres: string[];
  mutationLoading: MutationLoadingState;
  onCreate: (data: NewTrackData) => void;
  onUpdate: (id: string, data: UpdateTrackData) => void;
  onDelete: (trackId: string) => void;
  onUploadFile: (id: string, file: File) => void;
  onDeleteFile: (trackId: string) => void;
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
  const trackForModal = findTrackById(trackIdForModal);

  if (!activeModal) return null;

  return (
    <>
      <CreateTrackModal
        isOpen={activeModal === 'createTrack'}
        onClose={closeModal}
        onSubmit={onCreate}
        availableGenres={availableGenres}
        isLoading={mutationLoading.isCreating}
      />

      {trackForModal && (
        <>
          <EditTrackModal
            isOpen={activeModal === 'editTrack'}
            onClose={closeModal}
            trackToEdit={trackForModal}
            onSubmit={(formData: UpdateTrackData) => {
              onUpdate(trackForModal.id, formData);
            }}
            availableGenres={availableGenres}
            isLoading={mutationLoading.isUpdating}
          />

          <TrackUploadModal
            isOpen={activeModal === 'uploadTrackFile'}
            onClose={closeModal}
            trackToUpload={trackForModal}
            isLoading={mutationLoading.isUploading}
            onUpload={(file: File) => {
              onUploadFile(trackForModal.id, file);
            }}
          />

          <DeleteConfirmationDialog
            isOpen={activeModal === 'deleteTrack'}
            onClose={closeModal}
            trackToDelete={trackForModal}
            onConfirm={() => onDelete(trackForModal.id)}
            isLoading={mutationLoading.isDeleting}
          />

          <DeleteFileConfirmationDialog
            isOpen={activeModal === 'deleteTrackFile'}
            onClose={closeModal}
            trackToDeleteFile={trackForModal}
            onConfirm={() => onDeleteFile(trackForModal.id)}
            isLoading={mutationLoading.isDeletingFile}
          />
        </>
      )}
    </>
  );
};