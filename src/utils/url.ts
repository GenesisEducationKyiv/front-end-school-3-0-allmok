const apiUrl = import.meta.env.VITE_API_URL;

/**
 * @param filename 
 * @returns 
 */
export const getAbsoluteFileUrl = (filename?: string | null): string | null => {
  if (!filename) {
    return null;
  }
  return `${apiUrl}/api/files/${filename}`;
};
