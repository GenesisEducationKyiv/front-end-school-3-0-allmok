import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './', 
  testMatch: /.*\.ct\.spec\.tsx$/,
  fullyParallel: true,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',

    ctViteConfig: {
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