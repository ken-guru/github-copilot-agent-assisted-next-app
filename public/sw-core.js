/**
 * Core Service Worker functionality
 * This file serves as the central module for the service worker
 */

// Import from modular files
import { CACHE_NAMES, precache, deleteOldCaches } from './sw-cache-strategies.js';
import { handleFetch } from './sw-fetch-handlers.js';
import { registerLifecycleEvents } from './sw-lifecycle.js';

/**
 * Initialize the service worker core functionality
 */
export function initializeServiceWorker() {
  // Register lifecycle events (install, activate)
  registerLifecycleEvents();
  
  // Register fetch event handler
  self.addEventListener('fetch', handleFetch);
  
  // Log successful initialization
  console.log('[Service Worker] Initialized successfully');
}

/**
 * Log debug information about the service worker state
 */
export function logServiceWorkerInfo() {
  console.log('[Service Worker] Version: 1.0.0');
  console.log('[Service Worker] Cache names:', Object.values(CACHE_NAMES));
  console.log('[Service Worker] Running in', process.env.NODE_ENV || 'unknown', 'mode');
}

/**
 * Export key functions and constants for service worker use
 */
export {
  CACHE_NAMES,
  precache,
  deleteOldCaches,
  handleFetch
};
