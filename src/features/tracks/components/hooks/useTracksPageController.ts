import { useMemo, useCallback } from 'react';
import {
  useTracksQuery,
  useGenresQuery,
} from './useTracksQuery';
import { useTrackMutations } from './useTrackMutations';
import { useFilterStore } from './useFilters';
import { useModalStore } from '../../../../stores/useModalStore';
import { useSelectionStore } from '../../../../stores/useSelectionStore';
import { Track, Meta } from '../../../../types/track';

interface GetTracksQueryData {
  tracks: {
    data: Track[];
    meta: Meta;
  };
}

interface GetGenresQueryData {
  genres: string[];
}

export const useTracksPageController = () => {
  const { data: tracksData, loading: isLoading, error, refetch } = useTracksQuery<GetTracksQueryData>();
  const { data: genresData } = useGenresQuery<GetGenresQueryData>();
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

  const tracks = useMemo(() => tracksData?.tracks.data ?? [], [tracksData]);
  const meta = useMemo(() => tracksData?.tracks.meta, [tracksData]);
  const isBusy = isLoading || mutationState.isAnyLoading;
  const availableGenres = useMemo(() => genresData?.genres ?? [], [genresData]);
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
      if (!track?.genres) return;
      const updatedGenres = track.genres.filter((g) => g !== genreToRemove);
      void updateTrack(trackId, { genres: updatedGenres });
    },
    [findTrackById, updateTrack]
  );

  const handleBulkDelete = useCallback(() => {
    void bulkDelete(Array.from(selectedIds));
  }, [bulkDelete, selectedIds]);

  const handleSelectAllOnPage = useCallback(() => {
    const allIdsOnPage = tracks.map((t) => t.id);
    selectAll(allIdsOnPage);
  }, [tracks, selectAll]);

  return {
    isLoading,
    isBusy,
    error,
    tracks,
    meta,
    availableGenres,
    uniqueArtists,
    activeModal,
    modalPayload: payload,
    selectedIds,
    isAllSelected: tracks.length > 0 && selectedIds.size === tracks.length,
    mutationState,
    page,
    refetch,
    setPage,
    openModal,
    closeModal,
    findTrackById,
    handleGenreRemove,
    handleBulkDelete,
    handleSelectAllOnPage,
    toggleId,
    clearSelection,
    createTrack,
    updateTrack,
    deleteTrack,
    uploadFile,
    deleteFile,
  };
};