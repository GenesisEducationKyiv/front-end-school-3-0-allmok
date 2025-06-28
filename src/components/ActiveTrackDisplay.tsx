import React from 'react';
import { useSubscription } from '@apollo/client';
import { ACTIVE_TRACK_SUBSCRIPTION } from '../graphql/subscriptions'; 

export const ActiveTrackDisplay: React.FC = () => {
  const { data, loading, error } = useSubscription(ACTIVE_TRACK_SUBSCRIPTION);

  console.log('[Subscription] Loading:', loading);
  console.log('[Subscription] Error:', error);
  console.log('[Subscription] Data:', data);

  const style: React.CSSProperties = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    padding: '10px 20px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    borderRadius: '8px',
    zIndex: 1000,
    minWidth: '200px',
    textAlign: 'center',
  };

  if (loading) {
    return <div style={style}>Connecting...</div>;
  }

  if (error) {
    console.error("GraphQL Subscription Error:", error);
    return <div style={style}>Error subscribing!</div>;
  }

  return (
    <div style={style}>
      <strong>Live:</strong>{' '}
      {data?.activeTrackChanged?.title 
        ? `${data.activeTrackChanged.title} - ${data.activeTrackChanged.artist}`
        : 'Waiting for track...'}
    </div>
  );
};