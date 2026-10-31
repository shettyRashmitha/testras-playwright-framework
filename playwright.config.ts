import { defineConfig, devices } from '@playwright/test';

// Importing testEnvConfig runs it once: it reads TEST_ENV, validates it,
// and loads that environment's settings and secrets. Any problem stops the run
// here, before a single test starts.
import { testEnvConfig } from './src/config/testEnvConfig';
// Builds each role's session file path, e.g. .auth/demo/admin.json.
// The same helper auth.setup.ts uses to SAVE the session, so the paths always match.
import { authFile } from './src/config/authFile';
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  // Shown in the HTML report, so nobody confuses a demo run with a QA run.
  metadata: { environment: testEnvConfig.name },

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // The current environment's address. Tests navigate with short paths,
    // e.g. page.goto('/web/index.php/auth/login'), and switching TEST_ENV changes them all.
    baseURL: testEnvConfig.baseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
//configure projects for browser
  projects: [
    // 1. Runs FIRST: logs in once per role and saves each session to .auth/<env>/<role>.json.
    //    Matches only *.setup.ts files, so normal tests never run in this project.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // 2. Browser projects. "dependencies: ['setup']" makes Playwright run the setup
    //    project before them, on every run. "storageState" loads the saved admin
    //    session into each test's browser, so tests start already logged in.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: authFile('admin') },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: authFile('admin') },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: authFile('admin') },
      dependencies: ['setup'],
    },
  ],
});