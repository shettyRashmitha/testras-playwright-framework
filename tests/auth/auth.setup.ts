// Logs in once per role and saves each session (storageState) to a file.
// Runs as the "setup" project, BEFORE any test (configured in playwright.config.ts),
// so tests start already logged in and never go through the login page.

import { test as setup, expect } from '@playwright/test';
import { testEnvConfig } from '@config/testEnvConfig';
import { ROLES } from '@config/baseEnvConfig';
import { authFile } from '@config/authFile';
import { Routes} from '@shared/routes';

// One setup step per role ('admin' for now). With more roles, Playwright runs
// these logins in parallel, so it takes about as long as one.
for (const role of ROLES) {
  setup(`authenticate as ${role}`, async ({ page }) => {
    // This role's credentials, loaded from .env.<env> by testEnvConfig.
    const { username, password } = testEnvConfig.users[role];

    // Relative path: baseURL from playwright.config.ts supplies the environment's address.
    await page.goto(Routes.login);

    // OrangeHRM's login inputs are identified by their placeholder text.
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Prove the login really worked before saving. Without this, a failed login
    // would save a logged-OUT session and every test would fail confusingly later.
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Save cookies and local storage, e.g. to .auth/demo/admin.json.
    // Playwright creates the folders if they don't exist.
    await page.context().storageState({ path: authFile(role) });
  });
}