import React, { memo } from "react";
import PlayPauseButton from "./PlayPauseButton";

interface TrackInfoProps {
  trackId: string;
  artist: string;
  title: string;
  album?: string | undefined;
  audioFile?: string | null | undefined;
  isPlaying: boolean;
  audioUrl: string | null;
  isReady: boolean;
  error: string | null;
  onPlay: (trackId: string) => void;
  onPause: (trackId: string) => void;
}

const TrackInfo: React.FC<TrackInfoProps> = ({
  trackId,
  artist,
  title,
  album,
  audioFile,
  isPlaying,
  audioUrl,
  isReady,
  error,
  onPlay,
  onPause,
}) => {
  return (
    <div className="track-info">
      {audioFile && (
        <PlayPauseButton
          trackId={trackId}
          isPlaying={isPlaying}
          audioUrl={audioUrl ?? ""}
          isReady={isReady}
          error={error}
          onPlay={onPlay}
          onPause={onPause}
        />
      )}
      <span data-testid={`track-item-${trackId}-artist`}>{artist}</span>
      {" - "}
      <span data-testid={`track-item-${trackId}-title`}>{title}</span>
      {album && <span className="track-album">({album})</span>}
    </div>
  );
};

export default memo(TrackInfo);