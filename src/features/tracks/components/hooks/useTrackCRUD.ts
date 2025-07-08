import { useMutation } from '@apollo/client';
import { CREATE_TRACK, UPDATE_TRACK, DELETE_TRACK } from '../../../../graphql/mutations';
import { NewTrackData, UpdateTrackData } from '../../../../types/track';

interface CrudOptions {
  refetchOptions: object;
  onSuccess: (message: string) => void;
  onError: (error: Error, context: string) => void;
}


export const useTrackCRUD = ({ refetchOptions, onSuccess, onError }: CrudOptions) => {
  const [createTrackMutation, { loading: isCreating }] = useMutation(CREATE_TRACK, {
    ...refetchOptions,
    onCompleted: () => onSuccess('Track created successfully!'),
    onError: (error) => onError(error, 'create track'),
  });

  const [updateTrackMutation, { loading: isUpdating }] = useMutation(UPDATE_TRACK, {
    ...refetchOptions,
    onCompleted: () => onSuccess('Track updated successfully!'),
    onError: (error) => onError(error, 'update track'),
  });

  const [deleteTrackMutation, { loading: isDeleting }] = useMutation(DELETE_TRACK, {
    ...refetchOptions,
    onCompleted: () => onSuccess('Track deleted!'),
    onError: (error) => onError(error, 'delete track'),
  });

  return {
    createTrack: (input: NewTrackData) => createTrackMutation({ variables: { input } }),
    updateTrack: (id: string, input: UpdateTrackData) => updateTrackMutation({ variables: { id, input } }),
    deleteTrack: (id: string) => deleteTrackMutation({ variables: { id } }),
    isCreating,
    isUpdating,
    isDeleting,
    updateTrackMutation, 
  };
};