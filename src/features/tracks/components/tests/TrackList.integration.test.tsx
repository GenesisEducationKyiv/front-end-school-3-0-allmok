import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrackList } from '../TrackList'; 
import { Track } from '../../../../types/track';

const mockSelectionProps = {
  handleSelectToggle: vi.fn(),
  handleSelectAllClick: vi.fn(),
  isAllSelected: false,
};

const mockTracks: Track[] = [
    { id: '1', title: 'Song A', artist: 'Artist A', genres: [], createdAt: '', updatedAt: '' },
    { id: '2', title: 'Song B', artist: 'Artist B', genres: [], createdAt: '', updatedAt: '' },
];

vi.mock('../../../../contexts/AudioPlayerContext', () => ({
  useAudioPlayer: () => ({}),
}));
vi.mock('wavesurfer.js', () => ({
  default: { create: vi.fn(() => ({ on: vi.fn(), un: vi.fn(), destroy: vi.fn() })) },
}));

describe('TrackList Integration Test', () => {
    beforeEach(() => {
        window.confirm = vi.fn(() => true);
        vi.clearAllMocks();
    });

    it('should select a track and show the bulk delete button', () => {
        render(
            <TrackList
                trackToUpload={mockTracks}
                isLoading={false}
                selectionProps={mockSelectionProps}
                selectedTrackIds={new Set(['1'])} 
                onBulkDelete={vi.fn()}
                isBulkDeleting={false}
                onEdit={vi.fn()} onDelete={vi.fn()} onUpload={vi.fn()}
                onDeleteFile={vi.fn()} onGenreRemove={vi.fn()}
            />
        );

        const bulkDeleteButton = screen.getByTestId('bulk-delete-button');
        expect(bulkDeleteButton).toBeInTheDocument();
        expect(bulkDeleteButton).toHaveTextContent('Delete Selected (1)');
    });

    it('should call onBulkDelete when the button is clicked', () => {
        const onBulkDelete = vi.fn();
        render(
            <TrackList
                trackToUpload={mockTracks}
                isLoading={false}
                selectionProps={mockSelectionProps}
                selectedTrackIds={new Set(['1', '2'])} 
                onBulkDelete={onBulkDelete} 
                isBulkDeleting={false}
                onEdit={vi.fn()} onDelete={vi.fn()} onUpload={vi.fn()}
                onDeleteFile={vi.fn()} onGenreRemove={vi.fn()}
            />
        );
        
        fireEvent.click(screen.getByTestId('bulk-delete-button'));

        expect(onBulkDelete).toHaveBeenCalledTimes(1);
    });
});