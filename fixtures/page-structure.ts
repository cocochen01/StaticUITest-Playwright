/**
 * These helper functions are code that we can repeat for each page (homepage, newest page, etc.) to avoid having to write repetitive functions.
 */
import { test as base, expect, Page, Locator, chromium } from '@playwright/test';
import { Article, getNewestPageFile, HOMEPAGE_FILE, MAX_ARTICLES_PER_PAGE, NEWESTPAGE_COUNT, SAVED_PAGES_FOLDER } from '../global-values';
import { PageObject } from './page-object';
import { NewestPages } from './newest-pages';
import fs from 'fs';

type Fixtures = {
  homepage: PageObject;
  newestPages: NewestPages;
};

export const test = base.extend<Fixtures>({
  homepage: async ({ page }, use) => {
    const homepageContent: string = fs.readFileSync(SAVED_PAGES_FOLDER + "/" + HOMEPAGE_FILE, "utf-8");

    const homepage = new PageObject(page);
    await homepage.setPageContent(homepageContent);
    await use(homepage);
  },
  newestPages: async ({ browser }, use) => {
    let pageArray: Page[] = [];
    let contentArray: string[] = [];
    for(let i = 1; i <= NEWESTPAGE_COUNT; i++) {
      pageArray.push(await browser.newPage());

      const newestPageContent: string = fs.readFileSync(SAVED_PAGES_FOLDER + "/" + getNewestPageFile(i), "utf-8");
      contentArray.push(newestPageContent);
    }
    const newestPages = new NewestPages(pageArray);
    await newestPages.setPagesContent(contentArray);
    await use(newestPages);
  },
});

export async function testForHeaderLinks(pageObject: PageObject) {
  const pagetop: Locator = pageObject.headerLocator;
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

export async function testArticleCount(pageObject: PageObject) {
  const articles: Locator = pageObject.articleElementsLocator;
  const articleCount: number = await articles.count();

  expect(articleCount).toBe(MAX_ARTICLES_PER_PAGE);
}

export async function testArticleForPoints(articleObject: Article) {
  const scoreRegex: RegExp = /^[0-9]+ points?/;
  const score: Locator = articleObject.subtextLocator.locator(".score");
    
  if(await score.count() === 0) {
    // If it has no score, check if it is a job post
    //console.log(`Article ID: ${articleID} has no score, should be a job posting`);
    const titleRegex: RegExp = /^.* \(YC [WS]\d{2}\).*$/;
    const titleText: string = (await articleObject.titleLocator.getByRole("link").first().textContent()) ?? "nullTitle";
    //console.log(titleText);
    expect(titleText).toMatch(titleRegex);
  }
  else {
    const articleID: string = (await articleObject.titleLocator.getAttribute("id")) ?? "nullID";
    const scoreString: string = (await score.getAttribute("id")) ?? "nullScore";
    const scoreID: string = scoreString.split("_")[1];

    expect(articleID).toBe(scoreID);

    //console.log(`Article ID: ${articleID}, Score: ${scoreTextContent}`);
    expect(await score.textContent()).toMatch(scoreRegex);
  }
}

export async function testArticleForTimestamps(articleObject: Article) {
  const articleID: string = (await articleObject.titleLocator.getAttribute("id")) ?? "nullID";
  const timestampHref: string = (await articleObject.subtextLocator.locator(".age > a").getAttribute("href")) ?? "nullTimestamp";

  //console.log(`Timestamp Link: ${timestampHref}`);
  expect(timestampHref).toBe(`item?id=${articleID}`);
}