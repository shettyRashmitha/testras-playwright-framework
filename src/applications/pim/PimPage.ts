// PimPage.ts
// Facade for the PIM module: the ONLY thing tests talk to for PIM actions.
// It holds the helpers once and hands out ready-made commands.

import { EmployeeApi } from '@api/EmployeeApi';
import { Cleanup } from '@core/Cleanup';
import { AddEmployeeCommand } from './commands/AddEmployeeCommand';   // same folder → relative path

export class PimPage {

  // Helpers the commands need. The facade receives them ONCE (from the fixture)
  // and passes them on, so tests never deal with them directly.
  constructor(
    private readonly employeeApi: EmployeeApi,
    private readonly cleanup: Cleanup,
  ) {}

  // Each method = one business action. It returns a NEW command every time,
  // so two calls never share values set by withFirstName(...) etc.
  addEmployee(): AddEmployeeCommand {
    return new AddEmployeeCommand(this.employeeApi, this.cleanup);
  }

  // Later: editEmployee(...), searchEmployee(), deleteEmployee(...)
}   