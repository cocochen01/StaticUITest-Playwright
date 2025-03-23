/**
 * These helper functions are code that we can repeat for each page (homepage, newest page, etc.) to avoid having to write repetitive functions.
 */
import { expect, Page, Locator } from '@playwright/test';
import { Article, MAX_ARTICLES_PER_PAGE } from '../global-values';

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
  const articles: Locator = page.locator(".athing");
  const articleCount: number = await articles.count();

  expect(articleCount).toBe(MAX_ARTICLES_PER_PAGE);
}

export async function testEachArticleForPoints(articleObject: Article) {
  const scoreRegex = /^[0-9]+ points?/;
  const score = articleObject.subtextLocator.locator(".score");
    
  if(await score.count() === 0) {
    // If it has no score, check if it is a job post
    //console.log(`Article ID: ${articleID} has no score, should be a job posting`);
    const titleRegex = /^.+ \(YC [WS]\d{2}\).*$/;
    expect(articleObject.titleLocator.textContent()).toMatch(titleRegex);
  }
  else {
    const scoreString = await score.getAttribute("id");
    const scoreID = scoreString ? scoreString.split("_")[1] : "";

    expect(articleObject.id).toBe(scoreID);

    //console.log(`Article ID: ${articleID}, Score: ${scoreTextContent}`);
    expect(await score.textContent()).toMatch(scoreRegex);
  }
  
}

export async function testEachArticleForTimestamps(articleObject: Article) {
  const timestamp = articleObject.subtextLocator.getByText(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2} \d+/);
  const timestampHref = timestamp.getAttribute("href");

  //console.log(`Article ID: ${articleID}, Timestamp Link: ${timestampHrefLink}`);
  expect(timestampHref).toBe(`item?id=${articleObject.id}`);
  
}

export async function saveArticle(page: Page): Promise<Article[]> {
  let articleObjectArray: Article[] = [];

  let table: Locator = page.getByRole("table");
  for (let i = 1; i < MAX_ARTICLES_PER_PAGE + 1; i++) {
    let title: Locator = table.getByRole("row").nth(i * 3 + 1);
    let subtext: Locator = page.getByRole("row").nth(i * 3 + 2);
    let spacer: Locator = page.getByRole("row").nth(i * 3 + 3);
    const IDText:string = (await title.getAttribute("id")) ?? "";
    let id = parseInt(IDText, 10);
    
    articleObjectArray.push({
      titleLocator: title,
      subtextLocator: subtext,
      spacerLocator: spacer,
      id: id
    });
  }
  return articleObjectArray;
}