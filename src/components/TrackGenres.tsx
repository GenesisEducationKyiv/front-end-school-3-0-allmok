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
  const handleInternalGenreRemove = useCallback(
    (genreToRemove: string) => {
      if (typeof onGenreRemove === "function") {
        onGenreRemove(trackId, genreToRemove);
      } else {
        console.warn(
          `[TrackGenres ${trackId}] onGenreRemove is not a function. Cannot remove genre: ${genreToRemove}`
        );
      }
    },
    [onGenreRemove, trackId]
  );

  return (
    <div className="track-genres">
      {genres && genres.length > 0 ? (
        genres.map((genre) => (
          <GenreTag
            key={genre}
            genre={genre}
            onRemove={handleInternalGenreRemove}
          />
        ))
      ) : (
        <span className="no-genres">No genres specified</span>
      )}
    </div>
  );
};

export default memo(TrackGenres);