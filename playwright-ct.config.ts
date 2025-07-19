import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './', 
  testMatch: /.*\.ct\.spec\.tsx$/,
  fullyParallel: true,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
    ctViteConfig: {
      esbuild: {
        target: 'es2020'
      },
      define: {
        global: 'globalThis'
      }
    },
    ctTemplateDir: './playwright'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});