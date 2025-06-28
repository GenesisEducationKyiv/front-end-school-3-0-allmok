import React from 'react';
import { useSubscription } from '@apollo/client';
import { ACTIVE_TRACK_SUBSCRIPTION } from '../graphql/subscriptions';

export const ActiveTrackDisplay: React.FC = () => {
  const { data, loading, error } = useSubscription(ACTIVE_TRACK_SUBSCRIPTION);

  const style: React.CSSProperties = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    padding: '10px 20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    borderRadius: '8px',
    zIndex: 1000,
  };

  if (loading) return <div style={style}>Connecting...</div>;
  if (error) return <div style={style}>Error!</div>;

  return (
    <div style={style}>
      <strong>Live:</strong> {data?.activeTrackChanged.title} - {data?.activeTrackChanged.artist}
    </div>
  );
};