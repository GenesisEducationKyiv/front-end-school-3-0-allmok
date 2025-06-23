// import { useState, useMemo, useCallback, useReducer } from 'react';
// import useDebounce from '../../../../hooks/useDebounce';
// import { pipe, O, S } from '@mobily/ts-belt';
// import { useTrackFiltersFromURL } from './useTrackFiltersFromURL';

// const DEFAULT_PAGE_SIZE = 10;

// export interface TrackFiltersState {
//     page: number;
//     limit: number;
//     sort: string;
//     order: 'asc' | 'desc';
//     search?: string;
//     genre?: string;
//     artist?: string;
// }

// interface FiltersReducerState {
//     page: number;
//     sort: string;
//     order: 'asc' | 'desc';
//     genre: string;
//     artist: string;
//     search: string;
// }

// type FiltersAction = 
//     | { type: 'SET_PAGE'; payload: number }
//     | { type: 'SET_SORT'; payload: string }
//     | { type: 'SET_ORDER'; payload: 'asc' | 'desc' }
//     | { type: 'SET_GENRE'; payload: string }
//     | { type: 'SET_ARTIST'; payload: string }
//     | { type: 'SET_SEARCH'; payload: string }
//     | { type: 'RESET_FILTERS'; payload: { sort: string; order: 'asc' | 'desc' } };

// type OptionalFilterKey = 'genre' | 'artist' | 'search';
// const createOptionalFilter = (key: OptionalFilterKey, value: string) =>
//     pipe(
//         value,
//         O.fromPredicate(S.isNotEmpty),
//         O.map(v => ({ [key]: v })),
//         O.getWithDefault({})
//     );

// const filtersReducer = (state: FiltersReducerState, action: FiltersAction): FiltersReducerState => {
//     switch (action.type) {
//         case 'SET_PAGE':
//             return { ...state, page: action.payload };
//         case 'SET_SORT':
//             return { ...state, sort: action.payload, page: 1 };
//         case 'SET_ORDER':
//             return { ...state, order: action.payload, page: 1 };
//         case 'SET_GENRE':
//             return { ...state, genre: action.payload, page: 1 };
//         case 'SET_ARTIST':
//             return { ...state, artist: action.payload, page: 1 };
//         case 'SET_SEARCH':
//             return { ...state, search: action.payload, page: 1 };
//         case 'RESET_FILTERS':
//             return {
//                 ...state,
//                 sort: action.payload.sort,
//                 order: action.payload.order,
//                 genre: '',
//                 artist: '',
//                 search: '',
//                 page: 1
//             };
//         default:
//             return state;
//     }
// };

// export const useTrackFilters = (initialSort = 'createdAt', initialOrder: 'asc' | 'desc' = 'desc') => {
//     const initialState = useTrackFiltersFromURL(initialSort, initialOrder);
//     const { page, sort, order, genre, artist, search } = initialState;
    
//     const [state, dispatch] = useReducer(filtersReducer, {
//         page,
//         sort,
//         order,
//         genre,
//         artist,
//         search
//     });
    
//     const [limit] = useState<number>(DEFAULT_PAGE_SIZE);
//     const debouncedSearch = useDebounce<string>(state.search, 500);

//     const handlePageChange = useCallback((page: number) => {
//         dispatch({ type: 'SET_PAGE', payload: page });
//     }, []);

//     const handleSortChange = useCallback((newSortBy: string) => {
//         dispatch({ type: 'SET_SORT', payload: newSortBy });
//     }, []);

//     const handleOrderChange = useCallback((newOrder: 'asc' | 'desc') => {
//         dispatch({ type: 'SET_ORDER', payload: newOrder });
//     }, []);

//     const handleGenreChange = useCallback((newGenre: string) => {
//         dispatch({ type: 'SET_GENRE', payload: newGenre });
//     }, []);

//     const handleArtistChange = useCallback((newArtist: string) => {
//         dispatch({ type: 'SET_ARTIST', payload: newArtist });
//     }, []);

//     const handleSearchChange = useCallback((newQuery: string) => {
//         dispatch({ type: 'SET_SEARCH', payload: newQuery });
//     }, []);

//     const handleResetFilters = useCallback(() => {
//         dispatch({ 
//             type: 'RESET_FILTERS', 
//             payload: { sort: initialSort, order: initialOrder } 
//         });
//     }, [initialSort, initialOrder]);

//     const filters = useMemo<TrackFiltersState>(() => {
//         return {
//             page: state.page,
//             limit,
//             sort: state.sort,
//             order: state.order,
//             ...createOptionalFilter('genre', state.genre),
//             ...createOptionalFilter('artist', state.artist),
//             ...createOptionalFilter('search', debouncedSearch),
//         };
//     }, [state.page, limit, state.sort, state.order, state.genre, state.artist, debouncedSearch]);

//     const filterProps = useMemo(() => ({
//         sortBy: state.sort,
//         sortOrder: state.order,
//         filterGenre: state.genre,
//         filterArtist: state.artist,
//         searchQuery: state.search,
//         currentPage: state.page,
//         handleSortChange,
//         handleOrderChange,
//         handleGenreChange,
//         handleArtistChange,
//         handleSearchChange,
//         handleResetFilters,
//         handlePageChange,
//     }), [
//         state.sort, 
//         state.order, 
//         state.genre, 
//         state.artist, 
//         state.search,
//         state.page,
//         handleSortChange, 
//         handleOrderChange, 
//         handleGenreChange, 
//         handleArtistChange,
//         handleSearchChange, 
//         handleResetFilters, 
//         handlePageChange
//     ]);

//     return { filters, filterProps };
// };