/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axiosInstance from '../api/axiosInstance'; 
import trackService, { GetTracksParams } from '../api/trackService';
import { Track, TracksApiResponse, NewTrackData, UpdateTrackData, Meta } from '../types/track';

vi.mock('../api/axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

const mockedAxiosInstance = axiosInstance as vi.Mocked<typeof axiosInstance>;

describe('TrackService', () => {
  const mockTrack: Track = {
    id: 't1', title: 'Test Track', artist: 'Test Artist', genres: ['Pop'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  const mockMeta: Meta = { totalItems: 1, total: 1, page: 1, limit: 10, totalPages: 1 };
  const mockApiResponse: TracksApiResponse = { data: [mockTrack], meta: mockMeta };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('getTracks should fetch tracks successfully', async () => {
    mockedAxiosInstance.get.mockResolvedValue({ data: mockApiResponse });

    const params: GetTracksParams = { page: 1, limit: 10, sort: 'title', order: 'asc' };
    const result = await trackService.getTracks(params);

    expect(mockedAxiosInstance.get).toHaveBeenCalledTimes(1);
    expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/tracks', {
      params: { page: 1, limit: 10, sort: 'title', order: 'asc' }
    });
    expect(result.tracks).toEqual([mockTrack]);
    expect(result.meta).toEqual(mockMeta);
  });

  it('getTracks should handle API error', async () => {
    const error = {
        response: { data: { message: 'Server error' }, status: 500 },
        isAxiosError: true,
        message: 'Request failed with status code 500'
    };
    mockedAxiosInstance.get.mockRejectedValue(error);
    await expect(trackService.getTracks()).rejects.toThrow('Server error');
  });

  it('createTrack should send POST request and return created track', async () => { 
    const newTrackData: NewTrackData = { title: 'New Song', artist: 'New Artist', genres: ['Rock'] };
    const createdTrack: Track = { ...newTrackData, id: 't2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockedAxiosInstance.post.mockResolvedValue({ data: createdTrack });

    const result = await trackService.createTrack(newTrackData);

    expect(mockedAxiosInstance.post).toHaveBeenCalledTimes(1);
    expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/tracks', newTrackData);
    expect(result).toEqual(createdTrack);
  });

  it('deleteTrack should send DELETE request', async () => {
      mockedAxiosInstance.delete.mockResolvedValue({}); 
      await trackService.deleteTrack('1');
      expect(mockedAxiosInstance.delete).toHaveBeenCalledTimes(1);
      expect(mockedAxiosInstance.delete).toHaveBeenCalledWith('/tracks/1');
  });

  it('updateTrack should send PUT request and return updated track', async () => {
    const updateData: UpdateTrackData = { title: 'Updated Title' };
    const updatedTrack: Track = { ...mockTrack, title: 'Updated Title' }; 
    mockedAxiosInstance.put.mockResolvedValue({ data: updatedTrack });

    const result = await trackService.updateTrack(mockTrack.id, updateData); 

    expect(mockedAxiosInstance.put).toHaveBeenCalledTimes(1);
    expect(mockedAxiosInstance.put).toHaveBeenCalledWith(`/tracks/${mockTrack.id}`, updateData);
    expect(result).toEqual(updatedTrack);
  });

  it('uploadTrackFile should send POST request with FormData', async () => {
    const file = new File(['(⌐□_□)'], 'track.mp3', { type: 'audio/mpeg' });
    const updatedTrack: Track = { ...mockTrack, audioFile: 'track-t1.mp3' };
    mockedAxiosInstance.post.mockResolvedValue({ data: updatedTrack });

    const result = await trackService.uploadTrackFile(mockTrack.id, file);

    expect(mockedAxiosInstance.post).toHaveBeenCalledTimes(1);
    const callArgs = mockedAxiosInstance.post.mock.calls[0];
    expect(callArgs[0]).toBe(`/tracks/${mockTrack.id}/upload`);
    expect(callArgs[1]).toBeInstanceOf(FormData);
    expect((callArgs[1] as FormData).get('trackFile')).toBe(file);
    expect(callArgs[2]).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } });
    expect(result).toEqual(updatedTrack);
  });

   it('deleteTrackFile should send DELETE request for file', async () => {
    const updatedTrack: Track = { ...mockTrack, audioFile: undefined };
    mockedAxiosInstance.delete.mockResolvedValue({ data: updatedTrack });

    const result = await trackService.deleteTrackFile(mockTrack.id);

    expect(mockedAxiosInstance.delete).toHaveBeenCalledTimes(1);
    expect(mockedAxiosInstance.delete).toHaveBeenCalledWith(`/tracks/${mockTrack.id}/file`);
    expect(result).toEqual(updatedTrack);
  });

  it('deleteMultipleTracks should send POST request with ids', async () => {
    const ids = ['t1', 't3'];
    const responseData = { success: ['t1'], failed: ['t3'] };
    mockedAxiosInstance.post.mockResolvedValue({ data: responseData });

    const result = await trackService.deleteMultipleTracks(ids);

    expect(mockedAxiosInstance.post).toHaveBeenCalledTimes(1);
    expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/tracks/delete', { ids });
    expect(result).toEqual(responseData);
  });

});