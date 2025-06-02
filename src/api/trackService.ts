import axios from 'axios';
import axiosInstance from './axiosInstance';
import { z } from 'zod'; 
import {
  Track,
 // TracksApiResponse,
 // Meta,
  NewTrackData,
  UpdateTrackData,
  BulkDeleteResponse, 
  TrackSchema,
  TracksApiResponseSchema,
  BulkDeleteResponseSchema,
  NewTrackDataSchema,
  UpdateTrackDataSchema,
  GetTracksResponse, 
} from '../types/track'; 

export interface GetTracksParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  artist?: string;
}
class TrackService {
  private handleAxiosError(err: unknown, defaultMessage: string): string {
    if (err instanceof z.ZodError) {
        return `Invalid data: ${err.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ')}`;
    }
	if (axios.isAxiosError(err)) {
  	    const axiosErr = err;
  	    return axiosErr.response?.data?.error ||
             	axiosErr.response?.data?.message ||
             	(axiosErr.response?.data && typeof axiosErr.response.data === 'string'
               	? axiosErr.response.data
               	: JSON.stringify(axiosErr.response?.data)) ||
             	axiosErr.message;
	} else if (err instanceof Error) {
  	    return err.message;
	}
	return defaultMessage;
  }

  private cleanParams<T>(params: T): Partial<T> {
	const cleaned: Partial<T> = {};
	Object.entries(params as any).forEach(([key, value]) => {
  	    if (value !== undefined && value !== null && value !== '') {
        	(cleaned as any)[key] = value;
  	    }
	});
	return cleaned;
  }

  public async getTracks(params: GetTracksParams = {}): Promise<GetTracksResponse> {
	try {
  	    const response = await axiosInstance.get<unknown>('/tracks', { // <unknown>
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

export const getTracks = trackService.getTracks.bind(trackService);
export const createTrack = trackService.createTrack.bind(trackService);
export const deleteTrack = trackService.deleteTrack.bind(trackService);
export const updateTrack = trackService.updateTrack.bind(trackService);
export const uploadTrackFile = trackService.uploadTrackFile.bind(trackService);
export const deleteTrackFile = trackService.deleteTrackFile.bind(trackService);
export const deleteMultipleTracks = trackService.deleteMultipleTracks.bind(trackService);