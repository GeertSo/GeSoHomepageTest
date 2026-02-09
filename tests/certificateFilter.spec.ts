import { test, expect } from '@playwright/test';

const filters = [
  {'filter': 'card', 'name': 'All'},
  {'filter': 'ai', 'name': 'AI / Machine Learning'},
  {'filter': 'sweng', 'name': 'Software Engineering'},
  {'filter': 'cloud', 'name': 'Cloud / Kubernetes'},
  {'filter': 'mobile', 'name': 'Mobile / Android / Kotlin'},
  {'filter': 'web', 'name': 'Web / Front‑End'},
  {'filter': 'language', 'name': 'Programming Languages'},
  {'filter': 'testing', 'name': 'Testing / QA'}
];
const filterCount = filters.length;

test.beforeEach('open homepage', async ({page}) => {
  await page.goto('https://geso-bonn.de/');
});

test(
  'check if all filters are visible', async ({ page }) => {
  for (let f=0; f < filterCount; f++) {
    await expect(page.getByRole('button', { name: filters[f].name })).toBeVisible();
  } 
});

test(
  'check if filter AI/Machine Learning shows only relevant cards', async ({ page }) => {
  const cards = page.locator('[data-title]');
  const count = await cards.count();

  for (let f=0; f < filterCount; f++) {
    page.getByRole('button', { name: filters[f].name }).first().click();
    const regex = new RegExp(`\\b${filters[f].filter}\\b`);
    let visibleCount = 0;
    for (let i=0; i < count; i++) {
      const card = cards.nth(i);
      const classAttribute = await card.getAttribute('class');
      //console.log("classAttribute = "+ classAttribute + " filters[f].filter = "+ filters[f].filter);
      if (regex.test(classAttribute?? '')) {
        await expect(card).toBeVisible();
        visibleCount++;
      } else {
        await expect(card).not.toBeVisible();
      }
    }
    console.log(visibleCount + "cards are visible with filter "+filters[f].name);
  }
});

