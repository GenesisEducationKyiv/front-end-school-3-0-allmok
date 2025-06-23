import { useQuery } from '@tanstack/react-query';
import { getTracks, getGenres } from '../../../../api/trackService';
import { useApiFilters } from '../../../../stores/useFilterStore';
import { GetTracksResponse } from '../../../../types/track'; 

export const trackKeys = {
  all: ['tracks'] as const,
  lists: () => [...trackKeys.all, 'list'] as const,
  list: (filters: object) => [...trackKeys.lists(), filters] as const,
  details: () => [...trackKeys.all, 'detail'] as const,
  detail: (id: string) => [...trackKeys.details(), id] as const,
};

export const genreKeys = {
    all: ['genres'] as const,
};

export const useTracksQuery = () => {
  const filters = useApiFilters();
  
  return useQuery<GetTracksResponse, Error>({ 
    queryKey: trackKeys.list(filters),
    queryFn: () => getTracks(filters),
  });
};

export const useGenresQuery = () => {
    return useQuery<string[], Error>({
        queryKey: genreKeys.all,
        queryFn: getGenres,
        staleTime: 1000 * 60 * 5, 
    });
};