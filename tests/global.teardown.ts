import { test as teardown } from '@playwright/test';

teardown('delete database', async ({ }) => {
  console.log('Running cleanup...');
  // Delete the database
});