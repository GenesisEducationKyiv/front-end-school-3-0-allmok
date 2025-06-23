import React from 'react';
import { CreateTrackModal } from './modals/CreateTrackModal';
import { EditTrackModal } from './modals/EditTrackModal';
import { TrackUploadModal } from './modals/UploadTrackModal';
import { DeleteConfirmationDialog } from '../../../components/ConfirmDialog/DeleteConfirmationDialog';
import { DeleteFileConfirmationDialog } from '../../../components/ConfirmDialog/DeleteFileConfirmationDialog';
import { Track, NewTrackData, UpdateTrackData } from '../../../types/track';
import { ModalType, ModalPayload } from '../../../stores/useModalStore';
import { MutationLoadingState } from '../../../features/tracks/components/hooks/useTrackMutations';

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
  if (!activeModal) return null;
  const trackForModal = findTrackById(trackIdForModal);

  return (
    <>
      <CreateTrackModal
        isOpen={activeModal === 'createTrack'}
        onClose={closeModal}
        onSubmit={onCreate}
        availableGenres={availableGenres}
        isLoading={mutationLoading.isCreating}
      />
      <EditTrackModal
        isOpen={activeModal === 'editTrack'}
        onClose={closeModal}
        trackToEdit={trackForModal}
        onSubmit={async () => {
          if (trackIdForModal && trackForModal) {
            await onUpdate(trackIdForModal, trackForModal);
          }
        }}
        availableGenres={availableGenres}
        isLoading={mutationLoading.isUpdating}
      />
<TrackUploadModal
      isOpen={activeModal === 'uploadTrackFile'}
      onClose={closeModal}
      trackToUpload={trackForModal} 
      onUpload={(id: string, file: File) => { 
        if (trackIdForModal) {
          onUploadFile(trackIdForModal, file); 
        }
      }}
      isLoading={mutationLoading.isUploading}
    />
      <DeleteConfirmationDialog
        isOpen={activeModal === 'deleteTrack'}
        onClose={closeModal}
        trackToDelete={trackForModal}
        onConfirm={() => {
          if (trackIdForModal) {
            onDelete(trackIdForModal);
          }
        }}
        isLoading={mutationLoading.isDeleting}
      />
      <DeleteFileConfirmationDialog
        isOpen={activeModal === 'deleteTrackFile'}
        onClose={closeModal}
        trackToDeleteFile={trackForModal}
        onConfirm={() => {
          if (trackIdForModal) {
            onDeleteFile(trackIdForModal);
          }
        }}
        isLoading={mutationLoading.isDeletingFile}
      />
    </>
  );
};