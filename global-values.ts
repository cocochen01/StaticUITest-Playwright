import { expect, Page, Locator } from '@playwright/test';
export const RATE_LIMIT_TIMER: 500 = 500;

export const MAX_ARTICLES_PER_PAGE: number = 30;
export const ARTICLE_CSV_LENGTH: number = 100;
export const SAVED_PAGES_FOLDER: string = "saved-pages";
export const TEST_RESULTS_FOLDER: string = "test-results";
export const HOMEPAGE_FILE: string = "homepageContent.html";
export const COMMENTSPAGE_FILE: string = "commentsPageContent.html";

export type Article = {
  titleLocator: Locator;
  subtextLocator: Locator;
  spacerLocator: Locator;
  id: number;
  
}