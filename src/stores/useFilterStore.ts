import { useLocation, useHistory } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
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

export const useFilters = (): FiltersState & FilterActions => {
  const location = useLocation();
  const history = useHistory();

  const searchParams = new URLSearchParams(location.search);

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || DEFAULT_PAGE_SIZE;
  const sort = searchParams.get('sort') || 'createdAt';
  const order = (searchParams.get('order') as 'asc' | 'desc') || 'desc';
  const search = searchParams.get('search') || '';
  const genre = searchParams.get('genre') || '';
  const artist = searchParams.get('artist') || '';

  const updateParams = useCallback((updates: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 0) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    history.push({ search: newParams.toString() });
  }, [location.search, navigator]);

  const setPage = useCallback((page: number) => {
    updateParams({ page: page > 1 ? page : undefined });
  }, [updateParams]);

  const setSort = useCallback((sort: string) => {
    updateParams({ sort: sort !== 'createdAt' ? sort : undefined, page: undefined });
  }, [updateParams]);

  const setOrder = useCallback((order: 'asc' | 'desc') => {
    updateParams({ order: order !== 'desc' ? order : undefined, page: undefined });
  }, [updateParams]);

  const setSearch = useCallback((search: string) => {
    updateParams({ search: search || undefined, page: undefined });
  }, [updateParams]);

  const setGenre = useCallback((genre: string) => {
    updateParams({ genre: genre || undefined, page: undefined });
  }, [updateParams]);

  const setArtist = useCallback((artist: string) => {
    updateParams({ artist: artist || undefined, page: undefined });
  }, [updateParams]);

  const resetFilters = useCallback((defaults: { sort: string; order: 'asc' | 'desc' }) => {
    updateParams({
      page: undefined,
      search: undefined,
      genre: undefined,
      artist: undefined,
      sort: defaults.sort !== 'createdAt' ? defaults.sort : undefined,
      order: defaults.order !== 'desc' ? defaults.order : undefined,
    });
  }, [updateParams]);

  return {
    page,
    limit,
    sort,
    order,
    search,
    genre,
    artist,
    setPage,
    setSort,
    setOrder,
    setSearch,
    setGenre,
    setArtist,
    resetFilters,
  };
};

export const useApiFilters = () => {
  const { page, limit, sort, order, genre, artist, search } = useFilters();
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
};