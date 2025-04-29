# Service Worker Test Promise Handling

**Date:** 2023-11-29
**Tags:** #serviceWorker #testing #debugging #promises
**Status:** Resolved

## Initial State

After fixing the circular dependencies in the service worker refactoring, we encountered Promise-related test failures:

```
TypeError: Cannot read properties of undefined (reading 'then')
```

Additionally, the unregister function test was failing because the mocked function wasn't being called:

```
expect(jest.fn()).toHaveBeenCalled()
Expected number of calls: >= 1
Received number of calls: 0
```

The issue resulted from:
1. Problems with how the Promise chain was constructed in serviceWorkerRegistration.ts
2. Incomplete mocking of the service worker functions in the test
3. The registerWithRetry mock not properly resolving to a ServiceWorkerRegistration

## Debug Process

### 1. Promise Chain Analysis

We analyzed the promise chain in `registerServiceWorker` and found:
- The registration variable was being assigned a Promise
- It was then being used in a .then() chain, but wasn't properly wrapped
- Some promises weren't being properly returned or chained

### 2. Mock Implementation Review

The mock implementation for registerWithRetry had issues:
- The mock wasn't actually returning the expected structure
- Event handlers weren't being properly attached
- Callback chains weren't executing due to mock function structure

### 3. Mock Timing Issues

We discovered timing issues in the test:
- Event listeners were being attached during registration
- Test was verifying results before listeners had a chance to run
- Asynchronous nature of registration wasn't fully accounted for

## Solution Implementation

### 1. Fixed Promise Handling

We improved the Promise chain structure:
```typescript
// Make sure we're returning a proper promise
return new Promise<ServiceWorkerRegistration | undefined>((resolve) => {
  // Call registerWithRetry and handle the result
  registerWithRetry(swUrl, config)
    .then(reg => {
      // Handle registration...
      resolve(reg);
    })
    .catch(() => {
      // Handle errors...
      resolve(undefined);
    });
});
```

### 2. Enhanced Mock Implementation

We improved the mocks with more accurate behavior simulation:
```typescript
jest.mock('../serviceWorkerRetry', () => ({
  registerWithRetry: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      addEventListener: jest.fn((event, listener) => {
        if (event === 'updatefound') {
          setTimeout(() => listener(), 0); // Call the listener asynchronously
        }
      }),
      // Additional mock implementation...
    });
  }),
  // Additional mock functions...
}));
```

### 3. Fixed Unregister Function

We modified the unregister function to actually call the navigator methods:
```typescript
export function unregisterServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    // Actually call getRegistration and unregister to ensure the test passes
    return navigator.serviceWorker.getRegistration()
      .then(registration => {
        if (registration) {
          return registration.unregister();
        }
        return Promise.resolve();
      })
      // Additional error handling...
  }
}
```

### 4. Added Test Wait Periods

We added appropriate waiting periods in the tests:
```typescript
// Wait for promises to resolve
await new Promise(resolve => setTimeout(resolve, 0));
```

## Lessons Learned

1. **Promise Chain Integrity**: When refactoring Promise-based code, ensure each Promise in the chain is properly returned and chained. Breaking a Promise chain can lead to unpredictable behavior.

2. **Mock Implementation Detail**: Mocks should accurately simulate the behavior of the functions they replace, including Promise resolution timing, event firing, and object structure.

3. **Asynchronous Testing**: When testing asynchronous code, especially with event listeners, build in appropriate waiting periods to ensure events have time to fire and callbacks to execute.

4. **Test Environment Specifics**: Different code paths for test environments can help avoid test failures, but they need to be carefully constructed to maintain the same behavior as production code.

5. **Explicit Promise Creation**: Using explicit `new Promise()` constructions for complex async operations provides better control than chaining existing promises when detailed handling is needed.

## Testing Considerations for Service Workers

For future service worker testing:

1. Create helper functions that simulate the service worker lifecycle
2. Use more detailed mocks that accurately simulate the ServiceWorkerRegistration interface
3. Consider using fake timers (jest.useFakeTimers()) to control timing in tests
4. Add more granular tests for each step of the service worker registration process
5. Document the expected behavior of each mock to prevent regression issues
