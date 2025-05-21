import { useState, useCallback } from 'react';
import {createTrack, deleteTrack, updateTrack, uploadTrackFile, deleteTrackFile, deleteMultipleTracks} from '../../../../api/trackService'; 
import { TrackFormData } from '../../../../features/tracks/components/TrackForm'; 
import { UpdateTrackData } from '../../../../types/track';
import toast from 'react-hot-toast';

interface MutationCallbacks {
    onSuccess?: (operation: string, data?: any) => void;
    onError?: (operation: string, message: string) => void;
}

export const useTrackMutations = ({ onSuccess, onError }: MutationCallbacks = {}) => {
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeletingFile, setIsDeletingFile] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const handleApiCall = async <T,>(apiFn: (...args: any[]) => Promise<T>, setLoading: (loading: boolean) => void, operationName: string, ...args: any[]) => {
        setLoading(true);
        try {
          const result = await apiFn(...args);
          toast.success(`${operationName.charAt(0).toUpperCase() + operationName.slice(1)} successful!`);
          onSuccess?.(operationName, result); 
          return result;
        } catch (err) {
          const message = err instanceof Error ? err.message : `Failed to ${operationName}`;
          console.error(`${operationName} error:`, err);
          toast.error(`Error during ${operationName}: ${message}`);
          onError?.(operationName, message);
          return null;
        } finally {
          setLoading(false);
        }
      };

    const handleCreate = useCallback(
        (data: TrackFormData) => handleApiCall(createTrack, setIsSubmitting, 'create', data),
        [onSuccess, onError]
    );

    const handleUpdate = useCallback(
        (id: string, data: UpdateTrackData) => handleApiCall(updateTrack, setIsSubmitting, 'update', id, data),
        [onSuccess, onError]
    );

    const handleDelete = useCallback(
        (id: string) => handleApiCall(deleteTrack, setIsDeleting, 'delete', id),
        [onSuccess, onError]
    );

    const handleUpload = useCallback(
        (id: string, file: File) => handleApiCall(uploadTrackFile, setIsUploading, 'upload', id, file),
        [onSuccess, onError]
    );

    const handleDeleteFile = useCallback(
        (id: string) => handleApiCall(deleteTrackFile, setIsDeletingFile, 'deleteFile', id),
        [onSuccess, onError]
    );

     const handleBulkDelete = useCallback(
        (ids: string[]) => handleApiCall(deleteMultipleTracks, setIsBulkDeleting, 'bulkDelete', ids),
        [onSuccess, onError]
    );

    const isAnyLoading = isSubmitting || isDeleting || isUploading || isDeletingFile || isBulkDeleting;

    return {
        mutationState: {
            isSubmitting,
            isDeleting,
            isUploading,
            isDeletingFile,
            isBulkDeleting,
            isAnyLoading,
        },
        mutationHandlers: {
            handleCreate,
            handleUpdate,
            handleDelete,
            handleUpload,
            handleDeleteFile,
            handleBulkDelete,
        },
    };
};

