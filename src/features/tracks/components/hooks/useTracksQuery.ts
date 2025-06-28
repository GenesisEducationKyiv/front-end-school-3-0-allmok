import { useQuery } from '@apollo/client';
import { GET_TRACKS, GET_GENRES } from '../../../../graphql/queries';
import { useApiParams } from '../../../tracks/components/hooks/useFilters';


export const useTracksQuery = () => {
  const apiParams = useApiParams();
  
  return useQuery(GET_TRACKS, {
    variables: { input: apiParams },
    notifyOnNetworkStatusChange: true,
  });
};

export const useGenresQuery = () => {
    return useQuery(GET_GENRES);
};