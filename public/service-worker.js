// Service Worker for offline capabilities
// Cache name with version for cache busting
const CACHE_NAME = 'github-copilot-agent-assisted-next-app-v4';
const APP_SHELL_CACHE_NAME = 'app-shell-v4';

// Determine if we're in development mode
// This checks if the URL contains localhost or a port number typically used in development
const isDevelopment = () => {
  return self.location.hostname === 'localhost' || 
         self.location.hostname === '127.0.0.1' ||
         self.location.port === '3000' || 
         self.location.port === '8080';
};

// Core files to cache for offline use - the minimal application shell
const APP_SHELL = [
  '/',
  '/index.html',  // Just in case the server responds with index.html
  '/favicon.ico',
  '/manifest.json'
];

// Message handler for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    console.log('Service worker skipping waiting phase');
  }
  
  // Special handling for caching specific URLs
  if (event.data && event.data.type === 'CACHE_URLS') {
    console.log('Received URLs to cache:', event.data.urls);
    
    // Open cache and add all URLs
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          event.data.urls.map(url => {
            return fetch(url)
              .then(response => {
                if (!response || response.status !== 200) {
                  throw new Error(`Failed to fetch ${url}`);
                }
                console.log(`Successfully cached: ${url}`);
                return cache.put(url, response);
              })
              .catch(err => console.warn(`Failed to cache ${url}:`, err));
          })
        );
      })
      .catch(err => console.error('Failed to process cache URLs message:', err));
  }
});

// Helper function to cache app shell with absolute URLs
async function cacheAppShell() {
  const cache = await caches.open(APP_SHELL_CACHE_NAME);
  console.log('Caching app shell resources');
  
  // For each app shell item, create and cache multiple URL variations to handle routing
  for (const path of APP_SHELL) {
    // Skip empty paths
    if (!path) continue;
    
    // Cache the original path
    try {
      const response = await fetch(path);
      if (response.ok) {
        await cache.put(path, response.clone());
        console.log(`Cached app shell path: ${path}`);
      }
    } catch (error) {
      console.warn(`Failed to cache app shell path ${path}:`, error);
    }
    
    // For the root path, cache additional variations to handle hybrid routing
    if (path === '/') {
      // Also cache as /index directly
      try {
        const indexResponse = await fetch('/');
        if (indexResponse.ok) {
          // Store it under multiple paths for different routing scenarios
          await cache.put('/index', indexResponse.clone());
          console.log('Cached root path as /index');
        }
      } catch (error) {
        console.warn('Failed to cache root path as /index:', error);
      }
    }
  }
}

// Enhanced fetch response function that tries multiple sources
async function fetchAndCache(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Clone the response to cache it
    const responseToCache = networkResponse.clone();
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's an HTML request, try returning the app shell
    if (request.headers.get('accept')?.includes('text/html')) {
      const appShellCache = await caches.open(APP_SHELL_CACHE_NAME);
      const appShellResponse = await appShellCache.match('/');
      if (appShellResponse) {
        return appShellResponse;
      }
    }
    
    // Everything failed
    throw error;
  }
}

// Install service worker and cache app shell
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache the app shell (critical resources)
      cacheAppShell(),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
    .then(() => {
      console.log('Service worker installation complete');
    })
    .catch(error => {
      console.error('Service worker installation failed:', error);
      // Continue with installation even if caching fails
      return self.skipWaiting();
    })
  );
});

// Clean up old caches when a new service worker activates
self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  
  const cacheWhitelist = [CACHE_NAME, APP_SHELL_CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        );
      })
      .then(() => {
        console.log('Service worker activated and claiming clients');
        return self.clients.claim();
      })
      .then(() => {
        // After activation and claiming, notify clients
        return self.clients.matchAll()
          .then(clients => {
            clients.forEach(client => {
              client.postMessage({ 
                type: 'SERVICE_WORKER_ACTIVATED',
                message: 'Service worker activated and in control'
              });
            });
          });
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Parse URL for decision making
  const url = new URL(event.request.url);
  
  // Skip some URLs that shouldn't be cached
  if (url.origin !== self.location.origin) {
    return; // Skip non-same-origin resources
  }
  
  // Skip Chrome extension requests and other browser-specific URLs
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle root path and HTML requests specially for offline support
  // This is critical for the application to work when offline
  if (url.pathname === '/' || 
      url.pathname === '/index' || 
      url.pathname === '/index.html' || 
      event.request.headers.get('accept')?.includes('text/html')) {
    
    event.respondWith(
      // Try app shell cache first for HTML requests
      caches.open(APP_SHELL_CACHE_NAME)
        .then(cache => cache.match('/'))
        .then(appShellResponse => {
          if (appShellResponse) {
            console.log('Serving from app shell cache:', url.pathname);
            
            // In the background, try to fetch from network to update the cache
            fetch(event.request)
              .then(networkResponse => {
                console.log('Updating app shell cache with fresh content');
                // Update both caches
                return Promise.all([
                  caches.open(APP_SHELL_CACHE_NAME).then(cache => 
                    cache.put('/', networkResponse.clone())
                  ),
                  caches.open(CACHE_NAME).then(cache => 
                    cache.put(event.request, networkResponse.clone())
                  )
                ]);
              })
              .catch(() => {
                console.log('Failed to update app shell cache, using cached version');
              });
              
            return appShellResponse;
          }
          
          // App shell cache miss, try normal cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                console.log('Serving from regular cache:', url.pathname);
                return cachedResponse;
              }
              
              // Not in any cache, try network
              console.log('Nothing in cache, fetching from network:', url.pathname);
              return fetch(event.request)
                .then(networkResponse => {
                  // Cache the response for future
                  const responseToCache = networkResponse.clone();
                  
                  // Save in both caches for HTML requests
                  Promise.all([
                    caches.open(APP_SHELL_CACHE_NAME).then(cache => {
                      // For HTML responses, also cache under root path for app shell
                      if (url.pathname === '/' || url.pathname === '/index' || url.pathname === '/index.html') {
                        cache.put('/', responseToCache.clone());
                      }
                    }),
                    caches.open(CACHE_NAME).then(cache => {
                      cache.put(event.request, responseToCache);
                    })
                  ]).catch(err => {
                    console.warn('Failed to cache HTML response:', err);
                  });
                  
                  return networkResponse;
                })
                .catch(error => {
                  console.error('Network fetch failed for HTML, trying root fallback:', error);
                  // Last resort - try the root path from regular cache
                  return caches.match('/')
                    .then(rootFallback => {
                      if (rootFallback) return rootFallback;
                      
                      // Nothing worked, return a simple offline page
                      return new Response(
                        '<html><head><title>Offline</title></head><body>' +
                        '<h1>You are offline</h1>' +
                        '<p>The application is currently offline. Please check your connection.</p>' +
                        '</body></html>',
                        {
                          headers: { 'Content-Type': 'text/html' }
                        }
                      );
                    });
                });
            });
        })
    );
    return;
  }
  
  // Check for Next.js-generated assets
  const isNextAsset = url.pathname.includes('/_next/');
  
  // For Next.js assets (CSS, JS chunks)
  if (isNextAsset) {
    event.respondWith(
      // Try cache first for Next.js assets (better performance)
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Serving Next.js asset from cache:', url.pathname);
            return cachedResponse;
          }
          
          // Not in cache, try network
          console.log('Next.js asset not in cache, fetching from network:', url.pathname);
          return fetch(event.request)
            .then((networkResponse) => {
              // Cache the network response for future
              const responseToCache = networkResponse.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                  console.log('Cached Next.js asset:', url.pathname);
                })
                .catch(err => {
                  console.warn('Failed to cache Next.js asset:', err);
                });
              
              return networkResponse;
            })
            .catch(error => {
              console.error('Failed to fetch Next.js asset:', url.pathname, error);
              
              // For CSS, return empty stylesheet as fallback
              if (url.pathname.endsWith('.css')) {
                return new Response('/* Offline fallback stylesheet */', {
                  headers: { 'Content-Type': 'text/css' }
                });
              }
              
              // For JS, return empty script as fallback
              if (url.pathname.endsWith('.js')) {
                return new Response('// Offline fallback script', {
                  headers: { 'Content-Type': 'application/javascript' }
                });
              }
              
              // Generic fallback for other assets
              return new Response('Offline fallback', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
    return;
  }
  
  // Static assets (images, manifest, etc.)
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If found in cache, return it
        if (cachedResponse) {
          console.log('Serving static asset from cache:', url.pathname);
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        console.log('Static asset not in cache, fetching from network:', url.pathname);
        return fetch(event.request)
          .then((networkResponse) => {
            // Only cache valid responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response to use it and cache it
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('Cached static asset:', url.pathname);
              })
              .catch(err => {
                console.warn('Failed to cache static asset:', err);
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('Failed to fetch static asset:', url.pathname, error);
            
            // Return a placeholder for images
            if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
              return new Response('', {
                headers: { 'Content-Type': 'image/svg+xml' }
              });
            }
            
            return new Response('Network error occurred', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});