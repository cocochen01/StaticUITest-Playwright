import { expect, Page, Locator } from '@playwright/test';

const MAX_ARTICLES: 30 = 30;

export async function testForHeaderLinks(page: Page) {
  const header: Locator = page.getByRole('cell', { name: 'Hacker News new | past | comments | ask | show | jobs | submit login' }).getByRole('table');
  
  console.log("Header should be visible");
  await expect(header).toBeVisible();
}

export async function testArticleCount(page: Page) {
  const articles: Locator = page.locator(".athing.submission");
  const articleCount: number = await articles.count();

  console.log(`PageStructure - Number of articles on this page: ${articleCount}`);
  await expect(articleCount).toBe(MAX_ARTICLES);
}

export async function testEachArticleForPoints(page: Page) {
  const articles = page.locator(".athing.submission");
    const subtext = page.locator(".subtext");

    const scoreRegex = /^[0-9]+ points?/;

    for (let i = 0; i < MAX_ARTICLES; i++) {
      const articleID = await articles.nth(i).getAttribute("id");
      const score = subtext.nth(i).locator(".score");
      
      if(await score.count() === 0) {
        console.log(`Article ID: ${articleID} has no score`);
      }
      else {
        const scoreString = await score.getAttribute("id");
        const scoreID = scoreString ? scoreString.split("_")[1] : "";

        await expect(articleID).toBe(scoreID);

        const scoreTextContent = await score.textContent();
        console.log(`Article ID: ${articleID}, Score: ${scoreTextContent}`);
        await expect(scoreTextContent).toMatch(scoreRegex);
      }
    }
}