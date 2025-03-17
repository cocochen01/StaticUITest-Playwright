import { expect, Page, Locator } from '@playwright/test';
import { MAX_ARTICLES } from '../global-values';

export async function testForHeaderLinks(page: Page) {
  await Promise.all([
    expect(page.getByRole('link', { name: 'Hacker News', exact: true })).toBeVisible(),
    expect(page.getByRole('link', { name: 'new', exact: true })).toBeVisible(),
    expect(page.getByRole('link', { name: 'past', exact: true })).toBeVisible(),
    expect(page.getByRole('link', { name: 'comments', exact: true })).toBeVisible(),
    expect(page.getByRole('link', { name: 'ask', exact: true })).toBeVisible(),
    expect(page.getByRole('link', { name: 'show', exact: true })).toBeVisible(),
    expect(page.getByRole('link', { name: 'jobs', exact: true })).toBeVisible(),
    expect(page.getByRole('link', { name: 'submit', exact: true })).toBeVisible(),
  ]);
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
      // If it has no score check if it is internal post
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