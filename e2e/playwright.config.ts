import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: '../certification/playwright-report' }],
    ['json', { outputFile: '../certification/playwright-report/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3030', // Default Dashboard port
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome (375px)',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari (375px)',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
