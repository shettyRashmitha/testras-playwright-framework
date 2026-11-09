// CommandBase.ts
// Parent class for all commands (AddEmployee, EditEmployee, ...).
// The test calls execute('ui') or execute('api'); the child class does the real work.

import { test } from '@playwright/test';   // for test.step → readable steps in the report

// Only two allowed modes; a typo like 'API' gives a compile error
export type ExecutionMode = 'ui' | 'api';

// abstract  → can't create it directly, only extend it
// <TResult> → each child decides what it returns (Employee, Employee[], void...)
export abstract class CommandBase<TResult> {

  // Every child command MUST say how to do the action through the browser
  protected abstract executeViaUi(): Promise<TResult>;

  // Every child command MUST say how to do the action through the API
  protected abstract executeViaApi(): Promise<TResult>;

  // The only method tests call. Picks UI or API based on the mode.
  // test.step shows it in the report, e.g. "AddEmployeeCommand (via api)"
  // this.constructor.name → the child class's name, picked up automatically
  async execute(mode: ExecutionMode = 'ui'): Promise<TResult> 
    {
      return mode === 'api' ? this.executeViaApi() : this.executeViaUi();
    };
  
}