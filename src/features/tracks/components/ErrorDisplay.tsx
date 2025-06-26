import React from 'react';
import { AppError } from '../../../types/errors';

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
}

const renderErrorDetails = (error: AppError) => {
  switch (error.type) {
    case 'ApiError':
      return (
        <>
          <p>Status Code: {error.statusCode}</p>
          {error.originalError && <pre>{JSON.stringify(error.originalError, null, 2)}</pre>}
        </>
      );
    case 'ValidationError':
      return <p>Please check the data you provided.</p>;
    case 'NotFoundError':
      return <p>Resource: {error.resourceName} (ID: {error.resourceId}) was not found.</p>;
    case 'UnknownError':
      return <p>An unexpected error occurred. Please try again later.</p>;
    default:
      return null;
  }
};

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="error-display" role="alert">
      <h2>Something Went Wrong</h2>
      <p className="error-message">{error.message}</p>
      <div className="error-details">
        {renderErrorDetails(error)}
      </div>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;