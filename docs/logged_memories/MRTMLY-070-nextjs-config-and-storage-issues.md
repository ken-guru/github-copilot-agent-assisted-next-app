### Issue: Next.js Configuration Errors and Browser Storage Issues
**Date:** 2025-04-08
**Tags:** #debugging #next-js #configuration #service-worker #browser-storage
**Status:** Resolved

#### Initial State
- Next.js warns about invalid configuration options in `next.config.ts`:
  ```
  ⚠ Invalid next.config.ts options detected: 
  ⚠     Unrecognized key(s) in object: 'appDir' at "experimental"
  ⚠     Unrecognized key(s) in object: 'srcDir'
  ⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
  ```
- Application is functional but shows warnings at startup
- Browser DevTools Application tab doesn't show any storage being used
- Service worker appears to be registered but not properly caching assets
- This occurred after implementing fixes for routing conflicts and service worker registration

#### Debug Process
1. Configuration error investigation
   - The warnings indicate that `appDir` and `srcDir` options are not recognized
   - Current Next.js version is 15.2.4, which uses different configuration options
   - These configuration options were renamed or removed in newer versions of Next.js
   - Needed to check official Next.js documentation for proper configuration syntax

2. Browser storage issue investigation
   - No storage appeared in DevTools Application tab
   - Service worker caching wasn't working properly
   - Determined the service worker was being registered but not caching assets
   - Found that service worker cache initialization needed improvement

3. Service worker implementation analysis
   - Examined service worker registration process in `pages/index.tsx`
   - Identified that while registration was successful, caching was not properly triggered
   - Found issues with error handling and the update lifecycle management
   - Discovered that service worker wasn't properly skipping waiting and claiming clients
   - The cache name needed updating to bust old caches

#### Resolution
1. Next.js Configuration Fix:
   - Updated `next.config.ts` to use the correct options for Next.js 15.2.4
   - Removed the unsupported `appDir` option (App Router is enabled by default in Next.js 15+)
   - Removed the unsupported `srcDir` option
   - Added appropriate configuration for the hybrid routing setup
   ```typescript
   const nextConfig: NextConfig = {
     // App Router is enabled by default in Next.js 15+
     distDir: ".next",
     
     experimental: {
       // For our hybrid routing setup
       serverActions: true,
     },
     
     // Enable more detailed error information
     typescript: {
       ignoreBuildErrors: false,
     },
     
     // Resolve paths properly
     webpack(config) {
       return config;
     },
   };
   ```

2. Service Worker Registration Enhancement:
   - Implemented improved service worker registration with proper error handling
   - Added unregistration of existing service workers to ensure clean state
   - Enhanced lifecycle management with explicit event listeners
   - Added explicit scope declaration for consistent behavior
   - Implemented forced cache initialization through prefetching
   - Added message handling for SKIP_WAITING to force activation
   - Improved logging for better debugging

3. Service Worker Implementation Enhancements:
   - Updated the cache name to bust old caches: `github-copilot-agent-assisted-next-app-v2`
   - Enhanced the caching strategy with better error handling
   - Added explicit message handler for SKIP_WAITING messages
   - Improved install and activate event handlers with proper logging
   - Fixed fetch event handler to better handle Next.js assets
   - Added graceful handling of cache failures
   - Improved offline response handling with content-type specific responses
   - Added explicit caching for Next.js static assets with `/_next/` path prefix

#### Lessons Learned
- Next.js configuration options can change between versions, requiring careful verification
- Service worker caching requires explicit initialization and proper lifecycle management
- Hybrid routing setups in Next.js need special consideration for service workers
- Browser storage issues often indicate problems with service worker cache initialization
- Clearing and properly renaming caches is essential when updating service worker implementations
- Error handling in service workers is critical for offline functionality
- Prefetching key assets can ensure the cache is properly populated for offline use
- Messages between the page and service worker can help manage the lifecycle
- Testing offline functionality should include checking for storage usage in browser DevTools
- Service worker debugging requires explicit console logging at each lifecycle stage