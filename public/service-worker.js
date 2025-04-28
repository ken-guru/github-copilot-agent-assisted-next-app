/**
 * Main Service Worker entry point
 * This file imports functionality from modular files and initializes the service worker
 */

// Import core functionality
import { initializeServiceWorker, logServiceWorkerInfo } from './sw-core.js';

/**
 * Service Worker initialization
 */
(function() {
  // Log service worker startup
  console.log('[Service Worker] Starting...');
  
  // Log environment information
  logServiceWorkerInfo();
  
  // Initialize service worker functionality
  initializeServiceWorker();
  
  // Log successful startup
  console.log('[Service Worker] Started successfully');
})();

/**
 * This is the main service worker file that gets registered.
 * It imports all functionality from modular files for better organization.
 * 
 * The modular structure includes:
 * - sw-cache-strategies.js: Contains caching strategies and cache operations
 * - sw-fetch-handlers.js: Contains fetch event handlers for different types of requests
 * - sw-lifecycle.js: Contains lifecycle event handlers (install, activate)
 * - sw-core.js: Contains core service worker initialization and shared utilities
 */