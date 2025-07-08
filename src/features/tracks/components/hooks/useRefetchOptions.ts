import { GET_TRACKS } from '../../../../graphql/queries';
import { useApiParams } from '../hooks/useFilters';


export const useRefetchOptions = () => {
  const apiParams = useApiParams();

  return {
    refetchQueries: [{ query: GET_TRACKS, variables: { input: apiParams } }],
    awaitRefetchQueries: true,
  };
};