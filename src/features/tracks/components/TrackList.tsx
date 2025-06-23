import React from 'react';
import TrackItem from './TrackItem';
import LoadingIndicator from '../../../components/LoadingIndicator'; 
import { Track } from '../../../types/track'; 
import { useBulkActions } from '../components/hooks/useBulkActions';
import '../../../css/TrackList.css';

interface TrackListProps {
    tracks: Track[];
    isLoading: boolean;
    selectionProps: ReturnType<typeof useBulkActions>['selectionProps'];
    selectedTrackIds: Set<string>;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onUpload: (id: string) => void;
    onDeleteFile: (id: string) => void;
    onGenreRemove: (trackId: string, genreToRemove: string) => void; 
    isBulkDeleting: boolean;
    onBulkDelete: (ids: string[]) => void;
}

export const TrackList: React.FC<TrackListProps> = ({
    tracks, isLoading, selectionProps, selectedTrackIds,
    onEdit, onDelete, onUpload, onDeleteFile,
    onGenreRemove, 
    isBulkDeleting, onBulkDelete
}) => {

    const handleBulkDeleteClick = () => {
        if (selectedTrackIds.size === 0) return;
        if (window.confirm(`Delete ${selectedTrackIds.size} tracks?`)) {
            onBulkDelete(Array.from(selectedTrackIds));
        }
    };

    if (isLoading) {
    }

    if (tracks.length === 0) {
        return <p className="track-list-empty">Track list is empty.</p>;
    }

    return (
        <div className="track-list-container"
        data-loading={isLoading} 
            aria-busy={isLoading} >
            <div className="track-list-header">
                <div className="select-all-container">
                    <input
                        type="checkbox"
                        id="select-all"
                        checked={selectionProps.isAllSelected}
                        onChange={selectionProps.handleSelectAllClick}
                        data-testid="select-all"
                        className="select-all-checkbox" 
                    />
                    <label htmlFor="select-all" className="select-all-label">
                        Select all on page
                    </label>
                </div>

 
                <div className="bulk-actions-container"> 
                    {selectedTrackIds.size > 0 && (
                        <button
                            onClick={handleBulkDeleteClick}
                            disabled={isBulkDeleting}
                            className="bulk-delete-button"
                            data-testid="bulk-delete-button"
                            data-loading={isBulkDeleting}
                            aria-disabled={isBulkDeleting}
                        >
                            {isBulkDeleting ? 'Deleting...' : `Delete selected (${selectedTrackIds.size})`}
                        </button>
                    )}
                </div>
            </div>


            <div className="track-list">
            {isLoading
                   ? <LoadingIndicator data-testid="loading-tracks"/>
                   : tracks.map(track => (
                        <TrackItem
                            key={track.id}
                            trackToUpload={track}
                            isSelected={selectedTrackIds.has(track.id)}
                            onSelectToggle={selectionProps.handleSelectToggle}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onUpload={onUpload}
                            onDeleteFile={onDeleteFile}
                            onGenreRemove={onGenreRemove}
                            />
                        ))
                    }
                </div>
            </div>
        );
    };
 export default TrackList; 