import { Locator } from '@playwright/test';
export const RATE_LIMIT_TIMER: 500 = 500;

export const MAX_ARTICLES_PER_PAGE: number = 30;
export const ARTICLE_CSV_LENGTH: number = 100;
export const FILENAME_CSV: string = "articles.csv";
export const SAVED_PAGES_FOLDER: string = "saved-pages";
export const TEST_RESULTS_FOLDER: string = "test-results";
export const HOMEPAGE_FILE: string = "homepageContent.html";
export const NEWESTPAGE_COUNT: number = 4;
export function getNewestPageFile(index: number): string {
  return `newestPage${index}Content.html`;
}

export type Article = {
  titleLocator: Locator;
  subtextLocator: Locator;
  spacerLocator: Locator;
};

export type PageNav = "news" | "newest";