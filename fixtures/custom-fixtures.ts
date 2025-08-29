import { test as base, Page } from '@playwright/test';
import { NewestPages } from "../page-objects/newest-pages";
import { PageObject } from "../page-objects/page-object";
import { getNewestPageFile, HOMEPAGE_FILE, NEWESTPAGE_COUNT, PASTPAGE_FILE, SAVED_PAGES_FOLDER } from '../global-values';
import fs from 'fs';

interface Fixtures {
  homepage: PageObject;
  newestPages: NewestPages;
  pastPage: PageObject;
};

export const test = base.extend<Fixtures>({
  homepage: async ({ page }, use) => {
    const homepageContent: string = fs.readFileSync(SAVED_PAGES_FOLDER + "/" + HOMEPAGE_FILE, "utf-8");

    const homepage = new PageObject(page);
    await homepage.setPageContent(homepageContent);
    await use(homepage);
  },
  newestPages: async ({ browser }, use) => {
    let pageArray: Page[] = [];
    let contentArray: string[] = [];
    for(let i = 1; i <= NEWESTPAGE_COUNT; i++) {
      pageArray.push(await browser.newPage());

      const newestPageContent: string = fs.readFileSync(SAVED_PAGES_FOLDER + "/" + getNewestPageFile(i), "utf-8");
      contentArray.push(newestPageContent);
    }
    const newestPages = new NewestPages(pageArray);
    await newestPages.setPagesContent(contentArray);
    await use(newestPages);
  },
  pastPage: async ({ page }, use) => {
    const pastPageContent: string = fs.readFileSync(SAVED_PAGES_FOLDER + "/" + PASTPAGE_FILE, "utf-8");

    const pastPage = new PageObject(page);
    await pastPage.setPageContent(pastPageContent);
    await use(pastPage);
  },
});