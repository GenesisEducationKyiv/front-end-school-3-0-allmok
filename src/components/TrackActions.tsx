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
  const handleEditClick = useCallback(() => onEdit(trackId), [onEdit, trackId]);
  const handleDeleteClick = useCallback(
    () => onDelete(trackId),
    [onDelete, trackId]
  );
  const handleUploadClick = useCallback(
    () => onUpload(trackId),
    [onUpload, trackId]
  );
  const handleDeleteFileClick = useCallback(
    () => onDeleteFile(trackId),
    [onDeleteFile, trackId]
  );

  return (
    <div className="track-actions">
      <button
        onClick={handleEditClick}
        data-testid={`edit-track-${trackId}`}
        className="button-edit"
      >
        Edit
      </button>
      <button
        onClick={handleDeleteClick}
        data-testid={`delete-track-${trackId}`}
        className="button-delete"
      >
        Delete
      </button>
      {hasAudioFile ? (
        <button
          onClick={handleDeleteFileClick}
          data-testid={`delete-track-file-${trackId}`}
          className="button-delete-file"
        >
          Delete File
        </button>
      ) : (
        <button
          onClick={handleUploadClick}
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