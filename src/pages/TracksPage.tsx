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
  BulkDeleteResponse,
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
    createOpen: false, editingTrackId: null, deletingTrackId: null,
    uploadingTrackId: null, deletingFileTrackId: null,
  });

  const [mutationLoading, setMutationLoading] = useState({
    isSubmitting: false, isDeleting: false, isUploading: false,
    isDeletingFile: false, isBulkDeleting: false,
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

  const { selectedTrackIds, selectionProps, clearSelection } = useBulkActions(tracks.map(t => t.id));

  const findTrackById = useCallback((id: string | null): Track | null => {
    return id ? tracks.find(t => t.id === id) ?? null : null;
  }, [tracks]);

  const openModal = {
    create: () => setModalState(prev => ({ ...prev, createOpen: true })),
    edit: (id: string) => setModalState(prev => ({ ...prev, editingTrackId: id })),
    delete: (id: string) => setModalState(prev => ({ ...prev, deletingTrackId: id })),
    upload: (id: string) => setModalState(prev => ({ ...prev, uploadingTrackId: id })),
    deleteFile: (id: string) => setModalState(prev => ({ ...prev, deletingFileTrackId: id })),
  };

  const closeAllModals = useCallback(() => {
    setModalState({
      createOpen: false, editingTrackId: null, deletingTrackId: null,
      uploadingTrackId: null, deletingFileTrackId: null,
    });
  }, []);

  const handleCreate = async (data: TrackFormData): Promise<void> => {
    setMutationLoading(prev => ({ ...prev, isSubmitting: true }));
    try {
      await createTrack(data);
      toast.success('Track created successfully!');
      closeAllModals();
      if (filters.page !== 1) {
        filterProps.handlePageChange(1); 
      } else {
        void fetchTracks(); 
      }
      clearSelection();
    } catch (err) {
      toast.error(`Failed to create track: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error("Create track error:", err);
    } finally {
      setMutationLoading(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleUpdateOptimistic = async (id: string, formData: UpdateTrackData): Promise<void> => {
    const trackIdToUpdate = id;
    if (!trackIdToUpdate) return;
    const originalTracks = [...tracks];
    const trackIndex = originalTracks.findIndex(t => t.id === trackIdToUpdate);
    if (trackIndex === -1) { return; }
    const originalTrack = originalTracks[trackIndex];
    const optimisticTrack = { ...originalTrack, ...formData };
    const optimisticTracks = [...originalTracks];
    optimisticTracks[trackIndex] = optimisticTrack;
    setTracks(optimisticTracks);
    closeAllModals();
    setMutationLoading(prev => ({ ...prev, isSubmitting: true }));
    try {
      const updatedTrackFromServer = await updateTrack(trackIdToUpdate, formData);
      setTracks((prev: Track[]) => prev.map(t => t.id === updatedTrackFromServer.id ? updatedTrackFromServer : t));
      toast.success('Track updated successfully!');
    } catch (err) {
        toast.error(`Failed to update track: ${err instanceof Error ? err.message : 'Unknown error'}. Reverting changes.`);
        console.error("Optimistic update failed, rolling back:", err);
        setTracks(originalTracks);
    } finally {
      setMutationLoading(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleDeleteOptimistic = async (trackIdToDelete: string) => {
    if (!trackIdToDelete) return;
    const originalTracks = [...tracks];
    const trackToDelete = originalTracks.find(t => t.id === trackIdToDelete);
    setTracks((prev: Track[]) => prev.filter(t => t.id !== trackIdToDelete));
    closeAllModals();
    clearSelection();
    setMutationLoading(prev => ({ ...prev, isDeleting: true }));
    try {
      await deleteTrack(trackIdToDelete);
      toast.success(`Track "${trackToDelete?.title ?? trackIdToDelete}" deleted.`);
      void fetchTracks(); // Виправляємо floating promise
    } catch (err) {
        toast.error(`Failed to delete track: ${err instanceof Error ? err.message : 'Unknown error'}. Reverting.`);
        console.error("Optimistic delete failed, rolling back:", err);
        setTracks(originalTracks);
    } finally {
      setMutationLoading(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleTrackGenreRemove = async (trackId: string, genreToRemove: string) => {
    const originalTracks = [...tracks];
    const trackIndex = originalTracks.findIndex(t => t.id === trackId);
    if (trackIndex === -1) {  return; }
    const originalTrack = originalTracks[trackIndex];
    if (!originalTrack.genres.includes(genreToRemove)) return;
    const newGenres = originalTrack.genres.filter(g => g !== genreToRemove);
    const optimisticTracks = [...originalTracks];
    optimisticTracks[trackIndex] = { ...originalTrack, genres: newGenres };
    setTracks(optimisticTracks);
    setMutationLoading(prev => ({ ...prev, isSubmitting: true }));
    try {
      await updateTrack(trackId, { genres: newGenres });
      toast.success(`Genre "${genreToRemove}" removed from "${originalTrack.title}"`);
    } catch (err) {
        toast.error(`Failed to remove genre: ${err instanceof Error ? err.message : 'Unknown error'}. Reverting.`);
        console.error("Optimistic genre removal failed, rolling back:", err);
        setTracks(originalTracks);
    } finally {
      setMutationLoading(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleDeleteFileOptimistic = async (trackIdToDeleteFile: string) => {
     if (!trackIdToDeleteFile) return;
    const originalTracks = [...tracks];
    const trackToDeleteFileObj = originalTracks.find(t => t.id === trackIdToDeleteFile);
    setTracks((prev: Track[]) =>
      prev.map(t => {
        if (t.id === trackIdToDeleteFile) {
          const updatedTrack: Omit<Track, 'audioFile'> & { audioFile?: string } = { ...t };
          delete updatedTrack.audioFile;
          return updatedTrack as Track; 
        }
        return t;
      })
    );
    closeAllModals();
    setMutationLoading(prev => ({ ...prev, isDeletingFile: true }));
    try {
      await deleteTrackFile(trackIdToDeleteFile);
      toast.success(`Audio file for "${trackToDeleteFileObj?.title ?? trackIdToDeleteFile}" deleted.`);
    } catch (err) {
        toast.error(`Failed to delete audio file: ${err instanceof Error ? err.message : 'Unknown error'}. Reverting.`);
        console.error("Optimistic delete file failed, rolling back:", err);
        setTracks(originalTracks);
    } finally {
      setMutationLoading(prev => ({ ...prev, isDeletingFile: false }));
    }
  };

   const handleUpload = async (id: string, file: File) => {
    if (!id) return;
    setMutationLoading(prev => ({ ...prev, isUploading: true }));
    try {
      const updatedTrack = await uploadTrackFile(id, file);
      setTracks((prev: Track[]) => prev.map(t => t.id === updatedTrack.id ? updatedTrack : t));
      toast.success(`Audio file uploaded for "${updatedTrack.title}"!`);
      closeAllModals();
    } catch (err) {
       toast.error(`Failed to upload file: ${err instanceof Error ? err.message : 'Unknown error'}`);
       console.error("Upload track file error:", err);
    } finally {
      setMutationLoading(prev => ({ ...prev, isUploading: false }));
    }
   };

   const handleBulkDeleteOptimistic = async (idsToDelete: string[]) => {
    if (idsToDelete.length === 0) return;
    const originalTracks = [...tracks];
    setTracks((prev: Track[]) => prev.filter(t => !idsToDelete.includes(t.id)));
    clearSelection();
    setMutationLoading(prev => ({ ...prev, isBulkDeleting: true }));
    try {
        const result: BulkDeleteResponse = await deleteMultipleTracks(idsToDelete);
        const successCount = result.success?.length ?? 0;
        const failedCount = result.failed?.length ?? 0;

        if (successCount > 0) {
            toast.success(`${successCount} track(s) deleted successfully.`);
        }
        if (failedCount > 0) {
            toast.error(`Failed to delete ${failedCount} track(s). IDs: ${result.failed.join(', ')}`);
            void fetchTracks(); 
        } else if (successCount > 0) { 
             void fetchTracks(); 
        }
    } catch (err) {
        toast.error(`Bulk delete failed: ${err instanceof Error ? err.message : 'Unknown error'}. Reverting.`);
        console.error("Optimistic bulk delete failed, rolling back:", err);
        setTracks(originalTracks);
    } finally {
         setMutationLoading(prev => ({ ...prev, isBulkDeleting: false }));
    }
 };

  const isAnyMutationLoading = mutationLoading.isSubmitting || mutationLoading.isDeleting ||
                              mutationLoading.isUploading || mutationLoading.isDeletingFile ||
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
          {tracksError}
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
        onSubmit={(data) => handleCreate(data)}
        availableGenres={availableGenres}
        isLoading={mutationLoading.isSubmitting}
      />
      <EditTrackModal
        isOpen={!!modalState.editingTrackId}
        onClose={closeAllModals}
        trackToEdit={findTrackById(modalState.editingTrackId)}
        onSubmit={(id, data) => handleUpdateOptimistic(id, data)} 
        availableGenres={availableGenres}
        isLoading={mutationLoading.isSubmitting}
      />
      <TrackUploadModal
        isOpen={!!modalState.uploadingTrackId}
        onClose={closeAllModals}
        trackToUpload={findTrackById(modalState.uploadingTrackId)}
        onUpload={(trackId, file) => { void handleUpload(trackId, file); }}
        isLoading={mutationLoading.isUploading}
      />
      <DeleteConfirmationDialog
        isOpen={!!modalState.deletingTrackId}
        onClose={closeAllModals}
        trackToDelete={findTrackById(modalState.deletingTrackId)}
        onConfirm={(trackId) => { void handleDeleteOptimistic(trackId); }}
        isLoading={mutationLoading.isDeleting}
      />
      <DeleteFileConfirmationDialog
        isOpen={!!modalState.deletingFileTrackId}
        onClose={closeAllModals}
        trackToDeleteFile={findTrackById(modalState.deletingFileTrackId)}
        onConfirm={(trackId) => { void handleDeleteFileOptimistic(trackId); }}
        isLoading={mutationLoading.isDeletingFile}
      />
    </div>
  );
};

export default TracksPage;