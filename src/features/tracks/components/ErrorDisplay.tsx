import React from 'react';
import './ErrorDisplay.css'; 

interface ErrorDisplayProps {
  error: Error | null;
  context?: string;
  onRetry?: () => void; 
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, context, onRetry }) => {
  if (!error) {
    return null;
  }

  const errorMessage = error.message || 'An unknown error occurred.';

  return (
    <div className="error-display" role="alert">
      <h4 className="error-title">
        {context ? `Error ${context}` : 'An Error Occurred'}
      </h4>
      <p className="error-message">{errorMessage}</p>
      {onRetry && (
        <button className="error-retry-button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;