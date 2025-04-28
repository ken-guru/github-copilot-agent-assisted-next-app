/**
 * Service Worker Lifecycle Events
 * Handles installation and activation of service workers
 */

import { precache, deleteOldCaches } from './sw-cache-strategies';

// Define cache names
export const CACHE_NAMES = {
  STATIC: 'static-assets-v1',
  DYNAMIC: 'dynamic-content-v1',
  PAGES: 'pages-cache-v1',
  IMAGES: 'images-cache-v1'
};

/**
 * Handle service worker installation
 * - Precaches static assets
 * - Activates immediately with skipWaiting
 */
export function handleInstall(event) {
  event.waitUntil(
    (async () => {
      try {
        await precache(CACHE_NAMES.STATIC, getPrecacheList());
      } catch (error) {
        console.error('Error during precaching:', error);
      }
      // Always call skipWaiting, even if precaching fails
      await self.skipWaiting();
    })()
  );
}

/**
 * Handle service worker activation
 * - Deletes old caches
 * - Claims all clients
 */
export function handleActivate(event) {
  event.waitUntil(
    (async () => {
      try {
        await deleteOldCaches(getValidCacheNames());
      } catch (error) {
        console.error('Error during cache cleanup:', error);
      }
      // Always claim clients, even if cache deletion fails
      await self.clients.claim();
    })()
  );
}

/**
 * Register lifecycle event listeners
 */
export function registerLifecycleEvents() {
  self.addEventListener('install', handleInstall);
  self.addEventListener('activate', handleActivate);
}

/**
 * Get list of URLs to precache
 * @returns {string[]} Array of URLs to precache
 */
export function getPrecacheList() {
  return [
    '/',
    '/index.html',
    '/static/css/main.css',
    '/static/js/main.js',
    // Add other important assets here
    '/manifest.json',
    '/favicon.ico',
    '/offline.html'
  ];
}

/**
 * Get list of valid cache names
 * @returns {string[]} Array of valid cache names
 */
export function getValidCacheNames() {
  return Object.values(CACHE_NAMES);
}
