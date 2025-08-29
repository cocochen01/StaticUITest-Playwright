import { Locator } from "playwright";
import { test } from "../fixtures/custom-fixtures";
import { MAX_ARTICLES_PER_PAGE } from "../global-values";
import { testArticleArrayForRank, testArticleForExternalLink, testArticleForPoints, testArticleForTimestamps, testArticleForUpvote } from "../helper-functions/article-structure";
import { testArticleCount, testForHeaderLinks } from "../helper-functions/page-structure";
import { expect } from "playwright/test";

test.describe("Past Page - Test page structure", () => {
  test("should have header links", async ({ pastPage }) => {
    await testForHeaderLinks(pastPage);
  });
  test(`should have ${MAX_ARTICLES_PER_PAGE} articles on page`, async ({ pastPage }) => {
    await testArticleCount(pastPage);
  });
});

test.describe("Past Page - Test article attributes", () => {
  test("should have rank for each article", async ({ pastPage }) => {
    await testArticleArrayForRank(pastPage.articleObjectArray);
  });
  test("should have upvote link for each article (not job posting)", async ({ pastPage }) => {
    for(const articleObject of pastPage.articleObjectArray) {
        await testArticleForUpvote(articleObject, "front");
    }
  });
  test("should have external link for each article (not Ask HN)", async ({ pastPage }) => {
    for(const articleObject of pastPage.articleObjectArray) {
        await testArticleForExternalLink(articleObject);
    }
  });
  test("should have points under each article (not job posting)", async ({ pastPage }) => {
    for(const articleObject of pastPage.articleObjectArray) {
      await testArticleForPoints(articleObject);
    }
  });
  test("should have timestamps under each article", async ({ pastPage }) => {
    for(const articleObject of pastPage.articleObjectArray) {
      await testArticleForTimestamps(articleObject);
    }
  });
});