import React, { memo } from "react";

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
      data-ui-test-id={`audio-progress-${trackId}`}
    >
      {!isReady && !error && (
        <div className="waveform-status">Loading waveform...</div>
      )}
      {error && (
        <div className="waveform-status waveform-error">Error: {error}</div>
      )}
    </div>
  );
};

export default memo(TrackWaveform);