import React, { useRef, useEffect } from 'react';

interface RemovableChipProps {
  genre: string;
  onRemove: (genre: string) => void;
}

export const RemovableChip: React.FC<RemovableChipProps> = ({ genre, onRemove }) => {
  const chipRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const chipElement = chipRef.current;
    const handleRemove = (event: Event) => {
      event.preventDefault();
      onRemove(genre);
    };

    if (chipElement) {
      chipElement.addEventListener('remove', handleRemove as EventListener);
    }

    return () => {
      if (chipElement) {
        chipElement.removeEventListener('remove', handleRemove as EventListener);
      }
    };
  }, [genre, onRemove]);

  return (
    <md-input-chip
      ref={chipRef}
      key={genre}
      label={genre}
      remove-only
      data-testid={`remove-chip-${genre}`}
    />
  );
};