### Issue: Persistent Offline Functionality Issues Despite Increased Caching
**Date:** 2025-04-08
**Tags:** #debugging #service-worker #offline #caching #pwa #next-js
**Status:** Resolved

#### Initial State
- Service worker is now caching significantly more content (5MB)
- Application remains unavailable when network is disabled
- Previous fixes (MRTMLY-068, MRTMLY-069, MRTMLY-070, MRTMLY-071) have incrementally improved caching
- Despite improved caching, core offline functionality is still not working

#### Debug Process
1. Initial assessment
   - 5MB of content is being cached, indicating that our runtime asset detection is working
   - The service worker registration is succeeding
   - Cache entries are being created and stored
   - Yet the application doesn't load when offline

2. Service worker implementation analysis
   - Examined how the service worker handles fetch events
   - Found that the caching strategy for HTML/root path needed improvement
   - Identified that hybrid routing in Next.js requires special handling
   - Discovered that separate caching for app shell vs. dynamic content was needed
   - Noted that offline functionality required more aggressive caching of the root path

3. Service worker registration analysis
   - Checked communication between service worker and client
   - Found that explicit messaging about critical paths would improve offline support
   - Identified need for proper service worker lifecycle management
   - Determined better coordination between activation and cache population was needed

#### Resolution
1. Implemented App Shell Caching Strategy:
   - Created separate cache specifically for app shell resources
   ```javascript
   const CACHE_NAME = 'github-copilot-agent-assisted-next-app-v4';
   const APP_SHELL_CACHE_NAME = 'app-shell-v4';
   ```
   - Added dedicated function to cache app shell with path variations for hybrid routing
   ```javascript
   async function cacheAppShell() {
     const cache = await caches.open(APP_SHELL_CACHE_NAME);
     
     // For each app shell item, create and cache multiple URL variations
     for (const path of APP_SHELL) {
       // Cache the original path
       try {
         const response = await fetch(path);
         if (response.ok) {
           await cache.put(path, response.clone());
         }
       } catch (error) {
         console.warn(`Failed to cache app shell path ${path}:`, error);
       }
       
       // For the root path, cache additional variations to handle hybrid routing
       if (path === '/') {
         try {
           const indexResponse = await fetch('/');
           if (indexResponse.ok) {
             // Store it under multiple paths for different routing scenarios
             await cache.put('/index', indexResponse.clone());
           }
         } catch (error) {
           console.warn('Failed to cache root path as /index:', error);
         }
       }
     }
   }
   ```

2. Enhanced Service Worker Fetch Strategy:
   - Prioritized app shell cache for HTML requests
   - Added special handling for root path and its variations
   - Implemented fallback mechanisms for all resource types
   - Added detailed logging for easier troubleshooting
   - Created more robust error handling with HTML/CSS/JS specific fallbacks

3. Improved Client-Service Worker Communication:
   - Implemented bidirectional messaging for service worker lifecycle events
   ```javascript
   // In service worker activation:
   self.clients.matchAll().then(clients => {
     clients.forEach(client => {
       client.postMessage({ 
         type: 'SERVICE_WORKER_ACTIVATED',
         message: 'Service worker activated and in control'
       });
     });
   });
   
   // In client-side code:
   navigator.serviceWorker.addEventListener('message', (event) => {
     if (event.data.type === 'SERVICE_WORKER_ACTIVATED') {
       // Handle activation event
       navigator.serviceWorker.ready.then(registration => {
         cacheCurrentPageAssets(registration);
       });
     }
   });
   ```
   - Added mechanism for explicit caching of critical paths
   ```javascript
   // Client sends critical paths to service worker
   registration.active.postMessage({
     type: 'CACHE_URLS',
     urls: criticalPaths
   });
   
   // Service worker handles the request
   self.addEventListener('message', (event) => {
     if (event.data && event.data.type === 'CACHE_URLS') {
       caches.open(CACHE_NAME).then(cache => {
         return Promise.all(
           event.data.urls.map(url => fetch(url).then(response => cache.put(url, response)))
         );
       });
     }
   });
   ```

4. Dynamic Asset Detection Improvements:
   - Enhanced DOM scanning for critical assets
   - Added special handling for Next.js hybrid routing patterns
   - Ensured the root path is cached with multiple path variations
   - Implemented robust error handling for fetch failures

#### Lessons Learned
- Next.js hybrid routing (Pages + App Router) requires special handling for offline support
- Separate caching strategies are needed for app shell vs. dynamic content
- Two-way communication between client and service worker improves reliability
- Path variations must be considered for the same content in hybrid routing setups
- DOM scanning is essential for detecting dynamically injected assets
- Service worker lifecycle events must be carefully managed for proper caching timing
- Multiple fallback strategies are needed for different types of resources
- Manual prefetching of critical paths improves offline reliability
- Version bumping of cache names is essential when implementing major changes
- App shell should be cached separately from other content for better offline performance