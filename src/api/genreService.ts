import axiosInstance from './axiosInstance';
import axios from 'axios';
import { GenresSchema } from '../types/track'; 
import z from 'zod';
import { Result, ok, err } from 'neverthrow'; 
import { AppError, createApiError, createValidationError, createUnknownError } from '../types/errors'; 

export const getGenres = async (): Promise<Result<string[], AppError>> => {
  try {
    const response = await axiosInstance.get<unknown>('/genres');
    const parsedData = GenresSchema.parse(response.data);
    return ok(parsedData); 
  } catch (error) {
    console.error("Error fetching genres:", error);
    if (error instanceof z.ZodError) {
      return err(createValidationError("Invalid data format received for genres.", error));
    }
    if (axios.isAxiosError(error) && error.response) {
      return err(createApiError(
        `Failed to fetch genres: ${error.response.status} ${error.response.statusText || 'Error'}`,
        error.response.status,
        error.response.data
      ));
    }
    if (error instanceof Error) {
      return err(createUnknownError(`Failed to fetch genres: ${error.message}`, error));
    }
    return err(createUnknownError("Failed to fetch genres due to an unknown error", error));
  }
};