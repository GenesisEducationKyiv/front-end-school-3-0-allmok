import React, {
  useCallback,
  memo,
  useState,
  useRef,
  useEffect,
  lazy,
  Suspense,
} from "react";
import clsx from "clsx";
import { Track } from "../../../types/track";
import { useAudioPlayer } from "../../../features/tracks/components/hooks/useAudioPlayer";
import { useWaveSurfer } from "../../tracks/components/hooks/useWaveSurfer";
import { getAbsoluteFileUrl } from "../../../utils/url";
import TrackImage from "../../../components/TrackImage";
import TrackInfo from "../../../components/TrackInfo";
import TrackActions from '../../../components/TrackActions';
import TrackGenres from "../../../components/TrackGenres";

const TrackWaveform = lazy(() => import("../../../components/TrackWaveform"));

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
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const {
    playingTrackId,
    isPlaying,
    requestPlay,
    requestPause,
    notifyTrackFinished,
  } = useAudioPlayer();

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsIntersecting(true);
      }
    },
    [],
  );

  useEffect(() => {
    const currentRef = itemRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "200px",
    });

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection]);

  const isThisTrackPlayingGlobally =
    playingTrackId === trackToUpload.id && isPlaying;
  const fullAudioUrl = getAbsoluteFileUrl(trackToUpload.audioFile);

  const {
    setWaveformContainer,
    isReady: isWsReady,
    error,
  } = useWaveSurfer({
    audioUrl: fullAudioUrl,
    trackId: trackToUpload.id,
    onFinish: notifyTrackFinished,
    isPlaying: isThisTrackPlayingGlobally,
    enabled: isIntersecting,
  });

  const handleSelectChange = useCallback(() => {
    onSelectToggle(trackToUpload.id);
  }, [onSelectToggle, trackToUpload.id]);


  return (
    <md-outlined-card
      ref={itemRef}
      className={clsx('track-item-card', { 'selected': isSelected, 'active': isThisTrackPlayingGlobally })}
      data-testid={`track-item-${trackToUpload.id}`}
    >
      <div className="track-item-grid">
        <div className="track-item-selection">
          <md-checkbox
            checked={isSelected}
            onClick={handleSelectChange} 
            aria-label={`Select track ${trackToUpload.title}`}
          />
        </div>

        <div className="track-item-cover">
           <TrackImage
              imageUrl={trackToUpload.coverImage}
              trackTitle={trackToUpload.title}
              trackId={trackToUpload.id}
            />
        </div>

        <div className="track-item-info">
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
        </div>
        
        <div className="track-item-actions">
           <TrackActions
                trackId={trackToUpload.id}
                hasAudioFile={!!trackToUpload.audioFile}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpload={onUpload}
                onDeleteFile={onDeleteFile}
            />
        </div>

        <div className="track-item-genres">
            <TrackGenres
              trackId={trackToUpload.id}
              genres={trackToUpload.genres || []}
              onGenreRemove={onGenreRemove}
            />
        </div>

        {trackToUpload.audioFile && isIntersecting && (
           <div className="track-item-waveform">
              <Suspense>
                 <TrackWaveform
                    trackId={trackToUpload.id}
                    waveformContainerRef={setWaveformContainer}
                    isReady={isWsReady}
                    error={error}
                 />
              </Suspense>
           </div>
        )}
      </div>
    </md-outlined-card>
  );
};

export default memo(TrackItem);
