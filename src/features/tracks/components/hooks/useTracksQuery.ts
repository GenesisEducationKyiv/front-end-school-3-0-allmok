import { useQuery } from '@apollo/client';
import { GET_TRACKS, GET_GENRES } from '../../../../graphql/queries';
import { useApiParams } from './useFilters';
import { GetTracksQueryData, GetGenresQueryData } from '../../../../types/track';


export const useTracksQuery = <TData = GetTracksQueryData>() => {
  const apiParams = useApiParams();
  
  return useQuery<TData>(GET_TRACKS, {
    variables: { input: apiParams },
    notifyOnNetworkStatusChange: true,
  });
};

export const useGenresQuery = <TData = GetGenresQueryData>() => {
    return useQuery<TData>(GET_GENRES);
};