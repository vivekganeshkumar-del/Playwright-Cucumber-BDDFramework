const { test, expect } = require('@playwright/test');

test('TC_001 - Playwright setup verification', async () => {
  expect(1 + 1).toBe(2);
  console.log('Playwright API framework setup is working!');
});