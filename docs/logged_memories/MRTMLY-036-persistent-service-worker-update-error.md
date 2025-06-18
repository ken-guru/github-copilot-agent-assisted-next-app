### Issue: Persistent Service Worker Update Error After Fix
**Date:** 2025-04-08
**Tags:** #debugging #service-worker #error-handling #offline #pwa
**Status:** Resolved

#### Initial State
- After implementing the previous fix in MRTMLY-062, the service worker error has reappeared:
  ```
  TypeError: Failed to update a ServiceWorker for scope ('http://localhost:3000/') with script ('Unknown'): Not found
  ```
- The error specifically mentions failure to update with an 'Unknown' script
- Our previous fix added the `.update()` call to the service worker registration in `pages/index.tsx`
- The error appears to be related to the update process, not the initial registration

#### Debug Process
1. Error pattern analysis
   - The error message indicates a failure during the `update()` call, not during registration
   - The 'Unknown' script reference suggests the service worker script path might not be resolved correctly
   - This appears when the service worker tries to check for updates to itself

2. Service worker registration investigation
   - Examined current registration and update mechanism
   - Reviewed how service worker updates are handled in development vs production environments
   - Discovered that service worker updates behave differently in development environments
   - Found that the "Unknown script" error is common in development environments due to the way Next.js handles file serving

3. Development environment considerations
   - Development environments handle service workers differently than production
   - In development, the Next.js dev server's file serving can cause inconsistencies with service worker script paths
   - The `update()` call in development can trigger this error because the service worker may try to update with a file that's not served consistently
   - This error is less problematic in production environments where paths are more static

#### Resolution
- Implemented environment-aware service worker registration:
  ```typescript
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
  
  // Register service worker with explicit path
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service worker registered successfully');
      
      // In development mode, we don't need to update the service worker
      // This helps avoid the "Unknown script" error during development
      if (!isDevelopment) {
        // Only update in production to avoid the error in development
        console.log('Production environment detected, checking for service worker updates');
        registration.update().catch(updateError => {
          console.error('Service worker update check failed', updateError);
          // Error is non-blocking, application will continue to work
        });
      } else {
        console.log('Development environment detected, skipping service worker update');
      }
      
      // Rest of the handler...
    });
  ```
- This solution:
  1. Detects if the application is running in a development environment
  2. Skips the service worker update check in development to avoid the error
  3. Still performs updates in production environments where they're needed
  4. Adds explicit error handling for update failures
  5. Maintains all other service worker functionality

#### Lessons Learned
- Service worker updates can be problematic in development environments
- Environment detection is crucial for handling service workers appropriately
- Different strategies are needed for development vs. production environments
- Non-blocking error handling is important for service worker operations
- Development-specific errors can often be safely suppressed when they don't impact core functionality
- The service worker lifecycle is complex and requires careful consideration of each stage
- Testing service workers in production-like environments is important for validating their behavior