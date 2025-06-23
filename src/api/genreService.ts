//import axiosInstance from './axiosInstance';
// import { GenresSchema } from '../types/track';
// import { Result } from 'neverthrow';
// import { AppError } from '../types/errors';
// import { safeApiCall } from './apiHandler'; 

// export const getGenres = async (): Promise<Result<string[], AppError>> => {
//   return safeApiCall(

//     async () => {
//       const response = await axiosInstance.get<unknown>('/genres');
//       return GenresSchema.parse(response.data);
//     },
//     {
//       validation: "Invalid data format received for genres.",
//       api: "Could not load genres.",
//       unknown: "Unable to load genres due to an unknown error."
//     }
//   );
// };