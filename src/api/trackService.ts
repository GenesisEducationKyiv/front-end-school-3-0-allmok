import axiosInstance from './axiosInstance';
import { cleanParams } from '../utils/cleanParams';

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
  GenresSchema,
} from '../types/track'; 


export interface GetTracksParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  artist?: string;
}

export const getTracks = async (params: GetTracksParams = {}): Promise<GetTracksResponse> => {
  const response = await axiosInstance.get('/tracks', { params: cleanParams(params) });
  const parsed = TracksApiResponseSchema.parse(response.data);
  return { tracks: parsed.data, meta: parsed.meta };
};

export const getGenres = async (): Promise<string[]> => {
  const response = await axiosInstance.get<unknown>('/genres');
  return GenresSchema.parse(response.data);
};


export const createTrack = async (trackData: NewTrackData): Promise<Track> => {
  const validatedData = NewTrackDataSchema.parse(trackData);
  const response = await axiosInstance.post('/tracks', validatedData);
  return TrackSchema.parse(response.data);
};


export const deleteTrack = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tracks/${id}`);
};

export const updateTrack = async (variables: { id: string, trackData: UpdateTrackData }): Promise<Track> => {
  const { id, trackData } = variables;
  const validatedData = UpdateTrackDataSchema.parse(trackData);
  const response = await axiosInstance.put(`/tracks/${id}`, validatedData);
  return TrackSchema.parse(response.data);
};

export const uploadTrackFile = async ({ id, file }: { id: string, file: File }): Promise<Track> => {
  const formData = new FormData();
  formData.append('trackFile', file);
  const response = await axiosInstance.post(`/tracks/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return TrackSchema.parse(response.data);
};
  
export const deleteTrackFile = async (id: string): Promise<Track> => {
  const response = await axiosInstance.delete(`/tracks/${id}/file`);
  return TrackSchema.parse(response.data); 
};

export const deleteMultipleTracks = async (ids: string[]): Promise<BulkDeleteResponse> => {
  const response = await axiosInstance.post('/tracks/delete', { ids });
  return BulkDeleteResponseSchema.parse(response.data);
};