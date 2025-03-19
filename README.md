# 🐺 QA Wolf Take Home Assignment

Please run with 'node index.js'

What this project does:
- Scrapes the Hacker News site and stores the homepage, 4 pages from the 'newest' page, and the comments page as raw html
    - Reuses saved html pages in subsequent tests to avoid server rate limit issues while testing
    - Scrapes a new set of pages if previous pages (or the folders) are deleted
- Tests all pages for features they share in common such as the presence of the header, the number of article elements, etc.
- Stores the first 100 articles from the 'newest' pages in a data format of [ID, Title, Timestamp, Link] and writes it into a csv file
- Tests the first 100 articles for time-order from newest to oldest
- Uses asynchronous helper functions for repetitive tests
- Streams live output in the terminal and opens the html report as part of the project configuration
- Adhere to Playwright best practices such as:
    - Maintaining test independence
    - Running tests in parallel
    - Using web first assertions
    - Avoiding flakiness