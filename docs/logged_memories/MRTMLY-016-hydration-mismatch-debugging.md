# MRTMLY-016: Hydration Mismatch Debugging for Theme Variables

**Date:** 2023-07-25
**Tags:** #debugging #hydration #theme #styling #nextjs
**Status:** In Progress

## Initial State
- The application is experiencing hydration mismatches between server and client rendering
- Error occurs specifically in the SplashScreen component styling
- Theme-specific CSS variables are inconsistent between server and client
- Key issues:
  - Server renders with `background-color` while client expects `backgroundColor`
  - Server uses light theme variables while client uses dark theme variables
  - HTML has inconsistent className (`dark-mode` missing in client)

## Debug Process

1. Identified hydration mismatch error
   - Error occurs during initial page load
   - Inconsistent style properties between server and client rendering
   - Server and client have different theme settings (light vs dark)
   - CSS property names are in different formats (kebab-case vs camelCase)

2. Root cause analysis
   - Theme detection happens client-side via a theme context
   - Server-side rendering has no access to user's theme preference
   - Results in server rendering with default theme (light) while client may use stored preference (dark)
   - Style attribute syntax differences cause additional mismatches

3. Solution approach options
   - Option 1: Fix immediate inline style syntax to be React-compatible (camelCase)
   - Option 2: Move all theme-dependent styles to CSS classes instead of inline styles
   - Option 3: Implement server-side theme detection with cookies or local storage hydration
   - Option 4: Use a loading pattern that defers rendering until after hydration

## Implementation Plan

1. Fix immediate style syntax issues
   - Convert kebab-case CSS properties to camelCase for React
   - `background-color` → `backgroundColor`

2. Implement consistent theme handling
   - Add script to prevent flash of wrong theme by checking localStorage before render
   - Create a theme initialization function that runs before hydration
   - Use CSS variables with fallbacks that work in both light and dark modes

3. Refactor SplashScreen component
   - Move inline styles to CSS module using theme variables
   - Implement proper theme class toggling with useEffect after mount
   - Add preload mechanism for user theme preference

## Technical Details

The primary issue involves how React hydration works with styling:

1. Server renders HTML with:
   ```html
   style="background-color: var(--bg-primary, #ffffff)"
   ```

2. Client expects React DOM properties:
   ```jsx
   style={{backgroundColor: "var(--bg-primary-dark, #121212)"}}
   ```

3. The mismatch in both property name format and variable values causes hydration errors

The solution will involve:
- Using proper React camelCase format for style properties
- Implementing a theme context that works consistently across SSR and CSR
- Adding a script to prevent theme flashing during load

## Progress 

- [x] Identified hydration mismatch causes
- [ ] Fix immediate style syntax issues
- [ ] Implement consistent theme handling
- [ ] Refactor SplashScreen component
- [ ] Test across multiple devices and browsers

## Next Steps

1. Create a fix for the SplashScreen component that corrects the style attributes
2. Implement proper theme initialization that works with SSR
3. Create a test case to verify hydration works correctly
4. Document the solution for future reference
