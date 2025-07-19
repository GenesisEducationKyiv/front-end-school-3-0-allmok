import React from 'react';
import TrackItem from './TrackItem';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { Track } from '../../../types/track';
import '../../../css/TrackList.css';
import { SelectionActionsBar } from '../../../components/SelectionActionsBar';

interface TrackListProps {
  trackToUpload: Track[];
  isLoading: boolean;
  selectedTrackIds: Set<string>;
  onSelectToggle: (id: string) => void;
  onSelectAllOnPage: () => void; 
  onClearSelection: () => void;
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
  onSelectToggle,
  onSelectAllOnPage, 
  onClearSelection,
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

      <div className="track-list-items">
        {isLoading ? (
          <LoadingIndicator data-testid="loading-tracks"/>
        ) : (
          trackToUpload.map(track => (
            <TrackItem
              key={track.id}
              trackToUpload={track}
              isSelected={selectedTrackIds.has(track.id)}
              onSelectToggle={onSelectToggle} 
              onEdit={onEdit}
              onDelete={onDelete}
              onUpload={onUpload}
              onDeleteFile={onDeleteFile}
              onGenreRemove={onGenreRemove} />
          ))
        )}
      </div>
      <SelectionActionsBar
        count={selectedTrackIds.size}
        isDeleting={isBulkDeleting}
        onSelectAll={onSelectAllOnPage}
        onDeleteSelected={handleBulkDeleteClick}
        onClearSelection={onClearSelection}
      />
    </div>
  );
};