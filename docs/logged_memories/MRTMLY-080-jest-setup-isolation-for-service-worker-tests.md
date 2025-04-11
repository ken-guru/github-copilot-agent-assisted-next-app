### Issue: Jest Setup Conflicts with Service Worker Test Environment
**Date:** 2025-04-13
**Tags:** #debugging #service-worker #testing #jest-config #test-isolation
**Status:** Resolved

#### Initial State
- Service worker syntax validation test was consistently failing with error:
  ```
  ReferenceError: window is not defined
  
  at Object.window (jest.setup.js:4:23)
  ```
- Previous solutions didn't work because the global Jest setup file was always loaded first
- The error was occurring in the Jest setup file itself, not in our test code
- This was preventing us from validating the service worker syntax

#### Debug Process
1. Test failure root cause analysis
   - Inspected the complete error stack trace to locate the source of the issue
   - Found the error was happening in `jest.setup.js` which tries to mock `window.matchMedia`
   - Discovered that Jest always loads the global setup file before any test environment is initialized
   - Determined that we needed to bypass the global setup for this specific test

2. First solution attempt
   - Created a specialized Jest configuration for service worker tests
   - Added explicit environment options to the test file
   - Implemented a dedicated mock for service worker globals
   - Result: Still failing with the same error as Jest was applying global setup

3. Second solution attempt
   - Created an even more isolated test environment
   - Added more robust mocks for browser APIs (Request, Response)
   - Implemented proper headers and cloning behavior
   - Result: Still failing with the same error from global setup

4. Third solution attempt
   - Changed approach to completely exclude the test from the main test run
   - Created a separate Jest configuration that explicitly doesn't use any setup files
   - Modified the main Jest configuration to ignore the service worker test directory
   - Added a dedicated npm script for running only service worker tests
   - Result: Now the service worker tests can run independently without conflicts

#### Resolution
- Created completely separate test execution path:
  - Added a dedicated Jest configuration file `test/service-worker/jest-sw-config.js`
  - Set it up with no setupFilesAfterEnv to avoid loading global setup
  - Added proper testMatch pattern to only run the service worker test

- Updated main Jest configuration:
  - Added testPathIgnorePatterns to exclude service worker tests from main test run
  - This prevents the global setup from conflicting with these specialized tests

- Rewrote the service worker test for complete isolation:
  - Created comprehensive mock implementation of service worker globals
  - Implemented proper Request and Response class mocks
  - Used Node.js vm module to create a completely isolated execution context

- Added dedicated test script:
  - Added `test:sw` script to package.json for running only service worker tests
  - This creates a clear separation between normal tests and specialized environment tests

#### Lessons Learned
- Jest's global setup files can't be selectively applied to different tests
- For Node.js environments requiring no browser APIs, it's better to run them separately
- Test isolation is easier to achieve through separate test runs than trying to hack around setup files
- Custom Jest configurations are powerful for specialized test requirements
- Sometimes it's better to exclude tests from the main run than to try to make them compatible
- VM module in Node.js is excellent for testing code syntax without execution side effects
- Mocking browser APIs requires careful attention to object prototypes and inheritance
- Service worker testing requires a dedicated testing approach separate from normal component tests
