import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../../../types/track';

interface TrackUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  trackToUpload: Track | null;
  isLoading: boolean;
}

const TrackUploadModal: React.FC<TrackUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  trackToUpload,
  isLoading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dialogRef = useRef<HTMLElement & { open: boolean }>(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.open = isOpen;
    }
    if (isOpen) {
      setSelectedFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  if (!trackToUpload) return null;

  return (
    <md-dialog
      ref={dialogRef}
      onClose={onClose}
      data-testid="upload-track-modal"
    >
      <div slot="headline">Upload Audio for {trackToUpload.title}</div>
      <div slot="content">
        <p>Select an audio file to upload (e.g., MP3, WAV).</p>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          data-testid="file-input"
        />
        {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      </div>
      <div slot="actions">
        <md-text-button onClick={onClose} disabled={isLoading}>
          Cancel
        </md-text-button>
        <md-filled-button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          data-testid="upload-button"
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </md-filled-button>
      </div>
    </md-dialog>
  );
};

export default TrackUploadModal;