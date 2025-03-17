import { test, expect, Page, BrowserContext, Locator } from "@playwright/test";
import { testForHeaderLinks, testArticleCount, testEachArticleForPoints } from "./page-structure";

let thisPage: Page;

test.beforeAll(async ({browser}) => {
  const context: BrowserContext = await browser.newContext();
  thisPage = await context.newPage();
  await thisPage.goto("/news");

  const header: Locator = thisPage.getByRole('cell', { name: 'Hacker News new | past | comments | ask | show | jobs | submit login' }).getByRole('table');
  await header.waitFor({ state: 'visible' });
});

test.describe("Homepage Tests", () => {
  test("Test 1: should have header links", async () => {
    await testForHeaderLinks(thisPage);
  });
  test("Test 2: should have correct article count", async () => {
    await testArticleCount(thisPage);
  });
  test("Test 3: should have points under each article", async () => {
    await testEachArticleForPoints(thisPage);
  });
});