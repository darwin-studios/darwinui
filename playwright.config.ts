import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  webServer: { command: 'pnpm dev --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
  use: { baseURL: 'http://127.0.0.1:4173' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
});
