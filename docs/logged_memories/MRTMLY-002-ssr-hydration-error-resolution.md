### Issue: React Hydration Error in Display Toggle Feature
**Date:** 2023-11-02
**Tags:** #debugging #hydration #SSR #react
**Status:** Resolved

#### Initial State
- Implementation of the "keep display on" toggle feature resulted in React hydration errors
- Error showed mismatches between server and client rendered HTML
- Specifically related to checking for browser APIs during rendering
- Error message indicated a mismatch in hydration caused by server/client branch with `typeof window !== 'undefined'`

#### Debug Process
1. Error analysis
   - Identified that the hydration error was caused by conditional code that ran differently on server vs client
   - The error occurred because we were accessing browser-specific APIs (localStorage and Wake Lock API) during component rendering
   - Found that conditional checks like `typeof window !== 'undefined'` were not sufficient when used directly in render logic

2. Solution attempt: Defer client-side initialization
   - Modified the DisplaySettingsContext to always render with default values initially
   - Used a useEffect hook to load localStorage values only after component mount
   - Used a ref to track if we're in the initial client render
   - Result: Eliminated the hydration mismatch, but created a flash of incorrect UI state

3. Solution attempt: Hide content until client-side hydration
   - Modified _app.tsx to conditionally render content only after client-side hydration
   - Used useState and useEffect to detect client-side rendering
   - Result: Eliminated both hydration errors and UI flashes, but added a slight delay before content is visible

4. Solution attempt: Safe SSR checks in all components
   - Updated all components to avoid rendering different content on server vs client
   - Made sure all browser API access happens in useEffect hooks
   - Added explicit checks before rendering browser-specific content
   - Result: Components render consistently across environments, eliminating hydration errors

#### Resolution
- Implemented a multi-layer approach to fix hydration issues:
  1. Made DisplaySettingsContext always initialize with the same default values on both server and client
  2. Moved all localStorage access to useEffect hooks that only run on client
  3. Used a ref to track initial client render to prevent unnecessary localStorage updates
  4. Made useWakeLock hook SSR-safe by checking for browser APIs in useEffect
  5. Avoided conditional rendering based on browser-specific features during initial render
  6. Added comprehensive tests to verify SSR compatibility of all components

- The hydration error was successfully resolved, and the feature now works correctly in both SSR and client environments.

#### Lessons Learned
- Always design React components with SSR in mind from the start
- Never access browser-specific APIs during component rendering
- Use useEffect for browser API interactions to ensure they only happen on client
- Test components in both simulated server and client environments
- Add explicit checks for functionality that might differ between environments
- Wrapping problematic components with a client-side detection wrapper can be a viable solution for complex cases
- Consider using Next.js dynamic imports with the `{ ssr: false }` option for components that depend heavily on browser APIs
