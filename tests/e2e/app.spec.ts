import { test, expect } from '@playwright/test';

test('homepage loads and shows NexDrop branding', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/NexDrop/i);
  await expect(page.getByRole('link', { name: /NexDrop/i })).toBeVisible();
});

test('login page is available', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible({ timeout: 15000 });
  await expect(page.getByLabel('Email')).toBeVisible({ timeout: 15000 });
  await expect(page.getByLabel('Password')).toBeVisible({ timeout: 15000 });
});
