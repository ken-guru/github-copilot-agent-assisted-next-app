### Issue: MRTMLY-009: Service Worker Test Mocking Problems
**Date:** 2024-11-30
**Tags:** #debugging #testing #service-worker #jest-mocks
**Status:** Resolved

#### Initial State
- Service worker tests failing inconsistently
- Jest mocks for service worker registration not working properly
- Test environment polluted between test runs
- Mock reset not functioning as expected

#### Debug Process
1. Investigated Jest mocking approach
   - Found improper use of jest.mock() for service worker APIs
   - Identified mocks persisting between test runs
   - Determined need for more granular mock control

2. Solution attempts
   - Refactored mock implementation
     - Used jest.spyOn instead of jest.mock
     - Added manual mock reset in beforeEach/afterEach
     - Outcome: Improved but still some contamination
     - Issue: Global namespace still polluted

   - Created isolated test environment
     - Implemented module-level mock isolation
     - Added proper cleanup between tests
     - Outcome: Better but some edge cases still failing
     - Why: Complex interactions between mocks

   - Implemented comprehensive mock strategy
     - Created dedicated mock factory for service worker APIs
     - Used jest.isolateModules for complete isolation
     - Implemented proper mock lifecycle management
     - Outcome: Tests now consistent and reliable

#### Resolution
- Final solution implemented:
  - Custom mock factory for service worker registration
  - Comprehensive beforeEach/afterEach cleanup
  - Module isolation for each test file
  - Clear documentation of mock patterns
- All service worker tests now pass consistently

#### Lessons Learned
- Key insights:
  - Complex browser APIs require specialized mocking strategies
  - Module isolation is crucial for stateful API testing
  - Mock lifecycle must be carefully managed
- Future considerations:
  - Create a library of reusable mock patterns
  - Consider using testing-library for more realistic testing
  - Evaluate alternatives to jest for service worker testing