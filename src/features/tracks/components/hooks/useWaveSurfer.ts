import { useRef, useEffect, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { logger } from '../../../../utils/logger';

interface UseWaveSurferOptions {
  audioUrl: string | null;
  trackId: string;
  onFinish: (trackId: string) => void;
  isPlaying: boolean;
  enabled?: boolean;
}

interface UseWaveSurferReturn {
  waveformContainerRef: React.RefObject<HTMLDivElement | null>;
  isReady: boolean;
  error: string | null;
  playTrack: () => Promise<void>;
  pauseTrack: () => void;
}

export const useWaveSurfer = ({
  audioUrl,
  trackId,
  onFinish,
  isPlaying,
  enabled = true,
}: UseWaveSurferOptions): UseWaveSurferReturn => {
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const handleError = useCallback((err: Error) => {
    logger.error(`[useWaveSurfer ${trackId}] WS Error:`, err);
    setError(err.message || 'Unknown WaveSurfer error');
    setIsReady(false);
  }, [trackId]);

  const handleFinish = useCallback(() => {
    onFinish(trackId);
  }, [onFinish, trackId]);

  useEffect(() => {
    if (!enabled || !waveformContainerRef.current || !audioUrl) {
      if (!audioUrl && trackId && enabled) {
        logger.error(`[useWaveSurfer ${trackId}] Invalid audio URL construction.`);
        setError("Invalid audio URL");
      }
      return;
    }

    setError(null);
    setIsReady(false);

    const ws = WaveSurfer.create({
      container: waveformContainerRef.current,
      url: audioUrl,
      waveColor: 'rgb(200, 150, 255)',
      progressColor: 'rgb(100, 50, 150)',
      height: 50,
      cursorWidth: 1,
      barWidth: 2,
      barGap: 1,
    });

    wavesurferRef.current = ws;

    ws.on('ready', handleReady);
    ws.on('error', handleError);
    ws.on('finish', handleFinish);

    return () => {
      ws.un('ready', handleReady);
      ws.un('error', handleError);
      ws.un('finish', handleFinish);
      ws.destroy();
      wavesurferRef.current = null;
      setIsReady(false);
    };
  }, [trackId, audioUrl, enabled, handleReady, handleError, handleFinish]);

  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws || !isReady) return;

    if (isPlaying) {
      if (!ws.isPlaying()) {
        ws.play().catch(e => logger.error(`[useWaveSurfer ${trackId}] Error on context play():`, e));
      }
    } else {
      if (ws.isPlaying()) {
        ws.pause();
      }
    }
  }, [isPlaying, isReady, trackId]);

  const playTrack = useCallback(async (): Promise<void> => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    
    try {
      await ws.play();
    } catch (e) {
      logger.error(`[useWaveSurfer ${trackId}] Error playing track:`, e);
    }
  }, [trackId]);

  const pauseTrack = useCallback((): void => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    ws.pause();
  }, []);

  return {
    waveformContainerRef,
    isReady,
    error,
    playTrack,
    pauseTrack
  };
};