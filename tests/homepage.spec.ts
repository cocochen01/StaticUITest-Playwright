import { test, expect, Page, BrowserContext, Locator } from "@playwright/test";
import { testForHeaderLinks, testArticleCount, testEachArticleForPoints } from "./page-structure";
import { SAVED_PAGES_FOLDER, HOMEPAGE_FILE } from '../global-values';
import fs from "fs";

let thisPage: Page;

test.beforeAll(async ({ browser }) => {
  let context = await browser.newContext();
  thisPage = await context.newPage();
  
  const homePageContent: string = fs.readFileSync(SAVED_PAGES_FOLDER + "/" + HOMEPAGE_FILE, "utf-8");
  thisPage.setContent(homePageContent);
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