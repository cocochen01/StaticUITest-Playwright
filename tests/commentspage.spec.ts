/**
 * Test functions for the Comments page
 */
import { test, expect, Page, BrowserContext } from "@playwright/test";
import { 
  testForHeaderLinks,
  testArticleCount,
  testEachArticleForTimestamps
} from "./page-structure";
import { SAVED_PAGES_FOLDER, COMMENTSPAGE_FILE, MAX_ARTICLES_PER_PAGE } from '../global-values';
import fs from "fs";

let thisPage: Page;

test.beforeAll(async ({ browser }) => {
  let context: BrowserContext = await browser.newContext();
  thisPage = await context.newPage();
  
  const commentsPageContent: string = fs.readFileSync(SAVED_PAGES_FOLDER + "/" + COMMENTSPAGE_FILE, "utf-8");
  thisPage.setContent(commentsPageContent);
});

test.describe("Comments Page Tests", () => {
  test("Test 1: should have header links", async () => {
    await testForHeaderLinks(thisPage);
  });
  test(`Test 2: should have ${MAX_ARTICLES_PER_PAGE} items`, async () => {
    await testArticleCount(thisPage);
  });
  test("Test 3: should have timestamps under each article", async () => {
    await testEachArticleForTimestamps(thisPage);
  });
});