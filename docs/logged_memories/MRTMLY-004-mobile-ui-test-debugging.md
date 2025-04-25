# MRTMLY-004: Mobile UI Test Debugging

**Date:** 2023-07-10
**Tags:** #debugging #tests #mobile #context
**Status:** Resolved

## Initial State
- OvertimeIndicator tests were passing after implementation
- MobileUI tests were failing due to missing dependencies:
  - `../context/AppStateContext` module could not be found
  - The test was trying to import a more complete App component than what was available
- Error message indicated nested dependency issues from `App.tsx` being imported in test

## Debug Process

1. Understanding the dependency chain
   - The MobileUI test imports App component
   - App component imports AppStateContext, ThemeContext, and other components
   - AppStateContext was missing, causing cascade of import failures

2. Implementation strategy evaluation
   - Option 1: Create full implementation of all dependencies
   - Option 2: Create minimal implementations focused on test success
   - Option 3: Mock all dependencies in test
   - Selected approach: Create minimal implementations for core contexts and mock sub-components

3. Implementing AppStateContext
   - Created a simplified but functional AppStateContext with essential state and actions
   - Implemented useAppState hook for consumption within components
   - Added relevant types for activities and state management

4. Simplifying App component
   - Created minimal App component with mocked sub-components
   - Implemented only the essential functionality needed for tests
   - Added support for overtime detection and rendering OvertimeIndicator

5. Test adaptation
   - Updated MobileUI test to work with the new minimal implementations
   - Added viewport simulation utilities
   - Mocked useViewport hook to control responsive behavior

## Resolution
- Created functional implementations of:
  - AppStateContext with reducer and provider
  - Simplified App component with mock sub-components
  - Basic CSS modules for styling
- Fixed test by providing all required dependencies
- Tests now pass, confirming:
  - Mobile-specific classes are applied
  - Overtime indicator displays correctly in overtime state

## Lessons Learned
1. **Test isolation is critical**: The MobileUI test was too tightly coupled to actual implementations, making it brittle. Future tests should be more isolated with better mocking.

2. **Component dependencies matter**: When planning tests, consider the full dependency graph to avoid complex setup requirements.

3. **Mock vs. Implement tradeoff**: Sometimes it's better to create simplified real implementations rather than complex mocks, especially for context providers.

4. **Test-first saved time**: Having the tests first made it clear what the minimum implementation needed to satisfy requirements.

5. **Consider test helpers**: Creating utilities for viewport simulation and other common test scenarios makes tests more maintainable.
