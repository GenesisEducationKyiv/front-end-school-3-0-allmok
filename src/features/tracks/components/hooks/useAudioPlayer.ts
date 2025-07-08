import { useContext } from 'react';
import { AudioPlayerContext, AudioPlayerContextType } from '../../../../contexts/audioPlayerContext.types';

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer should be used inside AudioPlayerProvider');
  }
  return context;
};