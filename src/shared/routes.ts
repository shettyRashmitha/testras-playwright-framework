// Paths of OrangeHRM pages, relative to the environment's baseURL.
// Playwright joins them to baseURL, so the same path works on every environment:
//   demo: https://opensource-demo.orangehrmlive.com + Routes.dashboard
//   qa:   https://qa.orangehrm.example.com          + Routes.dashboard
// Keeping them here means a changed URL is fixed in ONE place.

export const Routes = {
  // Auth
  login: '/web/index.php/auth/login',

  // Dashboard (landing page after login)
  dashboard: '/web/index.php/dashboard/index',

  // PIM (employee management): add paths here as tests need them
  employeeList: '/web/index.php/pim/viewEmployeeList',
} as const;