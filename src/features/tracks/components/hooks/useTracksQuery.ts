import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getTracksSafe, getGenresSafe } from '../../../../api/trackService';
import { GetTracksResponse } from '../../../../types/track';
import { useApiParams } from './useFilters';
import { AppError } from '../../../../types/errors';

const queryFnWrapper = async (queryFn: () => Promise<any>) => {
  const result = await queryFn();
  if (result.isErr()) {
    throw result.error;
  }
  return result.value;
};

export const trackKeys = {
  all: ['tracks'] as const,
  lists: () => [...trackKeys.all, 'list'] as const,
  list: (filters: object) => [...trackKeys.lists(), filters] as const,
  details: () => [...trackKeys.all, 'detail'] as const,
  detail: (id: string) => [...trackKeys.details(), id] as const,
};

export const useTracksQuery = () => {
  const apiParams = useApiParams();

  return useQuery<GetTracksResponse, AppError>({
    queryKey: trackKeys.list(apiParams),
    queryFn: () => queryFnWrapper(() => getTracksSafe(apiParams)),
    placeholderData: keepPreviousData,
  });
};

export const genreKeys = {
    all: ['genres'] as const,
};


export const useGenresQuery = () => {
  return useQuery<string[], AppError>({
      queryKey: ['genres'],
      queryFn: () => queryFnWrapper(getGenresSafe),
      staleTime: 1000 * 60 * 15,
  });
};