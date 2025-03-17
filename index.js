// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
import { exec } from "child_process";

async function sortHackerNewsArticles() {
  // launch browser
  
  exec("npx playwright test", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing test: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Test stderr: ${stderr}`);
      return;
    }
    console.log(`Test output:\n${stdout}`);
  });

}

(async () => {
  await sortHackerNewsArticles();
})();
