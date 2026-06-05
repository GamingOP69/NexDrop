import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const baseUrl = (process.env.APP_URL || 'http://127.0.0.1:3000')
  .replace('localhost', '127.0.0.1')
  .replace(/\/+$/, '');

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 5000
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: baseUrl
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], baseURL: baseUrl }
    }
  ],
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1 --port 3000',
    url: baseUrl,
    reuseExistingServer: true,
    timeout: 120_000
  }
};

export default config;
