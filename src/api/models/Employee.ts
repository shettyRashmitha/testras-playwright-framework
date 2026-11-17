// Employee.ts
// TypeScript shapes for the OrangeHRM employee API.
// Built from the real request/response captured in Chrome DevTools.

// What we SEND to create an employee (POST /api/v2/pim/employees)
export interface NewEmployee {
  firstName: string;
  middleName: string;          // empty string '' if there is no middle name
  lastName: string;
  employeeId: string;          // the ID a human types, e.g. "0389". Must be UNIQUE
  empPicture: null;            // we never upload a photo, so always null
}

// What the server SENDS BACK inside "data" after creating/reading an employee
export interface Employee {
  empNumber: number;           // DATABASE ID (e.g. 191). Used for edit and delete
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;          // human-typed ID, e.g. "0389"
  terminationId: number | null; // null = active employee; a number = terminated
}

// Every OrangeHRM API response is wrapped like: { data: ..., meta: ..., rels: ... }
// <T> = generic: what's inside "data" changes per API
//   ApiResponse<Employee>   → data is one employee   (create)
//   ApiResponse<Employee[]> → data is a list         (search)
export interface ApiResponse<T> {
  data: T;
  meta: unknown;               // extra info (e.g. total count); we don't use it yet
  rels: unknown;               // related links; we don't use it
}