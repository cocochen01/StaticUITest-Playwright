import { chromium, test as setup, expect } from '@playwright/test';
import fs from "fs";

// Prevent spamming the server with requests
const RATE_LIMIT_TIMER: 500 = 500;

setup('Preload pages', async () => {
  console.log('Running setup...');

  for (let i: number = 1; i < 5; i++) {
    if(!fs.existsSync(`saved-pages/newestPage${i}Content.html`)) {
      break;
    }
    if (i === 4) {
      console.log("All pages already exist, delete file or delete folder to write new pages")
      return;
    }
  }
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const moreButton = page.getByRole('link', { name: 'More', exact: true });


  if (!fs.existsSync("saved-pages")) {
    fs.mkdirSync("saved-pages", { recursive: true })
  }

  await page.goto("/newest");

  for (let i: number = 1; i < 5; i++) {
    const newestPageContent: string = await page.content();
    if (!fs.existsSync(`saved-pages/newestPage${i}Content.html`)) {
      fs.writeFileSync(`saved-pages/newestPage${i}Content.html`, newestPageContent);
      console.log(`Saved new page: newestPage${i}Content.html`);
    } else {
      console.log(`Page newestPage${i}Content.html already exists, delete file or delete folder to write new page`)
    }
    if(i === 4)
      break;
    await Promise.all([
      page.waitForEvent("framenavigated"),
      moreButton.click(),
      new Promise(resolve => setTimeout(resolve, RATE_LIMIT_TIMER)),
    ]);
  }
  await browser.close();
});