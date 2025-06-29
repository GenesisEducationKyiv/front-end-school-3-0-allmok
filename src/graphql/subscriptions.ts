import { gql } from '@apollo/client';

export const ACTIVE_TRACK_SUBSCRIPTION = gql`
  subscription OnActiveTrackChanged {
    activeTrackChanged {
      id
      title
      artist
    }
  }
`;