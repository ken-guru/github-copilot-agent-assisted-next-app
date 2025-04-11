### Issue: Test Suite Failure Debugging Session
**Date:** 2023-11-15
**Tags:** #debugging #tests #layout #theme #splashScreen
**Status:** Resolved

#### Initial State
- Multiple failing tests in the test suite
- Layout tests failing with module import errors for Geist fonts
- ThemeToggle tests failing with localStorage mock issues
- SplashScreen tests failing with LoadingContext undefined errors

#### Debug Process
1. Layout test investigation
   - Identified that Geist font modules needed to be mocked
   - Also identified missing viewport configuration in layout.tsx

2. ThemeToggle test investigation
   - Found that localStorage methods were not properly mocked
   - The classList.contains method was also not correctly mocked

3. SplashScreen test investigation
   - LoadingContext was not available in the test environment
   - Found that jest.useFakeTimers() was not being called correctly
   - Aspect ratio test was using real computed styles instead of mocks

#### Resolution
1. Created mock modules for Geist font imports
   - Added __mocks__/geist/font/mono.js and __mocks__/geist/font/sans.js
   - Provided simple export objects matching expected structure

2. Fixed viewport configuration in layout.tsx
   - Added proper viewport export with required properties
   - Added mobile-specific viewport settings

3. Implemented comprehensive localStorage mocking in ThemeToggle tests
   - Used a factory function to create a proper mock
   - Added proper mockImplementation for all methods

4. Fixed document.documentElement.classList mocking
   - Added state tracking for dark/light mode
   - Implemented mock functions that update this state

5. Fixed SplashScreen tests
   - Added proper mocking for LoadingContext
   - Used jest.useFakeTimers() and jest.useRealTimers() appropriately
   - Added proper mock for window.getComputedStyle

#### Lessons Learned
- Always mock external modules in tests
- Use proper Jest mocking patterns for browser APIs
- Track state in mock implementations when necessary
- Always clean up timers after tests
- Mock context providers or their hooks for component tests
