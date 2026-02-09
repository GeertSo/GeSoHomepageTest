import { test, expect } from '@playwright/test';

// there is a problem that coursera does not reply fast if you ask for a number of certificates fast after each other
const testurl = false;  

test.beforeEach('open homepage', async ({page}) => {
  await page.goto('https://geso-bonn.de/');
});

test(
  'check if each card opens a modal with appropriate info and clicking on pdfcert/url displays info', 
  async ({ page, browserName }, 
    testInfo) => {
  testInfo.setTimeout(180000); // 180 seconds - opening the coursera URLs takes long - 180 sec is only enough for 62 cards!!!
  const cards = page.locator('[data-title]');
  const count = await cards.count();
  const modal = page.locator('[id="modal"]');
  // Modal should not be visible initially 
  await expect(modal).toBeHidden();
  
  for (let i=0; i < count; i++) {
  const title = await cards.nth(i).getAttribute('data-title');
  console.log("#"+i+" title = "+title);
  if (title) {
    const card = page.locator('.card[data-title="'+title+'"]');
    await expect(card.getByText(title)).toBeVisible();

    const url = await card.getAttribute('data-url');  // url can be null
    const pdfcertname = await card.getAttribute('data-pdfcertname');  // pdfcertname can be null
    const provider = await card.getAttribute('data-provider');
    

    console.log("url = "+url);
    console.log("pdfcertname = "+pdfcertname);

    card.getByRole("button",{ name: "View Certificate"}).first().click();
    await expect(modal).not.toBeHidden();

    expect(page.getByText('Certificate', { exact: true })).toBeVisible;
    expect(page.getByText('Title', { exact: true })).toBeVisible;
    expect(page.getByText(title, { exact: true })).toBeVisible;
    expect(page.getByText('Course provided by', { exact: true })).toBeVisible;
    provider?expect(page.getByText(provider, { exact: true })).toBeVisible : null;
    expect(page.getByText('Date of Certification', { exact: true })).toBeVisible;
  
    if (pdfcertname) {
      const page1Promise = page.waitForEvent('popup');
      await page.getByRole('link', { name: 'View PDF Certificate' }).click();
      const page1 = await page1Promise;
      page1.close();
    }
    if (url && testurl) {
      const page2Promise = page.waitForEvent('popup');
      await page.getByRole('link', { name: url }).click();
      const page2 = await page2Promise;
      page2.close();
    }

    await page.getByRole('button', { name: 'Cancel' }).click();
  }
  await expect(modal).toBeHidden();
}
});

