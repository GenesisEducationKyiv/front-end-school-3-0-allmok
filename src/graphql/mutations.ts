import { gql } from '@apollo/client';

export const CREATE_TRACK = gql`
  mutation CreateTrack($input: CreateTrackInput!) {
    createTrack(input: $input) {
      id
      title
      artist
    }
  }
`;

export const UPDATE_TRACK = gql`
  mutation UpdateTrack($id: String!, $input: UpdateTrackInput!) {
    updateTrack(id: $id, input: $input) {
      id 
    }
  }
`;

export const DELETE_TRACK = gql`
  mutation DeleteTrack($id: String!) {
    deleteTrack(id: $id)
  }
`;


export const DELETE_TRACK_FILE = gql`
  mutation DeleteTrackFile($id: String!) {
    deleteTrackFile(id: $id) {
      id
      audioFile
    }
  }
`;

export const DELETE_MULTIPLE_TRACKS = gql`
  mutation DeleteTracks($ids: [String!]!) {
    deleteTracks(ids: $ids) {
      success
      failed
    }
  }
`;

export const UPLOAD_TRACK_FILE = gql`
  mutation UploadTrackFile($id: String!, $file: Upload!) {
    uploadTrackFile(id: $id, file: $file) {
      id
      title
      artist
      album
      genres
      coverImage
      audioFile
      createdAt
      updatedAt
    }
  }
`;