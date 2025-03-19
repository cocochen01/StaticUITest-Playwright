// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
import { spawn } from "child_process";

async function sortHackerNewsArticles() {
  console.log("Starting HeckerNews Tests...");
  spawn("npx", ["playwright", "test"], {
    stdio: "inherit",
    shell: true
  });
}

(async () => {
  await sortHackerNewsArticles();
})();
