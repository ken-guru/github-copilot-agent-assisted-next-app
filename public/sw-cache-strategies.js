/**
 * Service Worker Cache Strategies
 * Contains various caching strategies used throughout the service worker
 */

/**
 * Network First strategy
 * Tries to fetch from network first, falling back to cache if network fails
 * @param {Request} request - The request to fetch
 * @param {string} cacheName - The cache to use
 * @returns {Promise<Response>} - The response
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Clone the response before caching it and returning it
    const responseToCache = networkResponse.clone();
    cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    console.log('Network request failed, falling back to cache', error);
    
    // If network fails, try cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If both network and cache fail, throw error
    throw new Error('NetworkFirst: Both network and cache failed');
  }
}

/**
 * Cache First strategy
 * Tries to get from cache first, falling back to network if cache misses
 * @param {Request} request - The request to fetch
 * @param {string} cacheName - The cache to use
 * @returns {Promise<Response>} - The response
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If cache misses, try network
  try {
    const networkResponse = await fetch(request);
    
    // Clone the response before caching it and returning it
    const responseToCache = networkResponse.clone();
    cache.put(request, responseToCache);
    
    return networkResponse;
  } catch (error) {
    console.error('Cache miss and network failed', error);
    throw new Error('CacheFirst: Both cache miss and network failed');
  }
}

/**
 * Stale While Revalidate strategy
 * Returns cached response immediately if available, while updating the cache in background
 * @param {Request} request - The request to fetch
 * @param {string} cacheName - The cache to use
 * @returns {Promise<Response>} - The response
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  
  // Revalidate in background regardless of cache hit/miss
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      // Clone the response before caching it
      cache.put(request, networkResponse.clone());
      return networkResponse;
    })
    .catch(error => {
      console.error('Background fetch failed', error);
      // Don't block the response on background fetch errors
    });
    
  // If we have a cached response, return it immediately
  if (cachedResponse) {
    // The cache update happens in background
    return cachedResponse;
  }
  
  // If no cached response, wait for the network response
  return fetchPromise;
}

/**
 * Cache Only strategy
 * Only tries the cache, throws if cache misses
 * @param {Request} request - The request to fetch
 * @param {string} cacheName - The cache to use
 * @returns {Promise<Response>} - The response
 */
async function cacheOnly(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  throw new Error('CacheOnly: Cache miss');
}

/**
 * Network Only strategy
 * Only tries the network, never uses cache
 * @param {Request} request - The request to fetch
 * @returns {Promise<Response>} - The response
 */
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('Network request failed', error);
    throw new Error('NetworkOnly: Network error');
  }
}

/**
 * Precache resources
 * @param {string} cacheName - The cache to use
 * @param {string[]} resources - Array of URLs to precache
 * @returns {Promise<void>}
 */
async function precache(cacheName, resources) {
  const cache = await caches.open(cacheName);
  return cache.addAll(resources);
}

/**
 * Delete old caches
 * @param {string[]} validCacheNames - Array of cache names to keep
 * @returns {Promise<void>}
 */
async function deleteOldCaches(validCacheNames) {
  const cacheNames = await caches.keys();
  const cachesToDelete = cacheNames.filter(name => !validCacheNames.includes(name));
  
  return Promise.all(
    cachesToDelete.map(name => {
      console.log('Deleting old cache:', name);
      return caches.delete(name);
    })
  );
}

// Export all strategies
module.exports = {
  networkFirst,
  cacheFirst,
  staleWhileRevalidate,
  cacheOnly,
  networkOnly,
  precache,
  deleteOldCaches
};
