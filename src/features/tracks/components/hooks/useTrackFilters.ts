import { useState, useMemo, useCallback } from 'react';
import useDebounce from '../../../../hooks/useDebounce'; 

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

export const useTrackFilters = (initialSort = 'createdAt', initialOrder: 'asc' | 'desc' = 'desc') => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit] = useState<number>(DEFAULT_PAGE_SIZE);
    const [sortBy, setSortBy] = useState<string>(initialSort);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialOrder);
    const [filterGenre, setFilterGenre] = useState<string>(''); 
    const [filterArtist, setFilterArtist] = useState<string>(''); 
    const [searchQuery, setSearchQuery] = useState<string>(''); 
    const debouncedSearch = useDebounce<string>(searchQuery, 500);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleSortChange = useCallback((newSortBy: string) => {
        setSortBy(newSortBy);
        setCurrentPage(1);
    }, []);

    const handleOrderChange = useCallback((newOrder: 'asc' | 'desc') => {
        setSortOrder(newOrder);
        setCurrentPage(1);
    }, []);

    const handleGenreChange = useCallback((newGenre: string) => {
        setFilterGenre(newGenre);
        setCurrentPage(1);
    }, []);

    const handleArtistChange = useCallback((newArtist: string) => {
        setFilterArtist(newArtist);
        setCurrentPage(1);
    }, []);

    const handleSearchChange = useCallback((newQuery: string) => {
        setSearchQuery(newQuery);
        setCurrentPage(1);
    }, []);

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

    const filters = useMemo<TrackFiltersState>(() => ({
        page: currentPage,
        limit,
        sort: sortBy,
        order: sortOrder,
        ...(filterGenre && { genre: filterGenre }),
        ...(filterArtist && { artist: filterArtist }),
        ...(debouncedSearch && { search: debouncedSearch }),
    }), [currentPage, limit, sortBy, sortOrder, filterGenre, filterArtist, debouncedSearch]);

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