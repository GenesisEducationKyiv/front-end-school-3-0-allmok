import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TrackList from '../TrackList';
import { useBulkActions } from '../hooks/useBulkActions';
import { Track } from '../../../../types/track';


vi.mock('../../../../contexts/AudioPlayerContext', () => ({
  useAudioPlayer: () => ({  }),
}));
vi.mock('wavesurfer.js', () => ({
  default: { create: vi.fn(() => ({ on: vi.fn(), un: vi.fn(), destroy: vi.fn() })) },
}));

const mockTracks: Track[] = [
  {
      id: '1', title: 'Song A', artist: 'Artist A', genres: [], duration: 180,
      createdAt: '',
      updatedAt: ''
  },
  {
      id: '2', title: 'Song B', artist: 'Artist B', genres: [], duration: 200,
      createdAt: '',
      updatedAt: ''
  },
];

const TestTrackListWrapper = ({ onBulkDelete = vi.fn() }) => {
  const { selectionProps, selectedTrackIds } = useBulkActions(mockTracks.map(t => t.id));
  return (
    <TrackList
      tracks={mockTracks}
      isLoading={false}
      selectionProps={selectionProps}
      selectedTrackIds={selectedTrackIds}
      onEdit={vi.fn()} onDelete={vi.fn()} onUpload={vi.fn()}
      onDeleteFile={vi.fn()} onGenreRemove={vi.fn()}
      isBulkDeleting={false} onBulkDelete={onBulkDelete}
    />
  );
};

describe('TrackList Integration Test', () => {
    beforeEach(() => {
        window.confirm = vi.fn(() => true); 
    });

  it('should select a track and enable bulk delete button', () => {
    render(<TestTrackListWrapper />);
    expect(screen.queryByTestId('bulk-delete-button')).toBeNull();

    fireEvent.click(screen.getByTestId('track-checkbox-1'));

    const bulkDeleteButton = screen.getByTestId('bulk-delete-button');
    expect(bulkDeleteButton).toBeInTheDocument();
    expect(bulkDeleteButton).toHaveTextContent('Delete selected (1)');
  });

  it('should call onBulkDelete with selected track ids when button is clicked', () => {
    const onBulkDelete = vi.fn();
    render(<TestTrackListWrapper onBulkDelete={onBulkDelete} />);

    fireEvent.click(screen.getByTestId('select-all'));
    fireEvent.click(screen.getByTestId('bulk-delete-button'));

    expect(window.confirm).toHaveBeenCalledWith('Delete 2 tracks?');
    expect(onBulkDelete).toHaveBeenCalledWith(['1', '2']);
  });
});