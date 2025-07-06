import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import GenreTag from '../../../components/GenreTag/GenreTag';
import '../../../css/TrackForm.css';
import { NewTrackDataSchema, NewTrackData } from '../../../types/track';

export type TrackFormData = NewTrackData & { id?: string };

interface FormErrors {
  title?: string;
  artist?: string;
  coverImage?: string;
  genres?: string;
  album?: string; 
}

interface TrackFormProps {
  onSubmit: (formData: TrackFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TrackFormData>;
  availableGenres: string[];
  isLoading?: boolean;
}

interface GenreSelectorProps {
  selectedGenres: string[];
  availableGenres: string[];
  onChange: (genres: string[]) => void;
  error?: string | undefined;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({
  selectedGenres,
  availableGenres,
  onChange,
  error
}) => {
  const [genreToAdd, setGenreToAdd] = useState<string>('');

  const handleGenreSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setGenreToAdd(e.target.value);
  };

  const handleAddGenre = () => {
    if (genreToAdd && !selectedGenres.includes(genreToAdd)) {
      onChange([...selectedGenres, genreToAdd]);
      setGenreToAdd('');
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    onChange(selectedGenres.filter(g => g !== genreToRemove));
  };

  const genresForSelect = availableGenres.filter(g => !selectedGenres.includes(g));

  return (
    <div className="form-group">
      <label>Genres *</label>
      <div className="selected-genres">
        {selectedGenres.length > 0 ? (
          selectedGenres.map(genre => (
            <GenreTag key={genre} genre={genre} onRemove={handleRemoveGenre} />
          ))
        ) : (
          <p>No genre selected.</p>
        )}
      </div>
      {error && <p className="error-message" data-testid="error-genre">{error}</p>}
      <div className="genre-adder" data-testid="genre-selector">
        <select 
          value={genreToAdd} 
          onChange={handleGenreSelectChange} 
          disabled={genresForSelect.length === 0}
        >
          <option value="" disabled>-- Choose a genre --</option>
          {genresForSelect.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <button type="button" onClick={handleAddGenre} disabled={!genreToAdd}>
          Add genre(+)
        </button>
      </div>
    </div>
  );
};

const TrackForm: React.FC<TrackFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  availableGenres = [],
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title ?? '',
    artist: initialData.artist ?? '',
    album: initialData.album ?? '',
    coverImage: initialData.coverImage ?? '',
    genres: initialData.genres ?? [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const formDataToValidate = {
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      album: formData.album.trim() ?? undefined, 
      coverImage: formData.coverImage.trim() ?? undefined, 
      genres: formData.genres,
    };

    const validationResult = NewTrackDataSchema.safeParse(formDataToValidate);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const newErrors: FormErrors = {};
      if (fieldErrors.title) newErrors.title = fieldErrors.title.join(', ');
      if (fieldErrors.artist) newErrors.artist = fieldErrors.artist.join(', ');
      if (fieldErrors.coverImage) newErrors.coverImage = fieldErrors.coverImage.join(', ');
      if (fieldErrors.genres) newErrors.genres = fieldErrors.genres.join(', ');
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleGenresChange = (genres: string[]) => {
    setFormData(prev => ({ ...prev, genres }));
    if (errors.genres) {
      setErrors(prev => {
        const { genres: _genres, ...rest  } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData: TrackFormData = NewTrackDataSchema.parse({
        title: formData.title.trim(),
        artist: formData.artist.trim(),
        album: formData.album.trim() || undefined,
        coverImage: formData.coverImage.trim() || undefined,
        genres: formData.genres,
      });
      onSubmit(submissionData);
    } else {
      console.log("Validation failed:", errors);
    }
  };

  useEffect(() => {
    console.log("TrackForm useEffect triggered with initialData:", initialData);
    setFormData({
      title: initialData.title ?? '',
      artist: initialData.artist ?? '',
      album: initialData.album ?? '',
      coverImage: initialData.coverImage ?? '',
      genres: initialData.genres ?? [],
    });
    setErrors({});
  }, [
    initialData?.id,
    initialData?.title,
    initialData?.artist,
    initialData?.album,
    initialData?.coverImage,
    initialData?.genres
  ]);

  return (
    <form onSubmit={handleSubmit} data-testid="track-form" noValidate>
      <div className="form-group">
        <label htmlFor="title">Track name *</label>
        <input
          type="text" 
          id="title" 
          name="title" 
          value={formData.title} 
          onChange={handleInputChange}
          data-testid="input-title" 
          aria-required="true" 
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "error-title" : undefined}
        />
        {errors.title && <p id="error-title" className="error-message" data-testid="error-title">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="artist">Artist *</label>
        <input
          type="text" 
          id="artist" 
          name="artist" 
          value={formData.artist} 
          onChange={handleInputChange}
          data-testid="input-artist" 
          aria-required="true" 
          aria-invalid={!!errors.artist}
          aria-describedby={errors.artist ? "error-artist" : undefined}
        />
        {errors.artist && <p id="error-artist" className="error-message" data-testid="error-artist">{errors.artist}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="album">Album</label>
        <input
          type="text" 
          id="album" 
          name="album" 
          value={formData.album} 
          onChange={handleInputChange}
          data-testid="input-album"
        />
      </div>

      <div className="form-group">
        <label htmlFor="coverImage">Link to the cover (URL)</label>
        <input
          type="url" 
          id="coverImage" 
          name="coverImage" 
          value={formData.coverImage} 
          onChange={handleInputChange}
          placeholder="https://example.com/image.jpg" 
          data-testid="input-cover-image"
          aria-invalid={!!errors.coverImage}
          aria-describedby={errors.coverImage ? "error-cover-image" : undefined}
        />
        {errors.coverImage && <p id="error-cover-image" className="error-message" data-testid="error-cover-image">{errors.coverImage}</p>}
      </div>

      <GenreSelector
        selectedGenres={formData.genres}
        availableGenres={availableGenres}
        onChange={handleGenresChange}
        error={errors.genres}
      />

      <div className="form-actions">
        <button
          type="submit"
          data-testid="submit-button"
          disabled={isLoading}
          data-loading={isLoading}
          aria-disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (initialData.title ? 'Save Changes' : 'Create Track')}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={isLoading} 
          data-loading={isLoading} 
          aria-disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TrackForm;