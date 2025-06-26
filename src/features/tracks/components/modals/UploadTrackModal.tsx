import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import Modal from '../../../../components/modal/Modal'; 
import { Track } from '../../../../types/track';
import '../../../../css/TrackForm.css'; 

interface TrackUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (id: string, file: File) => Promise<void> | void;
  trackToUpload: Track | null; 
  isLoading: boolean; 
}

const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3']; 
const MAX_FILE_SIZE_MB = 15; 
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const TrackUploadModal: React.FC<TrackUploadModalProps> = ({
    isOpen,
    onClose,
    onUpload,
    trackToUpload,
    isLoading
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); 
    const audioRef = useRef<HTMLAudioElement>(null); 

    useEffect(() => {
        let objectUrl: string | null = null;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        if (selectedFile) {
            objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null); 
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [selectedFile, isOpen]); 

    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setError(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; 
            }
        }
    }, [isOpen]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null); 
        setSelectedFile(null);

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
                setError(`Invalid file type. Allowed types: ${ALLOWED_AUDIO_TYPES.join(', ')}`);
                e.target.value = ''; 
                return;
            }
            if (file.size > MAX_FILE_SIZE_BYTES) {
                setError(`File too large. Maximum size: ${MAX_FILE_SIZE_MB} MB.`);
                e.target.value = ''; 
                return;
            }


            setSelectedFile(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            setError("Please select a file.");
            return;
        }
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setError(null);
        if (trackToUpload) {
            onUpload(trackToUpload.id, selectedFile);
        }
    };
    if (!isOpen || !trackToUpload) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} data-testid="upload-track-modal">
            <h2>Upload Audio File</h2>
            <p>
                Track: <strong>{trackToUpload.title} - {trackToUpload.artist}</strong>
            </p>
            <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="audioFile">Select audio file:</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="audioFile"
                        name="audioFile"
                        accept={ALLOWED_AUDIO_TYPES.join(',')} 
                        onChange={handleFileChange}
                        data-testid="input-audio-file" 
                        required
                        disabled={isLoading} 
                    />
                    {error && <p className="error-message" data-testid="error-audio-file">{error}</p>}
                </div>

                {previewUrl && (
                    <div className="audio-preview" style={{ marginTop: '15px', marginBottom: '15px' }}>
                        <p style={{ marginBottom: '5px' }}>Preview:</p>
                        <audio
                            ref={audioRef}
                            controls
                            src={previewUrl}
                            data-testid={`audio-preview-${trackToUpload.id}`} 
                            style={{ width: '100%' }} 
                        >
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}


                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={!selectedFile || isLoading} 
                        data-testid="submit-upload-button" 
                    >
                        {isLoading ? 'Uploading...' : 'Upload to Server'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading} 
                        data-testid="cancel-upload-button"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}