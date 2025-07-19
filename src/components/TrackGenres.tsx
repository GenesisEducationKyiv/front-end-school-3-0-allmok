import React, { useCallback, memo } from "react";
import { RemovableChip } from "./RemovableChip"; 
import "../css/GenreTag.css"; 

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
      <md-chip-set>
        {genres.map((genre) => (
          <RemovableChip
            key={genre}
            genre={genre}
            onRemove={handleInternalGenreRemove}
          />
        ))}
      </md-chip-set>
    </div>
  );
};

export default memo(TrackGenres);