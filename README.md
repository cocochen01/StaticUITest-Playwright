
# Static UI Testing with Playwright
This project tests ycombinator.com news page for static UI elements using Playwright.

## What this project does
- Scrapes the website and stores each page or pages of the that we are testing as static html files
    - Reuses saved html pages in subsequent tests to avoid server rate limit issues while testing
    - Scrapes a new set of pages if previous pages (or the folders) are deleted
- Tests all pages for common features such as the presence of the header, the number of article elements, etc.
- Stores the first 100 articles from the 'newest' pages in a data format of [ID, Title, Timestamp, Link] and writes it into a csv file
- Tests the articles to ensure they are sorted in time-order
- Uses asynchronous helper functions for repetitive tests
- Uses custom fixture to handle repetitive setup code
- Streams live test output in the terminal and opens the html report
- Adhere to Playwright best practices such as:
    - Maintaining test independence
    - Running tests in parallel
    - Prefering web first assertions
    - Avoiding flakiness

## Run Test(s)
### Install modules:
```
npm i
npm playwright install
```
### Run all tests:
```
node index.js
```
or
```
node index.js all
```
### Run specific tests
```
node index.js home new comments
```
List of all pages: all, home, new, past, comments, ask, jobs, submit

## Project Details
### This projects tests for:
- All pages
    - Valid header navigation links
    - Display 30 articles
- All article posts
    - Have a rank
    - Have a title
- Homepage
- Newest Page
    - Articles are sorted newest to oldest (tests first 4 pages)
- Past Page (not implemented)
- Comments Page (not implemented)
- Ask Page (not implemented)
- Show Page (not implemented)
- Jobs Page (not implemented)
- Submit Page (not implemented)

### Page Object Model
Tests utilize page objects that help organize page interactions. The page object class is reused for each of the pages, which are themselves an object containing an array of page objects.

### Fixtures
The custom fixures construct the page objects and keep the test setup separate from the test code.

## Report
Playwright's test reports are configured in `playwright.config.ts`. At the end of the test, playwright will stream the results of the test in the terminal and open up an html report as per the config.

## Demo
![Demo Preview](./demo.gif)