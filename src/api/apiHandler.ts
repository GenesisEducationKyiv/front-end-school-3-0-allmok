import axios from 'axios';
import { z } from 'zod';
import { Result, ok, err } from 'neverthrow';
import { AppError, createApiError, createValidationError, createUnknownError, createNotFoundError } from '../types/errors';

interface ApiCallMessages {
  validation?: string;
  notFound?: string; 
  api?: string;
  unknown?: string;
}

/**
 * @param error 
 * @param messages
 * @param entityInfo
 */
function analyzeApiError(error: unknown, messages: ApiCallMessages, entityInfo?: { id?: string, type?: string }): AppError {
  if (error instanceof z.ZodError) {
    console.error("Zod validation error:", error.format());
    return createValidationError(messages.validation ?? "Incorrect data format.", error);
  }

  if (axios.isAxiosError(error) && error.response) {
    const { status, data } = error.response;
    
    if (status === 404 && messages.notFound) {
      return createNotFoundError(messages.notFound, entityInfo?.type ?? 'Entity', entityInfo?.id);
    }
    
    return createApiError(
      messages.api ?? `Error API: ${status}`,
      status,
      data
    );
  }

  if (error instanceof Error) {
    return createUnknownError(messages.unknown ?? `Error: ${error.message}`, error);
  }
  
  return createUnknownError(messages.unknown ?? "An unknown error occurred.", error);
}

/**
 * @param apiCall
 * @param messages 
 * @param entityInfo 
 * @returns
 */

export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  messages: ApiCallMessages,
  entityInfo?: { id?: string, type?: string }
): Promise<Result<T, AppError>> {
  try {
    const result = await apiCall();
    return ok(result);
  } catch (error) {
    console.error(`API Call Failed [${messages.unknown ?? 'Unknown Operation'}]`, error);
    const appError = analyzeApiError(error, messages, entityInfo);
    return err(appError);
  }
}