/**
 * Test functions for the Homepage
 */
//import { test, expect, Page } from "@playwright/test";
import { 
  test,
  testForHeaderLinks,
  testArticleCount,
  testArticleForPoints,
  testArticleForTimestamps
} from "../fixtures/page-structure";
import { MAX_ARTICLES_PER_PAGE } from "../global-values";
// Homepage is a an custom text fixture
test.describe("Homepage - Test page structure", () => {
  test("Test 1: should have header links", async ({ homepage }) => {
    await testForHeaderLinks(homepage);
  });
  test(`Test 2: should have ${MAX_ARTICLES_PER_PAGE} articles on page`, async ({ homepage }) => {
    await testArticleCount(homepage);
  });
});

test.describe("Homepage - Test article attributes", () => {
  test("Test 1: should have points under each article", async ({ homepage }) => {
    for(const articleObject of homepage.articleObjectArray) {
      await testArticleForPoints(articleObject);
    }
  });
  test("Test 2: should have timestamps under each article", async ({ homepage }) => {
    for(const articleObject of homepage.articleObjectArray) {
      await testArticleForTimestamps(articleObject);
    }
  })
});