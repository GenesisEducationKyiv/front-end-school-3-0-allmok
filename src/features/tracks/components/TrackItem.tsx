import React, { useCallback, memo } from "react";
import { Track } from "../../../types/track";
import { useAudioPlayer } from "../../../features/tracks/components/hooks/useAudioPlayer";
import { useWaveSurfer } from "../../tracks/components/hooks/useWaveSurfer";
import { getAbsoluteFileUrl } from "../../../utils/url";
import TrackImage from "../../../components/TrackImage";
import TrackInfo from "../../../components/TrackInfo";
import TrackActions from "../../../components/TrackActions";
import TrackGenres from "../../../components/TrackGenres";
import TrackWaveform from "../../../components/TrackWaveform";

import "../../../css/TrackItem.css";

interface TrackItemProps {
  trackToUpload: Track;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpload: (id: string) => void;
  onDeleteFile: (id: string) => void;
  isSelected: boolean;
  onSelectToggle: (id: string) => void;
  onGenreRemove: (trackId: string, genreToRemove: string) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({
  trackToUpload,
  onEdit,
  onDelete,
  onUpload,
  onDeleteFile,
  isSelected,
  onSelectToggle,
  onGenreRemove,
}) => {
  const {
    playingTrackId,
    isPlaying,
    requestPlay,
    requestPause,
    notifyTrackFinished,
  } = useAudioPlayer();

  const isThisTrackPlayingGlobally =
    playingTrackId === trackToUpload.id && isPlaying;
  const fullAudioUrl = getAbsoluteFileUrl(trackToUpload.audioFile);

  const {
    waveformContainerRef,
    isReady: isWsReady,
    error,
  } = useWaveSurfer({
    audioUrl: fullAudioUrl,
    trackId: trackToUpload.id,
    onFinish: notifyTrackFinished,
    isPlaying: isThisTrackPlayingGlobally,
  });

  const handleSelectChange = useCallback(
    () => onSelectToggle(trackToUpload.id),
    [onSelectToggle, trackToUpload.id]
  );

  return (
    <div
      className={`track-item ${isSelected ? "selected" : ""} ${
        isThisTrackPlayingGlobally ? "active" : ""
      }`}
      data-testid={`track-item-${trackToUpload.id}`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleSelectChange}
        className="track-item-checkbox"
        data-testid={`track-checkbox-${trackToUpload.id}`}
        aria-label={`Select track ${trackToUpload.title}`}
      />

      <TrackImage
        imageUrl={trackToUpload.coverImage}
        trackTitle={trackToUpload.title}
        trackId={trackToUpload.id}
      />

      <div className="track-item-content">
        <div className="track-item-main-info">
          <TrackInfo
            trackId={trackToUpload.id}
            artist={trackToUpload.artist}
            title={trackToUpload.title}
            album={trackToUpload.album}
            audioFile={trackToUpload.audioFile}
            isPlaying={isThisTrackPlayingGlobally}
            audioUrl={fullAudioUrl}
            isReady={isWsReady}
            error={error}
            onPlay={requestPlay}
            onPause={requestPause}
          />

          <TrackActions
            trackId={trackToUpload.id}
            hasAudioFile={!!trackToUpload.audioFile}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpload={onUpload}
            onDeleteFile={onDeleteFile}
          />
        </div>

        <TrackGenres
          trackId={trackToUpload.id}
          genres={trackToUpload.genres || []}
          onGenreRemove={onGenreRemove}
        />

        {trackToUpload.audioFile && (
          <TrackWaveform
            trackId={trackToUpload.id}
            waveformContainerRef={waveformContainerRef}
            isReady={isWsReady}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default memo(TrackItem);