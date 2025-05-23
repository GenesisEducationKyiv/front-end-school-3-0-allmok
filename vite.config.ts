/// <reference types="vitest" /> 

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { 
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', 
    css: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,

      }
    }
  },
});