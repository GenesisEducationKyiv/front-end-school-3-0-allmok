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
  setWaveformContainer: (node: HTMLDivElement | null) => void;
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
  const [containerNode, setContainerNode] = useState<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReady = useCallback(() => setIsReady(true), []);
  const handleError = useCallback((err: Error) => {
    logger.error(`[useWaveSurfer ${trackId}] WS Error:`, err);
    setError(err.message || 'Unknown WaveSurfer error');
    setIsReady(false);
  }, [trackId]);

   const handleFinish = useCallback(() => {
    onFinish(trackId);
    const ws = wavesurferRef.current;
    if (ws) {
      ws.seekTo(1);
    }
  }, [onFinish, trackId]); 



  useEffect(() => {
    if (enabled && containerNode && audioUrl) {
      setError(null);
      setIsReady(false);

      const ws = WaveSurfer.create({
        container: containerNode,
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
        ws.destroy();
        wavesurferRef.current = null;
      };
    } else {
      return; 
    }
  }, [containerNode, audioUrl, enabled, handleReady, handleError, handleFinish]);

  useEffect(() => {
    const ws = wavesurferRef.current;
    if (ws && isReady) {
      if (isPlaying) {
        if (!ws.isPlaying()) ws.play().catch(e => logger.error(`[useWaveSurfer ${trackId}] Error on context play():`, e));
      } else {
        if (ws.isPlaying()) ws.pause();
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
    setWaveformContainer: setContainerNode,
    isReady,
    error,
    playTrack,
    pauseTrack
  };
};