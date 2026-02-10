import { test, expect } from '@playwright/test';

const numberOfProjectsExpected = 6;

test.beforeEach(async ({ page }) => {
      await page.goto('https://geso-bonn.de/');
    });

test('check number of project cards is at least NN', async({page}) => {
  const projects = page.getByTestId("project-card");
  const count = await projects.count();
  console.log("number of projects found = "+count)
  expect(count).toBeGreaterThanOrEqual(numberOfProjectsExpected);
});

test('for each project-card check content', async({page}) => {
  const projects = page.getByTestId("project-card");
  const count = await projects.count();
  for (let i = 0; i < count; i++) {
    // project title not to be empty
    const projectNtitle = "project"+(i+1)+"title";
    const title = await projects.nth(i).locator('[data-i18n="'+projectNtitle+'"]').textContent();
    expect(title).not.toBeNull(); 
    expect(title?.trim().length).toBeGreaterThan(0);
    // project description not to be empty
    const projectNdescription = "project"+(i+1)+"description";
    const description = await projects.nth(i).locator('[data-i18n="'+projectNdescription+'"]').textContent();
    expect(description).not.toBeNull(); 
    expect(description?.trim().length).toBeGreaterThan(0);
    // at least 1 image to be visible and loaded
    const images = projects.nth(i).getByRole('img');
    await expect(images.first()).toBeVisible();
    const isLoaded = await images.first().evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
    expect(isLoaded).toBe(true);
}
});