import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast'; 
import { getTracks, GetTracksParams, GetTracksResponse } from '../../../../api/trackService'; 
import { getGenres } from '../../../../api/genreService';
import { Track, Meta } from '../../../../types/track'; 
import { TrackFiltersState } from './useTrackFilters'; 


export const useTracks = (filters: TrackFiltersState) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [availableGenres, setAvailableGenres] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); 

    const fetchTracksAndGenres = useCallback(async () => {
        setIsLoading(true);
        setError(null); 
        try {
            const response = await getTracks(filters as GetTracksParams) as GetTracksResponse;
            setTracks(response.tracks); 
            setMeta(response.meta);

            if (availableGenres.length === 0) {
                const genres = await getGenres();
                setAvailableGenres(genres.sort());
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error loading data';
            setError(`Loading error: ${message}`);
            toast.error(`Loading error: ${message}`); 
            console.error('fetchTracks error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [JSON.stringify(filters), availableGenres.length]); 

    useEffect(() => {
        fetchTracksAndGenres();
    }, [fetchTracksAndGenres]);

    return {
        tracks,
        setTracks, 
        meta,
        isLoading,
        error, 
        fetchTracks: fetchTracksAndGenres, 
        availableGenres,
    };
};