export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL, 
  ENDPOINTS: {
    UPLOAD: '/api/upload',
  },
} as const;