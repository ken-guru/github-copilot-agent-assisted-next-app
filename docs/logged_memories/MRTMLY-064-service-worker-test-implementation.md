### Issue: MRTMLY-413: Service Worker Test Implementation
**Date:** 2025-04-28  
**Tags:** #debugging #cypress #e2e-tests #service-worker  
**Status:** In Progress  

#### Initial State
- Cypress configuration has been fixed and E2E tests are now able to run
- Activity state transition tests are passing
- Basic page functionality tests are passing
- Service worker tests are partially working but have some failures

#### Debug Process
1. Investigation of service worker test failures
   - We have a mix of issues with the service worker tests:
     - Custom command `waitForServiceWorkerRegistration` is not being recognized
     - Timeouts when waiting for service worker registration
     - Issues with route interceptors for service worker requests

2. Current understanding
   - The custom Cypress commands for service worker interaction need to be properly registered in commands.ts
   - We may need a different approach for testing service workers in Cypress
   - The current implementation is trying to wait for events that may not be firing properly

#### Plan Forward
1. Implement proper TypeScript definitions for custom Cypress commands
2. Review service worker implementation in the application
3. Consider simplifying the service worker tests or mocking certain behavior
4. Add timeout configuration specifically for service worker tests

#### Next Steps
- Review service worker implementation
- Fix type definitions for custom commands
- Add proper timeouts and fallback mechanisms for service worker tests
- Consider adding retry logic for flaky service worker tests

#### Lessons Learned So Far
- Cypress 14+ requires explicit configuration for test types (e2e)
- Handling hydration mismatches requires specific exception handling
- Custom commands need proper TypeScript type definitions
- Service worker testing may require additional configuration
