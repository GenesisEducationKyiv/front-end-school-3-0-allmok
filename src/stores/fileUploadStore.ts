import { API_CONFIG } from '../api/constants';

export interface UploadResponse {
  filename: string;
}

export class FileUploadService {
  private static instance: FileUploadService;

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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'File upload failed on the server.');
    }

    return await response.json();
  }
}