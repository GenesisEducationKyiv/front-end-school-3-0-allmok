import React, { useCallback, memo } from "react";
import { Track } from "../../../types/track";
import GenreTag from "../../../components/GenreTag/GenreTag";
import defaultCover from "../../../assets/default-cover.jpg";
import { useAudioPlayer } from "../../../features/tracks/components/hooks/useAudioPlayer";
import { useWaveSurfer } from "../../tracks/components/hooks/useWaveSurfer";
import { getAbsoluteFileUrl } from "../../../utils/url";

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
  const imageUrl = trackToUpload.coverImage ?? defaultCover;
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

  const handleInternalGenreRemove = useCallback(
    (genreToRemove: string) => {
      if (typeof onGenreRemove === "function") {
        onGenreRemove(trackToUpload.id, genreToRemove);
      } else {
        console.warn(
          `[TrackItem ${trackToUpload.id}] onGenreRemove is not a function. Cannot remove genre: ${genreToRemove}`
        );
      }
    },
    [onGenreRemove, trackToUpload.id]
  );

  const handleEditClick = useCallback(
    () => onEdit(trackToUpload.id),
    [onEdit, trackToUpload.id]
  );
  const handleDeleteClick = useCallback(
    () => onDelete(trackToUpload.id),
    [onDelete, trackToUpload.id]
  );
  const handleUploadClick = useCallback(
    () => onUpload(trackToUpload.id),
    [onUpload, trackToUpload.id]
  );
  const handleDeleteFileClick = useCallback(
    () => onDeleteFile(trackToUpload.id),
    [onDeleteFile, trackToUpload.id]
  );
  const handleSelectChange = useCallback(
    () => onSelectToggle(trackToUpload.id),
    [onSelectToggle, trackToUpload.id]
  );

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      (e.target as HTMLImageElement).src = defaultCover;
    },
    []
  );

  const handlePlayPauseClick = useCallback(() => {
    if (!fullAudioUrl) {
      console.warn(`[TrackItem ${trackToUpload.id}] No audio file URL.`);
      return;
    }

    if (!isWsReady && !error) {
      console.warn(
        `[TrackItem ${trackToUpload.id}] Play/Pause clicked but WS not ready yet.`
      );
      return;
    }

    if (error) {
      console.error(
        `[TrackItem ${trackToUpload.id}] Cannot play/pause due to WS error: ${error}`
      );
      return;
    }

    console.log(
      `[TrackItem ${trackToUpload.id}] Play/Pause button clicked. Currently playing globally: ${isThisTrackPlayingGlobally}`
    );

    if (isThisTrackPlayingGlobally) {
      requestPause(trackToUpload.id);
    } else {
      requestPlay(trackToUpload.id);
    }
  }, [
    trackToUpload.id,
    fullAudioUrl,
    isThisTrackPlayingGlobally,
    requestPlay,
    requestPause,
    isWsReady,
    error,
  ]);

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

      <img
        src={imageUrl}
        alt={`Cover for ${trackToUpload.title}`}
        className="track-item-cover"
        onError={handleImageError}
      />

      <div className="track-item-content">
        <div className="track-item-main-info">
          <div className="track-info">
            {trackToUpload.audioFile && (
              <button
                onClick={handlePlayPauseClick}
                className={`play-pause-button ${
                  isThisTrackPlayingGlobally ? "playing" : "paused"
                }`}
                disabled={!isWsReady && !error}
                data-testid={
                  isThisTrackPlayingGlobally
                    ? `pause-button-${trackToUpload.id}`
                    : `play-button-${trackToUpload.id}`
                }
                aria-label={isThisTrackPlayingGlobally ? "Pause" : "Play"}
                title={isThisTrackPlayingGlobally ? "Pause" : "Play"}
              >
                {isThisTrackPlayingGlobally ? "❚❚" : "▶"}
              </button>
            )}
            <span data-testid={`track-item-${trackToUpload.id}-artist`}>
              {trackToUpload.artist}
            </span>
            {" - "}
            <span data-testid={`track-item-${trackToUpload.id}-title`}>
              {trackToUpload.title}
            </span>
            {trackToUpload.album && (
              <span className="track-album">({trackToUpload.album})</span>
            )}
          </div>

          <div className="track-actions">
            <button
              onClick={handleEditClick}
              data-testid={`edit-track-${trackToUpload.id}`}
              className="button-edit"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              data-testid={`delete-track-${trackToUpload.id}`}
              className="button-delete"
            >
              Delete
            </button>
            {trackToUpload.audioFile ? (
              <button
                onClick={handleDeleteFileClick}
                data-testid={`delete-track-file-${trackToUpload.id}`}
                className="button-delete-file"
              >
                Delete File
              </button>
            ) : (
              <button
                onClick={handleUploadClick}
                data-testid={`upload-track-${trackToUpload.id}`}
                className="button-upload"
              >
                Upload
              </button>
            )}
          </div>
        </div>

        <div className="track-genres">
          {trackToUpload.genres && trackToUpload.genres.length > 0 ? (
            trackToUpload.genres.map((genre) => (
              <GenreTag
                key={genre}
                genre={genre}
                onRemove={handleInternalGenreRemove}
              />
            ))
          ) : (
            <span className="no-genres">No genres specified</span>
          )}
        </div>

        {trackToUpload.audioFile && (
          <div
            ref={waveformContainerRef}
            className="waveform-container"
            data-testid={`waveform-${trackToUpload.id}`}
            data-ui-test-id={`audio-progress-${trackToUpload.id}`}
          >
            {!isWsReady && !error && (
              <div className="waveform-status">Loading waveform...</div>
            )}
            {error && (
              <div className="waveform-status waveform-error">
                Error: {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(TrackItem);
