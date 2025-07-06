import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { DELETE_MULTIPLE_TRACKS } from '../../../../graphql/mutations';
import { BulkDeleteResponse } from '../../../../types/track'; 

interface BulkOperationsOptions {
  refetchOptions: object;
  onSuccess: () => void;
  onError: (error: Error, context: string) => void;
}

export const useTrackBulkOperations = ({ refetchOptions, onSuccess, onError }: BulkOperationsOptions) => {
  const [bulkDeleteMutation, { loading: isBulkDeleting }] = useMutation<BulkDeleteResponse>(DELETE_MULTIPLE_TRACKS, {
    ...refetchOptions,
    onCompleted: (data) => {
      const { success, failed } = data.deleteTracks;
      toast.success(`${success.length} track(s) deleted successfully.`);
      if (failed.length > 0) {
        toast.error(`Failed to delete ${failed.length} track(s).`);
      }
      onSuccess();
    },
    onError: (error) => onError(error, 'bulk delete tracks'),
  });

  return {
    bulkDelete: (ids: string[]) => bulkDeleteMutation({ variables: { ids } }),
    isBulkDeleting,
  };
};