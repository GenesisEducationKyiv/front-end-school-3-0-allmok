import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  createTrack as apiCreateTrack,
  deleteTrack as apiDeleteTrack,
  updateTrack as apiUpdateTrack,
  uploadTrackFile as apiUploadTrackFile,
  deleteTrackFile as apiDeleteTrackFile,
  deleteMultipleTracks as apiDeleteMultipleTracks,
} from '../../../../api/trackService'; 
import { Track, UpdateTrackData, NewTrackData } from '../../../../types/track';
import { AppError } from '../../../../types/errors';

interface UseTrackOperationsProps {
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  fetchTracks: () => Promise<void>; 
  closeModal: () => void; 
  clearSelection?: () => void; 
  filters?: { page: number }; 
  onPageChange?: (page: number) => void; 
}

export interface MutationLoadingState {
  isSubmitting: boolean; 
  isDeleting: boolean;  
  isUploading: boolean; 
  isDeletingFile: boolean;
  isBulkDeleting: boolean; 
}

export const useTrackOperations = ({
  tracks,
  setTracks,
  fetchTracks,
  closeModal,
  clearSelection,
  filters,
  onPageChange,
}: UseTrackOperationsProps) => {
  const [mutationLoading, setMutationLoading] = useState<MutationLoadingState>({
    isSubmitting: false,
    isDeleting: false,
    isUploading: false,
    isDeletingFile: false,
    isBulkDeleting: false,
  });

  const handleApiError = (error: AppError, context: string) => {
    toast.error(`Failed to ${context}: ${error.message}`);
    console.error(`${context} error object:`, error);
    if (error.type === 'ApiError' && error.statusCode) {
      const responseBody = error.originalError;
      let serverMessage: string | undefined;
      if (typeof responseBody === 'object' && responseBody !== null) {
        const maybeBody = responseBody as Record<string, unknown>;
        serverMessage = typeof maybeBody.message === 'string'
          ? maybeBody.message
          : typeof maybeBody.error === 'string'
          ? maybeBody.error
          : undefined;
      } else if (typeof responseBody === 'string') {
        serverMessage = responseBody;
      }
      if (serverMessage) {
        toast.error(`${context} failed: ${serverMessage}`);
      }
    } else if (error.type === 'ValidationError') {
      console.error("Validation Error details:", error.originalError);
    }
  };

  const handleCreate = async (data: NewTrackData): Promise<void> => {
    setMutationLoading(prev => ({ ...prev, isSubmitting: true }));
    const result = await apiCreateTrack(data);

    if (result.isOk()) {
      toast.success('Track created successfully!');
      closeModal();
      if (filters && filters.page !== 1 && onPageChange) {
        onPageChange(1);
      } else {
        await fetchTracks();
      }
      clearSelection?.();
    } else {
      handleApiError(result.error, 'create track');
    }
    setMutationLoading(prev => ({ ...prev, isSubmitting: false }));
  };

  const handleUpdateOptimistic = async (id: string, formData: UpdateTrackData): Promise<void> => {
    const originalTracks = [...tracks];
    const trackIndex = originalTracks.findIndex(t => t.id === id);
    if (trackIndex === -1) {
      toast.error("Track not found for update.");
      return;
    }
    const originalTrack = originalTracks[trackIndex];

    const optimisticTrackData: Track = {
      ...originalTrack,
      ...formData,
      title: formData.title ?? originalTrack.title,
      artist: formData.artist ?? originalTrack.artist,
      genres: formData.genres ?? originalTrack.genres,
    };

    const optimisticTracks = [...originalTracks];
    optimisticTracks[trackIndex] = optimisticTrackData;

    setTracks(optimisticTracks);
    closeModal();
    setMutationLoading(prev => ({ ...prev, isSubmitting: true }));

    const result = await apiUpdateTrack(id, formData);

    if (result.isOk()) {
      const updatedTrackFromServer = result.value;
      setTracks(prevTracks =>
        prevTracks.map(t => (t.id === updatedTrackFromServer.id ? updatedTrackFromServer : t))
      );
      toast.success('Track updated successfully!');
    } else {
      handleApiError(result.error, 'update track');
      setTracks(originalTracks); 
    }
    setMutationLoading(prev => ({ ...prev, isSubmitting: false }));
  };

  const handleDeleteOptimistic = async (trackIdToDelete: string): Promise<void> => {
    const originalTracks = [...tracks];
    const trackToDelete = originalTracks.find(t => t.id === trackIdToDelete);

    setTracks(prev => prev.filter(t => t.id !== trackIdToDelete));
    closeModal();
    clearSelection?.();
    setMutationLoading(prev => ({ ...prev, isDeleting: true }));

    const result = await apiDeleteTrack(trackIdToDelete);

    if (result.isOk()) {
      toast.success(`Track "${trackToDelete?.title ?? trackIdToDelete}" deleted.`);
      await fetchTracks();
    } else {
      handleApiError(result.error, 'delete track');
      setTracks(originalTracks); 
    }
    setMutationLoading(prev => ({ ...prev, isDeleting: false }));
  };

  const handleTrackGenreRemove = async (trackId: string, genreToRemove: string): Promise<void> => {
    const originalTracks = [...tracks];
    const trackIndex = originalTracks.findIndex(t => t.id === trackId);
    if (trackIndex === -1) return;

    const originalTrack = originalTracks[trackIndex];
    if (!originalTrack.genres.includes(genreToRemove)) return;

    const newGenres = originalTrack.genres.filter(g => g !== genreToRemove);
    const optimisticTracks = [...originalTracks];
    optimisticTracks[trackIndex] = { ...originalTrack, genres: newGenres };

    setTracks(optimisticTracks);
    setMutationLoading(prev => ({ ...prev, isSubmitting: true })); 

    const result = await apiUpdateTrack(trackId, { genres: newGenres });

    if (result.isOk()) {
      toast.success(`Genre "${genreToRemove}" removed from "${originalTrack.title}"`);
    } else {
      handleApiError(result.error, 'remove genre');
      setTracks(originalTracks);
    }
    setMutationLoading(prev => ({ ...prev, isSubmitting: false }));
  };


  const handleDeleteFileOptimistic = async (trackIdToDeleteFile: string): Promise<void> => {
    const originalTracks = [...tracks];
    const trackIndex = originalTracks.findIndex(t => t.id === trackIdToDeleteFile);
    if (trackIndex === -1) {
      toast.error("Track not found to delete file.");
      return;
    }
    const originalTrack = originalTracks[trackIndex];
    if (!originalTrack.audioFile) {
      toast("Track doesn't have an audio file to delete.");
      closeModal();
      return;
    }

    const optimisticTrackData: Track = { ...originalTrack, audioFile: undefined }; 
    const optimisticTracks = [...originalTracks];
    optimisticTracks[trackIndex] = optimisticTrackData;

    setTracks(optimisticTracks);
    closeModal();
    setMutationLoading(prev => ({ ...prev, isDeletingFile: true }));

    const result = await apiDeleteTrackFile(trackIdToDeleteFile);

    if (result.isOk()) {
      const updatedTrackFromServer = result.value;
      setTracks(prevTracks =>
        prevTracks.map(t => (t.id === updatedTrackFromServer.id ? updatedTrackFromServer : t))
      );
      toast.success(`Audio file for "${originalTrack.title}" deleted successfully.`);
    } else {
      handleApiError(result.error, 'delete audio file');
      setTracks(originalTracks);
    }
    setMutationLoading(prev => ({ ...prev, isDeletingFile: false }));
  };

  const handleUpload = async (id: string, file: File): Promise<void> => {
    setMutationLoading(prev => ({ ...prev, isUploading: true }));
    const result = await apiUploadTrackFile(id, file);

    if (result.isOk()) {
      const updatedTrack = result.value;
      setTracks(prev => prev.map(t => (t.id === updatedTrack.id ? updatedTrack : t)));
      toast.success(`Audio file uploaded for "${updatedTrack.title}"!`);
      closeModal();
    } else {
      handleApiError(result.error, 'upload file');
    }
    setMutationLoading(prev => ({ ...prev, isUploading: false }));
  };

  const handleBulkDeleteOptimistic = async (idsToDelete: string[]): Promise<void> => {
    if (idsToDelete.length === 0) return;

    const originalTracks = [...tracks];
    setTracks(prev => prev.filter(t => !idsToDelete.includes(t.id)));
    clearSelection?.();
    setMutationLoading(prev => ({ ...prev, isBulkDeleting: true }));

    const result = await apiDeleteMultipleTracks(idsToDelete);

    if (result.isOk()) {
      const responseData = result.value;
      const successCount = responseData.success?.length ?? 0;
      const failedCount = responseData.failed?.length ?? 0;

      if (successCount > 0) toast.success(`${successCount} track(s) deleted successfully.`);
      if (failedCount > 0) {
        toast.error(`Failed to delete ${failedCount} track(s). IDs: ${responseData.failed?.join(', ')}`);
         await fetchTracks(); 
      } else if (successCount > 0) {
         await fetchTracks(); 
      }
    } else {
      handleApiError(result.error, 'bulk delete');
      setTracks(originalTracks); 
    }
    setMutationLoading(prev => ({ ...prev, isBulkDeleting: false }));
  };

  const isAnyMutationLoading = Object.values(mutationLoading).some(Boolean);

  return {
    mutationLoading,
    isAnyMutationLoading,
    handleCreate,
    handleUpdateOptimistic,
    handleDeleteOptimistic,
    handleTrackGenreRemove,
    handleDeleteFileOptimistic,
    handleUpload,
    handleBulkDeleteOptimistic,
  };
};