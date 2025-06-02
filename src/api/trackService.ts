import axios from 'axios';
import axiosInstance from './axiosInstance';
import { z } from 'zod'; 
import {
  Track,
  GetTracksResponse,
  NewTrackData,
  UpdateTrackData,
  BulkDeleteResponse,
  TrackSchema,
  TracksApiResponseSchema, 
  BulkDeleteResponseSchema,
  NewTrackDataSchema,
  UpdateTrackDataSchema,
 // GetTracksResponseSchema, 
} from '../types/track'; 

import { Result, ok, err } from 'neverthrow'; 
import { AppError, createApiError, createValidationError, createNotFoundError, createUnknownError } from '../types/errors'; 

export interface GetTracksParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  artist?: string;
}


interface ErrorResponse {
  error?: string;
  message?: string;
}

class TrackService {
  private handleAxiosError(err: unknown, defaultMessage: string): string {
    if (err instanceof z.ZodError) {
        return `Invalid data: ${err.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ')}`;
    }
    
    if (axios.isAxiosError(err)) {
        const axiosErr = err;
        const responseData = axiosErr.response?.data as ErrorResponse | string | undefined;
        
        if (responseData && typeof responseData === 'object') {
            return responseData.error ?? 
                   responseData.message ?? 
                   JSON.stringify(responseData) ?? 
                   axiosErr.message;
        } else if (typeof responseData === 'string') {
            return responseData;
        }
        
        return axiosErr.message;
    } else if (err instanceof Error) {
        return err.message;
    }
    
    return defaultMessage;
  }

  private cleanParams<T extends Record<string, unknown>>(params: T): Partial<T> {
    const cleaned: Partial<T> = {};
    
    (Object.entries(params) as [keyof T, T[keyof T]][]).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            cleaned[key] = value;
        }
    });
    
    return cleaned;
  }

  public async getTracks(params: GetTracksParams = {}): Promise<GetTracksResponse> {
    try {
        const response = await axiosInstance.get<unknown>('/tracks', {
            params: this.cleanParams(params),
        });
        const parsedApiResponse = TracksApiResponseSchema.parse(response.data);
        return { tracks: parsedApiResponse.data, meta: parsedApiResponse.meta };
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error('Zod validation error (getTracks):', err.formErrors.fieldErrors);
            throw new Error(`Failed to download tracks: Invalid data format. ${err.errors.map(e => e.message).join(', ')}`);
        }
        const message = this.handleAxiosError(err, 'Failed to download tracks.');
        console.error('getTracks error:', err);
        throw new Error(message);
    }
  }

  public async createTrack(trackData: NewTrackData): Promise<Track> {
    try {
        const validatedData = NewTrackDataSchema.parse(trackData);
        const response = await axiosInstance.post<unknown>('/tracks', validatedData);
        return TrackSchema.parse(response.data);
    } catch (err) {
        if (err instanceof z.ZodError) { 
            console.error('Zod validation error (createTrack):', err.formErrors.fieldErrors);
            throw new Error(`Track creation error: Invalid data. ${err.errors.map(e => e.message).join(', ')}`);
        }
        const message = this.handleAxiosError(err, 'Track creation error.');
        console.error('createTrack error:', err);
        throw new Error(message);
    }
  }

  public async deleteTrack(id: string): Promise<void> {
    try {
        await axiosInstance.delete(`/tracks/${id}`);
    } catch (err) {
        const message = this.handleAxiosError(err, `Track deletion error ${id}.`);
        console.error(`deleteTrack(${id}) error:`, err);
        throw new Error(message);
    }
  }

  public async updateTrack(id: string, trackData: UpdateTrackData): Promise<Track> {
    try {
        const validatedData = UpdateTrackDataSchema.parse(trackData);
        const response = await axiosInstance.put<unknown>(`/tracks/${id}`, validatedData);
        return TrackSchema.parse(response.data); 
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error('Zod validation error (updateTrack):', err.formErrors.fieldErrors);
            throw new Error(`Track update error ${id}: Invalid data. ${err.errors.map(e => e.message).join(', ')}`);
        }
        const message = this.handleAxiosError(err, `Track update error ${id}.`);
        console.error(`updateTrack(${id}) error:`, err);
        throw new Error(message);
    }
  }

  public async uploadTrackFile(id: string, file: File): Promise<Track> {
    const formData = new FormData();
    formData.append('trackFile', file);
    try {
        const response = await axiosInstance.post<unknown>( 
            `/tracks/${id}/upload`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return TrackSchema.parse(response.data);
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error('Zod validation error (uploadTrackFile):', err.formErrors.fieldErrors);
            throw new Error(`File upload error for track ${id}: Invalid response data. ${err.errors.map(e => e.message).join(', ')}`);
        }
        const message = this.handleAxiosError(err, `Failed to load file for track ${id}.`);
        console.error(`uploadTrackFile(${id}) error:`, err);
        throw new Error(message);
    }
  }

  public async deleteTrackFile(id: string): Promise<Track> {
    try {
        const response = await axiosInstance.delete<unknown>(`/tracks/${id}/file`);
        return TrackSchema.parse(response.data); 
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error('Zod validation error (deleteTrackFile):', err.formErrors.fieldErrors);
            throw new Error(`Error deleting file for track ${id}: Invalid response data. ${err.errors.map(e => e.message).join(', ')}`);
        }
        const message = this.handleAxiosError(err, `Error deleting a track file ${id}.`);
        console.error(`deleteTrackFile(${id}) error:`, err);
        throw new Error(message);
    }
  }

  public async deleteMultipleTracks(ids: string[]): Promise<BulkDeleteResponse> {
    try {
        const response = await axiosInstance.post<unknown>('/tracks/delete', { ids }); 
        return BulkDeleteResponseSchema.parse(response.data); 
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error('Zod validation error (deleteMultipleTracks):', err.formErrors.fieldErrors);
            throw new Error(`Error deleting multiple tracks: Invalid response data. ${err.errors.map(e => e.message).join(', ')}`);
        }
        const message = this.handleAxiosError(err, `Error deleting multiple tracks.`);
        console.error(`deleteMultipleTracks error:`, err);
        throw new Error(message);
    }
  }
}

const trackService = new TrackService();
export default trackService;

export const getTracks = async (params: GetTracksParams = {}): Promise<Result<GetTracksResponse, AppError>> => {
    const cleanParams = <T extends Record<string, unknown>>(p: T): Partial<T> => {
        const cleaned: Partial<T> = {};
        
        (Object.entries(p) as [keyof T, T[keyof T]][]).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                cleaned[key] = value;
            }
        });
        
        return cleaned;
    };

    try {
        const response = await axiosInstance.get<unknown>('/tracks', { 
            params: cleanParams(params),
        });
        const parsedServerResponse = TracksApiResponseSchema.parse(response.data);
        const resultForHook: GetTracksResponse = {
            tracks: parsedServerResponse.data, 
            meta: parsedServerResponse.meta,
        };

        return ok(resultForHook);

    } catch (error) {
        console.error('getTracks error:', error);
        if (error instanceof z.ZodError) {
            console.error('Zod validation details:', error.format());
            return err(createValidationError("Invalid data format for tracks list.", error));
        }
        if (axios.isAxiosError(error)) {
            if (error.response) {
                return err(createApiError(
                    `Failed to download tracks: ${error.response.status}`,
                    error.response.status,
                    error.response.data
                ));
            }
            return err(createApiError(`Network error fetching tracks: ${error.message}`, undefined, error));
        }
        return err(createUnknownError('Failed to download tracks.', error));
    }
};

export const createTrack = async (trackData: NewTrackData): Promise<Result<Track, AppError>> => {
    try {
        const validatedData = NewTrackDataSchema.parse(trackData);
        const response = await axiosInstance.post<unknown>('/tracks', validatedData);
        const parsedTrack = TrackSchema.parse(response.data);
        return ok(parsedTrack);
    } catch (error) {
        console.error('createTrack error:', error);
        if (error instanceof z.ZodError) {
            return err(createValidationError("Invalid track data provided or received.", error));
        }
        if (axios.isAxiosError(error) && error.response) {
            return err(createApiError(`Track creation error: ${error.response.status}`, error.response.status, error.response.data));
        }
        return err(createUnknownError('Track creation error.', error));
    }
};

export const deleteTrack = async (id: string): Promise<Result<void, AppError>> => {
    try {
        await axiosInstance.delete(`/tracks/${id}`);
        return ok(undefined); 
    } catch (error) {
        console.error(`deleteTrack(${id}) error:`, error);
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 404) {
                return err(createNotFoundError(`Track with ID ${id} not found.`, 'Track', id));
            }
            return err(createApiError(`Track deletion error ${id}: ${error.response.status}`, error.response.status, error.response.data));
        }
        return err(createUnknownError(`Track deletion error ${id}.`, error));
    }
};

export const updateTrack = async (id: string, trackData: UpdateTrackData): Promise<Result<Track, AppError>> => {
    try {
        const validatedData = UpdateTrackDataSchema.parse(trackData);
        const response = await axiosInstance.put<unknown>(`/tracks/${id}`, validatedData);
        const parsedTrack = TrackSchema.parse(response.data);
        return ok(parsedTrack);
    } catch (error) {
        console.error(`updateTrack(${id}) error:`, error);
        if (error instanceof z.ZodError) {
            return err(createValidationError(`Invalid track data for update or received. ID: ${id}`, error));
        }
        if (axios.isAxiosError(error) && error.response) {
             if (error.response.status === 404) {
                return err(createNotFoundError(`Track with ID ${id} not found for update.`, 'Track', id));
            }
            return err(createApiError(`Track update error ${id}: ${error.response.status}`, error.response.status, error.response.data));
        }
        return err(createUnknownError(`Track update error ${id}.`, error));
    }
};

export const uploadTrackFile = async (id: string, file: File): Promise<Result<Track, AppError>> => {
    const formData = new FormData();
    formData.append('trackFile', file);
    try {
        const response = await axiosInstance.post<unknown>(
            `/tracks/${id}/upload`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        const parsedTrack = TrackSchema.parse(response.data);
        return ok(parsedTrack);
    } catch (error) {
        console.error(`uploadTrackFile(${id}) error:`, error);
        if (error instanceof z.ZodError) return err(createValidationError('Invalid track data after file upload.', error));
        if (axios.isAxiosError(error) && error.response) return err(createApiError('File upload failed.', error.response.status, error.response.data));
        return err(createUnknownError('File upload failed.', error));
    }
};

export const deleteTrackFile = async (id: string): Promise<Result<Track, AppError>> => {
    try {
        const response = await axiosInstance.delete<unknown>(`/tracks/${id}/file`);
        const parsedTrack = TrackSchema.parse(response.data);
        return ok(parsedTrack);
    } catch (error) {
        console.error(`deleteTrackFile(${id}) error:`, error);
        if (error instanceof z.ZodError) return err(createValidationError('Invalid track data after file deletion.', error));
        if (axios.isAxiosError(error) && error.response) return err(createApiError('File deletion failed.', error.response.status, error.response.data));
        return err(createUnknownError('File deletion failed.', error));
    }
};

export const deleteMultipleTracks = async (ids: string[]): Promise<Result<BulkDeleteResponse, AppError>> => {
    try {
        const response = await axiosInstance.post<unknown>('/tracks/delete', { ids });
        const parsedResponse = BulkDeleteResponseSchema.parse(response.data);
        return ok(parsedResponse);
    } catch (error) {
        console.error(`deleteMultipleTracks error:`, error);
        if (error instanceof z.ZodError) return err(createValidationError('Invalid response for bulk delete.', error));
        if (axios.isAxiosError(error) && error.response) return err(createApiError('Bulk delete failed.', error.response.status, error.response.data));
        return err(createUnknownError('Bulk delete failed.', error));
    }
};