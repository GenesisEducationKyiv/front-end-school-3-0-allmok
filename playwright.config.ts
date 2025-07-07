import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL  || 'http://localhost:3000';
const apiBaseURL = process.env.VITE_API_URL || 'http://localhost:8000';;

if (!baseURL) {
  throw new Error('BASE_URL environment variable is required');
}

if (!apiBaseURL) {
  throw new Error('VITE_API_URL environment variable is required');
}

const apiURL = apiBaseURL.endsWith('/api') ? apiBaseURL : `${apiBaseURL}/api`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [['html', { open: 'never' }]],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      VITE_API_URL: apiURL,
    },
  },
});