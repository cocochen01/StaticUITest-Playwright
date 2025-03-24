/**
 * Test functions for the Homepage
 */
import { test } from "../fixtures/custom-fixtures.ts";
import { MAX_ARTICLES_PER_PAGE } from "../global-values";
import { testArticleForPoints, testArticleArrayForRank, testArticleForTimestamps, testArticleForUpvote, testArticleForExternalLink } from "../helper-functions/article-structure.ts";
import { testArticleCount, testForHeaderLinks } from "../helper-functions/page-structure.ts";

// Homepage is a custom page fixture
test.describe("Homepage - Test page structure", () => {
  test("should have header links", async ({ homepage }) => {
    await testForHeaderLinks(homepage);
  });
  test(`should have ${MAX_ARTICLES_PER_PAGE} articles on page`, async ({ homepage }) => {
    await testArticleCount(homepage);
  });
});

test.describe("Homepage - Test article attributes", () => {
  test("should have rank for each article", async ({ homepage }) => {
    await testArticleArrayForRank(homepage.articleObjectArray);
  });
  test("should have upvote link for each article (not job posting)", async ({ homepage }) => {
    for(const articleObject of homepage.articleObjectArray) {
        await testArticleForUpvote(articleObject, "news");
    }
  });
  test("should have external link for each article (not Ask HN)", async ({ homepage }) => {
    for(const articleObject of homepage.articleObjectArray) {
        await testArticleForExternalLink(articleObject);
    }
  });
  test("should have points under each article (not job posting)", async ({ homepage }) => {
    for(const articleObject of homepage.articleObjectArray) {
      await testArticleForPoints(articleObject);
    }
  });
  test("should have timestamps under each article", async ({ homepage }) => {
    for(const articleObject of homepage.articleObjectArray) {
      await testArticleForTimestamps(articleObject);
    }
  })
});