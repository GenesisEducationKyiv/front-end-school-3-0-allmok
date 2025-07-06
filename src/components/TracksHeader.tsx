import React from 'react';
import { ActiveTrackDisplay } from '../components/ActiveTrackDisplay';

export const TracksHeader: React.FC = () => (
  <>
    <ActiveTrackDisplay />
    <h1 data-testid="tracks-header">Tracks</h1>
  </>
);