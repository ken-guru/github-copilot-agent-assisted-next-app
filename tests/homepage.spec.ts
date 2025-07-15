import { test, expect } from '@playwright/test';

test('homepage loads and displays expected content', async ({ page }) => {
  await page.goto('/');
  // Wait for splash screen to disappear if present
  await page.waitForSelector('header h1', { state: 'visible' });
  const header = page.locator('header h1');
  await expect(header).toBeVisible();
  await expect(header).not.toHaveText('404');
});
