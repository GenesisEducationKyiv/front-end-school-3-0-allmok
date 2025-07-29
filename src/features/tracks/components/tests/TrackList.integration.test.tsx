import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrackList } from '../TrackList'; 
import { Track } from '../../../../types/track';

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

describe('TrackList Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.confirm = vi.fn(() => true);
    });

    it('should show the selection actions bar when a track is selected', () => {
        render(
            <TrackList
                trackToUpload={mockTracks}
                isLoading={false}
                selectedTrackIds={new Set(['1'])}

                onSelectToggle={vi.fn()}
                onSelectAllOnPage={vi.fn()}
                onClearSelection={vi.fn()}
                onBulkDelete={vi.fn()}
                isBulkDeleting={false}
                onEdit={vi.fn()} onDelete={vi.fn()} onUpload={vi.fn()}
                onDeleteFile={vi.fn()} onGenreRemove={vi.fn()}
            />
        );

        const actionsBar = screen.getByTestId('selection-actions-bar');
        expect(actionsBar).toBeInTheDocument();
        expect(screen.getByText('1 selected')).toBeInTheDocument();
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        expect(deleteButton).toBeInTheDocument();
    });

    it('should call onBulkDelete when the delete button in the actions bar is clicked', () => {
        const mockOnBulkDelete = vi.fn();
        
        render(
            <TrackList
                trackToUpload={mockTracks}
                isLoading={false}
                selectedTrackIds={new Set(['1', '2'])} 
                onBulkDelete={mockOnBulkDelete} 
                onSelectToggle={vi.fn()}
                onSelectAllOnPage={vi.fn()}
                onClearSelection={vi.fn()}
                isBulkDeleting={false}
                onEdit={vi.fn()} onDelete={vi.fn()} onUpload={vi.fn()}
                onDeleteFile={vi.fn()} onGenreRemove={vi.fn()}
            />
        );
        
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
        expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete 2 track(s)?');
        expect(mockOnBulkDelete).toHaveBeenCalledTimes(1);
        expect(mockOnBulkDelete).toHaveBeenCalledWith(['1', '2']);
    });

    it('should call onSelectAllOnPage when the "Select all" button is clicked', () => {
        const mockOnSelectAll = vi.fn();
        render(
            <TrackList
                trackToUpload={mockTracks}
                isLoading={false}
                selectedTrackIds={new Set(['1'])}
                onSelectAllOnPage={mockOnSelectAll}
                onSelectToggle={vi.fn()} onClearSelection={vi.fn()} onBulkDelete={vi.fn()}
                isBulkDeleting={false} onEdit={vi.fn()} onDelete={vi.fn()} 
                onUpload={vi.fn()} onDeleteFile={vi.fn()} onGenreRemove={vi.fn()}
            />
        );
        
        const selectAllButton = screen.getByRole('button', { name: 'Select all' });
        fireEvent.click(selectAllButton);
        
        expect(mockOnSelectAll).toHaveBeenCalledTimes(1);
    });

    it('should call onClearSelection when the "Clear" button is clicked', () => {
        const mockOnClear = vi.fn();
        render(
            <TrackList
                trackToUpload={mockTracks}
                isLoading={false}
                selectedTrackIds={new Set(['1'])}
                onClearSelection={mockOnClear}
                onSelectToggle={vi.fn()} onSelectAllOnPage={vi.fn()} onBulkDelete={vi.fn()}
                isBulkDeleting={false} onEdit={vi.fn()} onDelete={vi.fn()} 
                onUpload={vi.fn()} onDeleteFile={vi.fn()} onGenreRemove={vi.fn()}
            />
        );
        
        const clearButton = screen.getByRole('button', { name: 'Clear' });
        fireEvent.click(clearButton);
        
        expect(mockOnClear).toHaveBeenCalledTimes(1);
    });
});