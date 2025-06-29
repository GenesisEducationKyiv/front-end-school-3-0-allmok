import { gql } from '@apollo/client';

export const GET_TRACKS = gql`
  query GetTracks($input: TracksInput) {
    tracks(input: $input) {
      data {
        id
        title
        artist
        album
        genres
        coverImage
        audioFile
        createdAt
      }
      meta {
        total
        page
        limit
        totalPages
      }
    }
  }
`;

export const GET_GENRES = gql`
  query GetGenres {
    genres
  }
`;