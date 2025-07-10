const isDevelopment = process.env.NODE_ENV === 'development';
export const logger = {
  log: isDevelopment ? console.log : () => void 0,
  warn: isDevelopment ? console.warn : () => void 0,
  error: isDevelopment ? console.error : () => void 0,
};