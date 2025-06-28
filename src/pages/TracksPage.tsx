import React, { useMemo, useCallback } from "react";
import { useTracksQuery, useGenresQuery,} from "../features/tracks/components/hooks/useTracksQuery";
import { useTrackMutations } from "../features/tracks/components/hooks/useTrackMutations";
import { useFilterStore } from "../features/tracks/components/hooks/useFilters"; 
import { useModalStore } from "../stores/useModalStore";
import { useSelectionStore } from "../stores/useSelectionStore";


import Pagination from "../components/Pagination/Pagination";
import { TrackFilters } from "../features/tracks/components/TrackFilters";
import { TrackList } from "../features/tracks/components/TrackList";
import { TrackModals } from "../features/tracks/components/TrackModals";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorDisplay from "../features/tracks/components/ErrorDisplay";


import { ActiveTrackDisplay } from "../components/ActiveTrackDisplay"; 


import { Track, NewTrackData, UpdateTrackData } from "../types/track";

import "../css/TracksPage.css";
import { ApolloError } from "@apollo/client";
import { AppError } from "@/types/errors";

const TracksPage: React.FC = () => {

  const {
    data: tracksData,
    loading: isLoading, 
    error,
    refetch,
  } = useTracksQuery();
  

  const { data: genresData } = useGenresQuery();
  const availableGenres = genresData?.genres ?? [];


  const {
    createTrack,
    updateTrack,
    deleteTrack,
    bulkDelete,
    uploadFile,
    deleteFile,
    mutationState,
  } = useTrackMutations();

  const { page, setPage } = useFilterStore();
  const { activeModal, payload, openModal, closeModal } = useModalStore();
  const { selectedIds, toggleId, selectAll, clearSelection } = useSelectionStore();

  const tracks = tracksData?.tracks.data ?? [];
  const meta = tracksData?.tracks.meta;
  
  const isBusy = isLoading || mutationState.isAnyLoading;

  const uniqueArtists = useMemo(() => {
    return [...new Set(tracks.map((t: { artist: string; }) => t.artist))].sort() as string[];
  }, [tracks]);

  const findTrackById = useCallback(
    (id: string | null | undefined): Track | null => {
      return id ? tracks.find((t: { id: string; }) => t.id === id) ?? null : null;
    },
    [tracks]
  );

  const handleGenreRemove = useCallback(
    (trackId: string, genreToRemove: string) => {
      const track = findTrackById(trackId);
      if (!track || !track.genres) return;
      const updatedGenres = track.genres.filter((g) => g !== genreToRemove);
      updateTrack(trackId, { genres: updatedGenres });
    },
    [findTrackById, updateTrack]
  );

  if (isLoading && !tracksData) {
    return <LoadingIndicator />;
  }

  if (error) {
    const mapApolloErrorToAppError = (apolloError: ApolloError): AppError => ({
      type: "UnknownError",
      message: apolloError.message,
      originalError: apolloError,
    });

    return <ErrorDisplay error={mapApolloErrorToAppError(error)} onRetry={() => refetch()} />;
  }

  return (
    <div className="tracks-page">
      <ActiveTrackDisplay />

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
      >
        <span className="fab-icon" aria-hidden="true">+</span>
        <span className="fab-text">Add Track</span>
      </button>

      <TrackList
        trackToUpload={tracks}
        isLoading={isLoading}
        selectedTrackIds={selectedIds}
        selectionProps={{
          handleSelectToggle: toggleId,
          handleSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => {
            const allIds = tracks.map((t: { id: any; }) => t.id);
            e.target.checked ? selectAll(allIds) : clearSelection();
          },
          isAllSelected: tracks.length > 0 && selectedIds.size === tracks.length,
        }}
        onEdit={(id) => openModal("editTrack", { trackId: id })}
        onDelete={(id) => openModal("deleteTrack", { trackId: id })}
        onUpload={(id) => openModal("uploadTrackFile", { trackId: id })}
        onDeleteFile={(id) => openModal("deleteTrackFile", { trackId: id })}
        onGenreRemove={handleGenreRemove}
        onBulkDelete={() => bulkDelete(Array.from(selectedIds))}
        isBulkDeleting={mutationState.isBulkDeleting}
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
        mutationLoading={mutationState}
        onCreate={createTrack}
        onUpdate={updateTrack}
        onDelete={deleteTrack}
        onUploadFile={uploadFile}
        onDeleteFile={deleteFile}
      />
    </div>
  );
};

export default TracksPage;