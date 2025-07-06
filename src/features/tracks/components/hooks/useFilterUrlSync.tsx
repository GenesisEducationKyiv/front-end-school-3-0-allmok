import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFilterStore, Filters } from './useFilters';

const cleanObject = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  const newObj: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
      if (key === 'page' && obj[key] === 1) continue;
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

export function useFilterUrlSync() {
  const navigate = useNavigate();
  const location = useLocation() as { pathname: string; search: string; state: unknown };
  
  const filters = useFilterStore(state => ({
    page: state.page,
    sort: state.sort,
    order: state.order,
    search: state.search,
    genre: state.genre,
    artist: state.artist,
  }));
  const setFiltersFromUrl = useFilterStore(state => state.setFiltersFromUrl);
  
  const isInitialized = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlFilters: Partial<Filters> = {};

    const search = params.get('search');
    if (search) urlFilters.search = search;

    const sort = params.get('sort');
    if (sort) urlFilters.sort = sort;

    const order = params.get('order');
    if (order === 'asc' || order === 'desc') urlFilters.order = order;
    
    const genre = params.get('genre');
    if (genre) urlFilters.genre = genre;
    
    const artist = params.get('artist');
    if (artist) urlFilters.artist = artist;

    const page = params.get('page');
    if (page && !isNaN(Number(page))) urlFilters.page = Number(page);

    const limit = params.get('limit');
    if (limit && !isNaN(Number(limit))) urlFilters.limit = Number(limit);

    setFiltersFromUrl(urlFilters);
    isInitialized.current = true;
    
  }, [location.search, setFiltersFromUrl]);

  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }
    
    const cleanedFilters = cleanObject(filters);
    const newSearch = new URLSearchParams(cleanedFilters as Record<string, string>).toString();

    if (newSearch !== location.search.substring(1)) {
      void navigate({ search: newSearch }, { replace: true, state: location.state });
    }
  }, [filters, navigate, location.state, location.search]);
}