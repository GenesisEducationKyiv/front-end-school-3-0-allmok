import React from 'react';
import { useSubscription } from '@apollo/client';
import { ACTIVE_TRACK_SUBSCRIPTION } from '../graphql/subscriptions';
import '../css/ActiveTrackDisplay.css'; 

interface ActiveTrackSubscriptionData {
  activeTrackChanged: {
    id: string;
    title: string;
    artist: string;
  };
}


const LiveTrackContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="live-track-container" role="status">
      <md-icon>podcasts</md-icon>
      <div>{children}</div>
    </div>
  );
};


export const ActiveTrackDisplay: React.FC = () => {
  const { data, loading, error } = useSubscription<ActiveTrackSubscriptionData>(
    ACTIVE_TRACK_SUBSCRIPTION
  );

  if (loading) {
    return null; 
  }

  if (error) {
    console.error("GraphQL Subscription Error:", error);
    return (
      <LiveTrackContainer>
        <span className="live-track-label">Error subscribing!</span>
      </LiveTrackContainer>
    );
  }
  
  const trackInfo = data?.activeTrackChanged;

  if (!trackInfo) {
    return null;
  }

  return (
    <LiveTrackContainer>
      <span className="live-track-label">Live: </span>
      <span>
        {`${trackInfo.title} - ${trackInfo.artist}`}
      </span>
    </LiveTrackContainer>
  );
};