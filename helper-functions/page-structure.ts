/**
 * These helper functions are code that we can repeat for each page (homepage, newest page, etc.) to avoid having to write repetitive functions.
 */
import { expect, Locator } from '@playwright/test';
import { MAX_ARTICLES_PER_PAGE } from '../global-values';
import { PageObject } from '../classes/page-object';

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
