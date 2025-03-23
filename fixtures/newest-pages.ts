import type { Page } from '@playwright/test';
import { NEWESTPAGE_COUNT } from '../global-values';
import { PageObject } from './page-object';

export class NewestPages {
  private pageObjectArray: PageObject[];

  constructor(public readonly pages:Page[]) {
    this.pageObjectArray = [];

    for(const page of pages) {
      this.pageObjectArray.push(new PageObject(page));
    }
  }

  async setPagesContent(contentArr: string[]) {
    for(let i = 0; i < NEWESTPAGE_COUNT; i++) {
      await this.pageObjectArray[i].setPageContent(contentArr[i]);
    }
  }
  async getPages() {
    return this.pageObjectArray;
  }
}