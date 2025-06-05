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

const TrackForm: React.FC<TrackFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  availableGenres = [],
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [artist, setArtist] = useState(initialData.artist || '');
  const [album, setAlbum] = useState(initialData.album || '');
  const [coverImage, setCoverImage] = useState(initialData.coverImage || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialData.genres || []);
  const [genreToAdd, setGenreToAdd] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});



  const validateForm = (): boolean => {
    const formDataToValidate = {
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || undefined, 
      coverImage: coverImage.trim() || undefined, 
      genres: selectedGenres,
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
    if (name === 'title') setTitle(value);
    if (name === 'artist') setArtist(value);
    if (name === 'album') setAlbum(value);
    if (name === 'coverImage') setCoverImage(value);
    if (errors[name as keyof FormErrors]) {
       setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleGenreSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setGenreToAdd(e.target.value);
  };

  const handleAddGenre = () => {
    if (genreToAdd && !selectedGenres.includes(genreToAdd)) {
      setSelectedGenres([...selectedGenres, genreToAdd]);
      setGenreToAdd('');
       if (errors.genres) { 
         setErrors(prev => {
           const { genres, ...rest } = prev;
           return rest;
         });
       }
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setSelectedGenres(selectedGenres.filter(g => g !== genreToRemove));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const formData: TrackFormData = NewTrackDataSchema.parse({
          title: title.trim(),
          artist: artist.trim(),
          album: album.trim() || undefined,
          coverImage: coverImage.trim() || undefined,
          genres: selectedGenres,
      });
      onSubmit(formData);
    } else {
      console.log("Validation failed:", errors);
    }
  };

  const genresForSelect = availableGenres.filter(g => !selectedGenres.includes(g));



  useEffect(() => {
    console.log("TrackForm useEffect triggered with initialData:", initialData); // Для дебагу
    setTitle(initialData?.title || '');
    setArtist(initialData?.artist || '');
    setAlbum(initialData?.album || '');
    setCoverImage(initialData?.coverImage || '');
    setSelectedGenres(initialData?.genres || []);
    setErrors({});
  }, [
    initialData?.id,
  ]);

  return (
    <form onSubmit={handleSubmit} data-testid="track-form" noValidate>
      <div className="form-group">
        <label htmlFor="title">Track name *</label>
        <input
          type="text" id="title" name="title" value={title} onChange={handleInputChange}
          data-testid="input-title" aria-required="true" aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "error-title" : undefined}
        />
        {errors.title && <p id="error-title" className="error-message" data-testid="error-title">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="artist">Artist *</label>
        <input
          type="text" id="artist" name="artist" value={artist} onChange={handleInputChange}
          data-testid="input-artist" aria-required="true" aria-invalid={!!errors.artist}
          aria-describedby={errors.artist ? "error-artist" : undefined}
        />
        {errors.artist && <p id="error-artist" className="error-message" data-testid="error-artist">{errors.artist}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="album">Album</label>
        <input
          type="text" id="album" name="album" value={album} onChange={handleInputChange}
          data-testid="input-album"
        />
      </div>

      <div className="form-group">
        <label htmlFor="coverImage">Link to the cover (URL)</label>
        <input
          type="url" id="coverImage" name="coverImage" value={coverImage} onChange={handleInputChange}
          placeholder="https://example.com/image.jpg" data-testid="input-cover-image"
          aria-invalid={!!errors.coverImage}
          aria-describedby={errors.coverImage ? "error-cover-image" : undefined}
        />
         {errors.coverImage && <p id="error-cover-image" className="error-message" data-testid="error-cover-image">{errors.coverImage}</p>}
      </div>

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
         {errors.genres && <p className="error-message" data-testid="error-genre">{errors.genres}</p>}
        <div className="genre-adder" data-testid="genre-selector">
          <select value={genreToAdd} onChange={handleGenreSelectChange} disabled={genresForSelect.length === 0}>
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
        <button type="button" onClick={onCancel} disabled={isLoading} data-loading={isLoading} aria-disabled={isLoading}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TrackForm;