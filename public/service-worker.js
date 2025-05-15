// Service Worker for Mr. Timely

const CACHE_NAME = 'mr-timely-cache-v1';
const OFFLINE_URL = '/index.html';
const APP_SHELL_CACHE = 'app-shell-cache';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  // Add CSS/JS files as needed
];

// Next.js specific assets to cache
const NEXT_ASSETS = [
  '/_next/static/',
  '/_next/image',
];

// Install event handler
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('[ServiceWorker] Caching app shell');
        await cache.addAll(PRECACHE_ASSETS);
        console.log('[ServiceWorker] All assets cached');
      } catch (error) {
        console.error('[ServiceWorker] Cache setup failed:', error);
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
      const oldCaches = cacheKeys.filter(key => key !== CACHE_NAME && key !== APP_SHELL_CACHE);
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
  
  // For HTML navigation requests (app shell)
  if (isNavigationRequest(request)) {
    event.respondWith(
      (async () => {
        try {
          // First try to get the response from the network
          const networkResponse = await fetch(request);
          
          // Cache successful responses
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            const cache = await caches.open(APP_SHELL_CACHE);
            await cache.put(request, clone);
          }
          
          return networkResponse;
        } catch (error) {
          // If network fails, try to serve from cache
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If not in cache, try to serve the root path instead
          const rootResponse = await caches.match('/');
          if (rootResponse) {
            return rootResponse;
          }
          
          // If everything fails, return a simple offline page
          return new Response(
            `<html><body><h1>Offline</h1><p>The app is currently offline.</p></body></html>`,
            {
              status: 200,
              headers: { 'Content-Type': 'text/html' }
            }
          );
        }
      })()
    );
    return;
  }
  
  // For Next.js static assets (use network first, then cache)
  if (isNextAsset(url.pathname)) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          
          // Cache successful responses
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }
          
          return networkResponse;
        } catch (error) {
          // Try to get from cache if network fails
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Otherwise, fail gracefully
          console.error('[ServiceWorker] Next.js asset fetch failed:', error);
          return new Response('Asset not available offline', { status: 404 });
        }
      })()
    );
    return;
  }
  
  // For all other requests (assets, API, etc.)
  event.respondWith(
    (async () => {
      // Try first from cache
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        // Return cached response and fetch update in background
        event.waitUntil(
          fetch(request)
            .then(networkResponse => {
              if (networkResponse.ok) {
                return caches.open(CACHE_NAME).then(cache => {
                  return cache.put(request, networkResponse.clone());
                });
              }
            })
            .catch(() => {/* Ignore fetch errors */})
        );
        return cachedResponse;
      }
      
      // If not in cache, get from network
      try {
        const networkResponse = await fetch(request);
        
        // Cache valid responses
        if (networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          event.waitUntil(
            caches.open(CACHE_NAME).then(cache => {
              return cache.put(request, responseToCache);
            })
          );
        }
        
        return networkResponse;
      } catch (error) {
        console.error('[ServiceWorker] Fetch error:', error);
        
        // Handle image failures by returning a default image
        if (request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
          return caches.match('/icons/offline-image.svg')
            || new Response('Image not available offline', { status: 404 });
        }
        
        // Handle other failures
        return new Response('Resource not available offline', { 
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});

// For debugging purposes
const TRUSTED_ORIGIN = 'https://www.example.com';

self.addEventListener('message', (event) => {
  if (event.origin !== TRUSTED_ORIGIN) {
    console.warn('[ServiceWorker] Ignored message from untrusted origin:', event.origin);
    return;
  }

  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Log service worker initialization
console.log('[ServiceWorker] Script loaded!');