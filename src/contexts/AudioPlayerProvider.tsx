import React, { useState, ReactNode, useCallback } from 'react';
import { AudioPlayerContext } from './audioPlayerContext.types';
  
interface AudioPlayerProviderProps {
  children: ReactNode;
}
  
export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  const requestPlay = useCallback((trackId: string) => {
    console.log(`[Context] Request Play: ${trackId}`);
    if (trackId === playingTrackId && !isPlaying) {
      setIsPlaying(true);
    } else {
      setPlayingTrackId(trackId);
      setIsPlaying(true);
    }
  }, [playingTrackId, isPlaying]); 

  const requestPause = useCallback((trackId: string) => {
    if (trackId === playingTrackId && isPlaying) {
      console.log(`[Context] Request Pause: ${trackId}`);
      setIsPlaying(false);
    } else {
      console.log(`[Context] Request Pause ignored for non-playing/different track: ${trackId}`);
    }
  }, [playingTrackId, isPlaying]); 

  const notifyTrackFinished = useCallback((trackId: string) => {
    if (trackId === playingTrackId) {
      console.log(`[Context] Track Finished notification: ${trackId}`);
      setPlayingTrackId(null);
      setIsPlaying(false);
    }
  }, [playingTrackId]); 
  
  const value = {
    playingTrackId,
    isPlaying,
    requestPlay,
    requestPause,
    notifyTrackFinished,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};