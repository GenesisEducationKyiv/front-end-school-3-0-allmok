import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFilterStore, Filters } from './useFilters';

const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
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
  const location = useLocation();
  const store = useFilterStore();
  const isInitialized = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlFilters: Partial<Record<keyof Filters, string | number>> = {};
    
    const stringKeys: (keyof Filters)[] = ['sort', 'order', 'search', 'genre', 'artist'];
    const numberKeys: (keyof Filters)[] = ['page', 'limit'];

    stringKeys.forEach(key => {
      if (params.has(key)) {
        urlFilters[key] = params.get(key)!;
      }
    });

    numberKeys.forEach(key => {
      if (params.has(key)) {
        urlFilters[key] = Number(params.get(key));
      }
    });

    store.setFiltersFromUrl(urlFilters as Partial<Filters>);
    isInitialized.current = true;
  }, []);

  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }

    const { page, sort, order, search, genre, artist } = store;
    const currentFilters = { page, sort, order, search, genre, artist };
    const cleanedFilters = cleanObject(currentFilters);
    const newSearch = new URLSearchParams(cleanedFilters as Record<string, string>).toString();

    if (newSearch !== location.search.substring(1)) {
      navigate({ search: newSearch }, { replace: true, state: location.state });
    }
  }, [store.page, store.sort, store.order, store.search, store.genre, store.artist, navigate, location]);
}