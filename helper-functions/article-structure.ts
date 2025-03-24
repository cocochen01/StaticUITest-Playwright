/**
 * These helper functions are code that we can repeat for each page (homepage, newest page, etc.) to avoid having to write repetitive functions.
 */
import { expect, Locator } from '@playwright/test';
import { Article, PageNav } from '../global-values';

export async function testArticleForPoints(articleObject: Article) {
  const scoreRegex: RegExp = /^[0-9]+ points?/;
  const score: Locator = articleObject.subtextLocator.locator(".score");
    
  if(await score.count() === 0) {
    // If it has no score, check if it is a job post
    //console.log(`Article ID: ${articleID} has no score, should be a job posting`);
    isArticleJobPosting((await articleObject.titleLocator.getByRole("link").first().textContent()) ?? "nullTitle");
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

export async function testArticleArrayForRank(articleObjectArray: Article[]) {
  for(let i=0; i< articleObjectArray.length; i++) {
    await testArticleForRank(articleObjectArray[i], i + 1);
  }
}
// export if needed later
async function testArticleForRank(articleObject: Article, expectedRank: number) {
  const rankLocator: Locator = articleObject.titleLocator.getByRole("cell").nth(0);
  const articleRank: number = parseInt((await rankLocator.textContent()) ?? "nullRank", 10);
  //console.log(articleRank);
  await expect(articleRank).toBe(expectedRank);
}

export async function testArticleForUpvote(articleObject: Article, pageType: PageNav) {
  const upvoteLocator: Locator = articleObject.titleLocator.getByRole("cell").nth(1).getByRole("link");
  
  if(await upvoteLocator.count() === 0) {
    isArticleJobPosting((await articleObject.titleLocator.getByRole("link").first().textContent()) ?? "nullTitle");
  } else {
    const upvoteLink: string = (await upvoteLocator.getAttribute("href") )?? "nullUpvote";
    //console.log(upvoteLink);
    await expect(upvoteLink).toContain(`vote?id=${await articleObject.titleLocator.getAttribute("id")}&how=up&goto=` + pageType);
  }
}

export async function testArticleForExternalLink(articleObject: Article) {
  const externalLinkLocator: Locator = articleObject.titleLocator.getByRole("cell").nth(2).getByRole("link");
  const internalLinkRegex: RegExp = /^item\?id=[0-9]+/;
  if(await externalLinkLocator.nth(1).count() === 0) {
    expect(await externalLinkLocator.nth(0).getAttribute("href")).toMatch(internalLinkRegex);
  } else {
    const externalLink1 = new URL((await externalLinkLocator.nth(0).getAttribute("href")) ?? "nullURL").hostname;
    const externalLink2 = (((await externalLinkLocator.nth(1).getAttribute("href")) ?? "nullURL").split("=")[1]).split("/")[0];
    //console.log(externalLink1 + "   " + externalLink2);
    await expect(externalLink1).toContain(externalLink2);
  }

}

function isArticleJobPosting(title: string) {
  const titleRegex: RegExp = /^.* \(YC [WS]\d{2}\).*$/;
  expect(title).toMatch(titleRegex);
}
