// import { useState, useEffect, useCallback } from 'react';
// import toast from 'react-hot-toast';
// import { getTracks, GetTracksParams } from '../../../../api/trackService'; 
// import { getGenres } from '../../../../api/genreService';
// import { Track, Meta, GetTracksResponse } from '../../../../types/track'; 
// import { AppError } from '../../../../types/errors';
// import { TrackFiltersState } from './useTrackFilters';

// export const useTracks = (filters: TrackFiltersState) => {
//   const [tracks, setTracks] = useState<Track[]>([]);
//   const [meta, setMeta] = useState<Meta | null>(null);
//   const [availableGenres, setAvailableGenres] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<AppError | null>(null);

//   const fetchTracksAndGenres = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {

//       const tracksResult = await getTracks(filters as GetTracksParams); 
//       if (tracksResult.isErr()) {
//         setError(tracksResult.error);
//         toast.error(`Loading error (tracks): ${tracksResult.error.message}`);
//         console.error('fetchTracks error object:', tracksResult.error);
//         setIsLoading(false);
//         return;
//       }

//       const tracksResponse: GetTracksResponse = tracksResult.value;
//       setTracks(tracksResponse.tracks);
//       setMeta(tracksResponse.meta);

//       if (availableGenres.length === 0) {
//         const genresResult = await getGenres(); 
//         if (genresResult.isOk()) {
//           setAvailableGenres(genresResult.value.sort());
//         } else {
//           console.warn('Failed to fetch genres:', genresResult.error);
//           toast.error(`Could not load genres: ${genresResult.error.message}`);
//         }
//       }
//     } catch (err) { 
//       const unknownErr = err instanceof Error ? err.message : 'Unknown error loading data';
//       const appErr: AppError = { type: 'UnknownError', message: unknownErr, originalError: err };
//       setError(appErr);
//       toast.error(`Loading error: ${appErr.message}`);
//       console.error('fetchTracksAndGenres unexpected error:', err);
//     } finally {
//       setIsLoading(false);
//     }

//   }, [JSON.stringify(filters), availableGenres.length]);

//   useEffect(() => {
//     void fetchTracksAndGenres();
//   }, [fetchTracksAndGenres]);

//   return {
//     tracks,
//     setTracks,
//     meta,
//     isLoading,
//     error, 
//     fetchTracks: fetchTracksAndGenres,
//     availableGenres,
//   };
// };