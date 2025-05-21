import axios, { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';
import { Track, TracksApiResponse, Meta, NewTrackData, UpdateTrackData } from '../types/track';

//(GET /tracks)
export interface GetTracksParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';    
  search?: string;
  genre?: string; 
  artist?: string;  
}

export interface GetTracksResponse {
  tracks: Track[];
  meta: Meta;
}

export interface BulkDeleteResponse {
  success: string[];
  failed: string[];
}


class TrackService {
  /**
   * @param err 
   * @param defaultMessage 
   * @returns 
   */
  private handleAxiosError(err: unknown, defaultMessage: string): string {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<any>;
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

  /**
   * Clearing a parameter object from empty values
   * @param params
   * @returns
   */
  private cleanParams<T>(params: T): Partial<T> {
    const cleaned: Partial<T> = {};
    Object.entries(params as any).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        (cleaned as any)[key] = value;
      }
    });
    return cleaned;
  }

  /**
   * Get a list of tracks from the server
   * @param params 
   * @returns 
   */
  public async getTracks(params: GetTracksParams = {}): Promise<GetTracksResponse> {
    try {
      const response = await axiosInstance.get<TracksApiResponse>('/tracks', {
        params: this.cleanParams(params),
      });
      const { data, meta } = response.data;
      return { tracks: data, meta };
    } catch (err) {
      const message = this.handleAxiosError(err, 'Failed to download tracks.');
      console.error('getTracks error:', err);
      throw new Error(message);
    }
  }

  /**
   * Create a new track
   * @param trackData 
   * @returns 
   */
  public async createTrack(trackData: NewTrackData): Promise<Track> {
    try {
      const response = await axiosInstance.post<Track>('/tracks', trackData);
      return response.data;
    } catch (err) {
      const message = this.handleAxiosError(err, 'Track creation error.');
      console.error('createTrack error:', err);
      throw new Error(message);
    }
  }

  /**
   * Delete track by ID
   * @param id 
   */
  public async deleteTrack(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/tracks/${id}`);
    } catch (err) {
      const message = this.handleAxiosError(err, `Track deletion error ${id}.`);
      console.error(`deleteTrack(${id}) error:`, err);
      throw new Error(message);
    }
  }

  /**
   * Update track data
   * @param id 
   * @param trackData 
   * @returns 
   */
  public async updateTrack(id: string, trackData: UpdateTrackData): Promise<Track> {
    try {
      const response = await axiosInstance.put<Track>(`/tracks/${id}`, trackData);
      return response.data;
    } catch (err) {
      const message = this.handleAxiosError(err, `Track update error ${id}.`);
      console.error(`updateTrack(${id}) error:`, err);
      throw new Error(message);
    }
  }

  /**
   * Upload an audio file for the track
   * @param id
   * @param file 
   * @returns 
   */
  public async uploadTrackFile(id: string, file: File): Promise<Track> {
    const formData = new FormData();
    formData.append('trackFile', file);

    try {
      const response = await axiosInstance.post<Track>(
        `/tracks/${id}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch (err) {
      const message = this.handleAxiosError(err, `Failed to load file for track ${id}.`);
      console.error(`uploadTrackFile(${id}) error:`, err);
      throw new Error(message);
    }
  }

  /**
   * Delete a track audio file
   * @param id 
   * @returns
   */
  public async deleteTrackFile(id: string): Promise<Track> {
    try {
      const response = await axiosInstance.delete<Track>(`/tracks/${id}/file`);
      return response.data;
    } catch (err) {
      const message = this.handleAxiosError(err, `Error deleting a track file ${id}.`);
      console.error(`deleteTrackFile(${id}) error:`, err);
      throw new Error(message);
    }
  }

  /**
   * Delete multiple tracks at once
   * @param ids 
   * @returns 
   */
  public async deleteMultipleTracks(ids: string[]): Promise<BulkDeleteResponse> {
    try {
      const response = await axiosInstance.post<BulkDeleteResponse>('/tracks/delete', { ids });
      return response.data;
    } catch (err) {
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