import { useMemo, useCallback } from 'react';
import {
  useTracksQuery,
  useGenresQuery,
} from '../../../../features/tracks/components/hooks/useTracksQuery';
import { useTrackMutations } from '../../../../features/tracks/components/hooks/useTrackMutations';
import { useFilterStore } from '../../../../features/tracks/components/hooks/useFilters';
import { useModalStore } from '../../../../stores/useModalStore';
import { useSelectionStore } from '../../../../stores/useSelectionStore';
import { Track } from '../../../../types/track';

export const useTracksPageController = () => {

  const { data: tracksData, loading: isLoading, error, refetch } = useTracksQuery();
  const { data: genresData } = useGenresQuery();
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

  const tracks: Track[] = tracksData?.tracks.data ?? [];
  const meta = tracksData?.tracks.meta;
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
      if (!track || !track.genres) return;
      const updatedGenres = track.genres.filter((g) => g !== genreToRemove);
      updateTrack(trackId, { genres: updatedGenres });
    },
    [findTrackById, updateTrack]
  );
  
  const handleBulkDelete = useCallback(() => {
    bulkDelete(Array.from(selectedIds));
  }, [bulkDelete, selectedIds]);

  const handleSelectAllClick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const allIdsOnPage = tracks.map((t) => t.id);
    e.target.checked ? selectAll(allIdsOnPage) : clearSelection();
  }, [tracks, selectAll, clearSelection]);

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
    handleSelectAllClick,
    toggleId,

    createTrack,
    updateTrack,
    deleteTrack,
    uploadFile,
    deleteFile,
  };
};