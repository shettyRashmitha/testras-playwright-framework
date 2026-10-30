// Allowed environment and role names.
//  Using these types means typos are caught while coding.
export type EnvName = 'demo';
export type Role = 'admin';

// All roles as a real list. testConfig loops over it to load each role's login
// from <ROLE>_USERNAME and <ROLE>_PASSWORD (e.g. ADMIN_USERNAME).
export const ROLES: Role[] = ['admin'];

// Contract every environment config file must follow.
export interface BaseEnvConfig {
  name: EnvName;
  baseUrl: string;
  allowDataCreation: boolean;
}

// A role's real username and password, after testConfig reads them from .env.<env>.
export interface UserCredentials {
  username: string;
  password: string;
}