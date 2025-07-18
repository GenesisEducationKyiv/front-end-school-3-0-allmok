import React, { useCallback } from 'react';
import { FilterDialog } from './FilterDialog';
import { RemovableChip } from './RemovableChip';


interface TrackFormGenresProps {
  selectedGenres: string[];
  availableGenres: string[];
  onGenresChange: (genres: string[]) => void;
  error: string | undefined;
  isLoading?: boolean;
  isDialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void; 
}

export const TrackFormGenres: React.FC<TrackFormGenresProps> = ({
  selectedGenres,
  availableGenres,
  onGenresChange,
  error,
  isLoading,
  isDialogOpen, 
  setDialogOpen, 
}) => {

  const isDisabled = isLoading ?? false;

  const handleRemoveGenre = useCallback((genreToRemove: string) => {
    onGenresChange(selectedGenres.filter(genre => genre !== genreToRemove));
  }, [onGenresChange, selectedGenres]);

  const handleConfirmGenres = (newGenres: string[]) => {
    onGenresChange(newGenres);
  };

  return (
    <>
      <div className="form-group">
        <p className="form-label">Genres *</p>
        <div className="selected-genres-chips">
          {selectedGenres.length > 0 ? (
            <md-chip-set>
              {selectedGenres.map((genre) => (
                <RemovableChip
                  key={genre}
                  genre={genre}
                  onRemove={handleRemoveGenre}
                />
              ))}
            </md-chip-set>
          ) : (
            <p className="no-genres-text">No genres selected.</p>
          )}
        </div>
        {error && <p className="error-message">{error}</p>}
        <md-outlined-button
          type="button" 
          style={{ marginTop: '8px' }}
          onClick={() => setDialogOpen(true)}
          disabled={isDisabled}
        >
          <md-icon slot="icon">tune</md-icon>
          Select Genres
        </md-outlined-button>
      </div>
     <FilterDialog
        open={isDialogOpen} 
        onClose={() => setDialogOpen(false)} 
        title="Select Genres"
        items={availableGenres}
        multiple={true}
        selectedValues={selectedGenres}
        onConfirm={handleConfirmGenres}
      />
    </>
  );
};