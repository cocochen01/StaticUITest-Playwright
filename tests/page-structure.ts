import { expect, Page, Locator } from '@playwright/test';
import { MAX_ARTICLES_PER_PAGE } from '../global-values';

export async function testForHeaderLinks(page: Page) {
  const pagetop = page.locator(".pagetop").first();
  await expect(pagetop).toBeVisible();
  await Promise.all([
    expect(pagetop.getByRole('link', { name: 'Hacker News', exact: true })).toBeVisible(),
    expect(pagetop.getByRole('link', { name: 'new', exact: true })).toBeVisible(),
    expect(pagetop.getByRole('link', { name: 'past', exact: true })).toBeVisible(),
    expect(pagetop.getByRole('link', { name: 'comments', exact: true })).toBeVisible(),
    expect(pagetop.getByRole('link', { name: 'ask', exact: true })).toBeVisible(),
    expect(pagetop.getByRole('link', { name: 'show', exact: true })).toBeVisible(),
    expect(pagetop.getByRole('link', { name: 'jobs', exact: true })).toBeVisible(),
    expect(pagetop.getByRole('link', { name: 'submit', exact: true })).toBeVisible(),
  ]);
}

export async function testArticleCount(page: Page) {
  const articles: Locator = page.locator(".athing.submission");
  const articleCount: number = await articles.count();

  await expect(articleCount).toBe(MAX_ARTICLES_PER_PAGE);
}

export async function testEachArticleForPoints(page: Page) {
  const articles = page.locator(".athing.submission");
  const subtext = page.locator(".subtext");

  const scoreRegex = /^[0-9]+ points?/;

  for (let i = 0; i < MAX_ARTICLES_PER_PAGE; i++) {
    const articleID = await articles.nth(i).getAttribute("id");
    const score = subtext.nth(i).locator(".score");
    
    if(await score.count() === 0) {
      // If it has no score, check if it is internal post
      //console.log(`Article ID: ${articleID} has no score, should be internal article from ycombinator.com`);
      await expect(await articles.nth(i).getByRole('link', { name: 'ycombinator.com', exact: true}).count()).toBe(1);
    }
    else {
      const scoreString = await score.getAttribute("id");
      const scoreID = scoreString ? scoreString.split("_")[1] : "";

      await expect(articleID).toBe(scoreID);

      const scoreTextContent = await score.textContent();
      //console.log(`Article ID: ${articleID}, Score: ${scoreTextContent}`);
      await expect(scoreTextContent).toMatch(scoreRegex);
    }
  }
}

export async function testEachArticleForTimestamps(page: Page) {
  const articles = page.locator(".athing.submission");
  const timestamp = page.locator(".age");
  const timestampHref = timestamp.locator("a");

  for (let i = 0; i < MAX_ARTICLES_PER_PAGE; i++) {
    const articleID = await articles.nth(i).getAttribute("id");
    const timestampHrefLink = await timestampHref.nth(i).getAttribute("href");

    //console.log(`Article ID: ${articleID}, Timestamp Link: ${timestampHrefLink}`);
    await expect(timestampHrefLink).toBe(`item?id=${articleID}`);
  }
}