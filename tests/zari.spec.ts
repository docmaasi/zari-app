import { test, expect } from '@playwright/test';

// ─── PUBLIC PAGES ───────────────────────────────────────────────────────────

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});

test('pricing page loads', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.locator('body')).toBeVisible();
});

// ─── SEO / LANDING PAGES ─────────────────────────────────────────────────────

test('ai companion landing page loads', async ({ page }) => {
  await page.goto('/ai-companion');
  await expect(page.locator('body')).toBeVisible();
});

test('ai friend spanish landing page loads', async ({ page }) => {
  await page.goto('/ai-friend-spanish');
  await expect(page.locator('body')).toBeVisible();
});

test('ai that remembers landing page loads', async ({ page }) => {
  await page.goto('/ai-that-remembers');
  await expect(page.locator('body')).toBeVisible();
});

// ─── LEGAL PAGES ────────────────────────────────────────────────────────────

test('privacy page loads', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.locator('body')).toBeVisible();
});

test('terms page loads', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.locator('body')).toBeVisible();
});

test('cookies page loads', async ({ page }) => {
  await page.goto('/cookies');
  await expect(page.locator('body')).toBeVisible();
});

// ─── AUTH PAGES ──────────────────────────────────────────────────────────────

test('sign-in page loads and has form', async ({ page }) => {
  await page.goto('/sign-in');
  await expect(page.locator('input[type="email"], input[type="text"]').first()).toBeVisible();
});

test('sign-up page loads', async ({ page }) => {
  await page.goto('/sign-up');
  await expect(page.locator('body')).toBeVisible();
});

// ─── AUTH PROTECTION ─────────────────────────────────────────────────────────
// NOTE: Stripe still being configured — payment flows not tested yet

test.skip('chat page redirects when logged out', async ({ page }) => {
  await page.goto('/chat');
  await expect(page).toHaveURL(/sign-in|login|auth/i);
});

test.skip('journal page redirects when logged out', async ({ page }) => {
  await page.goto('/journal');
  await expect(page).toHaveURL(/sign-in|login|auth/i);
});

test.skip('mood page redirects when logged out', async ({ page }) => {
  await page.goto('/mood');
  await expect(page).toHaveURL(/sign-in|login|auth/i);
});

test.skip('sleep page redirects when logged out', async ({ page }) => {
  await page.goto('/sleep');
  await expect(page).toHaveURL(/sign-in|login|auth/i);
});

test.skip('memories page redirects when logged out', async ({ page }) => {
  await page.goto('/memories');
  await expect(page).toHaveURL(/sign-in|login|auth/i);
});

test.skip('voice notes page redirects when logged out', async ({ page }) => {
  await page.goto('/voice-notes');
  await expect(page).toHaveURL(/sign-in|login|auth/i);
});
