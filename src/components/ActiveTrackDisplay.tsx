import React from 'react';
import { useSubscription } from '@apollo/client';
import { ACTIVE_TRACK_SUBSCRIPTION } from '../graphql/subscriptions';

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  width: '100%',
  padding: '8px 0',
  backgroundColor: 'rgba(34, 3, 59, 0.2)',
  color: 'white',
  zIndex: 1000,
  textAlign: 'center',
  fontSize: '12px',
  lineHeight: '1.2',
};

interface ActiveTrackSubscriptionData {
  activeTrackChanged: {
    id: string;
    title: string;
    artist: string;
  };
}

export const ActiveTrackDisplay: React.FC = () => {
  const { data, loading, error } = useSubscription<ActiveTrackSubscriptionData>(
    ACTIVE_TRACK_SUBSCRIPTION
  );

  if (loading) {
    return <div style={containerStyle}>Connecting...</div>;
  }

  if (error) {
    console.error("GraphQL Subscription Error:", error);
    return <div style={containerStyle}>Error subscribing!</div>;
  }

  const trackInfo = data?.activeTrackChanged;

  return (
    <div style={containerStyle}>
      <strong>Live:</strong>{' '}
      {trackInfo
        ? `${trackInfo.title} - ${trackInfo.artist}`
        : 'Waiting for track...'}
    </div>
  );
};