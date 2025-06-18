
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TrackItem from '../TrackItem';
import { useAudioPlayer } from '../../../../contexts/AudioPlayerContext';
import { Track } from '../../../../types/track';

vi.mock('wavesurfer.js', () => ({
  default: {
    create: vi.fn(() => ({
      on: vi.fn((event, cb) => { if (event === 'ready') cb(); }),
      un: vi.fn(),
      destroy: vi.fn(),
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      isPlaying: vi.fn(() => false),
    })),
  },
}));
vi.mock('../../../../contexts/AudioPlayerContext', () => ({
  useAudioPlayer: vi.fn(),
}));

const mockTrack: Track = {
    id: '1',
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    genres: ['rock', 'pop'],
    duration: 180,
    audioFile: 'test.mp3',
    coverImage: 'cover.jpg',
    createdAt: '',
    updatedAt: ''
};

describe('TrackItem (White-box with Mocks)', () => {
  const mockUseAudioPlayer = useAudioPlayer as vi.Mock;
  const mockRequestPlay = vi.fn();
  const mockRequestPause = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAudioPlayer.mockReturnValue({
      playingTrackId: null,
      isPlaying: false,
      requestPlay: mockRequestPlay,
      requestPause: mockRequestPause,
      notifyTrackFinished: vi.fn(),
    });
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<TrackItem track={mockTrack} onEdit={onEdit} onDelete={() => {}} onUpload={() => {}} onDeleteFile={() => {}} isSelected={false} onSelectToggle={() => {}} onGenreRemove={() => {}} />);
    
    fireEvent.click(screen.getByTestId('edit-track-1'));
    expect(onEdit).toHaveBeenCalledWith('1');
  });

  it('should call requestPlay when play button is clicked', () => {
    render(<TrackItem track={mockTrack} onEdit={() => {}} onDelete={() => {}} onUpload={() => {}} onDeleteFile={() => {}} isSelected={false} onSelectToggle={() => {}} onGenreRemove={() => {}} />);
    
    const playButton = screen.getByTestId('play-button-1');
    fireEvent.click(playButton);
    expect(mockRequestPlay).toHaveBeenCalledWith('1');
  });

  it('should call requestPause when track is playing and button is clicked', () => {
    mockUseAudioPlayer.mockReturnValue({
      playingTrackId: '1',
      isPlaying: true,
      requestPlay: mockRequestPlay,
      requestPause: mockRequestPause,
    });
    render(<TrackItem track={mockTrack} onEdit={() => {}} onDelete={() => {}} onUpload={() => {}} onDeleteFile={() => {}} isSelected={false} onSelectToggle={() => {}} onGenreRemove={() => {}} />);
    
    const pauseButton = screen.getByTestId('pause-button-1');
    fireEvent.click(pauseButton);
    expect(mockRequestPause).toHaveBeenCalledWith('1');
  });

  it('should call onGenreRemove with correct trackId and genre', () => {
    const onGenreRemove = vi.fn();
    render(<TrackItem track={mockTrack} onEdit={() => {}} onDelete={() => {}} onUpload={() => {}} onDeleteFile={() => {}} isSelected={false} onSelectToggle={() => {}} onGenreRemove={onGenreRemove} />);
    
    const removeGenreButton = screen.getByTestId('remove-genre-rock');
    fireEvent.click(removeGenreButton);
    
    expect(onGenreRemove).toHaveBeenCalledWith('1', 'rock');
  });
});