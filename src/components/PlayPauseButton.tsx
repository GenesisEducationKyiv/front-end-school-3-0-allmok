import React, { useCallback, memo } from "react";

interface PlayPauseButtonProps {
  trackId: string;
  isPlaying: boolean;
  audioUrl: string;
  isReady: boolean;
  error: string | null;
  onPlay: (trackId: string) => void;
  onPause: (trackId: string) => void;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  trackId,
  isPlaying,
  audioUrl,
  isReady,
  error,
  onPlay,
  onPause,
}) => {
  const handlePlayPauseClick = useCallback(() => {
    if (!audioUrl) {
      console.warn(`[PlayPauseButton ${trackId}] No audio file URL.`);
      return;
    }

    if (!isReady && !error) {
      console.warn(
        `[PlayPauseButton ${trackId}] Play/Pause clicked but not ready yet.`
      );
      return;
    }

    if (error) {
      console.error(
        `[PlayPauseButton ${trackId}] Cannot play/pause due to error: ${error}`
      );
      return;
    }

    console.log(
      `[PlayPauseButton ${trackId}] Play/Pause button clicked. Currently playing: ${isPlaying}`
    );

    if (isPlaying) {
      onPause(trackId);
    } else {
      onPlay(trackId);
    }
  }, [trackId, audioUrl, isPlaying, onPlay, onPause, isReady, error]);

  return (
    <button
      onClick={handlePlayPauseClick}
      className={`play-pause-button ${isPlaying ? "playing" : "paused"}`}
      disabled={!isReady && !error}
      data-testid={
        isPlaying ? `pause-button-${trackId}` : `play-button-${trackId}`
      }
      aria-label={isPlaying ? "Pause" : "Play"}
      title={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? "❚❚" : "▶"}
    </button>
  );
};

export default memo(PlayPauseButton);