import { test, expect } from '@playwright/test';
import en from './en.json';  // these are the English terms used on the website
import de from './de.json';  // these are the German terms used on the website

const languages = ['de', 'en'];
const multilingual = {de: de , en: en};

// perform check for supported languages
for (const lang of languages) {
  const translator = multilingual[lang as keyof typeof multilingual];
  console.log(`Testing in language ${lang}`);

  test.describe(`Homepage in ${lang}`, () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('https://geso-bonn.de/');

      // click the language which is to be tested
      const idName = '#lang-'+lang;
      await page.locator(idName).click();
    });


    test('check Logo, Name and Title are visible and in viewport', async({page}) => {
      // check that title and subtitle are in viewport
      //const titleLocator = page.locator('[data-i18n="title"]');
      const titleLocator = page.getByTestId('title');
      await expect(titleLocator.getByText(translator.title)).toBeInViewport();
      await expect(titleLocator.getByText(translator.title)).toBeVisible();
      const subTitleLocator = page.getByTestId('subtitle');
      await expect(subTitleLocator.getByText(translator.subtitle)).toBeInViewport();
      await expect(subTitleLocator.getByText(translator.subtitle)).toBeVisible();

      // Check that name is in viewport
      await expect(page.getByText('Dr. Geert Solvie')).toBeVisible();
      await expect(page.getByRole('banner')).toContainText('Dr. Geert Solvie');
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('banner')).toBeInViewport();

      // check that text below name (headertext) is in viewport
      await expect(page.getByRole('banner')).toContainText(translator.headertext);
      await expect(page.getByText(translator.headertext)).toBeInViewport();
      await expect(page.getByText(translator.headertext)).toBeVisible();

      // check that logo is in viewport
      await expect(page.getByRole('img', { name: 'Logo' })).toBeVisible();
      await expect(page.getByRole('img', { name: 'Logo' })).toBeInViewport();
    });


    test(`check headline labels in ${lang} are visible (on Desktop)`, async({page}) => {
      await page.setViewportSize({ width: 1280, height: 900 }); // typical desktop

      // loop over all attibutes in the list and check if the correct text is visible
      const attributesList = ["about", "skills", "offers", "projects", "contact", "certs"];
      for (const attr of attributesList) {
        await expect(page.getByRole('link', { name: translator[attr as keyof typeof translator] })).toBeVisible();
      }
    });

    test(`check clicking links jumps to the internal link in language ${lang} (on Desktop)`, async({page}) => {
      await page.setViewportSize({ width: 1280, height: 900 }); // typical desktop

      // loop over all links in the list: click on link and check if the corresponding section is in viewport
      const linkList = ["about", "skills", "offers", "projects", "contact", "certs"];
      for (const link of linkList) {
        await page.getByRole('link', { name: translator[link as keyof typeof translator] }).click();
        await expect(page.getByRole('heading', { name: translator[link as keyof typeof translator] })).toBeInViewport();
      }
    });

    test(`for each project-card check content in ${lang}`, async({page}) => {
      const projects = page.getByTestId("project-card");
      const count = await projects.count();

      for (let i = 0; i < count; i++) {
        // project title not to be empty
        const projectNtitle = "project"+(i+1)+"title";
        const title = await projects.nth(i).locator('[data-i18n="'+projectNtitle+'"]').textContent();
        expect(title).not.toBeNull();
        expect(title?.trim().length).toBeGreaterThan(0);
        // project title according to the json-entry in correct language
        const titleExpected = translator[projectNtitle as keyof typeof translator];
        expect(title).toBe(titleExpected);
        
        // project description not to be empty
        const projectNdescription = "project"+(i+1)+"description";
        const description = await projects.nth(i).locator('[data-i18n="'+projectNdescription+'"]').textContent();
        expect(description).not.toBeNull(); 
        expect(description?.trim().length).toBeGreaterThan(0);
        // project description according to the json-entry in correct language
        const descriptionExpected = translator[projectNtitle as keyof typeof translator];
        expect(title).toBe(descriptionExpected);

        // at least 1 image to be visible and loaded
        const images = projects.nth(i).getByRole('img');
        await expect(images.first()).toBeVisible();
        const isLoaded = await images.first().evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
        expect(isLoaded).toBe(true);
      }
    });
  });
}
