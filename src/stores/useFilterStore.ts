import { create } from 'zustand';
import { useMemo } from 'react';
import useDebounce from '../hooks/useDebounce';
import { pipe, O, S } from '@mobily/ts-belt';

const DEFAULT_PAGE_SIZE = 10;

interface FiltersState {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  search: string;
  genre: string;
  artist: string;
}

interface FilterActions {
  setPage: (page: number) => void;
  setSort: (sort: string) => void;
  setOrder: (order: 'asc' | 'desc') => void;
  setSearch: (search: string) => void;
  setGenre: (genre: string) => void;
  setArtist: (artist: string) => void;
  resetFilters: (defaults: { sort: string; order: 'asc' | 'desc' }) => void;
}

const createOptionalFilter = (key: 'genre' | 'artist' | 'search', value: string) =>
    pipe(
        value,
        O.fromPredicate(S.isNotEmpty),
        O.map(v => ({ [key]: v })),
        O.getWithDefault({})
    );


export const useFilterStore = create<FiltersState & FilterActions>((set) => ({
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  sort: 'createdAt',
  order: 'desc',
  search: '',
  genre: '',
  artist: '',

  setPage: (page) => set({ page }),
  setSort: (sort) => set({ sort, page: 1 }),
  setOrder: (order) => set({ order, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setGenre: (genre) => set({ genre, page: 1 }),
  setArtist: (artist) => set({ artist, page: 1 }),
  resetFilters: (defaults) => set({
    page: 1,
    search: '',
    genre: '',
    artist: '',
    sort: defaults.sort,
    order: defaults.order,
  }),
}));

export const useApiFilters = () => {
    const { page, limit, sort, order, genre, artist, search } = useFilterStore();
    const debouncedSearch = useDebounce(search, 500);

    const apiParams = useMemo(() => ({
        page,
        limit,
        sort,
        order,
        ...createOptionalFilter('genre', genre),
        ...createOptionalFilter('artist', artist),
        ...createOptionalFilter('search', debouncedSearch),
    }), [page, limit, sort, order, genre, artist, debouncedSearch]);

    return apiParams;
}