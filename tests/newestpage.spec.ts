/**
 * Test functions for the Newest page
 */
import { expect, Page, Locator, BrowserContext, chromium } from "@playwright/test";
import { 
  test,
  testForHeaderLinks,
  testArticleCount,
  testArticleForPoints,
  //testEachArticleForPoints,
  //testEachArticleForTimestamps,
  //saveArticle
} from "../fixtures/page-structure";
import {
  MAX_ARTICLES_PER_PAGE,
  ARTICLE_CSV_LENGTH,
  SAVED_PAGES_FOLDER,
  TEST_RESULTS_FOLDER,
  Article,
  NEWESTPAGE_COUNT
} from '../global-values';
import fs from "fs";
import { PageObject } from "../fixtures/page-object";

const FILENAME_CSV: string = "articles.csv";

let articleIDArray: number[] = [];
let titleTextArray: string[] = [];
let timestampArray: number[] = [];
let articleLinkArray: string[] = [];

async function writeValuesToCSV() {
  await expect(articleIDArray.length).toBe(ARTICLE_CSV_LENGTH);
  await expect(titleTextArray.length).toBe(ARTICLE_CSV_LENGTH);
  await expect(timestampArray.length).toBe(ARTICLE_CSV_LENGTH);
  await expect(articleLinkArray.length).toBe(ARTICLE_CSV_LENGTH);

  let csvContent = "ID,Title,Timestamp,Link\n";
  for (let i: number = 0; i < articleIDArray.length; i++) {
    csvContent += `"${articleIDArray[i]}","${titleTextArray[i]}","${timestampArray[i]}","${articleLinkArray[i]}"\n`;
  }

  fs.writeFileSync(TEST_RESULTS_FOLDER + "/" + FILENAME_CSV, csvContent);
  console.log(`CSV File Path: ${TEST_RESULTS_FOLDER + "/" + FILENAME_CSV}`);
}

test.describe("Newest Pages - Test page structure", () => {
  test("Test 1: should have header links on each page", async ({ newestPages }) => {
    const pageObjectArray: PageObject[] = await newestPages.getPages();
    for(const pageObject of pageObjectArray) {
      await testForHeaderLinks(pageObject);
    }
  });
});

test.describe("Newest Pages - Test article attributes", () => {
  test("Test 1: should have points under every article of each page", async ({ newestPages }) => {
    const pageObjectArray: PageObject[] = await newestPages.getPages();
    for(const pageObject of pageObjectArray) {
      for(const articleObject of pageObject.articleObjectArray) {
        testArticleForPoints(articleObject);
      }
    }
  });
  test("Test 2: should have timestamps under every article of each page", async ({ newestPages }) => {
    const pageObjectArray: PageObject[] = await newestPages.getPages();
    for(const pageObject of pageObjectArray) {
      for(const articleObject of pageObject.articleObjectArray) {
        testArticleForPoints(articleObject);
      }
    }
  });
});

test.describe("Newest Pages - Verify article order", () => {
  test(`Test 1: first ${ARTICLE_CSV_LENGTH} articles are sorted in time order`, async ({ newestPages }) => {
    const pageObjectArray: PageObject[] = await newestPages.getPages();
    for(const pageObject of pageObjectArray) {
      for(const articleObject of pageObject.articleObjectArray) {
        if(articleIDArray.length >= ARTICLE_CSV_LENGTH) {
          break;
        }
        const articleID: string = (await articleObject.titleLocator.getAttribute("id")) ?? "nullID";
        const titleText: string = (await articleObject.titleLocator.getByRole("link").nth(1).textContent()) ?? "nullTitle";
        const timestampText: string = (await articleObject.subtextLocator.locator(".age").getAttribute("title")) ?? "nullTimestamp";
        const articleLink: string = (await articleObject.titleLocator.getByRole("link").nth(1).getAttribute("href")) ?? "nullArticlLink";
        articleIDArray.push(parseInt(articleID, 10));
        titleTextArray.push(titleText);
        timestampArray.push(parseInt(timestampText.split(" ")[1], 10));
        articleLinkArray.push(articleLink);
      }
    }
    await writeValuesToCSV();
    
    for (let i = 0; i < timestampArray.length - 1; i++) {
      expect(timestampArray[i]).toBeGreaterThanOrEqual(timestampArray[i + 1]);
    }
  });
});