import { test, expect } from '@playwright/test';

const numberOfCertificatesExpected = 108;

test.beforeEach(async ({ page }) => {
      await page.goto('https://geso-bonn.de/');
    });

test('check number of certificates is at least NN', async({page}) => {
  const cards = page.locator('[data-title]');
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(numberOfCertificatesExpected);
});

test('for each certificate/card check if it has a non-empty attributes', async({page}) => {
  const cards = page.locator('[data-title]');
  const count = await cards.count();
  
  for (let i = 0; i < count; i++) {
    const title = await cards.nth(i).getAttribute('data-title'); 
    expect(title).not.toBeNull(); 
    expect(title?.trim().length).toBeGreaterThan(0);

    if (title) {
      const card = page.locator('.card[data-title="'+title+'"]');
      await expect(card.getByText(title)).toBeVisible();

      // check that all required attributes of card are being set
      //await expect(card).toHaveAttribute('data-title', /.+/);
      await expect(card).toHaveAttribute('data-provider', /.+/);
      await expect(card).toHaveAttribute('data-date', /.+/);
      //await expect(card).toHaveAttribute('data-url', /https?:\/\//); // there is not a url for each certificate available
      await expect(card).toHaveAttribute('data-pdfcertname', /.+pdf/);

      // check that the image is visible and has been loaded successfully
      const img = card.locator('img');
      await expect(img).toBeVisible();
      const isLoaded = await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
      expect(isLoaded).toBe(true);
    }
  }
});