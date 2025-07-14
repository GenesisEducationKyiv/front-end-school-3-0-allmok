import React, { useCallback, memo } from "react";
import defaultCover from "../assets/default-cover.webp";


interface TrackImageProps {
  imageUrl: string | null | undefined;
  trackTitle: string;
  trackId: string;
}

const TrackImage: React.FC<TrackImageProps> = ({
  imageUrl,
  trackTitle,
}) => {
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      (e.target as HTMLImageElement).src = defaultCover;
    },
    []
  );

  return (
    <img
      src={imageUrl ?? defaultCover}
      alt={`Cover for ${trackTitle}`}
      className="track-item-cover"
      onError={handleImageError}
      loading="lazy"
      decoding="async"
    />
  );
};

export default memo(TrackImage);