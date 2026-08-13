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
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
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
    // Removidos todos os outros browsers pois não estão disponíveis no container de auditoria (STATUS = ENVIRONMENT BLOCKED). 
    // pois não estão disponíveis no container de auditoria (STATUS = ENVIRONMENT BLOCKED).
  ],
});
