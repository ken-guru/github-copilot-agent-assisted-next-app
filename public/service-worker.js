// Service Worker for offline capabilities
// Cache name with version for cache busting
const CACHE_NAME = 'github-copilot-agent-assisted-next-app-v1';

// Files to cache for offline use - list core app files
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/file.svg',
  '/globe.svg',
  '/next.svg',
  '/vercel.svg',
  '/window.svg',
];

// Install service worker and cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Clean up old caches when a new service worker activates
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip some URLs that shouldn't be cached
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return; // Skip non-same-origin resources
  }
  
  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If found in cache, return it
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache invalid responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response to use it and cache it
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // If both cache and network fail, return a fallback if it's an HTML page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
            
            return new Response('Network error occurred', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});