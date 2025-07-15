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
      case 'edit': onEdit(trackId); break;
      case 'delete': onDelete(trackId); break;
      case 'upload': onUpload(trackId); break;
      case 'deleteFile': onDeleteFile(trackId); break;
    }
  }, [trackId, onEdit, onDelete, onUpload, onDeleteFile]);

  return (
    <div className="track-actions">
      <md-icon-button
        onClick={() => handleAction('edit')}
        data-testid={`edit-track-${trackId}`}
        aria-label="Edit track details"
        title="Edit"
      >
        <md-icon>edit</md-icon>
      </md-icon-button>
      
      <md-icon-button
        onClick={() => handleAction('delete')}
        data-testid={`delete-track-${trackId}`}
        className="button-error"
        aria-label="Delete track"
        title="Delete"
      >
        <md-icon>delete</md-icon>
      </md-icon-button>
      
      {hasAudioFile ? (
        <md-icon-button
          onClick={() => handleAction('deleteFile')}
          data-testid={`delete-track-file-${trackId}`}
          className="button-error"
          aria-label="Delete audio file"
          title="Delete File"
        >
          <md-icon>file_upload_off</md-icon>
        </md-icon-button>
      ) : (
        <md-icon-button
          onClick={() => handleAction('upload')}
          data-testid={`upload-track-${trackId}`}
          aria-label="Upload audio file"
          title="Upload"
        >
          <md-icon>upload</md-icon>
        </md-icon-button>
      )}
    </div>
  );
};

export default memo(TrackActions);