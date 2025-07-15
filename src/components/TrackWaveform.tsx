import React, { memo } from "react";
import LoadingIndicator from './LoadingIndicator';

interface TrackWaveformProps {
  trackId: string;
  waveformContainerRef: React.RefObject<HTMLDivElement | null>;
  isReady: boolean;
  error: string | null;
}

const TrackWaveform: React.FC<TrackWaveformProps> = ({
  trackId,
  waveformContainerRef,
  isReady,
  error,
}) => {
  return (
    <div
      ref={waveformContainerRef}
      className="waveform-container" 
      data-testid={`waveform-${trackId}`}
    >

      {!isReady && !error && (
        <div className="waveform-loading-state">
          <LoadingIndicator />
        </div>
      )}

      {error && (
        <div className="waveform-error-state">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default memo(TrackWaveform);