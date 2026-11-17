// EmployeeApi.ts
// Talks to the OrangeHRM employee API (create, delete).
// Uses Playwright's APIRequestContext: sends HTTP requests WITHOUT a browser.

import { APIRequestContext, expect } from '@playwright/test';
import { Endpoints } from './endPoints';                                 // API URLs (file name matches yours: capital P)
import { NewEmployee, Employee, ApiResponse } from './models/Employee';  // data shapes

export class EmployeeApi {

  // 'request' = Playwright's HTTP client.
  // It will be created with the admin storageState, so the 'orangehrm' login cookie
  // is sent automatically with every call. No login code needed here.
  constructor(private readonly request: APIRequestContext) {}

  // Create an employee → returns the created employee (including empNumber)
  async create(newEmployee: NewEmployee): Promise<Employee> {

    // POST /api/v2/pim/employees
    // data: {...} → the request BODY. Playwright converts it to JSON and sets content-type.
    const response = await this.request.post(Endpoints.employees, { data: newEmployee });

    // Check 1 (status): fail clearly if not 2xx (e.g. 401 not logged in, 422 duplicate employeeId).
    // The message includes the server's reply, so we can see WHY it failed.
    await expect(response, `Create employee failed: ${await response.text()}`).toBeOK();

    // Deserialize: JSON text → JavaScript object.
    // NOTE: the type here is only a compile-time promise; nothing is checked at runtime.
    const body: ApiResponse<Employee> = await response.json();
    const employee = body.data;

    // Check 2 (structure): did we really get an employee with a database ID?
    // Without empNumber we can't edit or clean up, so fail right here with a clear message.
    if (!employee || typeof employee.empNumber !== 'number') {
      throw new Error(`Create employee: response has no valid empNumber. Got: ${JSON.stringify(body)}`);
    }

    // Check 3 (content): did the server save what we sent?
    if (
      employee.firstName !== newEmployee.firstName ||
      employee.lastName !== newEmployee.lastName ||
      employee.employeeId !== newEmployee.employeeId
    ) {
      throw new Error(`Create employee: saved data does not match what was sent. Got: ${JSON.stringify(employee)}`);
    }

    return employee;   // return only the employee, not the wrapper
  }

  // Delete one or more employees by their DATABASE IDs (empNumber, e.g. 191)
  async delete(empNumbers: number[]): Promise<void> {

    // DELETE /api/v2/pim/employees with body { ids: [191, 192] }
    const response = await this.request.delete(Endpoints.employees, { data: { ids: empNumbers } });
    await expect(response, `Delete employees failed: ${await response.text()}`).toBeOK();
  }
}