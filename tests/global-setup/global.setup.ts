/**
 * In setup file, we store all the pages we need before any of the tests run.
 * This is so that we don't need to open new pages for each test if the test doesn't require any clicks, navigations, or any kind of change to the page.
 * It also allows me not repeatedly send requests to the Hacker News servers while I test my tests.
 * All because sending too many requests got me ip banned :D
 */
import { chromium, test as setup, Browser, BrowserContext } from '@playwright/test';
import fs from "fs";
import { RATE_LIMIT_TIMER, SAVED_PAGES_FOLDER, TEST_RESULTS_FOLDER, HOMEPAGE_FILE, PASTPAGE_FILE } from '../../global-values';

setup('Preload pages', async () => {
  console.log('Running setup...');
  
  const browser: Browser = await chromium.launch();
  const context: BrowserContext = await browser.newContext();

  // If folder does not exist, create folder
  if (!fs.existsSync(SAVED_PAGES_FOLDER)) {
    fs.mkdirSync(SAVED_PAGES_FOLDER, { recursive: true })
  }
  if (!fs.existsSync(TEST_RESULTS_FOLDER)) {
    fs.mkdirSync(TEST_RESULTS_FOLDER, { recursive: true })
  }

  // Store homepage, 4 pages from newest page, and comments page
  await setupHomepage(context);
  await setupNewestPage(context);
  await setupPastPage(context);
  
  await browser.close();
});

async function setupHomepage(context: BrowserContext) {
  // If page exist already, do not overwrite
  if (fs.existsSync(SAVED_PAGES_FOLDER + "/" + HOMEPAGE_FILE)) {
    console.log("Homepage already exists, delete file or delete folder to write new pages")
    return;
  }

  const page = await context.newPage();
  await page.goto("/news");
  const homepageContent: string = await page.content();

  fs.writeFileSync(SAVED_PAGES_FOLDER + "/" + HOMEPAGE_FILE, homepageContent);
  console.log("Saved page: " + HOMEPAGE_FILE);
}

async function setupNewestPage(context: BrowserContext) {
  // If pages exist already, do not overwrite
  for (let i: number = 1; i < 5; i++) {
    if(!fs.existsSync(SAVED_PAGES_FOLDER + `/newestPage${i}Content.html`)) {
      break;
    }
    if (i === 4) {
      console.log("Newest pages already exist, delete files or delete folder to write new pages")
      return;
    }
  }

  const page = await context.newPage();
  await page.goto("/newest");
  const moreButton = page.getByRole('link', { name: 'More', exact: true });

  for (let i: number = 1; i < 5; i++) {
    const newestPageContent: string = await page.content();
    fs.writeFileSync(SAVED_PAGES_FOLDER + `/newestPage${i}Content.html`, newestPageContent);
    console.log(`Saved page: newestPage${i}Content.html`);
    if(i === 4)
      break;
    await Promise.all([
      page.waitForEvent("framenavigated"),
      moreButton.click(),
      new Promise(resolve => setTimeout(resolve, RATE_LIMIT_TIMER)),
    ]);
  }
}

async function setupPastPage(context: BrowserContext) {
  // If page exist already, do not overwrite
  if (fs.existsSync(SAVED_PAGES_FOLDER + "/" + PASTPAGE_FILE)) {
    console.log("Past page already exists, delete file or delete folder to write new pages")
    return;
  }

  const page = await context.newPage();
  await page.goto("/front");
  const pastPageContent: string = await page.content();

  fs.writeFileSync(SAVED_PAGES_FOLDER + "/" + PASTPAGE_FILE, pastPageContent);
  console.log("Saved page: " + PASTPAGE_FILE);
}