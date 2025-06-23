import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createTrack,
  updateTrack,
  deleteTrack,
  uploadTrackFile,
  deleteTrackFile,
  deleteMultipleTracks,
} from '../../../../api/trackService';
import { trackKeys } from './useTracksQuery';
import { useModalStore } from '../../../../stores/useModalStore';
import { useSelectionStore } from '../../../../stores/useSelectionStore';
import { Track, GetTracksResponse, UpdateTrackData, NewTrackData, BulkDeleteResponse } from '../../../../types/track';

type TrackMutationContext = {
  previousTracksData?: GetTracksResponse;
  currentQueryKey?: QueryKey;
};

export const useTrackMutations = () => {
  const queryClient = useQueryClient();
  const closeModal = useModalStore((s) => s.closeModal);
  const clearSelection = useSelectionStore((s) => s.clearSelection);

  const invalidateTracksList = () => {
    queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
  };

  const handleError = (error: unknown, context: string) => {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    toast.error(`Failed to ${context}: ${message}`);
    console.error(`Error during ${context}:`, error);
  };

  const { mutate: createTrackMutation, isPending: isCreating } = useMutation<Track, Error, NewTrackData>({
    mutationFn: createTrack,
    onSuccess: () => {
      toast.success('Track created successfully!');
      invalidateTracksList();
      closeModal();
    },
    onError: (error) => handleError(error, 'create track'),
  });

  const { mutate: updateTrackMutation, isPending: isUpdating } = useMutation<
  Track, 
  Error, 
  { id: string; trackData: UpdateTrackData }, 
  TrackMutationContext | undefined 
>({
  mutationFn: updateTrack,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: trackKeys.lists() });
    
    const queries = queryClient.getQueriesData<GetTracksResponse>({ queryKey: trackKeys.lists() });
    const [currentQueryKey, previousTracksData] = queries[0] ?? []; 

    if (!currentQueryKey || !previousTracksData) {
      return undefined; 
    }
    
    const newTracks = previousTracksData.tracks.map(track => 
        track.id === newData.id ? { ...track, ...newData.trackData } : track
    );
    queryClient.setQueryData(currentQueryKey, { ...previousTracksData, tracks: newTracks });
    
    closeModal();
    return { previousTracksData, currentQueryKey };
  },
  onError: (err, _vars, context) => {
    handleError(err, 'update track');
    if (context?.previousTracksData && context.currentQueryKey) {
      queryClient.setQueryData(context.currentQueryKey, context.previousTracksData);
    }
  },
  onSettled: (_data, _error, _vars, context) => {
    if (context?.currentQueryKey) {
      queryClient.invalidateQueries({ queryKey: context.currentQueryKey });
    } else {
      invalidateTracksList();
    }
  },
  onSuccess: () => {
    toast.success('Track updated successfully!');
  }
});

const { mutate: deleteTrackMutation } = useMutation<void, Error, string>({
  mutationFn: deleteTrack,
  onSuccess: () => {
    toast.success('Track deleted!');
    invalidateTracksList();
    closeModal();
  },
  onError: (error) => handleError(error, 'delete track'),
});
  
  const { mutate: uploadFileMutation, isPending: isUploading } = useMutation<Track, Error, { id: string; file: File }>({
    mutationFn: uploadTrackFile,
    onSuccess: (updatedTrack) => {
      toast.success('File uploaded successfully!');
      queryClient.setQueriesData<GetTracksResponse>({ queryKey: trackKeys.lists() }, (oldData) => {
          if (!oldData) return;
          return {
              ...oldData,
              tracks: oldData.tracks.map(t => t.id === updatedTrack.id ? updatedTrack : t),
          };
      });
      closeModal();
    },
    onError: (error) => handleError(error, 'upload file'),
  });

 
  const { mutate: deleteFileMutation, isPending: isDeletingFile } = useMutation<Track, Error, string>({
    mutationFn: deleteTrackFile, 
    onSuccess: (updatedTrack) => {
      toast.success('File deleted successfully!');
      queryClient.setQueriesData<GetTracksResponse>({ queryKey: trackKeys.lists() }, (oldData) => {
          if (!oldData) return;
          return {
              ...oldData,
              tracks: oldData.tracks.map(t => t.id === updatedTrack.id ? updatedTrack : t),
          };
      });
      closeModal();
    },
    onError: (error) => handleError(error, 'delete file'),
  });


  const { mutate: bulkDeleteMutation, isPending: isBulkDeleting } = useMutation<BulkDeleteResponse, Error, string[]>({
    mutationFn: deleteMultipleTracks,
    onSuccess: (data) => {
      toast.success(`${data.success.length} track(s) deleted.`);
      if(data.failed.length > 0) {
        toast.error(`Failed to delete ${data.failed.length} track(s).`);
      }
      invalidateTracksList();
      clearSelection();
    },
    onError: (error) => handleError(error, 'bulk delete'),
  });

  const isDeleting = false;

  return {
    createTrack: createTrackMutation,
    updateTrack: updateTrackMutation,
    deleteTrack: deleteTrackMutation, 
    uploadFile: uploadFileMutation,
    deleteFile: deleteFileMutation,
    bulkDelete: bulkDeleteMutation,
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