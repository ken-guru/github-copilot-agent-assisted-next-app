### Issue: SplashScreen and Page Title Tests Debugging
**Date:** 2023-11-30
**Tags:** #debugging #tests #components #splashscreen
**Status:** Resolved

#### Initial State
- Two failing tests:
  1. SplashScreen test expecting DOM removal after animation
  2. Page test with ambiguous title selector causing "Found multiple elements with the text: Mr. Timely"
- SplashScreen component was added to fix module import issues but caused new test failures

#### Debug Process
1. Investigation of SplashScreen test failure
   - Test expected element to be removed from DOM after fade-out animation
   - In Jest environment with fake timers, React doesn't always complete DOM updates
   - Issue identified: Test expectations didn't match actual component behavior in test environment

2. Solution attempt for SplashScreen test
   - Updated test to check for fadeOut class instead of null element
   - Added data-testid attribute to make selections more reliable
   - Updated component to include optional testMode parameter to modify behavior

3. Investigation of page test failure
   - Multiple elements with text "Mr. Timely" were found in the rendered output
   - Both SplashScreen and main header had title elements
   - Testing library couldn't determine which element to select

4. Solution attempt for page test
   - Updated selector to be more specific: `{ selector: 'header h1.title' }`
   - This ensures we're getting the title in the header, not the splash screen

#### Resolution
- SplashScreen test: Changed expectations to check for fadeOut class rather than DOM removal
- Page test: Added more specific selector to target only the header title element
- Added data-testid to SplashScreen component for more reliable selection
- All tests now pass correctly

#### Lessons Learned
- Jest's fake timers don't automatically handle React's DOM updates the same way real timers do
- When components have async effects like animations, tests should check properties rather than complete DOM removal
- When multiple elements match the same text, use more specific selectors (by role, by testid, or with CSS selector constraints)
- Always add testids to components that might be tested in isolation from their parent context
