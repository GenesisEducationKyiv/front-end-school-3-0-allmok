import axiosInstance from './axiosInstance';
import { safeApiCall } from './apiHandler';
import { parseResponse } from '../utils/apiUtils';
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
} from '../types/track'; 

import { Result } from 'neverthrow'; 
import { AppError } from '../types/errors'; 

export interface GetTracksParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  artist?: string;
}

export const getTracks = (params: GetTracksParams = {}): Promise<Result<GetTracksResponse, AppError>> => {
  return safeApiCall(
    async () => {
      const parsed = await parseResponse(
        axiosInstance.get('/tracks', { params: cleanParams(params) }),
        TracksApiResponseSchema
      );
      return { tracks: parsed.data, meta: parsed.meta };
    },
    {
      validation: "Invalid track list format received.",
      unknown: "Could not download tracks."
    }
  );
};

export const createTrack = (trackData: NewTrackData): Promise<Result<Track, AppError>> => {
  return safeApiCall(
    async () => {
      const validatedData = NewTrackDataSchema.parse(trackData);
      return await parseResponse(
        axiosInstance.post('/tracks', validatedData),
        TrackSchema
      );
    },
    {
      validation: "Incorrect data was provided for track creation.",
      unknown: "Track creation error."
    }
  );
};

export const deleteTrack = (id: string): Promise<Result<void, AppError>> => {
  return safeApiCall(
    async () => {
      await axiosInstance.delete(`/tracks/${id}`);
      return undefined; 
    },
    {
      notFound: `Track with ID ${id} not found.`,
      unknown: `Track deletion error ${id}.`
    },
    { id, type: 'Track' } 
  );
};

export const updateTrack = (id: string, trackData: UpdateTrackData): Promise<Result<Track, AppError>> => {
  return safeApiCall(
    async () => {
      const validatedData = UpdateTrackDataSchema.parse(trackData);
      return await parseResponse(
        axiosInstance.put(`/tracks/${id}`, validatedData),
        TrackSchema
      );
    },
    {
      validation: `Incorrect data for track update ${id}.`,
      notFound: `Track with ID ${id} not found to update.`,
      unknown: `Track update error ${id}.`
    },
    { id, type: 'Track' }
  );
};

export const uploadTrackFile = (id: string, file: File): Promise<Result<Track, AppError>> => {
  return safeApiCall(
    async () => {
      const formData = new FormData();
      formData.append('trackFile', file);
      return await parseResponse(
        axiosInstance.post(
          `/tracks/${id}/upload`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        ),
        TrackSchema
      );
    },
    {
      validation: `Invalid response from the server after uploading the file.`,
      api: `Failed to upload file for track.`,
      unknown: `Unknown error while uploading the file.`
    },
    { id, type: 'Track' }
  );
};
  
export const deleteTrackFile = (id: string): Promise<Result<Track, AppError>> => {
  return safeApiCall(
    async () => {
      return await parseResponse(
        axiosInstance.delete(`/tracks/${id}/file`),
        TrackSchema
      );
    },
    {
      validation: `Invalid response from the server after deleting the file.`,
      notFound: `The file or track with ID ${id} was not found to delete.`,
      api: `Could not delete the track file.`,
      unknown: `Unknown error while deleting the file.`
    },
    { id, type: 'Track' }
  );
};

export const deleteMultipleTracks = (ids: string[]): Promise<Result<BulkDeleteResponse, AppError>> => {
  return safeApiCall(
    async () => {
      return await parseResponse(
        axiosInstance.post('/tracks/delete', { ids }),
        BulkDeleteResponseSchema
      );
    },
    {
      validation: `Incorrect server response on mass deletion of tracks.`,
      api: `Unable to delete selected tracks.`,
      unknown: `Unknown error during mass deletion of tracks.`
    }
  );
};