export interface ApiError {
    message: string; 
    statusCode?: number | undefined;  
    originalError?: unknown; 
    type: 'ApiError';
  }
  
  export interface ValidationError {
    message: string;
    originalError?: unknown;
    type: 'ValidationError';
  }
  
  export interface NotFoundError {
    message: string;
    resourceName?: string | undefined;
    resourceId?: string | undefined;
    type: 'NotFoundError';
  }
  export type AppError = ApiError | ValidationError | NotFoundError | { type: 'UnknownError', message: string, originalError?: unknown };

  export const createApiError = (message: string, statusCode?: number, originalError?: unknown): ApiError => ({
    type: 'ApiError',
    message,
    statusCode,
    originalError,
  });
  
  export const createValidationError = (message: string, originalError?: unknown): ValidationError => ({
    type: 'ValidationError',
    message,
    originalError,
  });
  
  export const createNotFoundError = (message: string, resourceName?: string, resourceId?: string): NotFoundError => ({
    type: 'NotFoundError',
    message,
    resourceName,
    resourceId
  });
  
  export const createUnknownError = (message: string, originalError?: unknown): AppError => ({
      type: 'UnknownError',
      message,
      originalError
  });