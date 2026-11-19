// src/fixtures/testFixture.ts
// Our own 'test' with extra ready-made objects (fixtures) for every test.
// Tests import { test, expect } from '@fixtures' instead of '@playwright/test'.

import { test as base, expect, APIRequestContext } from '@playwright/test';
import { testEnvConfig } from '@config/testEnvConfig';   // baseUrl of the current environment
import { authFile } from '@config/authFile';             // where the saved admin login is
import { Cleanup } from '@core/Cleanup';                  // collects delete tasks, runs them at the end
import { EmployeeApi } from '@api/EmployeeApi';    
import { PimPage } from '@app/pim/PimPage';              // PIM facade: pim.addEmployee()...
// The list of extra fixtures and their types.
// TypeScript uses this so tests get autocomplete: ({ employeeApi }) => employeeApi.create(...)
type Fixtures = {
  adminRequest: APIRequestContext;   // HTTP client logged in as admin
  cleanup: Cleanup;
  employeeApi: EmployeeApi;
    pim: PimPage;                      // PIM actions for tests: pim.addEmployee()...
};

// base.extend → "Playwright's normal test, plus our fixtures"
export const test = base.extend<Fixtures>({

  // ── adminRequest: an HTTP client that is already logged in ─────────────────
  adminRequest: async ({ playwright }, use) => {
    // SETUP: create the client with the  saved admin login (the 'orangehrm' cookie)
    const adminRequest = await playwright.request.newContext({
      baseURL: testEnvConfig.baseUrl,
      storageState: authFile('admin'),   // same file auth.setup.ts saved → UI and API share one login
    });

    await use(adminRequest);             // ← the test runs here

    // TEARDOWN: close the client after the test
    await adminRequest.dispose();
  },

  // ── cleanup: runs all registered delete tasks after the test ───────────────
  // It lists 'adminRequest' on purpose, even though it doesn't use it directly:
  // Playwright tears fixtures down in REVERSE order, so adminRequest is closed
  // only AFTER cleanup has finished deleting (the deletes need that client).
  cleanup: async ({ adminRequest }, use) => {
    const cleanup = new Cleanup();

    await use(cleanup);                  // ← the test runs here (commands call cleanup.add(...))

    await cleanup.runAll();              // TEARDOWN: delete test data, even if the test failed
  },

  // ── employeeApi: the API client, built on the logged-in HTTP client ────────
  employeeApi: async ({ adminRequest }, use) => {
    await use(new EmployeeApi(adminRequest));   // nothing to tear down
  },


  pim: async ({ employeeApi, cleanup }, use) => {
  await use(new PimPage(employeeApi, cleanup));
},
});
// Re-export expect, so tests need only ONE import line: import { test, expect } from '@fixtures'
export { expect };