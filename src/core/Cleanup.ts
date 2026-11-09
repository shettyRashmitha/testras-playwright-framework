// Cleanup registry: collects "undo" tasks while a test runs and runs them after it.
// Create commands register a delete right after creating something, e.g.
//   cleanup.add(() => api.employees.delete(employee.empNumber));
// A fixture calls runAll() after every test, whether the test passed or failed,
// so test data never piles up in shared environments.

// One cleanup task: any async function, e.g. an API delete call.
export type CleanupTask = () => Promise<unknown>;

export class Cleanup {
  // Tasks in the order they were registered. private: only this class touches the list.
  private readonly tasks: CleanupTask[] = [];

  // Register a task to run after the test.
  add(task: CleanupTask): void {
    this.tasks.push(task);
  }

  // Run every task, NEWEST FIRST (last in, first out), so children are deleted
  // before their parents, e.g. an employee's leave request before the employee.
  async runAll(): Promise<void> {
    const errors: unknown[] = [];

    while (this.tasks.length > 0) {
      // pop() takes the LAST task added. The "!" tells TypeScript it can't be undefined:
      // the while condition already guarantees the list isn't empty.
      const task = this.tasks.pop()!;

      try {
        await task();
      } catch (error) {
        // One failed delete must not stop the others: remember it and keep going.
        errors.push(error);
        console.warn('Cleanup task failed:', error);
      }
    }

    // After trying everything, report failures so leftover data doesn't go unnoticed.
    if (errors.length > 0) {
      throw new Error(`${errors.length} cleanup task(s) failed. See the warnings above.`);
    }
  }
}

/*e’s your explanation, polished but kept in your own words and order:

“This is the cleanup registry class. At the top, I create a type alias, CleanupTask: an arrow function with no arguments that returns a Promise. I use unknown as the Promise’s type because I’m not bothered about what value it returns; I only wait for it to finish.

Inside the Cleanup class, I have a private readonly property called tasks. It’s an array of CleanupTask, so it holds all the cleanup functions registered during a test.

The add method is public. It receives a task function and pushes it into the tasks array. It only stores the function; it doesn’t run it.

The runAll method is async and returns Promise<void>. A fixture calls it after every test, whether the test passed or failed. It declares an errors array to collect failures. Then, while the tasks array still has items, it pops each task function off the array, newest first, so child data is deleted before its parent, and stores it in a variable called task. Inside a try block, it calls that function, and that’s when the actual delete happens. If a delete fails, the catch block logs a warning and saves the error, and the loop continues so the other deletes still run.

Once all tasks have been tried, if any errors were collected, it throws one summary error, so Playwright reports the cleanup failure instead of leaving test data behind silently.”

Key idea to remember: add stores the function during the test; runAll calls it after the test.*/