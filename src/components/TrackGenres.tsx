import React, { useCallback, memo } from "react";
import GenreTag from "../components/GenreTag/GenreTag";

interface TrackGenresProps {
  trackId: string;
  genres: string[];
  onGenreRemove: (trackId: string, genreToRemove: string) => void;
}

const TrackGenres: React.FC<TrackGenresProps> = ({
  trackId,
  genres,
  onGenreRemove,
}) => {

  const handleInternalGenreRemove = useCallback((genreToRemove: string) => {
    onGenreRemove(trackId, genreToRemove);
  }, [trackId, onGenreRemove]);

  if (!genres?.length) {
    return (
      <div className="track-genres">
        <span className="no-genres">No genres specified</span>
      </div>
    );
  }

  return (
    <div className="track-genres">
      {genres.map((genre) => (
        <GenreTag
          key={genre}
          genre={genre}
          onRemove={handleInternalGenreRemove}
        />
      ))}
    </div>
  );
};

export default memo(TrackGenres);