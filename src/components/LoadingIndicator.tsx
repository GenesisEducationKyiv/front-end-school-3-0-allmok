import React from 'react';

interface LoadingIndicatorProps {
  'data-testid'?: string; 
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = (props) => {
  return (
    <div className="loading-spinner" data-testid={props['data-testid'] ?? "loading-indicator"}>
      loading...
    </div>
  );
};

export default LoadingIndicator;