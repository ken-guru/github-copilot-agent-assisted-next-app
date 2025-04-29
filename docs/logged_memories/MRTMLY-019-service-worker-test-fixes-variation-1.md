# Service Worker Test Fixes

**Date:** 2023-11-26
**Tags:** #serviceWorker #testing #debugging
**Status:** Resolved

## Initial State

After refactoring the service worker registration system into a modular directory structure, three tests in `serviceWorkerRegistration.test.ts` began failing:

1. `calls onSuccess callback when registration is successful`
   - Error: `TypeError: Cannot read properties of undefined (reading '1')`
   - The test was trying to access mock event listeners that weren't properly set up

2. `calls onUpdate callback when an update is available`
   - Error: `expect(jest.fn()).toHaveBeenCalled()`
   - The onUpdate callback wasn't being called during testing

3. `calls custom update handler when set`
   - Error: `expect(jest.fn()).toHaveBeenCalled()`
   - The custom update handler wasn't being called during testing

The tests were failing due to structural changes in the service worker system and how the mocks were set up.

## Debug Process

### 1. Missing Service Worker Directory
- We identified that the serviceWorker directory was missing, even though we were trying to import from it
- Created the directory and index.ts file to serve as the barrel export

### 2. Mock Configuration Issues
- The original mock setup didn't properly capture event handlers
- Changed the mock implementation to store handlers directly on the mock object for direct access in tests:
  ```typescript
  installing: {
    addEventListener: jest.fn((event, handler) => {
      // Store the handler directly on the mock for testing
      mockRegistration.installing.stateChangeHandler = handler;
    }),
    stateChangeHandler: null,
    state: 'installing'
  }
  ```

### 3. Update Handler Visibility
- The update handler function was being set but not being used
- Added a getUpdateHandler function to make it accessible from serviceWorkerUpdates.ts

### 4. Test Structure Problems
- Tests were trying to simulate events in a complex way that became fragile
- Simplified the tests to directly call handlers when needed

## Resolution

1. Created missing serviceWorker directory with index.ts to export all functionality
2. Added proper update handler implementation in serviceWorkerUpdates.ts
3. Enhanced mock implementation to better simulate service worker events
4. Simplified test structure for more reliable testing

Key approach: Instead of trying to simulate complex interactions through mock function calls and parameters, we directly stored handlers and explicitly set states to simulate the service worker lifecycle more effectively.

## Lessons Learned

1. **Mock Design Patterns**: When mocking complex event-based systems like service workers, it's often better to directly store handlers on mock objects for explicit testing rather than trying to access them through mock.calls arrays.

2. **Module Structure**: When refactoring a system into modules, ensure that the new structure maintains the same behavior as the original, especially for aspects like global state (such as the update handler).

3. **Test Setup**: Tests dependent on complex state transitions benefit from more explicit setup rather than trying to simulate the entire process through natural API calls.

4. **Barrel Exports**: When creating a new module structure, having a proper barrel export file from the start helps prevent import errors and makes future refactoring easier.
