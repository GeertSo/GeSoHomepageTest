import { test, expect } from '@playwright/test';

test.beforeEach('open homepage', async ({page}) => {
    await page.goto('https://geso-bonn.de/');
});

test('check headline labels are NOT visible on small screens (e.g. mobile)', async({page}) => {
    await page.setViewportSize({ width: 375, height: 800 }); // iPhone-ish

    const headerlocator = page.locator('header');
    const navigationbar = headerlocator.locator('nav');
    await expect(navigationbar).not.toBeVisible();

    // loop over all attibutes in the list and check if the correct text is visible
    const attributesList = ["about", "skills", "offers", "projects", "contact", "certs"];
    for (const attr of attributesList) {
        await expect(navigationbar.locator('[data-i18n="'+attr+'"]')).not.toBeVisible();
    }
});

test('filter-bar is hidden on mobile and visible on Desktop', async ({ page }) => {
  const filterBar = page.locator('.filter-bar');

  // --- Mobile viewport ---
  await page.setViewportSize({ width: 375, height: 800 }); // iPhone-ish
  await expect(filterBar).toBeHidden();

  // --- Desktop viewport ---
  await page.setViewportSize({ width: 1280, height: 900 }); // typical desktop
  await expect(filterBar).toBeVisible();
});
