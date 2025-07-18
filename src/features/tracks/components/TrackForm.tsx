import React, { useState, useCallback } from 'react';
import '../../../css/TrackForm.css';
import { useTrackForm, TrackFormData } from '../components/hooks/useTrackForm';
import { TrackFormGenres } from '../../../components/TrackFormGenres';
import { TrackFormActions } from '../../../components/TrackFormActions';
import { NewTrackData } from '../../../types/track';

interface TrackFormProps {
  onSubmit: (formData: NewTrackData) => void;
  onCancel?: () => void;
  initialData?: Partial<TrackFormData>;
  availableGenres: string[];
  isLoading?: boolean;
  formId: string;
}

const TrackForm: React.FC<TrackFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  availableGenres,
  isLoading,
  formId,
}) => {
  const { formData, errors, handleInputChange, handleGenresChange, handleSubmit } = useTrackForm({
    initialData: initialData ?? {},
    onSubmit,
  });

 
  const [isGenreDialogOpen, setGenreDialogOpen] = useState(false);
  const isDisabled = isLoading ?? false;

  const onInputHandler = useCallback((event: Event) => {
    const target = event.target as HTMLInputElement;
    handleInputChange(target.name, target.value);
  }, [handleInputChange]);

  return (
    <form id={formId} onSubmit={handleSubmit} data-testid="track-form" noValidate className="track-form-md3">
      <md-outlined-text-field
        label="Track name *"
        name="title"
        value={formData.title}
        onInput={onInputHandler} 
        required
        error={!!errors.title}
        error-text={errors.title}
        disabled={isDisabled}
      />
      <md-outlined-text-field
        label="Artist *"
        name="artist"
        value={formData.artist}
        onInput={onInputHandler} 
        required
        error={!!errors.artist}
        error-text={errors.artist}
        disabled={isDisabled}
      />
      <md-outlined-text-field
        label="Album"
        name="album"
        value={formData.album ?? ''}
        onInput={onInputHandler} 
        disabled={isDisabled}
      />
      <md-outlined-text-field
        label="Link to the cover (URL)"
        name="coverImage"
        type="url"
        value={formData.coverImage ?? ''}
        onInput={onInputHandler} 
        error={!!errors.coverImage}
        error-text={errors.coverImage}
        disabled={isDisabled}
      />

      <TrackFormGenres
        selectedGenres={formData.genres}
        availableGenres={availableGenres}
        onGenresChange={handleGenresChange}
        error={errors.genres}
        isLoading={isDisabled}
        isDialogOpen={isGenreDialogOpen}
        setDialogOpen={setGenreDialogOpen}
      />
      <TrackFormActions
        onCancel={onCancel}
        isLoading={isDisabled}
        isEditing={!!initialData?.id}
        formId={formId}
      />
    </form>
  );
};

export default TrackForm;