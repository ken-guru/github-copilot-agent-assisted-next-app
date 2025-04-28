/**
 * Core Service Worker functionality
 * This file serves as the entry point for the service worker
 */

// Import components from modular files
import { cacheName as CACHE_NAME, precache, deleteOldCaches } from './sw-cache-strategies.js';
import { handleFetch } from './sw-fetch-handlers.js';
import { registerLifecycleEvents, getPrecacheList, getValidCacheNames } from './sw-lifecycle.js';

/**
 * Initialize the service worker core functionality
 */
function initializeServiceWorker() {
  // Register lifecycle events (install, activate)
  registerLifecycleEvents();
  
  // Register fetch event handler
  self.addEventListener('fetch', handleFetch);
  
  // Log successful initialization
  console.log('Service Worker initialized successfully');
}

// Initialize when this script loads
initializeServiceWorker();

/**
 * Re-export key constants and functions for main service-worker.js usage
 */
export {
  CACHE_NAME,
  precache,
  deleteOldCaches,
  handleFetch,
  getPrecacheList,
  getValidCacheNames
};
