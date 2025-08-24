// Service Worker for Mr. Timely

// In development on localhost, avoid intercepting requests entirely
let DEV_BYPASS = false;
try {
  DEV_BYPASS = Boolean(self && self.location && (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1'));
} catch (_) {
  // Ignore errors accessing self in some environments
}

const CACHE_NAME_PREFIX = 'github-copilot-agent-assisted-next-app';
// Use consistent version - will be replaced at build time or deployment
// This ensures consistent cache versioning across all instances
const BUILD_VERSION = '0.1.0-1756062270718'; // Format: package.version-increment
const CACHE_NAME = `${CACHE_NAME_PREFIX}-v${BUILD_VERSION}`;
const APP_SHELL_CACHE_NAME = `app-shell-v${BUILD_VERSION}`;

console.log('[ServiceWorker] Cache version:', BUILD_VERSION);

// Offline page template for better code organization
const OFFLINE_PAGE_TEMPLATE = `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Offline - Mr. Timely</title>
              <link rel="icon" href="/favicon.svg" type="image/svg+xml">
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  text-align: center; padding: 2rem; margin: 0;
                  background: #f8f9fa; color: #212529;
                }
                .offline-container { max-width: 600px; margin: 0 auto; }
                .offline-icon { width: 64px; height: 64px; margin: 1rem 0; opacity: 0.7; }
                .btn { 
                  background: #007bff; color: white; border: none; 
                  padding: 0.75rem 1.5rem; border-radius: 0.375rem;
                  cursor: pointer; margin: 0.5rem;
                }
                .btn:hover { background: #0056b3; }
              </style>
            </head>
            <body>
              <div class="offline-container">
                <img src="/icons/offline-image.svg" alt="Offline" class="offline-icon" />
                <h1>You are offline</h1>
                <p>Mr. Timely is currently unavailable. Please check your internet connection and try again.</p>
                <button class="btn" onclick="window.location.reload()">Try Again</button>
                <button class="btn" onclick="window.location.href='/'">Go Home</button>
              </div>
            </body>
            </html>`;

// Pre-built offline Response for better performance
const OFFLINE_RESPONSE = new Response(OFFLINE_PAGE_TEMPLATE, {
  status: 200,
  headers: { 'Content-Type': 'text/html; charset=utf-8' }
});

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/api/manifest',
  '/favicon.ico', 
  '/favicon.svg',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/icons/apple-touch-icon.svg',
  '/icons/offline-image.svg'
];

// App shell resources that are critical for offline functionality
const APP_SHELL = [
  '/',
  '/index.html'
];

// Next.js specific assets to cache
const NEXT_ASSETS = [
  '/_next/static/',
  '/_next/image',
];

// Install event handler
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    (async () => {
      try {
        // Cache precache assets first
        const cache = await caches.open(CACHE_NAME);
        console.log('[ServiceWorker] Caching precache assets');
        await cache.addAll(PRECACHE_ASSETS);
        
        // Cache app shell in separate cache for better management
        const appShellCache = await caches.open(APP_SHELL_CACHE_NAME);
        console.log('[ServiceWorker] Caching app shell');
        
        // Cache multiple variations of the root to handle routing
        for (const path of APP_SHELL) {
          try {
            const response = await fetch(path);
            if (response.ok) {
              await appShellCache.put(path, response.clone());
              
              // For root path, also cache as index.html for fallback
              if (path === '/') {
                await appShellCache.put('/index.html', response.clone());
              }
            }
          } catch (fetchError) {
            console.warn(`[ServiceWorker] Failed to cache ${path}:`, fetchError.message);
          }
        }
        
        console.log('[ServiceWorker] All critical assets cached');
        
        // For updates, always skip waiting to ensure immediate activation
        // This ensures users get updates as soon as they're available
        console.log('[ServiceWorker] Skipping waiting for immediate activation');
        self.skipWaiting();
      } catch (error) {
        console.error('[ServiceWorker] Cache setup failed:', error);
        // Even if caching fails, skip waiting to avoid blocking
        self.skipWaiting();
      }
    })()
  );
});

// Activate event handler
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  // Take over control immediately
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheKeys = await caches.keys();
      const oldCaches = cacheKeys.filter(key => key !== CACHE_NAME && key !== APP_SHELL_CACHE_NAME);
      await Promise.all(oldCaches.map(key => caches.delete(key)));
      
      // Take control of all clients
      await clients.claim();
      console.log('[ServiceWorker] Claimed clients');
    })()
  );
});

// Helper: Should we bypass cache for this request?
function shouldBypassCache(url) {
  // Skip caching for:
  // - Chrome extensions
  // - DevTools
  // - Debug endpoints
  return (
    url.startsWith('chrome-extension://') ||
    url.includes('/devtools/') ||
    url.includes('__/') ||
    url.includes('debug') ||
    url.includes('sourcemap') ||
    url.includes('webpack-hmr') || // Skip HMR for development
    url.includes('webpack-internal:')
  );
}

// Helper: Is this a navigation request?
function isNavigationRequest(request) {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' && 
     request.headers.get('accept')?.includes('text/html'))
  );
}

// Helper: Is this a Next.js asset request?
function isNextAsset(url) {
  return NEXT_ASSETS.some(asset => url.includes(asset));
}

// Fetch event handler
self.addEventListener('fetch', (event) => {
  if (DEV_BYPASS) {
    // Don't intercept any requests on localhost dev
    return;
  }
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests and those that should bypass cache
  if (request.method !== 'GET' || shouldBypassCache(url.href)) {
    return;
  }
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // For HTML navigation requests (app shell) - improve cache-first for offline
  if (isNavigationRequest(request)) {
    event.respondWith(
      (async () => {
        // First, try to get from app shell cache for immediate response
        const cachedResponse = await caches.match(request, { cacheName: APP_SHELL_CACHE_NAME });
        
        try {
          // Try network for fresh content
          const networkResponse = await fetch(request);
          
          // Cache successful responses
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            const cache = await caches.open(APP_SHELL_CACHE_NAME);
            await cache.put(request, clone);
            console.log('[ServiceWorker] Updated HTML cache from network');
            return networkResponse;
          }
          
          // If network response is not ok, fall back to cache
          if (cachedResponse) {
            console.log('[ServiceWorker] Network response not ok, serving from cache');
            return cachedResponse;
          }
          
          return networkResponse;
        } catch (networkError) {
          console.log('[ServiceWorker] Network unavailable, serving from cache:', networkError.message);
          
          // Try specific cached response first
          if (cachedResponse) {
            console.log('[ServiceWorker] Serving HTML from app shell cache');
            return cachedResponse;
          }
          
          // Try root path variations
          const rootResponse = await caches.match('/') || await caches.match('/index.html');
          if (rootResponse) {
            console.log('[ServiceWorker] Serving root HTML from cache');
            return rootResponse;
          }
          
          // If everything fails, return a comprehensive offline page
          return OFFLINE_RESPONSE.clone();
        }
      })()
    );
    return;
  }
  
  // For Next.js static assets (cache-first with network update)
  if (isNextAsset(url.pathname)) {
    event.respondWith(
      (async () => {
        // Try cache first for immediate response
        const cachedResponse = await caches.match(request);
        
        try {
          // Try to update from network in background
          const networkResponse = await fetch(request);
          
          // Cache successful responses
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
            console.log('[ServiceWorker] Updated Next.js asset cache:', url.pathname);
            return networkResponse;
          }
          
          // If network response not ok, fall back to cache
          if (cachedResponse) {
            console.log('[ServiceWorker] Network response not ok, serving Next.js asset from cache:', url.pathname);
            return cachedResponse;
          }
          
          return networkResponse;
        } catch (networkError) {
          console.log('[ServiceWorker] Network unavailable for asset:', url.pathname, networkError.message);
          
          // Serve from cache if available
          if (cachedResponse) {
            console.log('[ServiceWorker] Serving Next.js asset from cache:', url.pathname);
            return cachedResponse;
          }
          
          // Otherwise, fail gracefully with proper error
          console.error('[ServiceWorker] Next.js asset not available:', url.pathname);
          return new Response('Asset not available offline', { 
            status: 404,
            statusText: 'Not Found - Offline' 
          });
        }
      })()
    );
    return;
  }
  
  // For all other requests (improved stale-while-revalidate strategy)
  event.respondWith(
    (async () => {
      // Try cache first for immediate response
      const cachedResponse = await caches.match(request);
      
      // Always try to update from network when possible
      const networkPromise = fetch(request)
        .then(networkResponse => {
          if (networkResponse.ok) {
            // Update cache with fresh content
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
              console.log('[ServiceWorker] Updated cache for:', url.pathname);
            }).catch(cacheError => {
              console.warn('[ServiceWorker] Failed to update cache:', cacheError.message);
            });
          }
          return networkResponse;
        })
        .catch(networkError => {
          console.log('[ServiceWorker] Network fetch failed:', url.pathname, networkError.message);
          return null;
        });

      // If we have cached content, return it immediately and update in background
      if (cachedResponse) {
        // Update cache in background without blocking the response
        event.waitUntil(networkPromise);
        console.log('[ServiceWorker] Serving from cache (updating in background):', url.pathname);
        return cachedResponse;
      }

      // No cached content, wait for network response
      const networkResponse = await networkPromise;
      if (networkResponse && networkResponse.ok) {
        return networkResponse;
      }

      // Handle specific resource types when everything fails
      if (request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
        return caches.match('/icons/offline-image.svg')
          || new Response('Image not available offline', { status: 404 });
      }

      // Handle other failures
      return new Response('Resource not available offline', { 
        status: 503,
        statusText: 'Service Unavailable'
      });
    })()
  );
});

// Message handling for service worker commands
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Received message:', event.data);
  
  // Allow messages from same origin for security
  if (!event.origin || event.origin !== location.origin) {
    console.warn('[ServiceWorker] Ignored message from untrusted or undefined origin:', event.origin);
    return;
  }

  const { type, data } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      console.log('[ServiceWorker] Received SKIP_WAITING message, skipping waiting');
      self.skipWaiting();
      break;
      
    case 'UPDATE_CACHE':
      console.log('[ServiceWorker] Received UPDATE_CACHE message');
      event.waitUntil(updateAllCaches());
      break;
      
    case 'CLEAR_OLD_CACHES':
      console.log('[ServiceWorker] Received CLEAR_OLD_CACHES message');
      event.waitUntil(clearOldCaches());
      break;
      
    case 'CACHE_URLS':
      console.log('[ServiceWorker] Received CACHE_URLS message');
      event.waitUntil(cacheUrls(data?.urls || []));
      break;
      
    default:
      console.log('[ServiceWorker] Received unknown message type:', type);
  }
});

// Helper function to cache specific URLs dynamically
async function cacheUrls(urls) {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    for (const url of urls) {
      try {
        // Validate URL is from same origin to prevent client-side request forgery
        const urlObj = new URL(url, location.origin);
        if (urlObj.origin !== location.origin) {
          console.warn('[ServiceWorker] Ignored cross-origin URL:', url);
          continue;
        }
        
        const response = await fetch(urlObj.href);
        if (response.ok) {
          await cache.put(urlObj.href, response);
          console.log('[ServiceWorker] Cached dynamic URL:', urlObj.href);
        }
      } catch (error) {
        console.warn('[ServiceWorker] Failed to cache URL:', url, error.message);
      }
    }
  } catch (error) {
    console.error('[ServiceWorker] Failed to cache URLs:', error);
  }
}

// Helper function to update all caches
async function updateAllCaches() {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Update precached assets
    await cache.addAll(PRECACHE_ASSETS);
    console.log('[ServiceWorker] Updated all precached assets');
    
    // Notify clients that cache has been updated
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'CACHE_UPDATED',
        message: 'Service worker cache has been updated'
      });
    });
  } catch (error) {
    console.error('[ServiceWorker] Failed to update caches:', error);
  }
}

// Helper function to clear old caches
async function clearOldCaches() {
  try {
    const cacheKeys = await caches.keys();
    const oldCaches = cacheKeys.filter(key => 
      key !== CACHE_NAME && 
      key !== APP_SHELL_CACHE_NAME &&
      key.startsWith(CACHE_NAME_PREFIX)
    );
    
    await Promise.all(oldCaches.map(key => caches.delete(key)));
    console.log('[ServiceWorker] Cleared old caches:', oldCaches);
  } catch (error) {
    console.error('[ServiceWorker] Failed to clear old caches:', error);
  }
}

// Log service worker initialization
console.log('[ServiceWorker] Script loaded!');