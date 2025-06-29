import React from 'react';
import { ApolloError } from '@apollo/client';

import Pagination from '../components/Pagination/Pagination';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorDisplay from '../features/tracks/components/ErrorDisplay';
import { ActiveTrackDisplay } from '../components/ActiveTrackDisplay';
import { TrackFilters } from '../features/tracks/components/TrackFilters';
import { TrackList } from '../features/tracks/components/TrackList';
import { TrackModals } from '../features/tracks/components/TrackModals';
import { CreateTrackButton } from '../components/CreateTrackButton'; 

import { useTracksPageController } from '../features/tracks/components/hooks/useTracksPageController';


import { AppError } from '../types/errors';
import '../css/TracksPage.css';

const TracksPage: React.FC = () => {
  const controller = useTracksPageController();

  if (controller.isLoading && controller.tracks.length === 0) {
    return <LoadingIndicator />;
  }

  if (controller.error) {
    const mapApolloErrorToAppError = (apolloError: ApolloError): AppError => ({
      type: 'UnknownError',
      message: apolloError.message,
      originalError: apolloError,
    });
    return <ErrorDisplay error={mapApolloErrorToAppError(controller.error)} onRetry={controller.refetch} />;
  }

  return (
    <div className="tracks-page">
      <ActiveTrackDisplay />
      <h1 data-testid="tracks-header">Tracks</h1>

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

      <TrackModals
        activeModal={controller.activeModal}
        modalPayload={controller.modalPayload}
        closeModal={controller.closeModal}
        findTrackById={controller.findTrackById}
        availableGenres={controller.availableGenres}
        mutationLoading={controller.mutationState}
        onCreate={controller.createTrack}
        onUpdate={controller.updateTrack}
        onDelete={controller.deleteTrack}
        onUploadFile={controller.uploadFile}
        onDeleteFile={controller.deleteFile}
      />
    </div>
  );
};

export default TracksPage;