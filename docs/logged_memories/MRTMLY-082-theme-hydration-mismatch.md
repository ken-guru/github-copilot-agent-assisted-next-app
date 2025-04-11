### Issue: Theme Hydration Mismatch in Next.js App
**Date:** 2025-04-15
**Tags:** #bug-fix #theme #hydration #ssr #nextjs
**Status:** Resolved

#### Initial State
- Application experiencing hydration mismatch errors related to theme classes
- Error shown: "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties"
- The mismatch occurs because the server renders with `className="light-mode"` but client might use a different theme based on localStorage or system preferences
- This happens because theme detection runs differently during SSR vs client-side

#### Debug Process
1. Error analysis
   - Examined hydration error in console
   - Identified that the mismatch specifically related to the HTML element's `className`
   - Found that `light-mode` class was added during server rendering
   - Determined that client-side theme detection was running after hydration

2. Cause identification
   - Server can't access browser-specific APIs (localStorage, matchMedia)
   - Theme detection logic runs twice: once during SSR and once on the client
   - The client uses localStorage and system preferences to determine theme
   - These two determinations may not match, causing the hydration error

3. Solution approaches considered
   - Option 1: Move all theme detection to the client using useEffect
   - Option 2: Add a script that runs before React hydration to apply the theme
   - Option 3: Use a theme provider with a suppressHydrationWarning attribute
   - Option 4: Use cookies to share theme preference between server and client

#### Resolution
- Created a solution that addresses the core hydration issue:
  - Implemented a pre-hydration script that runs before React hydration
  - Applied theme from localStorage or system preference during document initialization
  - Used the `suppressHydrationWarning` attribute on the HTML element to prevent React warnings
  - Made sure theme transitions remain smooth by avoiding flash of incorrect theme

- The implementation ensures:
  - No hydration mismatch warnings
  - Theme preference is preserved across page loads
  - System preference is still respected when no explicit preference is set
  - No flash of incorrect theme during page load

#### Lessons Learned
- Server-side rendering requires special consideration for browser-specific features like theme preferences
- Use `suppressHydrationWarning` when client-side values must differ from server-rendered values
- Pre-hydration scripts are effective for applying user preferences before React hydration
- Theme detection should prioritize user preferences over system preferences
- When working with Next.js, consider both SSR and CSR implications of UI features
