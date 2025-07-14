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
    
    if (isPlaying) { 
      onPause(trackId);
    } else {
      onPlay(trackId);
    }
  }, [trackId, isPlaying, onPlay, onPause, audioUrl, error, isReady]);

  const isDisabled = !isReady && !error;
  const ariaLabel = isPlaying ? "Pause" : "Play";

  return (
    <md-icon-button
      filled-tonal
      toggle 
      selected={isPlaying} 
      onClick={handlePlayPauseClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="play-pause-button-m3"
      data-testid={isPlaying ? `pause-button-${trackId}` : `play-button-${trackId}`}
    >
      <span slot="icon" className="material-symbols-outlined">play_arrow</span>
      
      <span slot="selectedIcon" className="material-symbols-outlined">pause</span>
    </md-icon-button>
  );
};

export default memo(PlayPauseButton);