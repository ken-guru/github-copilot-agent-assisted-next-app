### Issue: Offline Functionality Broken After Routing Fix
**Date:** 2025-04-08
**Tags:** #debugging #service-worker #offline #caching #pwa
**Status:** Resolved

#### Initial State
- After implementing the routing and service worker fixes (MRTMLY-066 and MRTMLY-067):
  - The offline status banner appears when the network is offline
  - The app does not work when reloaded while offline
  - Browser storage/caching is no longer being used
- Service worker registration appears to complete without errors
- Application is functional while online
- Core offline functionality is broken

#### Debug Process
1. Initial problem assessment
   - The offline indicator working suggests the service worker is partially functional
   - Lack of browser storage usage indicates caching is not being properly configured
   - App not working offline suggests the service worker fetch handler is not working correctly

2. Service worker registration investigation
   - Examined how the service worker is registered in both implementations:
     - Original App Router implementation in `src/app/layout.tsx`
     - Current bridge implementation in `pages/index.tsx`
   - Found that the service worker was being registered but not properly updated
   - Discovered that the custom registration function was missing the cache update call

3. Root cause identification
   - In the original implementation, the `registerServiceWorker()` function from `serviceWorkerRegistration.ts` includes an explicit call to `registration.update()`
   - In our custom implementation, we were registering the service worker but not calling `update()`
   - This missing update call is critical because:
     - It triggers the caching mechanism
     - It initializes the storage of required resources
     - It ensures the service worker can properly handle offline requests

#### Resolution
- Added the missing `update()` call to our custom service worker registration function:
  ```typescript
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service worker registered from Pages Router');
      
      // Critical: Update the service worker to ensure caching is initialized
      registration.update().catch(updateError => {
        console.error('Service worker update failed', updateError);
      });
      
      // Rest of the handler...
    });
  ```
- This fix ensures that:
  1. The service worker registration completes successfully
  2. The update process initializes the caching mechanism
  3. Required resources are properly stored for offline use
  4. The service worker can properly intercept and handle network requests while offline

#### Lessons Learned
- Service worker registration alone doesn't ensure offline functionality - explicit update calls are needed
- When creating custom service worker registration functions, include all essential steps from the original implementation
- The service worker lifecycle includes separate registration and update/activation phases
- Testing offline functionality should include multiple scenarios:
  1. Going offline while using the app
  2. Reloading the app while offline
  3. Verifying browser storage usage
- Service worker implementations should be carefully migrated when updating routing approaches