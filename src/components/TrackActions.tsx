import React, { useCallback, memo } from "react";

interface TrackActionsProps {
  trackId: string;
  hasAudioFile: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpload: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

const TrackActions: React.FC<TrackActionsProps> = ({
  trackId,
  hasAudioFile,
  onEdit,
  onDelete,
  onUpload,
  onDeleteFile,
}) => {
  const handleAction = useCallback((action: 'edit' | 'delete' | 'upload' | 'deleteFile') => {
    switch (action) {
      case 'edit':
        onEdit(trackId);
        break;
      case 'delete':
        onDelete(trackId);
        break;
      case 'upload':
        onUpload(trackId);
        break;
      case 'deleteFile':
        onDeleteFile(trackId);
        break;
    }
  }, [trackId, onEdit, onDelete, onUpload, onDeleteFile]);

  return (
    <div className="track-actions">
      <button
        onClick={() => handleAction('edit')}
        data-testid={`edit-track-${trackId}`}
        className="button-edit"
      >
        Edit
      </button>
      
      <button
        onClick={() => handleAction('delete')}
        data-testid={`delete-track-${trackId}`}
        className="button-delete"
      >
        Delete
      </button>
      
      {hasAudioFile ? (
        <button
          onClick={() => handleAction('deleteFile')}
          data-testid={`delete-track-file-${trackId}`}
          className="button-delete-file"
        >
          Delete File
        </button>
      ) : (
        <button
          onClick={() => handleAction('upload')}
          data-testid={`upload-track-${trackId}`}
          className="button-upload"
        >
          Upload
        </button>
      )}
    </div>
  );
};

export default memo(TrackActions);