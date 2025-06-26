import React, { useMemo, useCallback } from "react";

import {
  useTracksQuery,
  useGenresQuery,
} from "../features/tracks/components/hooks/useTracksQuery";
import { useTrackMutations } from "../features/tracks/components/hooks/useTrackMutations";
import { useFilterStore } from "../stores/useFilterStore";
import { useModalStore } from "../stores/useModalStore";
import { useSelectionStore } from "../stores/useSelectionStore";

import Pagination from "../components/Pagination/Pagination";
import { TrackFilters } from "../features/tracks/components/TrackFilters";
import { TrackList } from "../features/tracks/components/TrackList";
import { TrackModals } from "../features/tracks/components/TrackModals";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorDisplay from "../features/tracks/components/ErrorDisplay";

import { Track } from "../types/track";

import "../css/TracksPage.css";

const TracksPage: React.FC = () => {
  const {
    data: tracksData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useTracksQuery();

  const { data: availableGenres = [] } = useGenresQuery();

  const {
    createTrack,
    updateTrack,
    deleteTrack,
    bulkDelete,
    uploadFile,
    deleteFile,
    mutationState,
  } = useTrackMutations();

  const { setPage, page } = useFilterStore();
  const { activeModal, payload, openModal, closeModal } = useModalStore();
  const { selectedIds, toggleId, selectAll, clearSelection } =
    useSelectionStore();

  const tracks = tracksData?.tracks ?? [];
  const meta = tracksData?.meta;

  const uniqueArtists = useMemo(() => {
    return [...new Set(tracks.map((t) => t.artist))].sort();
  }, [tracks]);

  const findTrackById = useCallback(
    (id: string | null | undefined): Track | null => {
      return id ? tracks.find((t) => t.id === id) ?? null : null;
    },
    [tracks]
  );

  const handleGenreRemove = useCallback(
    (trackId: string, genreToRemove: string) => {
      const track = findTrackById(trackId);
      if (!track) return;

      const updatedGenres = track.genres.filter((g) => g !== genreToRemove);
      updateTrack({ id: trackId, trackData: { genres: updatedGenres } });
    },
    [findTrackById, updateTrack]
  );

  const isBusy = isFetching || mutationState.isAnyLoading;

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError && error) {
    return <ErrorDisplay error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="tracks-page">
      <h1 data-testid="tracks-header">Tracks</h1>

      <TrackFilters
        availableGenres={availableGenres}
        uniqueArtists={uniqueArtists}
        disabled={isBusy}
      />

      <button
        className="fab-create-track"
        onClick={() => openModal("createTrack")}
        disabled={isBusy}
        data-testid="create-track-button"
        title="Create new track"
        data-loading={isBusy}
        aria-disabled={isBusy}
      >
        <span className="fab-icon" aria-hidden="true">
          +
        </span>
        <span className="fab-text">Add Track</span>
      </button>

      <TrackList
        tracks={tracks}
        isLoading={isFetching}
        selectedTrackIds={selectedIds}
        selectionProps={{
          handleSelectToggle: toggleId,
          handleSelectAllClick: () => {
            const allIds = tracks.map((t) => t.id);
            const isAllSelected =
              tracks.length > 0 && selectedIds.size === tracks.length;
            isAllSelected ? clearSelection() : selectAll(allIds);
          },
          isAllSelected:
            tracks.length > 0 && selectedIds.size === tracks.length,
        }}
        onEdit={(id) => openModal("editTrack", { trackId: id })}
        onDelete={(id) => openModal("deleteTrack", { trackId: id })}
        onUpload={(id) => openModal("uploadTrackFile", { trackId: id })}
        onDeleteFile={(id) => openModal("deleteTrackFile", { trackId: id })}
        onGenreRemove={handleGenreRemove}
        onBulkDelete={() => bulkDelete(Array.from(selectedIds))}
        isBulkDeleting={mutationState.isBulkDeleting}
        mutationState={mutationState}
        onSelectTrack={function (): void {
          throw new Error("Function not implemented.");
        }}
        onSelectAll={function (): void {
          throw new Error("Function not implemented.");
        }}
        onClearSelection={function (): void {
          throw new Error("Function not implemented.");
        }}
        isAllSelected={false}
      />

      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}
      <TrackModals
        activeModal={activeModal}
        modalPayload={payload}
        closeModal={closeModal}
        findTrackById={findTrackById}
        availableGenres={availableGenres}
        mutationLoading={{
          isCreating: mutationState.isCreating,
          isUpdating: mutationState.isUpdating,
          isDeleting: mutationState.isDeleting,
          isUploading: mutationState.isUploading,
          isDeletingFile: mutationState.isDeletingFile,
          isBulkDeleting: mutationState.isBulkDeleting,
          isAnyLoading: mutationState.isAnyLoading,
        }}
        onCreate={async (data) => {
          await createTrack(data);
        }}
        onUpdate={async (id, data) => updateTrack({ id, trackData: data })}
        onDelete={async (trackId: string) => {
          await deleteTrack(trackId);
        }}
        onUploadFile={async (id, file) => uploadFile({ id, file })}
        onDeleteFile={async (trackId: string) => {
          await deleteFile(trackId);
        }}
      />
    </div>
  );
};

export default TracksPage;
