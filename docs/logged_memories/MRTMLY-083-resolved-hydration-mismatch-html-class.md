### Issue: MRTMLY-083: Resolved HTML Class Hydration Mismatch
**Date:** 2025-04-16
**Tags:** #bug-fix #hydration #nextjs #theme #ssr
**Status:** Resolved

#### Initial State
- Application showing hydration mismatch error in console
- Error related to class name on HTML element: `className="light-mode"`
- SSR rendering with light-mode class while client-side rendering attempted different theme
- Error message: "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties"
- Root cause: theme detection logic different between server and client sides

#### Debug Process
1. Error identification
   - Examined error message pointing to className mismatch on HTML element
   - Determined this was related to theme class application
   - Found that SSR was always using "light-mode" class
   - Client-side rendering was checking localStorage and system preferences

2. Solution approach
   - Considered multiple approaches to address the issue:
     - Using `suppressHydrationWarning` attribute on HTML element
     - Adding pre-hydration script to set correct theme before React hydration
     - Moving theme detection entirely to client-side with useEffect
     - Using cookies to share theme information between server and client

3. Implementation selection
   - Selected approach using a pre-hydration script combined with suppressHydrationWarning
   - This approach allows immediate theme application without flash of wrong theme
   - Maintains responsiveness to user preferences
   - Avoids hydration errors while preserving functionality

#### Resolution
- Added `suppressHydrationWarning` attribute to HTML element in RootLayout component
- Implemented pre-hydration script that runs before React hydration to:
  - Check localStorage for user theme preference
  - Fall back to system preference if no explicit user preference exists
  - Apply appropriate theme class to HTML element immediately
- Modified ThemeToggle component to be SSR-aware:
  - Only initialize theme state after component mount
  - Avoid theme application during server-side rendering
  - Respect theme already applied by pre-hydration script

- The result:
  - No more hydration mismatch errors in console
  - Theme correctly applied on initial page load
  - No flash of incorrect theme during page load
  - Theme preferences correctly persisted between sessions
  - System preference detection working properly

#### Lessons Learned
- Next.js SSR requires special consideration for browser API access like localStorage and matchMedia
- Pre-hydration scripts are effective for applying client-specific preferences immediately
- `suppressHydrationWarning` is valuable when client rendering must differ from server rendering
- Theme handling should account for both SSR and CSR environments
- Using inline scripts before hydration helps provide a seamless user experience
- Client-side component initialization should respect pre-hydration state
- The same solution pattern could be applied to other personalized UI elements in SSR applications
