// import { useMemo } from 'react';
// import { pipe, O, S } from '@mobily/ts-belt';

// export interface URLFiltersState {
//     page: number;
//     sort: string;
//     order: 'asc' | 'desc';
//     genre: string;
//     artist: string;
//     search: string;
// }

// /**
//  * @param initialSort
//  * @param initialOrder
//  * @returns
//  */
// export const useTrackFiltersFromURL = (
//     initialSort: string, 
//     initialOrder: 'asc' | 'desc'
// ): URLFiltersState => {
//     return useMemo(() => {
//         const params = new URLSearchParams(window.location.search);
        
//         const getParamValue = (key: string) => 
//             pipe(params.get(key), O.fromNullable);

//         const page = pipe(
//             getParamValue('page'),
//             O.map(Number),
//             O.flatMap(parsed => isNaN(parsed) ? O.None : O.Some(parsed)),
//             O.map(Math.round),
//             O.filter(n => n > 0),
//             O.getWithDefault<number>(1)
//         );

//         const sort = pipe(
//             getParamValue('sort'),
//             O.getWithDefault(initialSort)
//         );

//         const order = pipe(
//             getParamValue('order'),
//             O.map(S.toLowerCase),
//             O.flatMap(o => (o === 'asc' || o === 'desc' ? O.Some(o) : O.None)),
//             O.getWithDefault(initialOrder)
//         );

//         const genre = pipe(
//             getParamValue('genre'), 
//             O.getWithDefault<string>('')
//         );
        
//         const artist = pipe(
//             getParamValue('artist'), 
//             O.getWithDefault<string>('')
//         );
        
//         const search = pipe(
//             getParamValue('search'), 
//             O.getWithDefault<string>('')
//         );

//         return { page, sort, order, genre, artist, search };
//     }, [initialSort, initialOrder]);
// };