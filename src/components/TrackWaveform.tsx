import React, { memo, lazy, Suspense } from "react";

interface TrackWaveformProps {
  trackId: string;
  waveformContainerRef: React.RefObject<HTMLDivElement | null>;
  isReady: boolean;
  error: string | null;
}

const LazyWaveformComponent = lazy(() => 
  Promise.resolve({
    default: ({ trackId, waveformContainerRef, isReady, error }: TrackWaveformProps) => (
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
    )
  })
);

const TrackWaveform: React.FC<TrackWaveformProps> = (props) => {
  return (
    <Suspense fallback={<div className="waveform-loading">Loading waveform...</div>}>
      <LazyWaveformComponent {...props} />
    </Suspense>
  );
};

export default memo(TrackWaveform);