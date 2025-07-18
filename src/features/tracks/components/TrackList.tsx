import React from 'react';
import TrackItem from './TrackItem';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { Track } from '../../../types/track';
import '../../../css/TrackList.css';

interface SelectionProps {
  isAllSelected: boolean;
  handleSelectAllClick: (event: React.MouseEvent<HTMLElement>) => void; 
  handleSelectToggle: (id: string) => void;
}

interface TrackListProps {
  trackToUpload: Track[];
  isLoading: boolean;
  selectedTrackIds: Set<string>;
  selectionProps: SelectionProps;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpload: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onGenreRemove: (trackId: string, genreToRemove: string) => void;
  onBulkDelete: (ids: string[]) => void;
  isBulkDeleting: boolean;
}

export const TrackList: React.FC<TrackListProps> = ({
  trackToUpload,
  isLoading,
  selectedTrackIds,
  selectionProps,
  onEdit,
  onDelete,
  onUpload,
  onDeleteFile,
  onGenreRemove,
  isBulkDeleting,
  onBulkDelete
}) => {
  const handleBulkDeleteClick = () => {
    if (selectedTrackIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedTrackIds.size} track(s)?`)) {
      onBulkDelete(Array.from(selectedTrackIds));
    }
  };

  if (!isLoading && trackToUpload.length === 0) {
    return <p className="track-list-empty">No tracks found. Try adjusting your filters.</p>;
  }

  return (
    <div className="track-list-container" data-loading={isLoading} aria-busy={isLoading}>
      <div className="track-list-header">
        <div className="select-all-container">
          <md-checkbox
            id="select-all"
            checked={selectionProps.isAllSelected}
            onClick={selectionProps.handleSelectAllClick}
            data-testid="select-all"
          />
          <label htmlFor="select-all">Select all on this page</label>
        </div>
        <div className="bulk-actions-container">
          {selectedTrackIds.size > 0 && (
            <md-filled-button
              onClick={handleBulkDeleteClick}
              disabled={isBulkDeleting}
              data-testid="bulk-delete-button"
            >
              <md-icon slot="icon">delete</md-icon>
              {isBulkDeleting ? 'Deleting...' : `Delete Selected (${selectedTrackIds.size})`}
            </md-filled-button>
          )}
        </div>
      </div>
      <div className="track-list-items">
        {isLoading ? (
          <LoadingIndicator data-testid="loading-tracks"/>
        ) : (
          trackToUpload.map(track => (
            <TrackItem
              key={track.id}
              trackToUpload={track}
              isSelected={selectedTrackIds.has(track.id)}
              onSelectToggle={selectionProps.handleSelectToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpload={onUpload}
              onDeleteFile={onDeleteFile}
              onGenreRemove={onGenreRemove} />
          ))
        )}
      </div>
    </div>
  );
};