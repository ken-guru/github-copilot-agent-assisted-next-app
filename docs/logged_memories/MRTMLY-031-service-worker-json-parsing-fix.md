# Service Worker Test JSON Parsing Fix

**Date:** 2023-12-05  
**Tags:** #serviceWorker #testing #jest #mocks  
**Status:** Resolved  

## Initial State

After implementing the basic service worker test environment with mocks for the `Response`, `Request`, and other browser APIs, we encountered a series of test failures:

```
SyntaxError: Unexpected token 'T', "Test response body" is not valid JSON
    at JSON.parse (<anonymous>)
```

The error occurred in our mock Response class's `json()` method when trying to parse a text response that wasn't valid JSON. The specific line causing the error was:

```javascript
this.json = jest.fn().mockResolvedValue(typeof body === 'string' ? JSON.parse(body) : body);
```

We were using plain text responses like `"Test response body"` in our tests, but then trying to parse them as JSON, which naturally failed since they weren't valid JSON strings.

## Debug Process

### 1. Error Analysis

I examined when and why the `json()` method was being called:

1. Our Response mock implementation assumed that any string passed to the constructor could be parsed as JSON
2. During test initialization, we created responses with plain text like `new Response('Test response body')`
3. When the constructor ran, it tried to set up the `json()` method to parse this text
4. Since the text wasn't valid JSON, it threw a syntax error during test setup

### 2. Solution Exploration

I considered several approaches:
1. Only using valid JSON strings in our test responses
2. Skipping JSON parsing during mock setup
3. Adding error handling to the JSON parsing

The third option was most appropriate because:
- It allows tests to use text responses for readability
- It preserves the behavior of the real Response object (which handles parsing errors)
- It's consistent with how browsers handle non-JSON responses

## Resolution

I updated the `json()` method implementation to safely handle non-JSON text:

```javascript
// Before - problematic code
this.json = jest.fn().mockResolvedValue(typeof body === 'string' ? JSON.parse(body) : body);

// After - with error handling
this.json = jest.fn().mockResolvedValue(() => {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch (e) {
      // If it's not valid JSON, return an empty object
      return {};
    }
  }
  return body;
}());
```

The key improvements:
1. We wrapped the JSON parsing in a try/catch block
2. We returned an empty object if parsing failed
3. We used an IIFE (Immediately Invoked Function Expression) to handle the logic cleanly

## Lessons Learned

1. **Mock Fidelity Considerations**: When mocking browser APIs, we need to consider both success and failure modes that match browser behavior.

2. **Error Handling in Mocks**: Just like with real code, error handling in mocks is essential, especially for functions that could throw exceptions like `JSON.parse()`.

3. **Defensive Construction**: When building test mocks, we should initialize them defensively to avoid errors during test setup, before the actual test code runs.

4. **Isolation of Test Setup Issues**: The error occurring during test setup (not during the test execution) made it harder to diagnose the issue. Making mocks more robust helps isolate and focus on actual test failures.

## Future Improvements

1. **Typed Responses**: Consider specifying content types for responses to determine whether JSON parsing should be attempted.

2. **Parameterized Mock Creation**: Create factory functions that produce appropriate response objects based on the intended type of response (JSON, text, binary, etc.).

3. **Shared Test Utilities**: Move these mock implementations to a shared test utilities file to ensure consistent behavior across all service worker tests.

4. **Expanded Error Simulation**: Add more error scenarios to the mocks to test how our code handles various network and parsing failures.
