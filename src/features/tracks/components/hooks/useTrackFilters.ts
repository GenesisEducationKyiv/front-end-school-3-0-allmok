import { useState, useMemo, useCallback } from 'react';
import useDebounce from '../../../../hooks/useDebounce';
import { pipe, O, S } from '@mobily/ts-belt';

const DEFAULT_PAGE_SIZE = 10;

export interface TrackFiltersState {
    page: number;
    limit: number;
    sort: string;
    order: 'asc' | 'desc';
    search?: string;
    genre?: string;
    artist?: string;
}

interface InitialState extends Omit<TrackFiltersState, 'limit' | 'search' | 'genre' | 'artist'> {
    search: string;
    genre: string;
    artist: string;
}

const getInitialStateFromURL = (initialSort: string, initialOrder: 'asc' | 'desc'): InitialState => {
    const params = new URLSearchParams(window.location.search);

    const page = pipe(
        params.get('page'),      
        O.fromNullable,   
        O.flatMap(value => {
            const parsed = Number(value);
            return isNaN(parsed) ? O.None : O.Some(parsed);
        }),    
        O.map(Math.round),          
        O.filter(n => n > 0),      
        O.getWithDefault<number>(1) 
    );

    const sort = pipe(
        params.get('sort'),
        O.fromNullable,
        O.getWithDefault(initialSort)
    );

    const order = pipe(
        params.get('order'),
        O.fromNullable,
        O.map(S.toLowerCase),
        O.flatMap(o => (o === 'asc' || o === 'desc' ? O.Some(o) : O.None)),
        O.getWithDefault(initialOrder)
    );

    const genre = pipe(params.get('genre'), O.fromNullable, O.getWithDefault<string>(''));
    const artist = pipe(params.get('artist'), O.fromNullable, O.getWithDefault<string>(''));
    const search = pipe(params.get('search'), O.fromNullable, O.getWithDefault<string>(''));

    return { page, sort, order, genre, artist, search };
};

export const useTrackFilters = (initialSort = 'createdAt', initialOrder: 'asc' | 'desc' = 'desc') => {
    const initialState = useMemo(() => getInitialStateFromURL(initialSort, initialOrder), [initialSort, initialOrder]);

    const [currentPage, setCurrentPage] = useState<number>(initialState.page);
    const [limit] = useState<number>(DEFAULT_PAGE_SIZE);
    const [sortBy, setSortBy] = useState<string>(initialState.sort);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialState.order);
    const [filterGenre, setFilterGenre] = useState<string>(initialState.genre);
    const [filterArtist, setFilterArtist] = useState<string>(initialState.artist);
    const [searchQuery, setSearchQuery] = useState<string>(initialState.search);
    const debouncedSearch = useDebounce<string>(searchQuery, 500);

    const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);
    const handleSortChange = useCallback((newSortBy: string) => { setSortBy(newSortBy); setCurrentPage(1); }, []);
    const handleOrderChange = useCallback((newOrder: 'asc' | 'desc') => { setSortOrder(newOrder); setCurrentPage(1); }, []);
    const handleGenreChange = useCallback((newGenre: string) => { setFilterGenre(newGenre); setCurrentPage(1); }, []);
    const handleArtistChange = useCallback((newArtist: string) => { setFilterArtist(newArtist); setCurrentPage(1); }, []);
    const handleSearchChange = useCallback((newQuery: string) => { setSearchQuery(newQuery); setCurrentPage(1); }, []);
    const handleResetFilters = useCallback(() => {
        setSortBy(initialSort);
        setSortOrder(initialOrder);
        setFilterGenre('');
        setFilterArtist('');
        setSearchQuery('');
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, initialSort, initialOrder]);

    const filters = useMemo<TrackFiltersState>(() => {
        type OptionalFilterKey = 'genre' | 'artist' | 'search';
        const createOptionalFilter = (key: OptionalFilterKey, value: string) =>
            pipe(
                value,
                O.fromPredicate(S.isNotEmpty),
                O.map(v => ({ [key]: v })),
                O.getWithDefault({})
            );
            return {
                page: currentPage,
                limit,
                sort: sortBy,
                order: sortOrder,
                ...createOptionalFilter('genre', filterGenre),
                ...createOptionalFilter('artist', filterArtist),
                ...createOptionalFilter('search', debouncedSearch),
            };
        }, [currentPage, limit, sortBy, sortOrder, filterGenre, filterArtist, debouncedSearch]);

    const filterProps = useMemo(() => ({
        sortBy,
        sortOrder,
        filterGenre,
        filterArtist,
        searchQuery,
        handleSortChange,
        handleOrderChange,
        handleGenreChange,
        handleArtistChange,
        handleSearchChange,
        handleResetFilters,
        handlePageChange,
        currentPage
    }), [
        sortBy, sortOrder, filterGenre, filterArtist, searchQuery,
        handleSortChange, handleOrderChange, handleGenreChange, handleArtistChange,
        handleSearchChange, handleResetFilters, handlePageChange, currentPage
    ]);

    return { filters, filterProps };
};