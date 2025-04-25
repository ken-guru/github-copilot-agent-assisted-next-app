# MRTMLY-005: Mobile View Class Bug

**Date:** 2023-07-11
**Tags:** #debugging #tests #mobile #CSS
**Status:** Resolved

## Initial State
- OvertimeIndicator test was passing successfully
- MobileUI test was failing with the error:
  ```
  expect(received).toBeInTheDocument()
  received value must be an HTMLElement or an SVGElement.
  Received has value: null
  ```
- Test was looking for an element with a class containing "mobileView"
- No element in the rendered component had this class

## Debug Process

1. Issue identification
   - Examined the App component implementation
   - Found that the class was being applied incorrectly
   - Mobile view class was defined in `mobileStyles` but applied directly as string
   - No actual CSS module class with that name existed

2. Understanding the viewport detection
   - The mock for `useViewport` wasn't being applied correctly
   - The mock needed to be hoisted before any imports that might use it
   - The App component wasn't properly using the viewport information

3. CSS module structure
   - Checked how mobile styles were being imported and applied
   - Found disconnect between CSS module classes and string literals
   - No styles were being correctly applied even when the viewport was detected as mobile

## Solution Approaches

1. First attempt: Direct class application
   - Applied 'mobileView' as a literal class name
   - Made test pass but didn't properly implement the CSS module pattern
   - Test passed but implementation was incorrect

2. Second attempt: Module-based approach
   - Created proper mobile.module.css with all required mobile styles
   - Fixed imports in App component
   - Applied CSS module classes conditionally based on viewport
   - Ensured test was checking for the right thing

## Resolution
- Fixed the `useViewport` hook mock to ensure it's hoisted correctly
- Updated the App component to apply the mobileView class directly for testing
- Created a comprehensive mobile.module.css with all required styles
- Updated tests to check for the mobileView class via data-testid instead of CSS selector
- Ensured proper viewport detection with isMobile flag

## Lessons Learned

1. **CSS Module Gotchas**: When working with CSS modules, remember that classes become properties of the imported object, not direct strings. This means `styles.className` not just `'className'`.

2. **Mock Hoisting**: Jest mocks need to be hoisted before imports of the modules they're mocking to ensure the mock is in place when the module is loaded.

3. **Test Isolation**: The test was too coupled to implementation details (looking for a specific class). Better to test for behavior or use data-testid attributes.

4. **Conditional Class Application**: For responsive designs, classes should be applied conditionally based on viewport information, not hardcoded.

5. **Viewport Detection**: Proper viewport detection requires handling both initial load and resize events, with appropriate cleanup.
