### Issue: Service Worker Syntax Test Failing Due to Environment Issues
**Date:** 2025-04-12
**Tags:** #debugging #service-worker #testing #environment
**Status:** Resolved

#### Initial State
- Service worker syntax validation test was failing with error:
  ```
  ReferenceError: window is not defined
  ```
- The test was missing proper environment setup for Node.js testing
- Required test environment configuration was incorrect
- Test was conflicting with the global Jest setup.js file

#### Debug Process
1. Test environment analysis
   - Examined the failing test and found it was using `window` in a Node.js environment
   - Identified that we needed a proper mock for the ServiceWorker global scope
   - Determined that the test needed to be adjusted to use Node.js environment with proper globals
   - Discovered that the Jest setup file was being loaded and causing conflicts

2. First solution attempt
   - Created a comprehensive mock for ServiceWorker environment
   - Set up global objects that mimic the service worker runtime
   - Used `vm` module to execute the service worker script in isolation
   - Added proper Jest environment annotation

3. Second solution attempt after continued failures
   - Found that the global Jest setup file was still being loaded despite environment configuration
   - Created a new test file that uses `isolatedModules` option
   - Added `jest.autoMockOff()` to prevent Jest's auto-mocking
   - Built a completely self-contained test environment with all necessary mocks
   - Implemented more comprehensive mocks for Request and Response objects

4. Cache-busting enhancement
   - Added `addCacheBustForDev` function to ensure CSS is always fresh
   - Implemented proper query parameter cache busting for development
   - Enhanced the service worker to use this function for CSS requests
   - Ensured compatibility with the testing environment

#### Resolution
- Fixed the syntax validation test:
  - Added proper `@jest-environment node` annotation with `isolatedModules` option
  - Created a comprehensive mock of the service worker global scope
  - Used Node's `vm` module to execute the script in a controlled environment
  - Added isolated beforeAll setup to create a completely independent environment
  - Added explicit mocks for all browser APIs used by the service worker

- Enhanced the service worker with cache-busting:
  - Added `addCacheBustForDev` function to add timestamp to CSS requests
  - Applied this function to CSS requests in development mode
  - Used proper request cloning to avoid modifying the original request
  - Made the service worker code more robust with console calls using our logging utility

#### Lessons Learned
- Service worker tests need special environment configuration
- Tests for browser-specific code require careful mocking in Node.js environments
- Using `vm` module provides a safer way to test script syntax without execution side effects
- Jest's setup files can interfere with isolated tests that need different environments
- The `isolatedModules` option helps create truly isolated test environments
- Cache-busting via query parameters is effective for development CSS refreshing
- Browser API mocking requires attention to object methods and inheritance
- Consistent logging via utility functions helps with debugging service workers
