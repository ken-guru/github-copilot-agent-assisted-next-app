### Issue: MRTMLY-006: Service Worker Registration Test Failures
**Date:** 2024-12-05
**Tags:** #debugging #tests #service-worker #jest-mocks
**Status:** Resolved

#### Initial State
- Service worker registration tests failing inconsistently
- Error: "TypeError: Cannot read property 'then' of undefined"
- Test environment not properly simulating browser registration
- Different behavior between local tests and CI environment

#### Debug Process
1. Investigated test environment setup
   - Found inconsistent mocking of navigator.serviceWorker
   - Identified promise chain breaking in registration mock
   - Determined race conditions in test execution

2. Solution attempts
   - Improved navigator.serviceWorker mock
     - Created more complete mock implementation with promise chain
     - Ensured register() returns proper promise
     - Outcome: Better but still occasional failures
     - Issue: Mock implementation details still incomplete

   - Added explicit test waiters
     - Implemented proper async test patterns
     - Added jest.advanceTimersByTime() for controlled timing
     - Outcome: Improved stability but edge cases still failing
     - Why: Registration events not properly simulated

   - Created comprehensive service worker test harness
     - Implemented full mock of service worker lifecycle
     - Added event simulation for registration events
     - Created utility for consistent test patterns
     - Outcome: Tests now passing consistently

#### Resolution
- Final solution implemented:
  - Complete service worker registration mock
  - Standardized testing patterns for async service worker operations
  - Implemented controlled timing for registration events
  - Added robust error handling in tests
- All registration tests now pass consistently

#### Lessons Learned
- Key insights:
  - Service worker testing requires comprehensive browser API simulation
  - Async testing patterns must be consistently applied
  - Test environment needs to closely match browser behavior
- Future considerations:
  - Create dedicated testing library for service worker functionality
  - Consider using test environment that better simulates browser
  - Implement integration tests with real service worker behavior