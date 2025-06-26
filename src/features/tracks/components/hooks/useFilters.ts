import { create } from 'zustand';
import useDebounce from '../../../../hooks/useDebounce';

export interface Filters {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  search: string;
  genre: string;
  artist: string;
}

interface FilterState extends Filters {
  setPage: (page: number) => void;
  setSort: (sort: string) => void;
  setOrder: (order: 'asc' | 'desc') => void;
  setSearch: (search: string) => void;
  setGenre: (genre: string) => void;
  setArtist: (artist: string) => void;
  setFiltersFromUrl: (initialFilters: Partial<Filters>) => void;
  resetFilters: () => void;
}

const defaultFilters: Omit<Filters, 'search' | 'genre' | 'artist'> = {
  page: 1,
  limit: 10,
  sort: 'createdAt',
  order: 'desc',
};

export const useFilterStore = create<FilterState>((set) => ({
  ...defaultFilters,
  search: '',
  genre: '',
  artist: '',

  setPage: (page) => set({ page }),
  setSort: (sort) => set({ sort, page: 1 }),
  setOrder: (order) => set({ order, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setGenre: (genre) => set({ genre, page: 1 }),
  setArtist: (artist) => set({ artist, page: 1 }),

  setFiltersFromUrl: (initialFilters) => set((state) => ({ ...state, ...initialFilters })),

  resetFilters: () => set({ ...defaultFilters, search: '', genre: '', artist: '' }),
}));

export const useApiParams = () => {
    const { page, limit, sort, order, genre, artist, search } = useFilterStore();
    const debouncedSearch = useDebounce(search, 500);

    return {
        page,
        limit,
        sort,
        order,
        genre,
        artist,
        search: debouncedSearch,
    };
};