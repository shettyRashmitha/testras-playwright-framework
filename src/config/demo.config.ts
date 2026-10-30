// Settings for the public OrangeHRM demo environment.
// Selected when TEST_ENV=demo (the default). Secrets are NOT stored here;
// they come from .env.demo, so this file is safe to commit.

import type { BaseEnvConfig } from './baseEnvConfig';

// ": BaseEnvConfig" makes TypeScript check this object 
// against the contract,
// so a missing or misspelled setting is a compile error,
//  not a runtime surprise.
export const demo: BaseEnvConfig = {
  // Must be one of the allowed EnvName values.
  name: 'demo',

  // Root URL of the app. Playwright uses it as baseURL,
  // so tests can navigate with short paths like '/web/index.php/auth/login'.
  baseUrl: 'https://opensource-demo.orangehrmlive.com',

  // The demo is a public sandbox, so tests may create (and clean up) data here.
  // A production environment would set this to false.
  allowDataCreation: true,
};