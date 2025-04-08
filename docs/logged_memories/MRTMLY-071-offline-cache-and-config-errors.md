### Issue: Persistent Offline Functionality and Next.js Configuration Issues
**Date:** 2025-04-08
**Tags:** #debugging #service-worker #offline #caching #next-js #configuration
**Status:** Resolved

#### Initial State
- Service worker is partially caching content (14.8kB) but application remains unavailable offline
- Next.js shows configuration error when starting the application:
  ```
  ⚠ Invalid next.config.ts options detected: 
  ⚠     Expected object, received boolean at "experimental.serverActions"
  ⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
  ```
- Browser DevTools shows 404 errors when attempting to fetch assets:
  ```
  GET /_next/static/css/app.css 404 in 1404ms
  GET /_next/static/chunks/main.js 404 in 1331ms
  GET /_next/static/css/app.css 404 in 55ms
  ```
- This occurred after implementing fixes from MRTMLY-070

#### Debug Process
1. Initial problem assessment
   - Service worker is caching some content (14.8kB) but not enough for offline functionality
   - Cache is being created but missing critical assets
   - Correct configuration format for Next.js 15.2.4 needs verification
   - Paths to static assets in service worker caching list may be incorrect

2. Configuration error investigation
   - The warning indicates `experimental.serverActions` is a boolean but should be an object
   - Next.js 15.2.4 documentation confirmed `serverActions` should be an object with properties
   - Needed to update the configuration to use the correct format
   - The `allowedOrigins` property was needed for proper ServerActions configuration

3. Static asset path analysis
   - The 404 errors showed that the static asset paths specified in service worker were incorrect
   - Next.js 15.2.4 with Turbopack generates assets with different paths than expected
   - Hardcoded paths like '/_next/static/css/app.css' aren't valid in Turbopack builds
   - Need for dynamic runtime detection of actual asset paths

#### Resolution
1. Next.js Configuration Fix:
   - Updated `next.config.ts` with proper `serverActions` configuration format:
   ```typescript
   experimental: {
     // Server Actions configuration as an object, not a boolean
     serverActions: {
       allowedOrigins: ['localhost:3000']
     },
   }
   ```
   - This corrected the configuration warning during startup

2. Service Worker Caching Strategy Enhancement:
   - Implemented more flexible asset caching in `service-worker.js`:
     - Changed from hardcoded asset paths to pattern-based detection
     - Used `url.pathname.includes('/_next/')` to catch all Next.js generated assets
     - Implemented more comprehensive caching strategies per asset type
     - Added detailed logging for easier troubleshooting
     - Updated cache name to 'v3' to clear old cache entries

3. Runtime Asset Detection Implementation:
   - Added DOM scanning functionality to detect and cache dynamically loaded assets:
   ```javascript
   function captureRuntimeAssets() {
     // Find all script tags and stylesheet links in the DOM
     const scriptSources = Array.from(document.querySelectorAll('script[src]'))
       .map(script => script.getAttribute('src'))
       .filter(Boolean);
     
     const styleSources = Array.from(document.querySelectorAll('link[rel="stylesheet"][href]'))
       .map(link => link.getAttribute('href'))
       .filter(Boolean);
     
     // Prefetch all detected resources to ensure they're cached
     [...scriptSources, ...styleSources].forEach(source => {
       if (source && (source.startsWith('/') || source.startsWith(window.location.origin))) {
         fetch(source);
       }
     });
     
     // Also scan for dynamically loaded chunks in Next.js elements
     const dynamicChunks = [];
     const nextElements = document.querySelectorAll('[id^="_next"]');
     nextElements.forEach(el => {
       const matches = el.outerHTML.match(/\/_next\/static\/[^"']+/g);
       if (matches) {
         dynamicChunks.push(...matches);
       }
     });
     
     // Cache all detected dynamic chunks
     [...new Set(dynamicChunks)].forEach(chunk => fetch(chunk));
   }
   ```

#### Lessons Learned
- Next.js configuration formats can change significantly between versions
- For proper offline functionality, hardcoded asset paths should be avoided
- Turbopack builds require a different approach to asset caching than webpack builds
- Runtime detection and caching of assets is more reliable than predefined paths
- Service worker caching strategies should be flexible and adaptive to build configurations
- Detecting assets via DOM scanning is effective for capturing dynamically loaded resources
- Detailed logging in service workers helps identify and troubleshoot caching issues
- Testing offline functionality requires multiple scenarios and careful verification
- Cache version bumping is essential when updating service worker implementations