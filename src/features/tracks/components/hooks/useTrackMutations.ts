import toast from 'react-hot-toast';
import { useModalStore } from '../../../../stores/useModalStore';
import { useSelectionStore } from '../../../../stores/useSelectionStore';
import { useRefetchOptions } from './useRefetchOptions';
import { useTrackCRUD } from './useTrackCRUD';
import { useTrackFileOperations } from './useTrackFileOperations';
import { useTrackBulkOperations } from './useTrackBulkOperations';

export type MutationLoadingState = ReturnType<typeof useTrackMutations>['mutationState'];


export const useTrackMutations = () => {
  const closeModal = useModalStore((s) => s.closeModal);
  const clearSelection = useSelectionStore((s) => s.clearSelection);
  const refetchOptions = useRefetchOptions();

  const handleError = (error: Error, context: string) => {
    toast.error(`Failed to ${context}: ${error.message}`);
    console.error(`Error during ${context}:`, error);
  };

  const handleSuccessWithModalClose = (message: string) => {
    toast.success(message);
    closeModal();
  };

  const { createTrack, updateTrack, deleteTrack, isCreating, isUpdating, isDeleting, updateTrackMutation } = useTrackCRUD({
    refetchOptions,
    onSuccess: handleSuccessWithModalClose,
    onError: handleError,
  });

  const { uploadFile, deleteFile, isUploading, isDeletingFile } = useTrackFileOperations({
    refetchOptions,
    onSuccess: handleSuccessWithModalClose,
    onError: handleError,
    updateTrackMutation,
  });

  const { bulkDelete, isBulkDeleting } = useTrackBulkOperations({
    refetchOptions,
    onSuccess: clearSelection,
    onError: handleError,
  });


  const mutationState = {
    isCreating,
    isUpdating,
    isDeleting,
    isUploading,
    isDeletingFile,
    isBulkDeleting,
    isAnyLoading: isCreating || isUpdating || isDeleting || isUploading || isDeletingFile || isBulkDeleting,
  };

  return {
    createTrack,
    updateTrack,
    deleteTrack,
    bulkDelete,
    uploadFile,
    deleteFile,
    mutationState,
  };
};