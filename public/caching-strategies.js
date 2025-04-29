/**
 * This is a stub implementation of caching strategies for service workers.
 * It provides basic functions for cache management in the service worker.
 */

// Define cache names
const CACHE_NAMES = {
  PRECACHE: 'v1-precache',
  RUNTIME: 'v1-runtime'
};

/**
 * Pre-caches static resources
 * @param {Array<string>} resources - List of resources to precache
 * @returns {Promise<void>}
 */
async function precache(resources = []) {
  const cache = await caches.open(CACHE_NAMES.PRECACHE);
  return cache.addAll(resources);
}

/**
 * Deletes old caches that are no longer needed
 * @param {Array<string>} validCacheNames - List of cache names to keep
 * @returns {Promise<void>}
 */
async function deleteOldCaches(validCacheNames = [CACHE_NAMES.PRECACHE, CACHE_NAMES.RUNTIME]) {
  const cacheNames = await caches.keys();
  const cachesToDelete = cacheNames.filter(name => !validCacheNames.includes(name));
  return Promise.all(cachesToDelete.map(name => caches.delete(name)));
}

/**
 * Cache-first strategy: tries to serve from cache first, falls back to network
 * @param {Request} request - The request to handle
 * @returns {Promise<Response>}
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAMES.RUNTIME);
  cache.put(request, response.clone());
  return response;
}

/**
 * Network-first strategy: tries to fetch from network first, falls back to cache
 * @param {Request} request - The request to handle
 * @returns {Promise<Response>}
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAMES.RUNTIME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

module.exports = {
  CACHE_NAMES,
  precache,
  deleteOldCaches,
  cacheFirst,
  networkFirst
};
