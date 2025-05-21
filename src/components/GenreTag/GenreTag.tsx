import React from 'react';
import '../../css/GenreTag.css';

interface GenreTagProps {
  genre: string;
  onRemove?: (genre: string) => void;
}

const GenreTag: React.FC<GenreTagProps> = ({ genre, onRemove }) => {
  const getGenreClass = (genreName: string): string => {
    const sanitized = genreName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    return `genre-${sanitized}`;
  };
  const genreSpecificClass = getGenreClass(genre);
  const className = `genre-tag ${genreSpecificClass} ${onRemove ? 'removable' : ''}`; 

  const handleRemoveClick = (e: React.MouseEvent) => {
      e.stopPropagation(); 
      onRemove?.(genre);
  };

  return (
    <span className={className} data-testid={`genre-tag-${genre}`}>
      {genre}
      {onRemove && (
        <button
  type="button"
  className="genre-tag-remove"
  onClick={handleRemoveClick}
  aria-label={`Remove genre ${genre}`} 
  data-testid={`remove-genre-${genre}`} 
>
  × 
</button>
      )}
    </span>
  );
};

export default GenreTag;