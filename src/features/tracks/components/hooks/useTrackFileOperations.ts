import { useState } from 'react';
import { useMutation, FetchResult } from '@apollo/client';
import { DELETE_TRACK_FILE } from '../../../../graphql/mutations';
import { FileUploadService } from '../../../../stores/fileUploadStore';
import { UpdateTrackData } from '../../../../types/track';

type UpdateTrackMutationFn = (
  options: {
    variables: {
      id: string;
      input: UpdateTrackData;
    };
  }
) => Promise<FetchResult>; 

interface FileOperationsOptions {
  refetchOptions: object;
  onSuccess: (message: string) => void;
  onError: (error: Error, context: string) => void;
  updateTrackMutation: UpdateTrackMutationFn;
}

export const useTrackFileOperations = ({ 
  refetchOptions, 
  onSuccess, 
  onError, 
  updateTrackMutation 
}: FileOperationsOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileUploadService = FileUploadService.getInstance();

  const [deleteFileMutation, { loading: isDeletingFile }] = useMutation(DELETE_TRACK_FILE, {
    ...refetchOptions,
    onCompleted: () => onSuccess('Audio file deleted successfully!'),
    onError: (error) => onError(error, 'delete audio file'),
  });

  const uploadFile = async (id: string, file: File) => {
    if (!id) {
      onError(new Error("Track ID is missing"), 'upload file');
      return;
    }

    setIsUploading(true);
    try {
      const result = await fileUploadService.uploadFile(file);
      await updateTrackMutation({
        variables: { id, input: { audioFile: result.filename } },
      });
    } catch (error) {
      onError(error as Error, 'upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    deleteFile: (id: string) => deleteFileMutation({ variables: { id } }),
    isUploading,
    isDeletingFile,
  };
};