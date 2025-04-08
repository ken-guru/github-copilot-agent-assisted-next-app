### Issue: Splash Screen Stuck in Hybrid Routing Setup
**Date:** 2025-04-12
**Tags:** #debugging #splash-screen #hybrid-routing #next-js #loading-state
**Status:** Resolved

#### Initial State
- Application shows 404 errors when accessing the root route locally
- After rebuilding, the splash screen appears but remains visible indefinitely
- Using a hybrid routing structure with both App Router (`/src/app`) and Pages Router (`/pages`)
- Previous fixes removed the Pages Router implementation but didn't properly create a bridge

#### Debug Process
1. Routing structure analysis
   - Confirmed App Router implementation exists and works independently
   - Found that Pages Router still handles requests but doesn't properly integrate with App Router
   - Identified that the LoadingContext state wasn't being properly managed in the bridge implementation
   - Discovered that the splash screen relies on LoadingContext to determine when to hide

2. Loading state management investigation
   - In the App Router implementation, LoadingContext is set up in the layout
   - LoadingContext's initial state is true, meaning "loading"
   - The splash screen remains visible until isLoading is set to false
   - In the original implementation, a useEffect sets isLoading to false after initialization

3. Test implementation
   - Created comprehensive tests to verify routing integration works
   - Added specific tests for LoadingContext state management
   - Verified splash screen behavior in both routing systems
   - Ensured service worker initialization still works

#### Resolution
1. Created a proper bridge implementation in `pages/index.tsx` that:
   - Imports and renders the App Router component correctly
   - Sets up the LoadingProvider with proper initial state
   - Implements a BridgeContent component that manages loading state
   - Contains a useEffect hook that initializes the app and sets loading to false
   - Registers the service worker for offline functionality
   - Properly handles update notifications

2. Enhanced integration tests to:
   - Verify App Router components render independently
   - Confirm Pages Router bridge properly integrates with App Router
   - Test loading state management and splash screen behavior
   - Check for correct routing structure

3. The fix ensures:
   - Splash screen appears during initialization
   - Splash screen properly disappears after initialization
   - App Router component renders correctly through the Pages Router bridge
   - Service worker registration functions properly
   - Offline functionality works as expected

#### Lessons Learned
- In hybrid routing setups, proper state management between routing systems is critical
- Loading state must be managed consistently across routing implementations
- Bridge implementations need to replicate all initialization logic from the target system
- Testing both routing systems independently and together helps identify integration issues
- Context providers in hybrid setups need careful attention to ensure state is properly shared
- Splash screens and loading indicators depend on properly managed loading state
- Next.js 15+ requires explicit handling when mixing Pages Router and App Router
