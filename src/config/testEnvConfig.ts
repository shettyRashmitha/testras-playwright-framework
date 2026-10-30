// The single entry point for configuration. 
// Every other file imports testEnvConfig
// from here and never reads TEST_ENV, .env files or process.env directly.

import dotenv from 'dotenv';
import { ROLES, type BaseEnvConfig, type EnvName, type Role, type UserCredentials } from './baseEnvConfig';
import { demo } from './demo.config';

// Register every environment here. Record<EnvName, ...> 
// forces one entry per EnvName,
// so adding 'qa' to EnvName without registering qa.config is a compile error.
//const declares a variable named environments. Its type is Record<EnvName, BaseEnvConfig>, 
// a dictionary whose keys must be EnvName values and whose values must follow the BaseEnvConfig contract. 
// It’s assigned { demo }, shorthand for { demo: demo }: 
// the key 'demo' maps to the demo settings object from demo.config.ts
const environments: Record<EnvName, BaseEnvConfig> = { demo };

// Which environment to run against, e.g. TEST_ENV=demo. Defaults to the demo.
const envName = process.env.TEST_ENV ?? 'demo';

// Fail fast on a typo like TEST_ENV=stagng, listing the valid names.
if (!(envName in environments)) {
  throw new Error(
    `Unknown TEST_ENV "${envName}". Valid values: ${Object.keys(environments).join(', ')}`,
  );
}

// Safe to treat as EnvName now: the check above proved it exists.
const selected = environments[envName as EnvName];

// Load secrets from .env.<env> into process.env.
// No file (as in CI) is fine: values then come from CI secrets instead.
// quiet: true hides dotenv's log line on every run.
dotenv.config({ path: `.env.${envName}`, quiet: true });

// Returns a secret's value, or stops the run with a message saying exactly what is missing
// and where to add it, instead of failing later with a confusing login timeout.
function readSecret(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing environment variable ${key} for TEST_ENV=${envName}. ` +
        `Add it to .env.${envName} locally, or to CI secrets.`,
    );
  }
  return value;
}

// Load each role's login using the naming rule <ROLE>_USERNAME / <ROLE>_PASSWORD,
// e.g. 'admin' -> ADMIN_USERNAME / ADMIN_PASSWORD.
// Starts empty and is filled by the loop, hence the "as" type assertion.
const users = {} as Record<Role, UserCredentials>;
for (const role of ROLES) {
  const prefix = role.toUpperCase();
  users[role] = {
    username: readSecret(`${prefix}_USERNAME`),
    password: readSecret(`${prefix}_PASSWORD`),
  };
}

// Everything the framework needs about the current environment, in one object.
export const testEnvConfig = {
  name: selected.name,
  baseUrl: selected.baseUrl,
  allowDataCreation: selected.allowDataCreation,
  users,
};