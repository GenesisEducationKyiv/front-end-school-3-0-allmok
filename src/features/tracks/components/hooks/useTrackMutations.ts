import { useMutation } from '@apollo/client';
import { 
  CREATE_TRACK, 
  UPDATE_TRACK, 
  DELETE_TRACK,
  DELETE_TRACK_FILE,
  DELETE_MULTIPLE_TRACKS,
  // UPLOAD_TRACK_FILE 
} from '../../../../graphql/mutations';
import { GET_TRACKS } from '../../../../graphql/queries';
import toast from 'react-hot-toast';
import { useModalStore } from '../../../../stores/useModalStore';
import { useSelectionStore } from '../../../../stores/useSelectionStore';
import { NewTrackData, UpdateTrackData } from '../../../../types/track';
import {useApiParams} from '../hooks/useFilters'

export const useTrackMutations = () => {
  const closeModal = useModalStore(s => s.closeModal);
  const clearSelection = useSelectionStore(s => s.clearSelection);

  const handleError = (error: Error, context: string) => {
    toast.error(`Failed to ${context}: ${error.message}`);
    console.error(`Error during ${context}:`, error);
  };


  const [createTrackMutation, { loading: isCreating }] = useMutation(CREATE_TRACK, {
    refetchQueries: [{ query: GET_TRACKS, variables: { input: {} } }],
    onCompleted: () => {
      toast.success('Track created successfully!');
      closeModal();
    },
    onError: (error) => handleError(error, 'create track'),
  });

  const [updateTrackMutation, { loading: isUpdating }] = useMutation(UPDATE_TRACK, {

    refetchQueries: [
      { 
        query: GET_TRACKS, 
        variables: { input: useApiParams } 
      }
    ],
    onCompleted: () => {
      toast.success('Track updated!');
      closeModal();
    },
    onError: (error) => handleError(error, 'update track'),
  });

  const [deleteTrackMutation, { loading: isDeleting }] = useMutation(DELETE_TRACK, {
    refetchQueries: [{ query: GET_TRACKS, variables: { input: {} } }],
    onCompleted: () => {
      toast.success('Track deleted!');
      closeModal();
    },
    onError: (error) => handleError(error, 'delete track'),
  });
  
  const [deleteFileMutation, { loading: isDeletingFile }] = useMutation(DELETE_TRACK_FILE, {
    onCompleted: () => {
      toast.success('File deleted successfully!');
      closeModal();
    },
    onError: (error) => handleError(error, 'delete file'),
  });

  const [bulkDeleteMutation, { loading: isBulkDeleting }] = useMutation(DELETE_MULTIPLE_TRACKS, {
    refetchQueries: [{ query: GET_TRACKS, variables: { input: {} } }],
    onCompleted: (data) => {
      const { success, failed } = data.deleteTracks;
      toast.success(`${success.length} track(s) deleted successfully.`);
      if (failed.length > 0) {
        toast.error(`Failed to delete ${failed.length} track(s).`);
      }
      clearSelection();
    },
    onError: (error) => handleError(error, 'bulk delete'),
  });

  const uploadFile = async (id: string, file: File) => {
    console.warn('Upload file mutation is not implemented yet. Requires `apollo-upload-client`.');
    toast.error('File upload is not configured.');
    //uploadFileMutation({ variables: { id, file } })
  };
  const isUploading = false; 

  return {
    createTrack: (input: NewTrackData) => createTrackMutation({ variables: { input } }),
    updateTrack: (id: string, input: UpdateTrackData) => updateTrackMutation({ variables: { id, input } }),
    deleteTrack: (id: string) => deleteTrackMutation({ variables: { id } }),
    deleteFile: (id: string) => deleteFileMutation({ variables: { id } }),
    bulkDelete: (ids: string[]) => bulkDeleteMutation({ variables: { ids } }),
    uploadFile,
    mutationState: {
        isCreating,
        isUpdating,
        isDeleting,
        isUploading,
        isDeletingFile,
        isBulkDeleting,
        isAnyLoading: isCreating || isUpdating || isDeleting || isUploading || isDeletingFile || isBulkDeleting,
    }
  };
};


export type MutationLoadingState = ReturnType<typeof useTrackMutations>['mutationState'];