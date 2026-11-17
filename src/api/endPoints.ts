// endpoints.ts
// All OrangeHRM API URLs in one place (like Routes for pages).
// If an API path changes, we fix it here only — not in every file.
// Paths are relative: Playwright adds baseURL from the config automatically.

export const Endpoints = {

  // Employees collection — one URL, different HTTP methods:
  //   POST   → create an employee   (body: firstName, middleName, lastName, employeeId)
  //   GET    → search/list employees
  //   DELETE → delete employees     (body: { ids: [empNumber, ...] })
  employees: '/web/index.php/api/v2/pim/employees',

  // One employee's personal details — needs the empNumber (database ID), e.g. 191
  // A function, because part of the URL changes for each employee.
  employeePersonalDetails: (empNumber: number) =>
    `/web/index.php/api/v2/pim/employees/${empNumber}/personal-details`,

} as const;