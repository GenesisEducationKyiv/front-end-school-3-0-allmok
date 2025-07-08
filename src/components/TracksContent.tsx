import React, { Suspense } from 'react';

import { useTracksPageController } from '../features/tracks/components/hooks/useTracksPageController';

import { mapApolloErrorToAppError } from '../utils/helpers';

import Pagination from '../components/Pagination/Pagination';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorDisplay from '../features/tracks/components/ErrorDisplay';
import { TrackFilters } from '../features/tracks/components/TrackFilters';
import { TrackList } from '../features/tracks/components/TrackList';
import { CreateTrackButton } from '../components/CreateTrackButton';

const TrackModals = React.lazy(() => 
  import('../features/tracks/components/TrackModals')
    .then(module => ({ default: module.TrackModals })) 
);


export const TracksContent: React.FC = () => {
  const controller = useTracksPageController();

  if (controller.isLoading && controller.tracks.length === 0) {
    return <LoadingIndicator />;
  }

  if (controller.error) {
    return <ErrorDisplay error={mapApolloErrorToAppError(controller.error)} onRetry={() => void controller.refetch()} />;
  }

  return (
    <>
      <TrackFilters
        availableGenres={controller.availableGenres}
        uniqueArtists={controller.uniqueArtists}
        disabled={controller.isBusy}
      />
      <CreateTrackButton
        onClick={() => controller.openModal('createTrack')}
        disabled={controller.isBusy}
      />
      <TrackList
        trackToUpload={controller.tracks}
        isLoading={controller.isLoading}
        selectedTrackIds={controller.selectedIds}
        selectionProps={{
          handleSelectToggle: controller.toggleId,
          handleSelectAllClick: controller.handleSelectAllClick,
          isAllSelected: controller.isAllSelected,
        }}
        onEdit={(id) => controller.openModal('editTrack', { trackId: id })}
        onDelete={(id) => controller.openModal('deleteTrack', { trackId: id })}
        onUpload={(id) => controller.openModal('uploadTrackFile', { trackId: id })}
        onDeleteFile={(id) => controller.openModal('deleteTrackFile', { trackId: id })}
        onGenreRemove={controller.handleGenreRemove}
        onBulkDelete={controller.handleBulkDelete}
        isBulkDeleting={controller.mutationState.isBulkDeleting}
      />
      {controller.meta && controller.meta.totalPages > 1 && (
        <Pagination
          currentPage={controller.page}
          totalPages={controller.meta.totalPages}
          onPageChange={controller.setPage}
        />
      )}
      <Suspense fallback={<LoadingIndicator />}>
        <TrackModals
          activeModal={controller.activeModal}
          modalPayload={controller.modalPayload}
          closeModal={controller.closeModal}
          findTrackById={controller.findTrackById}
          availableGenres={controller.availableGenres}
          mutationLoading={controller.mutationState}
          onCreate={(data) => void controller.createTrack(data)}
          onUpdate={(id, data) => void controller.updateTrack(id, data)}
          onDelete={(trackId) => void controller.deleteTrack(trackId)}
          onUploadFile={(id, file) => void controller.uploadFile(id, file)}
          onDeleteFile={(trackId) => void controller.deleteFile(trackId)}
        />
      </Suspense>
    </>
  );
};