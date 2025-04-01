### Issue: ThemeToggle System Preference Test Failure
**Date:** 2025-03-31
**Tags:** #debugging #tests #theme
**Status:** In Progress

#### Initial State
- ThemeToggle test "updates theme when system preference changes" is failing
- Error: The document's classList does not contain "dark-mode" as expected when simulating system preference change
- Current implementation uses fake timers but theme changes aren't being properly applied in test environment

#### Debug Process
1. Investigated ThemeContext implementation
   - Identified that ThemeProvider handles system preference changes through a MediaQueryList event listener
   - The applyTheme function modifies document.documentElement.classList when theme changes
   - The test mocks matchMedia but doesn't properly trigger the theme context update flow

2. Solution attempts
   - Added Jest fake timers to handle setTimeout calls in theme change logic
   - However, the core issue is that the mocked callback for system preference changes isn't properly updating the theme
   - Need to investigate how MediaQueryList "change" events flow through to the theme context

#### Planned Solution
- Modify the test to better simulate the actual behavior of system preference changes
- Ensure the theme context has time to process the preference change
- Consider adding a direct way to inspect or force theme updates in test environment