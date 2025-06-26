import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import { Track } from '../../../types/track';
import Modal from '../../../components/modal/Modal'; 

interface TrackUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  trackToUpload: Track | null; 
  isLoading: boolean;
}

const TrackUploadModal: React.FC<TrackUploadModalProps> = ({
    isOpen, onClose, onUpload, trackToUpload, isLoading
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        let objectUrl: string | null = null;

        if (selectedFile) {
            objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
            console.log("Created preview URL:", objectUrl);
        } else {
            setPreviewUrl(null);
        }

        return () => {
            if (objectUrl) {
                console.log("Revoking preview URL:", objectUrl);
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [selectedFile]); 

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setSelectedFile(null); 
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
            const maxSizeInBytes = 10 * 1024 * 1024;
            if (!allowedTypes.includes(file.type)) {
                setError(`Invalid file type...`);
                e.target.value = '';
                return;
            }
            if (file.size > maxSizeInBytes) {
                setError(`File is too large...`);
                e.target.value = '';
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !trackToUpload) return;
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setError(null);
        try {
           await onUpload(selectedFile);
           onClose();
        } catch (uploadError) {
           setError(uploadError instanceof Error ? `Upload error: ${uploadError.message}` : 'An unknown error occurred.');
        }
    }

    if (!isOpen || !trackToUpload) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Download and Listen </h2>
            <p>Трек: <strong>{trackToUpload.title} - {trackToUpload.artist}</strong></p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="audioFile">Select file: </label>
                    <input
                        type="file"
                        id="audioFile"
                        name="audioFile"
                        accept="audio/mpeg, audio/wav, audio/ogg"
                        onChange={handleFileChange}
                        data-testid="input-audio-file"
                        required
                    />
                     {error && <p className="error-message" data-testid="error-audio-file">{error}</p>}
                </div>

                {previewUrl && (
                    <div className="audio-preview" style={{ marginTop: '15px' }}>
                        <p>Pre-listening: </p>
                        <audio
                            ref={audioRef} 
                            controls 
                            src={previewUrl} 
                            data-testid={`audio-preview-${trackToUpload.id}`} 
                        >
                            Your browser does not support the element <code>audio</code>.
                        </audio>
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" disabled={!selectedFile || isLoading} data-testid="submit-upload-button">
                        {isLoading ? 'Loading...' : 'Upload to server'}
                    </button>
                    <button type="button" onClick={onClose} disabled={isLoading}>
                        Close
                    </button>
                </div>
            </form>
        </Modal>
    );
}
export default TrackUploadModal;