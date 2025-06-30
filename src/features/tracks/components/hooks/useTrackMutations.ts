import { useState } from 'react';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';

import {
  CREATE_TRACK,
  UPDATE_TRACK,
  DELETE_TRACK,
  DELETE_MULTIPLE_TRACKS,
  DELETE_TRACK_FILE,
} from '../../../../graphql/mutations';
import { GET_TRACKS } from '../../../../graphql/queries';
import { useModalStore } from '../../../../stores/useModalStore';
import { useSelectionStore } from '../../../../stores/useSelectionStore';
import { NewTrackData, UpdateTrackData } from '../../../../types/track';
import { useApiParams } from './useFilters';
import { FileUploadService } from '../../../../stores/fileUploadStore';

export type MutationLoadingState = ReturnType<typeof useTrackMutations>['mutationState'];

export const useTrackMutations = () => {
  const closeModal = useModalStore(s => s.closeModal);
  const clearSelection = useSelectionStore(s => s.clearSelection);
  const apiParams = useApiParams();
  const fileUploadService = FileUploadService.getInstance();

  const handleError = (error: Error, context: string) => {
    const errorMessage = `Failed to ${context}: ${error.message}`;
    toast.error(errorMessage);
    console.error(`Error during ${context}:`, error);
  };

  const refetchQueriesOptions = {
    refetchQueries: [{ query: GET_TRACKS, variables: { input: apiParams } }],
    awaitRefetchQueries: true, 
  };

  const [createTrackMutation, { loading: isCreating }] = useMutation(CREATE_TRACK, {
    ...refetchQueriesOptions,
    onCompleted: () => {
      toast.success('Track created successfully!');
      closeModal();
    },
    onError: (error) => handleError(error, 'create track'),
  });

  const [updateTrackMutation, { loading: isUpdating }] = useMutation(UPDATE_TRACK, {
    ...refetchQueriesOptions,
    onCompleted: () => {
      toast.success('Track updated successfully!');
      closeModal();
    },
    onError: (error) => handleError(error, 'update track'),
  });

  const [deleteTrackMutation, { loading: isDeleting }] = useMutation(DELETE_TRACK, {
    ...refetchQueriesOptions,
    onCompleted: () => {
      toast.success('Track deleted!');
      closeModal();
    },
    onError: (error) => handleError(error, 'delete track'),
  });

  const [deleteFileMutation, { loading: isDeletingFile }] = useMutation(DELETE_TRACK_FILE, {
    ...refetchQueriesOptions,
    onCompleted: () => {
      toast.success('Audio file deleted successfully!');
      closeModal();
    },
    onError: (error) => handleError(error, 'delete audio file'),
  });

  const [bulkDeleteMutation, { loading: isBulkDeleting }] = useMutation(DELETE_MULTIPLE_TRACKS, {
    ...refetchQueriesOptions,
    onCompleted: (data) => {
      const { success, failed } = data.deleteTracks;
      toast.success(`${success.length} track(s) deleted successfully.`);
      if (failed.length > 0) {
        toast.error(`Failed to delete ${failed.length} track(s).`);
      }
      clearSelection();
    },
    onError: (error) => handleError(error, 'bulk delete tracks'),
  });

  const [isFileUploading, setIsFileUploading] = useState(false);

  /**
   * @param id
   * @param file
   */
  const uploadFile = async (id: string, file: File) => {
    if (!id) {
      handleError(new Error("Track ID is missing"), 'upload file');
      return;
    }

    setIsFileUploading(true);
    
    try {
      const result = await fileUploadService.uploadFile(file);
      
      await updateTrackMutation({
        variables: { id, input: { audioFile: result.filename } },
      });
    } catch (error) {
      handleError(error as Error, 'upload file');
    } finally {
      setIsFileUploading(false);
    }
  };

  return {
    createTrack: (input: NewTrackData) => createTrackMutation({ variables: { input } }),
    updateTrack: (id: string, input: UpdateTrackData) => updateTrackMutation({ variables: { id, input } }),
    deleteTrack: (id: string) => deleteTrackMutation({ variables: { id } }),
    bulkDelete: (ids: string[]) => bulkDeleteMutation({ variables: { ids } }),
    uploadFile, 
    deleteFile: (id: string) => deleteFileMutation({ variables: { id } }),

    mutationState: {
      isCreating,
      isUpdating,
      isDeleting,
      isUploading: isFileUploading, 
      isDeletingFile,
      isBulkDeleting,
      isAnyLoading:
        isCreating ||
        isUpdating ||
        isDeleting ||
        isFileUploading ||
        isDeletingFile ||
        isBulkDeleting,
    },
  };
};