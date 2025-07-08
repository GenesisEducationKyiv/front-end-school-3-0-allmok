import { createContext } from 'react';

export interface AudioPlayerContextType {
  playingTrackId: string | null;
  isPlaying: boolean;
  requestPlay: (trackId: string) => void;
  requestPause: (trackId: string) => void;
  notifyTrackFinished: (trackId: string) => void;
}
 
export const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);