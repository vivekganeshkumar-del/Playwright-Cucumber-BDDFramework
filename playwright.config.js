require('dotenv').config();

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/api',
  timeout: 30000,
  workers: 1,
  reporter: ['html',
  {
      outputFolder: 'playwright-report',
      open: 'never'
    }],
  use: {
    trace: 'retain-on-failure'
  }
});

