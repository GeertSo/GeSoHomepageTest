import { test, expect } from '@playwright/test';

test.beforeEach('open homepage', async ({page}) => {
  await page.goto('https://geso-bonn.de/');
});

test('check if Impressum link is available and working', async ({ page }) => {
  await page.getByRole('link', {name: 'Impressum'}).click();
  await expect(page.getByRole('heading', { name: 'Impressum' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Verantwortlich für den Inhalt' })).toBeVisible();
  await page.getByRole('link', {name: 'Datenschutzerklärung'}).click();
  await expect(page.getByRole('heading', { name: 'Datenschutzerklärung' })).toBeVisible();
});

test('check if Datenschutz link is available and working', async ({ page }) => {
  await page.getByRole('link', {name: 'Datenschutz'}).click();
  await expect(page.getByRole('heading', { name: 'Datenschutzerklärung' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hinweis zur verantwortlichen Stelle' })).toBeVisible();
  await expect(page.locator('body')).toContainText('Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist: Dr. Geert Solvie Caspar-David-Friedrich-Str. 45 53125 Bonn E-Mail: contact@geso-bonn.de');
});