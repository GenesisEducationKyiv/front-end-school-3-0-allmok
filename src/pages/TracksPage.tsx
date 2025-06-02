import React, { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

import { useTrackFilters } from '../features/tracks/components/hooks/useTrackFilters';
import { useTracks } from '../features/tracks/components/hooks/useTracks';
import { useBulkActions } from '../features/tracks/components/hooks/useBulkActions';

import {
  createTrack,
  deleteTrack,
  updateTrack,
  uploadTrackFile,
  deleteTrackFile,
  deleteMultipleTracks,
} from '../api/trackService';

import Pagination from '../components/Pagination/Pagination';
import { TrackFilters } from '../features/tracks/components/TrackFilters';
import { TrackList } from '../features/tracks/components/TrackList';
import { CreateTrackModal } from '../features/tracks/components/modals/CreateTrackModal';
import { EditTrackModal } from '../features/tracks/components/modals/EditTrackModal';
import { TrackUploadModal } from '../features/tracks/components/modals/UploadTrackModal'; 
import { DeleteConfirmationDialog } from '../components/ConfirmDialog/DeleteConfirmationDialog';
import { DeleteFileConfirmationDialog } from '../components/ConfirmDialog/DeleteFileConfirmationDialog';

import { Track, UpdateTrackData } from '../types/track';
import { TrackFormData } from '../features/tracks/components/TrackForm'; 

import '../css/TracksPage.css';

const TracksPage: React.FC = () => {
  const [modalState, setModalState] = useState<{
    createOpen: boolean;
    editingTrackId: string | null;
    deletingTrackId: string | null;
    uploadingTrackId: string | null;
    deletingFileTrackId: string | null;
  }>({
    createOpen: false,
    editingTrackId: null,
    deletingTrackId: null,
    uploadingTrackId: null,
    deletingFileTrackId: null,
  });

  const [mutationLoading, setMutationLoading] = useState({
    isSubmitting: false,
    isDeleting: false,
    isUploading: false,
    isDeletingFile: false,
    isBulkDeleting: false,
  });

  const { filters, filterProps } = useTrackFilters();
  const {
    tracks,
    setTracks,
    meta,
    isLoading: isLoadingTracks,
    error: tracksError,
    fetchTracks,
    availableGenres,
  } = useTracks(filters);

  const uniqueArtists = useMemo(() => {
    return [...new Set(tracks.map(t => t.artist))].sort();
  }, [tracks]);

  const { selectedTrackIds, selectionProps, clearSelection } = useBulkActions(
    tracks.map(t => t.id)
  );

  const findTrackById = useCallback(
    (id: string | null): Track | null => {
      return id ? tracks.find(t => t.id === id) ?? null : null;
    },
    [tracks]
  );

  const openModal = {
    create: () => setModalState(prev => ({ ...prev, createOpen: true })),
    edit: (id: string) => setModalState(prev => ({ ...prev, editingTrackId: id })),
    delete: (id: string) => setModalState(prev => ({ ...prev, deletingTrackId: id })),
    upload: (id: string) => setModalState(prev => ({ ...prev, uploadingTrackId: id })),
    deleteFile: (id: string) => setModalState(prev => ({ ...prev, deletingFileTrackId: id })),
  };

  const closeAllModals = useCallback(() => {
    setModalState({
      createOpen: false,
      editingTrackId: null,
      deletingTrackId: null,
      uploadingTrackId: null,
      deletingFileTrackId: null,
    });
  }, []);

  const handleCreate = async (data: TrackFormData): Promise<void> => {
    setMutationLoading(prev => ({ ...prev, isSubmitting: true }));
    const result = await createTrack(data);

    if (result.isOk()) {
      toast.success('Track created successfully!');
      closeAllModals();
      if (filters.page !== 1) {
        filterProps.handlePageChange(1);
      } else {
        void fetchTracks();
      }
      clearSelection();
    } else {
      const apiError = result.error;
      toast.error(`Failed to create track: ${apiError.message}`);
      console.error("Create track error object:", apiError);
      if (apiError.type === 'ApiError' && apiError.statusCode) {
        const responseBody = apiError.originalError as any; 
        if (responseBody) {
          console.error("Server response BODY for ApiError:", responseBody);
          let serverMessage: string | undefined;
          if (typeof responseBody.message === 'string') {
            serverMessage = responseBody.message;
          } else if (typeof responseBody.error === 'string') { 
            serverMessage = responseBody.error;
          } else if (typeof responseBody === 'string') { 
            serverMessage = responseBody;
          }

          if (serverMessage) {
            toast.error(`Creation failed: ${serverMessage}`);
          }
        }
      } else if (apiError.type === 'ValidationError') {
        console.error("Validation Error details:", apiError.originalError); 
      }
    }
    setMutationLoading(prev => ({ ...prev, isSubmitting: false }));
  };

  const handleUpdateOptimistic = async (id: string, formData: UpdateTrackData): Promise<void> => {
    const trackIdToUpdate = id;
    if (!trackIdToUpdate) return;

    const originalTracks = [...tracks];
    const trackIndex = originalTracks.findIndex(t => t.id === trackIdToUpdate);
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
      genres: formData.genres !== undefined ? formData.genres : originalTrack.genres,
    };

    const optimisticTracks = [...originalTracks];
    optimisticTracks[trackIndex] = optimisticTrackData;

    setTracks(optimisticTracks);
    closeAllModals();
    setMutationLoading(prev => ({ ...prev, isSubmitting: true }));

    const result = await updateTrack(trackIdToUpdate, formData);

    if (result.isOk()) {
      const updatedTrackFromServer = result.value;
      setTracks((prevTracks: Track[]) =>
        prevTracks.map(t => (t.id === updatedTrackFromServer.id ? updatedTrackFromServer : t))
      );
      toast.success('Track updated successfully!');
    } else {
      const apiError = result.error;
      toast.error(`Failed to update track: ${apiError.message}. Reverting changes.`);
      console.error("Optimistic update failed, rolling back:", apiError);
      setTracks(originalTracks);
    }
    setMutationLoading(prev => ({ ...prev, isSubmitting: false }));
  };

  const handleDeleteOptimistic = async (trackIdToDelete: string): Promise<void> => {
    if (!trackIdToDelete) return;

    const originalTracks = [...tracks];
    const trackToDelete = originalTracks.find(t => t.id === trackIdToDelete);

    setTracks((prev: Track[]) => prev.filter(t => t.id !== trackIdToDelete));
    closeAllModals();
    if (selectedTrackIds.has(trackIdToDelete)) {
        clearSelection();
    }
    setMutationLoading(prev => ({ ...prev, isDeleting: true }));

    const result = await deleteTrack(trackIdToDelete);

    if (result.isOk()) {
      toast.success(`Track "${trackToDelete?.title ?? trackIdToDelete}" deleted.`);
      void fetchTracks();
    } else {
      const apiError = result.error;
      toast.error(`Failed to delete track: ${apiError.message}. Reverting.`);
      console.error("Optimistic delete failed, rolling back:", apiError);
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

    const result = await updateTrack(trackId, { genres: newGenres });

    if (result.isOk()) {
      toast.success(`Genre "${genreToRemove}" removed from "${originalTrack.title}"`);
    } else {
      const apiError = result.error;
      toast.error(`Failed to remove genre: ${apiError.message}. Reverting.`);
      console.error("Optimistic genre removal failed, rolling back:", apiError);
      setTracks(originalTracks);
    }
    setMutationLoading(prev => ({ ...prev, isSubmitting: false }));
  };

  const handleDeleteFileOptimistic = async (trackIdToDeleteFile: string): Promise<void> => {
    if (!trackIdToDeleteFile) return;

    const originalTracks = [...tracks];
    const trackIndex = originalTracks.findIndex(t => t.id === trackIdToDeleteFile);
    if (trackIndex === -1) {
      toast.error("Track not found to delete file.");
      return;
    }
    const originalTrack = originalTracks[trackIndex];
    if (!originalTrack.audioFile) {
      toast("Track doesn't have an audio file to delete.");
      closeAllModals();
      return;
    }

    const optimisticTrackData: Track = { ...originalTrack, audioFile: undefined };
    const optimisticTracks = [...originalTracks];
    optimisticTracks[trackIndex] = optimisticTrackData;

    setTracks(optimisticTracks);
    closeAllModals();
    setMutationLoading(prev => ({ ...prev, isDeletingFile: true }));

    const result = await deleteTrackFile(trackIdToDeleteFile);

    if (result.isOk()) {
      const updatedTrackFromServer = result.value;
      setTracks((prevTracks: Track[]) =>
        prevTracks.map(t => (t.id === updatedTrackFromServer.id ? updatedTrackFromServer : t))
      );
      toast.success(`Audio file for "${originalTrack.title}" deleted successfully.`);
    } else {
      const apiError = result.error;
      toast.error(`Failed to delete audio file: ${apiError.message}. Reverting.`);
      console.error("Optimistic delete file failed, rolling back:", apiError);
      setTracks(originalTracks);
    }
    setMutationLoading(prev => ({ ...prev, isDeletingFile: false }));
  };

  const handleUpload = async (id: string, file: File): Promise<void> => {
    if (!id) return;
    setMutationLoading(prev => ({ ...prev, isUploading: true }));
    const result = await uploadTrackFile(id, file);

    if (result.isOk()) {
      const updatedTrack = result.value;
      setTracks((prev: Track[]) => prev.map(t => (t.id === updatedTrack.id ? updatedTrack : t)));
      toast.success(`Audio file uploaded for "${updatedTrack.title}"!`);
      closeAllModals();
    } else {
      const apiError = result.error;
      toast.error(`Failed to upload file: ${apiError.message}`);
      console.error("Upload track file error object:", apiError);
    }
    setMutationLoading(prev => ({ ...prev, isUploading: false }));
  };

  const handleBulkDeleteOptimistic = async (idsToDelete: string[]): Promise<void> => {
    if (idsToDelete.length === 0) return;

    const originalTracks = [...tracks];
    setTracks((prev: Track[]) => prev.filter(t => !idsToDelete.includes(t.id)));
    clearSelection();
    setMutationLoading(prev => ({ ...prev, isBulkDeleting: true }));

    const result = await deleteMultipleTracks(idsToDelete);

    if (result.isOk()) {
      const responseData = result.value;
      const successCount = responseData.success?.length ?? 0;
      const failedCount = responseData.failed?.length ?? 0;

      if (successCount > 0) toast.success(`${successCount} track(s) deleted successfully.`);
      if (failedCount > 0) {
        toast.error(`Failed to delete ${failedCount} track(s). IDs: ${responseData.failed.join(', ')}`);
        void fetchTracks();
      } else if (successCount > 0) {
        void fetchTracks();
      }
    } else {
      const apiError = result.error;
      toast.error(`Bulk delete failed: ${apiError.message}. Reverting.`);
      console.error("Optimistic bulk delete failed, rolling back:", apiError);
      setTracks(originalTracks);
    }
    setMutationLoading(prev => ({ ...prev, isBulkDeleting: false }));
  };

  const isAnyMutationLoading =
    mutationLoading.isSubmitting ||
    mutationLoading.isDeleting ||
    mutationLoading.isUploading ||
    mutationLoading.isDeletingFile ||
    mutationLoading.isBulkDeleting;
  const isBusy = isLoadingTracks || isAnyMutationLoading;

  return (
    <div className="tracks-page">
      <h1 data-testid="tracks-header">Tracks</h1>
      <TrackFilters
        {...filterProps}
        availableGenres={availableGenres}
        uniqueArtists={uniqueArtists}
        disabled={isBusy}
      />
      <button
        className="fab-create-track"
        onClick={openModal.create}
        disabled={isBusy}
        data-testid="create-track-button"
        title="Create new track"
        data-loading={isBusy}
        aria-disabled={isBusy}
      >
        <span className="fab-icon" aria-hidden="true">+</span>
        <span className="fab-text">Add Track</span>
      </button>

      {tracksError && !isLoadingTracks && (
        <div className="error-message page-error" data-testid="page-error-message">
          <strong>Error loading tracks:</strong> {tracksError.message}
          {(tracksError.type === 'ApiError' && tracksError.statusCode) &&
            ` (Status: ${tracksError.statusCode})`}
          <button onClick={() => void fetchTracks()} style={{ marginLeft: '10px', fontSize: '0.9em', padding: '0.3em 0.6em'}}>
            Retry
          </button>
        </div>
      )}

      <TrackList
        tracks={tracks}
        isLoading={isLoadingTracks}
        selectionProps={selectionProps}
        selectedTrackIds={selectedTrackIds}
        onEdit={openModal.edit}
        onDelete={openModal.delete}
        onUpload={openModal.upload}
        onDeleteFile={openModal.deleteFile}
        onGenreRemove={handleTrackGenreRemove}
        isBulkDeleting={mutationLoading.isBulkDeleting}
        onBulkDelete={handleBulkDeleteOptimistic}
      />

      {!isLoadingTracks && meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={filterProps.handlePageChange}
        />
      )}

      <CreateTrackModal
        isOpen={modalState.createOpen}
        onClose={closeAllModals}
        onSubmit={handleCreate}
        availableGenres={availableGenres}
        isLoading={mutationLoading.isSubmitting}
      />
      <EditTrackModal
        isOpen={!!modalState.editingTrackId}
        onClose={closeAllModals}
        trackToEdit={findTrackById(modalState.editingTrackId)}
        onSubmit={handleUpdateOptimistic}
        availableGenres={availableGenres}
        isLoading={mutationLoading.isSubmitting}
      />
      <TrackUploadModal
        isOpen={!!modalState.uploadingTrackId}
        onClose={closeAllModals}
        trackToUpload={findTrackById(modalState.uploadingTrackId)}
        onUpload={(id, file) => { void handleUpload(id, file); }}
        isLoading={mutationLoading.isUploading}
      />
      <DeleteConfirmationDialog
        isOpen={!!modalState.deletingTrackId}
        onClose={closeAllModals}
        trackToDelete={findTrackById(modalState.deletingTrackId)}
        onConfirm={handleDeleteOptimistic}
        isLoading={mutationLoading.isDeleting}
      />
      <DeleteFileConfirmationDialog
        isOpen={!!modalState.deletingFileTrackId}
        onClose={closeAllModals}
        trackToDeleteFile={findTrackById(modalState.deletingFileTrackId)}
        onConfirm={handleDeleteFileOptimistic}
        isLoading={mutationLoading.isDeletingFile}
      />
    </div>
  );
};

export default TracksPage;