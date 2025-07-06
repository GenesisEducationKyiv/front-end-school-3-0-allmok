import { API_CONFIG } from '../api/constants';

export interface UploadResponse {
  filename: string;
}

interface ApiErrorResponse {
  error: string;
}

export class FileUploadService {
  private static instance: FileUploadService;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): FileUploadService {
    if (!FileUploadService.instance) {
      FileUploadService.instance = new FileUploadService();
    }
    return FileUploadService.instance;
  }

  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'File upload failed on the server.';
      try {
        const errorData = await response.json() as ApiErrorResponse;
        
        if (typeof errorData.error === 'string') {
          errorMessage = errorData.error;
        }
      } catch (e) {
        console.error('Failed to parse error response as JSON:', e);
      }
      throw new Error(errorMessage);
    }

    return await response.json() as UploadResponse;
  }
}