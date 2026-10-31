// Builds the path of a role's saved login session (Playwright "storageState" file).
// Used by BOTH sides so they always agree on the path:
//   - tests/auth/auth.setup.ts SAVES the session here after logging in
//   - playwright.config.ts LOADS it, so every test starts already logged in

import { testEnvConfig } from './testEnvConfig';
import { Role } from './baseEnvConfig';

// The environment name is part of the path, e.g. .auth/demo/admin.json,
// so a demo session is never reused in a QA run (and vice versa).
// The .auth/ folder is gitignored: these files contain session cookies.
export function authFile(role: Role): string {
  return `.auth/${testEnvConfig.name}/${role}.json`;
}