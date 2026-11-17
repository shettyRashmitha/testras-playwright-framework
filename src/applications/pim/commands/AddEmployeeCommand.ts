// AddEmployeeCommand.ts
// Business action: "add an employee".
// The test sets only the values it cares about; everything else has a sensible default.

import { CommandBase } from '@core/CommandBase';
import { Cleanup } from '@core/Cleanup';
import { EmployeeApi } from '@api/EmployeeApi';
import { Employee, NewEmployee } from '@api/models/Employee';

// extends CommandBase<Employee> → TResult = Employee, so execute() returns Promise<Employee>
export class AddEmployeeCommand extends CommandBase<Employee> {

  // Default values: a test that doesn't care about the name still gets a valid employee.
  // Date.now() = milliseconds since 1970, different on every run → unique values.
  private firstName = 'Test';
  private middleName = '';
  private lastName = `Employee${Date.now()}`;
  private employeeId = String(Date.now()).slice(-8);   // last 8 digits; OrangeHRM rejects duplicate IDs

  // The command gets its helpers from outside (the facade passes them in).
  // It doesn't create them itself, so tests and fixtures stay in control.
  constructor(
    private readonly employeeApi: EmployeeApi,
    private readonly cleanup: Cleanup,
  ) {
    super();   // required: run the parent (CommandBase) constructor first
  }

  // ── Builder methods: store the value, return 'this' so calls can be chained ──
  withFirstName(firstName: string): this { this.firstName = firstName; return this; }
  withMiddleName(middleName: string): this { this.middleName = middleName; return this; }
  withLastName(lastName: string): this { this.lastName = lastName; return this; }
  withEmployeeId(employeeId: string): this { this.employeeId = employeeId; return this; }

  // ── API mode: fast, no browser ──
  protected async executeViaApi(): Promise<Employee> {

    // 1. Build the request body from the stored values.
    //    ': NewEmployee' → TypeScript checks every required field is here.
    const newEmployee: NewEmployee = {
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      employeeId: this.employeeId,
      empPicture: null,
    };

    // 2. Call the API client (it checks status, structure and content for us)
    const created = await this.employeeApi.create(newEmployee);

    // 3. Register the delete NOW, but it runs only after the test (even if the test fails).
    //    The arrow function "remembers" created.empNumber (a closure).
    this.cleanup.add(() => this.employeeApi.delete([created.empNumber]));

    // 4. Give the created employee back to the test
    return created;
  }

  // ── UI mode: comes later, when the Add Employee page class exists ──
  protected async executeViaUi(): Promise<Employee> {
    throw new Error('AddEmployeeCommand: UI mode is not built yet. Use execute("api").');
  }
}