/// <reference types="vitest" /> 

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ 
      filename: 'build-stats.html', 
      open: true, 
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',   
      '**/*.ct.spec.tsx', 
      '**/tests/**', 
      '**/tests-examples/**'
    ],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true,
      }
    }
  },
  build: {
    sourcemap: true,
  },
});