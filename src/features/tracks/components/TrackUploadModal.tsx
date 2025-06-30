import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Track } from '../../../types/track';
import Modal from '../../../components/modal/Modal';

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetStates = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  const handleClose = () => {
    resetStates();
    onClose();
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    const maxSizeInBytes = 15 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please select an MP3 or WAV file.');
      e.target.value = '';
      return;
    }

    if (file.size > maxSizeInBytes) {
      setError(`File is too large (max ${maxSizeInBytes / 1024 / 1024}MB).`);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    onUpload(selectedFile);
  };

  if (!isOpen || !trackToUpload) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2>Upload Audio File</h2>
      <p>
        For track: <strong>{trackToUpload.title}</strong> by{' '}
        <strong>{trackToUpload.artist}</strong>
      </p>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="audioFile">Select an audio file:</label>
          <input
            type="file"
            id="audioFile"
            name="audioFile"
            accept="audio/mpeg,audio/wav,audio/mp3"
            onChange={handleFileChange}
            required
            disabled={isLoading}
          />
          {error && <p className="error-message">{error}</p>}
        </div>
        {previewUrl && (
          <div className="audio-preview" style={{ marginTop: '15px' }}>
            <p>Preview:</p>
            <audio controls src={previewUrl} style={{ width: '100%' }}>
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        <div className="form-actions">
          <button type="button" onClick={handleClose} disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" disabled={!selectedFile || isLoading}>
            {isLoading ? 'Uploading...' : 'Upload & Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TrackUploadModal;