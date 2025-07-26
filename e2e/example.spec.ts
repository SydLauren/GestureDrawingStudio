import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Hi There! This template has:').click();

  await page.getByTestId('neat-btn').click();
  await page.getByTestId('neat-btn').click();
  await page.getByTestId('neat-btn').click();

  await expect(page.getByText('Neat counter: 3')).toBeDefined;
});
