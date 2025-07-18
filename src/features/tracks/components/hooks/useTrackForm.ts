import { useState, useEffect, useCallback, FormEvent } from 'react';
import { NewTrackDataSchema, NewTrackData } from '../../../../types/track';

export type TrackFormData = NewTrackData & { id?: string };

interface FormErrors {
  title?: string;
  artist?: string;
  coverImage?: string;
  genres?: string;
  album?: string;
}

interface UseTrackFormProps {
  initialData?: Partial<TrackFormData>;
  onSubmit: (formData: NewTrackData) => void;
}

export const useTrackForm = ({ initialData = {}, onSubmit }: UseTrackFormProps) => {
  const [formData, setFormData] = useState<TrackFormData>({
    title: initialData.title ?? '',
    artist: initialData.artist ?? '',
    album: initialData.album ?? '',
    coverImage: initialData.coverImage ?? '',
    genres: initialData.genres ?? [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const { id, title, artist, album, coverImage, genres } = initialData;

  useEffect(() => {
    setFormData({
      title: title ?? '',
      artist: artist ?? '',
      album: album ?? '',
      coverImage: coverImage ?? '',
      genres: genres ?? [],
    });
    setErrors({});
  }, [id, title, artist, album, coverImage, genres]);

  const validateForm = useCallback(() => {
    const dataToValidate = {
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      album: formData.album?.trim() ?? undefined,
      coverImage: formData.coverImage?.trim() ?? undefined,
      genres: formData.genres,
    };

    const validationResult = NewTrackDataSchema.safeParse(dataToValidate);

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
  }, [formData]);

  const handleInputChange = useCallback((name: string, value: string) => {
    const key = name as keyof FormErrors;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[key]) {
      setErrors((prev) => {
        const { [key]: _discarded, ...rest } = prev;
        return rest;
      });
    }
  }, [errors]);

  const handleGenresChange = useCallback((genres: string[]) => {
    setFormData((prev) => ({ ...prev, genres }));
    setErrors((prev) => {
      if (prev.genres) {
        const { genres: _discarded, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      const submissionData = NewTrackDataSchema.parse({
        title: formData.title.trim(),
        artist: formData.artist.trim(),
        album: formData.album?.trim() ?? undefined,
        coverImage: formData.coverImage?.trim() ?? undefined,
        genres: formData.genres,
      });

      onSubmit(submissionData);
    }
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleGenresChange,
    handleSubmit,
  };
};