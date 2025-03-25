// Service Worker for offline capabilities
// Cache name with version for cache busting
const CACHE_NAME = 'github-copilot-agent-assisted-next-app-v1';

// Determine if we're in development mode
// This checks if the URL contains localhost or a port number typically used in development
const isDevelopment = () => {
  return self.location.hostname === 'localhost' || 
         self.location.hostname === '127.0.0.1' ||
         self.location.port === '3000' || 
         self.location.port === '8080';
};

// Files to cache for offline use - list core app files
const urlsToCache = [
  '/',
  '/favicon.ico',
  '/file.svg',
  '/globe.svg',
  '/next.svg',
  '/vercel.svg',
  '/window.svg',
  '/manifest.json'
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

  // Network-first strategy for HTML requests
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then(response => {
              if (response) {
                return response;
              }
              // If no cached version, return cached home page as fallback
              return caches.match('/');
            });
        })
    );
    return;
  }
  
  // Check file types for development-specific handling
  const isCssFile = url.pathname.endsWith('.css');
  const isJsFile = url.pathname.endsWith('.js') || url.pathname.endsWith('.jsx') || 
                  url.pathname.endsWith('.ts') || url.pathname.endsWith('.tsx');
  const isJsonFile = url.pathname.endsWith('.json');
  const isDevAsset = isDevelopment() && (isCssFile || isJsFile || isJsonFile);
  
  // Network-first strategy for development assets (CSS, JS, JSON)
  if (isDevAsset) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to use it and cache it
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // Fall back to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Cache-first strategy for other static assets
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
            return new Response('Network error occurred', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});