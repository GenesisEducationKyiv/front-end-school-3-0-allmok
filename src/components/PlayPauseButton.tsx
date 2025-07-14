import React, { useCallback, memo } from "react";
import { logger } from "../utils/logger";

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
      logger.warn(`[PlayPauseButton ${trackId}] No audio file URL.`);
      return;
    }
    if (!isReady && !error) {
      logger.warn(`[PlayPauseButton ${trackId}] Play/Pause clicked but not ready yet.`);
      return;
    }
    if (error) {
      logger.error(`[PlayPauseButton ${trackId}] Cannot play/pause due to error: ${error}`);
      return;
    }
    logger.log(`[PlayPauseButton ${trackId}] Play/Pause button clicked. Currently playing: ${isPlaying}`);
    if (isPlaying) {
      onPause(trackId);
    } else {
      onPlay(trackId);
    }
  }, [trackId, isPlaying, onPlay, onPause, audioUrl, error, isReady]);

  const isDisabled = !isReady && !error;
  const buttonClass = `play-pause-button ${isPlaying ? "playing" : "paused"}`;
  const testId = isPlaying ? `pause-button-${trackId}` : `play-button-${trackId}`;
  const ariaLabel = isPlaying ? "Pause" : "Play";

  return (
    <button
      onClick={handlePlayPauseClick}
      className={buttonClass}
      disabled={isDisabled}
      data-testid={testId}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {isPlaying ? "❚❚" : "▶"}
    </button>
  );
};

export default memo(PlayPauseButton);