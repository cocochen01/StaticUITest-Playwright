/**
 * These helper functions are code that we can repeat for each page (homepage, newest page, etc.) to avoid having to write repetitive functions.
 */
import { expect, Locator } from '@playwright/test';
import { Article } from '../global-values';

export async function testArticleForPoints(articleObject: Article) {
  const scoreRegex: RegExp = /^[0-9]+ points?/;
  const score: Locator = articleObject.subtextLocator.locator(".score");
    
  if(await score.count() === 0) {
    // If it has no score, check if it is a job post
    //console.log(`Article ID: ${articleID} has no score, should be a job posting`);
    const titleRegex: RegExp = /^.* \(YC [WS]\d{2}\).*$/;
    const titleText: string = (await articleObject.titleLocator.getByRole("link").first().textContent()) ?? "nullTitle";
    //console.log(titleText);
    expect(titleText).toMatch(titleRegex);
  }
  else {
    const articleID: string = (await articleObject.titleLocator.getAttribute("id")) ?? "nullID";
    const scoreString: string = (await score.getAttribute("id")) ?? "nullScore";
    const scoreID: string = scoreString.split("_")[1];

    expect(articleID).toBe(scoreID);

    //console.log(`Article ID: ${articleID}, Score: ${scoreTextContent}`);
    expect(await score.textContent()).toMatch(scoreRegex);
  }
}

export async function testArticleForTimestamps(articleObject: Article) {
  const articleID: string = (await articleObject.titleLocator.getAttribute("id")) ?? "nullID";
  const timestampHref: string = (await articleObject.subtextLocator.locator(".age > a").getAttribute("href")) ?? "nullTimestamp";

  //console.log(`Timestamp Link: ${timestampHref}`);
  expect(timestampHref).toBe(`item?id=${articleID}`);
}