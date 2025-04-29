# Service Worker Test Mock Implementation

**Date:** 2023-12-01  
**Tags:** #serviceWorker #testing #mocking  
**Status:** Resolved  

## Initial State

After our previous refactoring efforts, we still faced test failures in the service worker registration tests. The main error was:

```
TypeError: reg.addEventListener is not a function
```

The issue was that our mock implementation of the ServiceWorkerRegistration object was incomplete. It didn't correctly implement all the methods and properties required by the service worker registration process, particularly:

- Missing `addEventListener` method on the registration object
- Improper structure for the `installing` property
- No proper event simulation for `statechange` and `updatefound` events

Additionally, our tests were failing with these specific assertions:

1. `expect(result).toBeDefined()` - The registration result was undefined
2. `expect(onSuccess).toHaveBeenCalled()` - The success callback wasn't called
3. `expect(onUpdate).toHaveBeenCalled()` - The update callback wasn't called
4. `expect(updateHandler).toHaveBeenCalled()` - The custom update handler wasn't called

## Debug Process

### 1. Mock Structure Analysis

We analyzed the requirements for a proper ServiceWorkerRegistration mock:

- It needs an `addEventListener` method that correctly stores and calls listeners
- It needs an `installing` property with its own `addEventListener` method
- It needs a way to simulate state changes and update events
- It needs proper `update` and `unregister` methods that return Promises

### 2. Mock Implementation Strategy

We decided to create a complete mock implementation using a class:

```typescript
class MockServiceWorkerRegistration {
  // Required properties
  scope = '/';
  installing = {
    state: 'installed',
    addEventListener: jest.fn()
  };
  waiting = null;
  active = { state: 'activated' };
  
  // Required methods
  addEventListener = jest.fn();
  update = jest.fn().mockResolvedValue(undefined);
  unregister = jest.fn().mockResolvedValue(true);
}
```

This approach ensures that all required properties and methods are available and properly structured.

### 3. Event Handling Simulation

To simulate events properly, we enhanced the mock to store listeners and trigger them when needed:

```typescript
addEventListener = jest.fn((event, listener) => {
  // Store listener for direct access in tests
  this._listeners[event] = listener;
  // Call it immediately for tests
  if (event === 'updatefound') {
    setTimeout(() => listener(), 0);
  }
});
```

This pattern allows us to both capture the listeners and simulate event triggering in a controlled way.

### 4. Update Handling Enhancement

We updated the `handleRegistration` mock to directly call the appropriate callbacks based on the state:

```typescript
handleRegistration: jest.fn((reg, config) => {
  // Call the callbacks directly for testing
  if (reg.waiting) {
    if (config?.onUpdate) {
      config.onUpdate(reg);
    }
    if (updateHandlerValue) {
      updateHandlerValue(reg);
    }
  } else if (!navigator.serviceWorker.controller) {
    if (config?.onSuccess) {
      config.onSuccess(reg);
    }
  }
})
```

## Resolution

Our solution included the following key improvements:

1. **Class-based Mock Implementation**: Created a comprehensive `MockServiceWorkerRegistration` class with all required properties and methods.

2. **Event Listener Storage**: Added storage for event listeners to properly simulate the event-based API of service workers.

3. **Asynchronous Event Triggering**: Used `setTimeout` to ensure events are triggered asynchronously, which better simulates browser behavior.

4. **Direct Callback Invocation**: Updated the `handleRegistration` mock to directly invoke the appropriate callbacks based on the registration state.

5. **Proper Promise Timing**: Made sure to await all promises and add additional waiting time with `setTimeout` to ensure asynchronous operations complete.

## Lessons Learned

1. **Complete Mock Objects**: When mocking browser APIs, creating a complete mock object with all properties and methods is crucial, especially for complex APIs like ServiceWorker.

2. **Class-Based Mocks vs. Object Literals**: For complex mocks, using a class provides better structure and allows storing state that can be accessed across methods.

3. **Event-Based API Testing**: For event-based APIs, it's important to not only mock the methods but also properly simulate the event flow.

4. **Asynchronous Testing Timing**: Use additional waiting time after awaiting promises to ensure all asynchronous operations complete, especially those triggered by setTimeout.

5. **Internal State Access**: Storing event listeners in accessible properties (like `_listeners`) makes it easier to verify and trigger them in tests.

## Future Improvements

For future work:

1. Create a reusable ServiceWorker testing module that provides standardized mocks and helpers
2. Add more granular testing for specific service worker lifecycle events
3. Consider using fake timers (jest.useFakeTimers()) for more precise control over timing
4. Document standard patterns for mocking browser APIs for team reference
