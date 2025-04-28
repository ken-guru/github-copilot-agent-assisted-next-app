/**
 * Service worker lifecycle event handlers
 */
const { precache, deleteOldCaches, CACHE_NAMES } = require('./caching-strategies');

/**
 * Returns a list of URLs to precache
 * @returns {Array<string>} List of URLs to precache
 */
function getPrecacheList() {
  return [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
    '/static/js/main.js',
    '/static/css/main.css'
  ];
}

/**
 * Returns a list of valid cache names
 * @returns {Array<string>} List of valid cache names
 */
function getValidCacheNames() {
  return [CACHE_NAMES.PRECACHE, CACHE_NAMES.RUNTIME];
}

/**
 * Handles the install event
 * @param {ExtendableEvent} event - The install event
 */
function handleInstall(event) {
  console.log('[Service Worker] Install');
  
  // Use waitUntil to signal install completion
  event.waitUntil(
    Promise.resolve()
      .then(() => precache(getPrecacheList()))
      .then(() => self.skipWaiting())
      .catch(err => {
        console.error('[Service Worker] Install error:', err);
        // Even if precache fails, skip waiting to activate the service worker
        return self.skipWaiting();
      })
  );
}

/**
 * Handles the activate event
 * @param {ExtendableEvent} event - The activate event
 */
function handleActivate(event) {
  console.log('[Service Worker] Activate');
  
  // Use waitUntil to signal activation completion
  event.waitUntil(
    Promise.resolve()
      .then(() => deleteOldCaches(getValidCacheNames()))
      .then(() => self.clients.claim())
      .catch(err => {
        console.error('[Service Worker] Activation error:', err);
        // Even if cache cleanup fails, claim clients
        return self.clients.claim();
      })
  );
}

/**
 * Registers all lifecycle event handlers
 */
function registerLifecycleEvents() {
  self.addEventListener('install', handleInstall);
  self.addEventListener('activate', handleActivate);
}

module.exports = {
  handleInstall,
  handleActivate,
  registerLifecycleEvents,
  getPrecacheList,
  getValidCacheNames,
  CACHE_NAMES
};
