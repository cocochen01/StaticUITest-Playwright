/**
 * Test functions for the Homepage
 */
//import { test, expect, Page } from "@playwright/test";
import { 
  test,
  testForHeaderLinks,
  testArticleCount,
  testEachArticleForPoints,
  testEachArticleForTimestamps
} from "../fixtures/page-structure";
import { MAX_ARTICLES_PER_PAGE } from "../global-values";

test.describe("Homepage - Test page structure", () => {
  test("Test 1: should have header links", async ({ homepage }) => {
    await testForHeaderLinks(homepage);
  });
  test(`Test 2: should have ${MAX_ARTICLES_PER_PAGE} articles on page`, async ({ homepage }) => {
    await testArticleCount(homepage);
  });
});

test.describe("Homepage - Test article attributes", () => {
  test("Test 4: should have points under each article", async ({ homepage }) => {
    for(const articleObject of homepage.articleObjectArray) {
      await testEachArticleForPoints(articleObject);
    }
  });
  test("Test 5: should have timestamps under each article", async ({ homepage }) => {
    for(const articleObject of homepage.articleObjectArray) {
      await testEachArticleForTimestamps(articleObject);
    }
  })
});