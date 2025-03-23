/**
 * These helper functions are code that we can repeat for each page (homepage, newest page, etc.) to avoid having to write repetitive functions.
 */
import { test as base, expect, Page, Locator } from '@playwright/test';
import { Article, MAX_ARTICLES_PER_PAGE } from '../global-values';
import { Homepage } from './homepage';

type Fixtures = {
  homepage: Homepage;

};

export const test = base.extend<Fixtures>({
  homepage: async ({page}, use) => {
    const homepage = new Homepage(page);
    await homepage.setPageContent();
    await use(homepage);
  },
});

export async function testForHeaderLinks(homepage: Homepage) {
  const pagetop = homepage.headerLocator;
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

export async function testArticleCount(homepage: Homepage) {
  const articles: Locator = homepage.articleElementsLocator;
  const articleCount: number = await articles.count();

  expect(articleCount).toBe(MAX_ARTICLES_PER_PAGE);
}

export async function testEachArticleForPoints(articleObject: Article) {
  const scoreRegex = /^[0-9]+ points?/;
  const score = articleObject.subtextLocator.locator(".score");
    
  if(await score.count() === 0) {
    // If it has no score, check if it is a job post
    //console.log(`Article ID: ${articleID} has no score, should be a job posting`);
    const titleRegex = /^.* \(YC [WS]\d{2}\).*$/;
    const titleText = await articleObject.titleLocator.locator(".titleline").textContent();
    expect(titleText).toMatch(titleRegex);
  }
  else {
    const articleID = await articleObject.titleLocator.getAttribute("id");
    const scoreString = await score.getAttribute("id");
    const scoreID = scoreString ? scoreString.split("_")[1] : "";

    expect(articleID).toBe(scoreID);

    //console.log(`Article ID: ${articleID}, Score: ${scoreTextContent}`);
    expect(await score.textContent()).toMatch(scoreRegex);
  }
}

export async function testEachArticleForTimestamps(articleObject: Article) {
  const timestamp = articleObject.subtextLocator.getByText(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2} \d+/);
  const timestampHref = await articleObject.subtextLocator.locator(".age > a").getAttribute("href");

  //console.log(`Timestamp Link: ${timestampHref}`);
  expect(timestampHref).toBe(`item?id=${await articleObject.titleLocator.getAttribute("id")}`);
}