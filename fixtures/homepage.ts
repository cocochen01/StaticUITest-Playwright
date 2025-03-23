import type { Page, Locator } from '@playwright/test';
import { Article, HOMEPAGE_FILE, MAX_ARTICLES_PER_PAGE, SAVED_PAGES_FOLDER } from '../global-values';
import fs from 'fs';

export class Homepage {
  public readonly headerLocator: Locator;
  public readonly articleElementsLocator: Locator;
  public articleObjectArray: Article[];

  constructor(public readonly page: Page) {
    this.headerLocator = this.page.getByRole('cell', { name: 'Hacker News new | past | comments | ask | show | jobs | submit login' }).getByRole('table');
    this.articleElementsLocator = this.page.locator(".athing");
    this.articleObjectArray = [];

    let table: Locator = this.page.getByRole("table");
    for (let i = 1; i < MAX_ARTICLES_PER_PAGE + 1; i++) {
      let title: Locator = table.getByRole("row").nth(i * 3 + 1);
      let subtext: Locator = page.getByRole("row").nth(i * 3 + 2);
      let spacer: Locator = page.getByRole("row").nth(i * 3 + 3);
      
      this.articleObjectArray.push({
        titleLocator: title,
        subtextLocator: subtext,
        spacerLocator: spacer
      });
    }
  }

  async setPageContent() {
    const homePageContent: string = fs.readFileSync(SAVED_PAGES_FOLDER + "/" + HOMEPAGE_FILE, "utf-8");
    await this.page.setContent(homePageContent);
  }
}