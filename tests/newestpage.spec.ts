/**
 * Test functions for the Newest page
 */
import { expect, Page, Locator, BrowserContext } from "@playwright/test";
import { 
  test,
  testForHeaderLinks,
  testArticleCount,
  //testEachArticleForPoints,
  //testEachArticleForTimestamps,
  //saveArticle
} from "../fixtures/page-structure";
import {
  MAX_ARTICLES_PER_PAGE,
  ARTICLE_CSV_LENGTH,
  SAVED_PAGES_FOLDER,
  TEST_RESULTS_FOLDER,
  Article
} from '../global-values';
import fs from "fs";
import { PageObject } from "../fixtures/page-object";

const FILENAME_CSV: string = "articles.csv";

let thisPage: Page[] = [];
let articleIDArray: number[] = [];
let titlelineArray: string[] = [];
let timestampArray: number[] = [];
let articleLinkArray: string[] = [];

async function createArticlesCSV(){
  for (let i = 0; i < 4; i++) {
    const articleID: Locator = thisPage[i].locator(".athing");
    const titleline: Locator = thisPage[i].locator(".titleline > a:nth-child(1)");
    const timestamp: Locator = thisPage[i].locator(".age");

    const articleIDElements = await articleID.elementHandles();
    const titlelineElements = await titleline.elementHandles();
    const timestampElements = await timestamp.elementHandles();

    for (let j = 0; j < MAX_ARTICLES_PER_PAGE; j++) {
      if (articleIDArray.length >= ARTICLE_CSV_LENGTH)
        break;
      const titlelineText:string = (await titlelineElements[j].textContent()) ?? "";
      const articleIDText:string = (await articleIDElements[j].getAttribute("id")) ?? "";
      const timestampText:string = (await timestampElements[j].getAttribute("title")) ?? "";
      let articleLinkText:string = (await titlelineElements[j].getAttribute("href")) ?? "";

      articleIDArray.push(parseInt(articleIDText, 10));
      titlelineArray.push(titlelineText);
      const timestampString = timestampText.split(" ")[1];
      timestampArray.push(parseInt(timestampString, 10));
      articleLinkText = articleLinkText.includes("item?id=") ? "https://news.ycombinator.com/" + articleLinkText : articleLinkText;
      articleLinkArray.push(articleLinkText);
    }
  }
  await expect(articleIDArray.length).toBe(ARTICLE_CSV_LENGTH);
  await expect(titlelineArray.length).toBe(ARTICLE_CSV_LENGTH);
  await expect(timestampArray.length).toBe(ARTICLE_CSV_LENGTH);
  await expect(articleLinkArray.length).toBe(ARTICLE_CSV_LENGTH);

  writeValuesToCSV(articleIDArray, titlelineArray, timestampArray, articleLinkArray);
}

function writeValuesToCSV(articleIDs, titlelines, timestamps, articleLinks) {
  if (articleIDs.length != ARTICLE_CSV_LENGTH
    || titlelines.length != ARTICLE_CSV_LENGTH
    || timestamps.length != ARTICLE_CSV_LENGTH
    || articleLinks.length != ARTICLE_CSV_LENGTH)
  {
    console.log(`Arrays not size ${ARTICLE_CSV_LENGTH}`)
    return;
  }

  let csvContent = "ID,Title,Timestamp,Link\n";
  for (let i: number = 0; i < articleIDs.length; i++) {
    csvContent += `"${articleIDs[i]}","${titlelines[i]}","${timestamps[i]}","${articleLinks[i]}"\n`;
  }

  fs.writeFileSync(TEST_RESULTS_FOLDER + "/" + FILENAME_CSV, csvContent);
  console.log(`CSV File Path: ${TEST_RESULTS_FOLDER + "/" + FILENAME_CSV}`);
}

test.describe("Newest Pages - Test page structure", () => {
  test("Test 1: should have header links", async ({ newestPages }) => {
    const pagesArray: PageObject[] = await newestPages.getPages();
    for(const page of pagesArray) {
      await testForHeaderLinks(page);
    }
  });
});

test.describe.skip("Newest Page - Test article attributes", () => {
  for (let i: number = 0; i < 4; i++) {/*
    articleObjectArray[i].forEach(articleObject => {
      test(`article ${articleObject.id} has all values`, async () => {
        await expect(articleObject.titleLocator).toBeVisible();
        await expect(articleObject.subtextLocator).toBeVisible();
        await expect(articleObject.spacerLocator).toBeVisible();
        await expect(articleObject.id).toBeGreaterThan(0);
      });
      test("articles should have points in subtext", async () => {
          await testEachArticleForPoints(articleObject);
      });
      test("articles should have timestamp in subtext", async () => {
          await testEachArticleForTimestamps(articleObject);
      });
      
    });*/
  }
});

test.describe.skip("Newest Page - Test articles are displayed in time order", () => {
  test(`first ${ARTICLE_CSV_LENGTH} articles should be sorted in time order`, async () => {
    await createArticlesCSV();
    for (let i: number = 0; i < timestampArray.length - 1; i++) {
      expect(timestampArray[i]).toBeGreaterThanOrEqual(timestampArray[i + 1]);
    }
  });
});