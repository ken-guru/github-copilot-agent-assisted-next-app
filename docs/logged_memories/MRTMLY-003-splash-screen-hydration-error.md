### Issue: SplashScreen Hydration Error Debugging
**Date:** 2023-11-03
**Tags:** #debugging #hydration #SSR #react #styles #theme
**Status:** Resolved

#### Initial State
- Hydration errors were occurring in the SplashScreen component
- Error showed mismatches between server and client rendered HTML
- Specific issues included:
  - Missing `className="dark-mode"` on the client
  - CSS property naming differences (`backgroundColor` vs `background-color`)
  - Different color variable values between server and client
- The error message pointed to style attributes in the SplashScreen component that were inconsistent between server and client rendering

#### Debug Process
1. Error analysis
   - Analyzed the hydration error details from the console
   - Identified three key mismatch points:
     1. The `dark-mode` class being added dynamically after hydration
     2. Style property format inconsistency (React uses camelCase, CSS uses kebab-case)
     3. Inconsistent CSS variable references between server and client

2. Root cause investigation
   - Theme detection was happening client-side only after initial render
   - The `dark-mode` class was being applied dynamically via JavaScript
   - CSS properties were using kebab-case format (e.g., `background-color`) which React converts to camelCase
   - Theme variables were being applied inconsistently between server and client

3. First solution attempt: Fix property naming
   - Updated all style properties to use React's camelCase format
   - Changed `background-color` to `backgroundColor`
   - Result: Partially fixed the hydration mismatch, but still had theme variable inconsistencies

4. Second solution attempt: Consistent theme initialization
   - Created a proper ThemeProvider context with consistent initial state
   - Made server and client always start with light theme
   - Applied theme changes only after hydration on client
   - Result: Fixed all hydration mismatches

#### Resolution
- Implemented a comprehensive solution with several components:
  1. Created a ThemeProvider component that always starts with light theme for SSR
  2. Used React's camelCase style properties consistently
  3. Fixed CSS variable references to use the same base variables for initial render
  4. Only applied theme preferences from localStorage after client-side hydration
  5. Added comprehensive tests to verify server/client rendering consistency

- The hydration error has been successfully resolved, and the SplashScreen component now renders consistently between server and client.

#### Lessons Learned
- Always ensure the initial render is identical between server and client
- Use React's camelCase style properties instead of CSS kebab-case
- Don't apply theme preferences during initial render; defer until after hydration
- Create a dedicated theme provider to manage theme state consistently
- Test SSR compatibility by simulating server and client environments
- Use CSS variables with consistent default values for initial rendering
- Remember that style attributes in React components need special attention for SSR
