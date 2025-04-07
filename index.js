// Optionally run node index.js
import { spawn } from "child_process";

const Index = {};
const indexKeys = [
  'all',
  'home',
  'new',
  'past',
  'comments',
  'ask',
  'jobs',
  'submit'
];

indexKeys.forEach((key, index) => {
  Index[key] = index;
  Index[index] = index;
});

const Test = {};
const testKeys = [
  '',
  'homepage.spec.ts',
  'newestpage.spec.ts',
  'pastpage.spec.ts',
  'commentspage.spec.ts',
  'askpage.spec.ts',
  'jobspage.spec.ts',
  'submitpage.spec.ts',
];

testKeys.forEach((key, index) => {
  Test[index] = key;
});

let TestList = [];
let isRunningAllTests = false;

async function BeginTesting() {
  const args = process.argv.slice(2);
  for (const value of args) {
    if (Index[value] !== undefined) {
      //console.log(Index[value] + "is valid");
      if (Index[value] === 0) {
        isRunningAllTests = true;
        return;
      }
      TestList.push(Test[Index[value]]);
    } else {
      //console.log("Index invalid");
    }
  }
}

async function RunTest() {
  if (isRunningAllTests || TestList.length===0) {
    console.log("Running All Tests...");
    spawn("npx", ["playwright", "test"], {
      stdio: "inherit",
      shell: true
    });
  } else {
    let testString = "";
    for (const file of TestList) {
      testString += file + " ";
    }
    console.log(`Running Test File(s) ${testString}...`);
    spawn("npx", ["playwright", "test", testString], {
      stdio: "inherit",
      shell: true
    });
  }
}

(async () => {
  await BeginTesting();
  await RunTest();
})();
