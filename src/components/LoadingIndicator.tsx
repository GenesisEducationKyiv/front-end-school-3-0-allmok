import React from 'react';

interface LoadingIndicatorProps {
  'data-testid'?: string; 
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = (props) => {
  return (
    <md-circular-progress
      indeterminate
      aria-label="Loading..."
      data-testid={props['data-testid'] ?? "loading-indicator"}
    ></md-circular-progress>
  );
};

export default LoadingIndicator;