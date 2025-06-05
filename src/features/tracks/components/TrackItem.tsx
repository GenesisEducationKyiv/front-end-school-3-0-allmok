import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Track } from '../../../types/track';
import GenreTag from '../../../components/GenreTag/GenreTag';
import defaultCover from '../../../assets/default-cover.jpg';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext'; 

import '../../../css/TrackItem.css';

interface TrackItemProps {
  track: Track;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpload: (id: string) => void;
  onDeleteFile: (id: string) => void;
  isSelected: boolean;
  onSelectToggle: (id: string) => void;
  onGenreRemove: (trackId: string, genreToRemove: string) => void;
}

const API_FILES_BASE_URL = 'http://localhost:8000/api/files/';

const TrackItem: React.FC<TrackItemProps> = ({
  track,
  onEdit,
  onDelete,
  onUpload,
  onDeleteFile,
  isSelected,
  onSelectToggle,
  onGenreRemove
}) => {
  const { playingTrackId, isPlaying, requestPlay, requestPause, notifyTrackFinished } = useAudioPlayer();

  const waveformContainerRef = useRef<HTMLDivElement>(null); 
  const wavesurferRef = useRef<WaveSurfer | null>(null); 

  const [isWsReady, setIsWsReady] = useState(false);
  const [error, setError] = useState<string | null>(null); 


  const isThisTrackPlayingGlobally = playingTrackId === track.id && isPlaying;

  const imageUrl = track.coverImage || defaultCover;
  const fullAudioUrl = track.audioFile ? API_FILES_BASE_URL + track.audioFile : null;

  const handleInternalGenreRemove = useCallback((genreToRemove: string) => {
    if (typeof onGenreRemove === 'function') {
      onGenreRemove(track.id, genreToRemove);
    } else {
      console.warn(`[TrackItem ${track.id}] onGenreRemove is not a function. Cannot remove genre: ${genreToRemove}`);
    }
  }, [onGenreRemove, track.id]);

  useEffect(() => {
    if (!waveformContainerRef.current || !fullAudioUrl) {
        if (!fullAudioUrl && track.audioFile) { 
            console.error(`[TrackItem ${track.id}] Invalid audio URL construction.`);
            setError("Invalid audio URL");
        }
      return;
    }

    console.log(`[TrackItem ${track.id}] Creating WS instance for URL: ${fullAudioUrl}`);
    setError(null); 
    setIsWsReady(false); 

    const ws = WaveSurfer.create({
      container: waveformContainerRef.current,
      url: fullAudioUrl, 
      waveColor: 'rgb(200, 150, 255)',
      progressColor: 'rgb(100, 50, 150)',
      height: 50,
      cursorWidth: 1,
      barWidth: 2,
      barGap: 1,
    });
    wavesurferRef.current = ws; 

    const handleReady = () => {
      console.log(`[TrackItem ${track.id}] WS Ready.`);
      setIsWsReady(true);
    };

    const handleError = (err: Error) => {
      console.error(`[TrackItem ${track.id}] WS Error:`, err);
      setError(err.message || 'Unknown WaveSurfer error');
      setIsWsReady(false); 
    };

    const handleFinish = () => {
      console.log(`[TrackItem ${track.id}] WS Finished.`);
      notifyTrackFinished(track.id); 
    };

    ws.on('ready', handleReady);
    ws.on('error', handleError);
    ws.on('finish', handleFinish);

    return () => {
      console.log(`[TrackItem ${track.id}] Destroying WS instance.`);
      ws.un('ready', handleReady); 
      ws.un('error', handleError);
      ws.un('finish', handleFinish);
      ws.destroy(); 
      wavesurferRef.current = null; 
      setIsWsReady(false);
    };
  }, [track.id, fullAudioUrl, notifyTrackFinished]);


  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws || !isWsReady) return;
    if (isThisTrackPlayingGlobally) {
      if (!ws.isPlaying()) {
        console.log(`[TrackItem ${track.id}] Received PLAY command from context.`);
        ws.play().catch(e => console.error(`[TrackItem ${track.id}] Error on context play():`, e));
      }
    }

    else {
      if (ws.isPlaying()) {
        console.log(`[TrackItem ${track.id}] Received PAUSE command from context.`);
        ws.pause();
      }
    }
  }, [isThisTrackPlayingGlobally, isWsReady, track.id]);


  const handleEditClick = useCallback(() => onEdit(track.id), [onEdit, track.id]);
  const handleDeleteClick = useCallback(() => onDelete(track.id), [onDelete, track.id]);
  const handleUploadClick = useCallback(() => onUpload(track.id), [onUpload, track.id]);
  const handleDeleteFileClick = useCallback(() => onDeleteFile(track.id), [onDeleteFile, track.id]);
  const handleSelectChange = useCallback(() => onSelectToggle(track.id), [onSelectToggle, track.id]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = defaultCover;
  }, []);

  const handlePlayPauseClick = useCallback(() => {
    if (!fullAudioUrl) {
        console.warn(`[TrackItem ${track.id}] No audio file URL.`);
        return;
    }

    if (!isWsReady && !error) {
        console.warn(`[TrackItem ${track.id}] Play/Pause clicked but WS not ready yet.`);

        return;
    }
    if (error) {
        console.error(`[TrackItem ${track.id}] Cannot play/pause due to WS error: ${error}`);
        return;
    }

    console.log(`[TrackItem ${track.id}] Play/Pause button clicked. Currently playing globally: ${isThisTrackPlayingGlobally}`);

    if (isThisTrackPlayingGlobally) {
      requestPause(track.id); 
    } else {
      requestPlay(track.id); 
    }
  }, [track.id, fullAudioUrl, isThisTrackPlayingGlobally, requestPlay, requestPause, isWsReady, error]);

  return (
    <div
      className={`track-item ${isSelected ? 'selected' : ''} ${isThisTrackPlayingGlobally ? 'active' : ''}`}
      data-testid={`track-item-${track.id}`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleSelectChange}
        className="track-item-checkbox"
        data-testid={`track-checkbox-${track.id}`}
        aria-label={`Select track ${track.title}`}
      />

      <img
        src={imageUrl}
        alt={`Cover for ${track.title}`}
        className="track-item-cover"
        onError={handleImageError}
      />

      <div className="track-item-content">
        <div className="track-item-main-info">
          <div className="track-info">
            {track.audioFile && (
              <button
                onClick={handlePlayPauseClick}
                className={`play-pause-button ${isThisTrackPlayingGlobally ? 'playing' : 'paused'}`}
                disabled={!isWsReady && !error}
                data-testid={isThisTrackPlayingGlobally ? `pause-button-${track.id}` : `play-button-${track.id}`}
                aria-label={isThisTrackPlayingGlobally ? 'Pause' : 'Play'}
                title={isThisTrackPlayingGlobally ? 'Pause' : 'Play'}
              >
                {isThisTrackPlayingGlobally ? '❚❚' : '▶'}
              </button>
            )}
            <span data-testid={`track-item-${track.id}-artist`}>{track.artist}</span>
            {' - '}
            <span data-testid={`track-item-${track.id}-title`}>{track.title}</span>
            {track.album && (
              <span className="track-album">({track.album})</span>
            )}
          </div>

          <div className="track-actions">
             <button onClick={handleEditClick} data-testid={`edit-track-${track.id}`} className="button-edit">Edit</button>
             <button onClick={handleDeleteClick} data-testid={`delete-track-${track.id}`} className="button-delete">Delete</button>
             {track.audioFile ? (
               <button onClick={handleDeleteFileClick} data-testid={`delete-track-file-${track.id}`} className="button-delete-file">Delete File</button>
             ) : (
               <button onClick={handleUploadClick} data-testid={`upload-track-${track.id}`} className="button-upload">Upload</button>
             )}
          </div>
        </div>

        <div className="track-genres">
          {track.genres && track.genres.length > 0 ? (
            track.genres.map((genre) => (
              <GenreTag key={genre} genre={genre} 
              onRemove={handleInternalGenreRemove}
              />
            ))
          ) : (
            <span className="no-genres">No genres specified</span>
          )}
        </div>

  
        {track.audioFile && (
          <div
              ref={waveformContainerRef}
              className="waveform-container"
              data-testid={`waveform-${track.id}`}
              data-ui-test-id={`audio-progress-${track.id}`}
              style={{ marginTop: '10px', minHeight: '52px' }}
          >
            {!isWsReady && !error && <div className="waveform-status">Loading waveform...</div>}
            {error && <div className="waveform-status waveform-error">Error: {error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(TrackItem);