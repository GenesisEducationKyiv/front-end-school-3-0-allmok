import axiosInstance from './axiosInstance';
import axios from 'axios'; 

export const getGenres = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get<string[]>('/genres');
    return response.data;
  } catch (error) {
    console.error("Error fetching genres:", error);
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