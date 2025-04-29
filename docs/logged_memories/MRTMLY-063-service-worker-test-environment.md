# Service Worker Testing Environment Setup

**Date:** 2023-12-05  
**Tags:** #serviceWorker #testing #jest #mocks  
**Status:** Resolved  

## Initial State

After creating the caching strategies module and its associated test file, we encountered test failures in our service worker caching strategies tests. The main error was:

```
ReferenceError: Response is not defined
```

This occurred because the Jest test environment (Node.js) doesn't include the browser-specific Web APIs like `Response`, `Request`, and `Headers` that are crucial for testing service worker functionality. Our tests were failing when trying to use these browser-specific objects.

## Debug Process

### 1. API Availability Analysis

First, I analyzed which browser APIs we needed to mock:

- `Response`: For creating and working with HTTP response objects
- `Request`: For creating and working with HTTP request objects
- `Headers`: For handling HTTP headers in requests and responses
- `Cache` and `CacheStorage`: The storage mechanism service workers use

### 2. Error Identification

The tests were failing because:

1. The `Response` constructor wasn't defined in Node.js environment
2. There was no proper mock implementation to use in tests
3. The browser API chain (`response.clone()`, `response.text()`, etc.) was used but unavailable

### 3. Mock Implementation Research

I looked at several options for mocking these APIs:
- Using existing libraries like `jest-fetch-mock` (too focused on fetch only)
- Using `whatwg-fetch` (complicated setup for our needs)
- Creating custom minimal mocks that support only what our tests need (chosen approach)

## Resolution

I implemented a set of custom mocks for the required browser APIs:

### 1. Response Mock

Created a mock `Response` class that:

```javascript
global.Response = class Response {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new Map(Object.entries(options.headers || {}));
    
    this.text = jest.fn().mockResolvedValue(typeof body === 'string' ? body : JSON.stringify(body));
    this.json = jest.fn().mockResolvedValue(typeof body === 'string' ? JSON.parse(body) : body);
    this.clone = jest.fn().mockImplementation(() => {
      const clone = new Response(this.body, {
        status: this.status,
        headers: Object.fromEntries(this.headers)
      });
      return clone;
    });
  }
};
```

### 2. Request Mock

Created a mock `Request` class with just enough functionality to support our tests:

```javascript
global.Request = class Request {
  constructor(input, options = {}) {
    this.url = typeof input === 'string' ? input : input.url;
    this.method = options.method || 'GET';
    this.headers = new Map(Object.entries(options.headers || {}));
  }
  
  clone() {
    return new Request(this.url, {
      method: this.method,
      headers: Object.fromEntries(this.headers)
    });
  }
};
```

### 3. Headers Mock

Added a simple Headers class:

```javascript
global.Headers = class Headers extends Map {};
```

### 4. Updated Test References

Modified all test cases to:
- Use `global.Response` instead of direct `Response` reference
- Use `global.Request` for creating request objects
- Ensure proper cleanup in `afterEach` to restore original globals

## Lessons Learned

1. **Testing Environment Limitations**: Node.js test environments don't include browser APIs by default, requiring manual mocking.

2. **Minimal Mock Design**: For testing purposes, we only need to mock the specific functions and properties that our code uses, not the entire API.

3. **Global Object Management**: When adding global objects to the test environment, it's important to:
   - Store original values (if they exist)
   - Restore them after tests complete
   - Clear between tests to avoid state leakage

4. **Mock Method Tracking**: Using Jest's `jest.fn()` for mocked methods like `text()` and `clone()` allows us to verify they were called in tests.

5. **Testing Boundary Definition**: These tests are integration tests between our service worker code and the Cache API, but they use mocks for the browser environment.

## Future Improvements

1. **Shared Web API Mock Library**: Consider creating a dedicated library file with these web API mocks to reuse across all service worker tests.

2. **More Complete Mocks**: As we develop more service worker functionality, expand these mocks to cover additional methods and properties.

3. **Environment Switching**: Consider setting up a more complete browser-like test environment for service worker tests using something like jest-environment-jsdom.

4. **Typed Mocks**: Add TypeScript definitions for these mocks to improve type checking in tests.
