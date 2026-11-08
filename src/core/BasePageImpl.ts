// BasePageImpl.ts
// Parent class for every page class (LoginPageImpl, EmployeeListPageImpl, ...).
// Gives every page two shared abilities: open itself, and confirm it is loaded.

import { Page, Locator, expect } from '@playwright/test';

// abstract → can't create it directly, only extend it
export abstract class BasePageImpl {

  // Every child page MUST give its URL path, e.g. Routes.employeeList
  protected abstract readonly path: string;

  // Every child page MUST give one element that proves "this page is loaded"
  // e.g. the "Employee Information" heading on the employee list page
  protected abstract readonly readyIndicator: Locator;

  // 'page' comes from the Playwright test (the browser tab).
  // protected readonly → child pages can use this.page, but can't replace it.
  constructor(protected readonly page: Page) {}

  // Open this page and wait until it is really loaded
  async goTo(): Promise<void> {
    await this.page.goto(this.path);   // baseURL from the config is added automatically
    await this.waitDisplayed();
  }

  // Wait until the page's key element is visible.
  // Useful on its own too, e.g. after clicking "Save", which takes you to another page.
  async waitDisplayed(): Promise<void> {
    await expect(this.readyIndicator).toBeVisible();
  }
}