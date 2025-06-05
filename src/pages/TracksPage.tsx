import React, { useCallback, useMemo } from 'react';

import { useTrackFilters } from '../features/tracks/components/hooks/useTrackFilters';
import { useTracks } from '../features/tracks/components/hooks/useTracks';
import { useBulkActions } from '../features/tracks/components/hooks/useBulkActions';
import { useModalState } from '../features/tracks/components/hooks/useModalState';
import { useTrackOperations } from '../features/tracks/components/hooks/useTrackOperations';

import Pagination from '../components/Pagination/Pagination';
import { TrackFilters } from '../features/tracks/components/TrackFilters';
import { TrackList } from '../features/tracks/components/TrackList';
import { TrackModals } from '../features/tracks/components/TrackModals';

import { Track } from '../types/track';

import '../css/TracksPage.css';

const TracksPage: React.FC = () => {
  const {
    activeModal,
    modalPayload,
    openModal,
    closeModal,
  } = useModalState();

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

  const {
    mutationLoading,
    isAnyMutationLoading,
    handleCreate,
    handleUpdateOptimistic,
    handleDeleteOptimistic,
    handleTrackGenreRemove,
    handleDeleteFileOptimistic,
    handleUpload,
    handleBulkDeleteOptimistic,
  } = useTrackOperations({
    tracks,
    setTracks,
    fetchTracks,
    closeModal,
    clearSelection,
    filters,
    onPageChange: filterProps.handlePageChange,
  });

  const findTrackById = useCallback(
    (id: string | null | undefined): Track | null => {
      return id ? tracks.find(t => t.id === id) ?? null : null;
    },
    [tracks]
  );

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
        onClick={() => openModal('createTrack')}
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
          <button
            onClick={() => {
              fetchTracks().catch(console.error);
            }}
            style={{ marginLeft: '10px', fontSize: '0.9em', padding: '0.3em 0.6em' }}
          >
            Retry
          </button>
        </div>
      )}

      <TrackList
        tracks={tracks}
        isLoading={isLoadingTracks}
        selectionProps={selectionProps}
        selectedTrackIds={selectedTrackIds}
        onEdit={(id) => openModal('editTrack', { trackId: id })}
        onDelete={(id) => openModal('deleteTrack', { trackId: id })}
        onUpload={(id) => openModal('uploadTrackFile', { trackId: id })}
        onDeleteFile={(id) => openModal('deleteTrackFile', { trackId: id })}
        onGenreRemove={handleTrackGenreRemove}
        isBulkDeleting={mutationLoading.isBulkDeleting}
        onBulkDelete={(ids) => handleBulkDeleteOptimistic(ids)}
      />

      {!isLoadingTracks && meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={filterProps.handlePageChange}
        />
      )}

      <TrackModals
        activeModal={activeModal}
        modalPayload={modalPayload}
        closeModal={closeModal}
        findTrackById={findTrackById}
        availableGenres={availableGenres}
        mutationLoading={mutationLoading}
        onCreate={handleCreate}
        onUpdate={handleUpdateOptimistic}
        onDelete={handleDeleteOptimistic}
        onUploadFile={handleUpload}
        onDeleteFile={handleDeleteFileOptimistic}
      />
    </div>
  );
};

export default TracksPage;