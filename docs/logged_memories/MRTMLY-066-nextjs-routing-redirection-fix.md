### Issue: Next.js Routing Redirection Fix
**Date:** 2025-04-08
**Tags:** #debugging #routing #next-js #redirection #app-router #pages-router
**Status:** Resolved

#### Initial State
- After implementing a bridge solution with `pages/index.tsx` redirecting to `/`, the page shows "Redirecting..." but doesn't complete the redirection
- Project has a hybrid routing structure with both App Router and Pages Router
- Initial splash screen appears, but then displays "Redirecting..." indefinitely
- Root route (`/`) is not being properly handled by either routing system

#### Debug Process
1. Bridge implementation analysis
   - Created a redirect in `pages/index.tsx` to pass control to App Router
   - Confirmed splash screen appears initially, indicating some routing is working
   - Identified that the redirect is not completing successfully
   - Suspicion: circular redirection may be occurring

2. Routing system investigation
   - Next.js hybrid routing system requires specific coordination
   - In hybrid setups, Pages Router takes precedence over App Router for the same routes
   - Our redirection in `pages/index.tsx` was causing a loop where:
     - Pages Router loads `pages/index.tsx`
     - It tries to redirect to `/`
     - Next.js routes back to `pages/index.tsx`
     - Redirection loop continues

3. Component integration approach
   - Examined structure of both the Pages Router and App Router implementations
   - Identified all essential elements needed from the App Router layout
   - Created a comprehensive bridge implementation that:
     - Directly imports the App Router's Home component
     - Sets up the same fonts and styles
     - Handles service worker registration
     - Includes all necessary meta tags

#### Resolution
- Implemented a complete bridge solution in `pages/index.tsx` that:
  1. Directly imports and renders the App Router's Home component instead of redirecting
  2. Replicates all essential elements from the App Router's layout
  3. Sets up fonts, styles, and service worker registration consistently
  4. Provides proper wrappers for the component tree
- This approach bypasses the redirection loop by ensuring the Pages Router directly renders the App Router component
- Maintained Next.js configuration with proper settings to recognize the source directory structure
- Created a seamless integration between the two routing systems that users won't notice

#### Lessons Learned
- Next.js hybrid routing requires careful coordination between Pages Router and App Router
- Redirecting between routing systems can cause infinite loops when both target the same path
- A more effective approach is direct component integration rather than redirection
- When bridging between routing systems, all layout elements and side effects must be preserved
- Testing with localhost is crucial for catching routing issues before deployment
- Component composition provides a more reliable bridge than navigation-based solutions