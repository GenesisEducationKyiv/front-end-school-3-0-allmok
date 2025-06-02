import axiosInstance from './axiosInstance';
import axios from 'axios';
import { GenresSchema } from '../types/track'; 
import z from 'zod';

export const getGenres = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get<unknown>('/genres'); 
    const parsedData = GenresSchema.parse(response.data);
    return parsedData; 

  } catch (error) {
    console.error("Error fetching genres:", error);
    if (error instanceof z.ZodError) { 
        console.error("Zod validation error (genres):", error.formErrors.fieldErrors);
        throw new Error(`Failed to fetch genres: Invalid data format received from server. ${error.errors.map(e => e.message).join(', ')}`);
    }
	if (axios.isAxiosError(error) && error.response) {
  	    console.error('API Response Error:', error.response.data);
  	    throw new Error(`Failed to fetch genres: ${error.response.status} ${error.response.statusText || 'Error'}`);
	} else if (error instanceof Error) {
  	    throw new Error(`Failed to fetch genres: ${error.message}`);
	} else {
  	    throw new Error("Failed to fetch genres due to an unknown error");
	}
  }
};