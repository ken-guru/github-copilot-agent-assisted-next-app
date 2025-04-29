/**
 * Service Worker
 * Barrel export for service worker functionality
 */

// Export types directly to avoid circular dependencies
export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

// Update handler state - stored in this module to avoid circular dependencies
let updateHandler: ((registration: ServiceWorkerRegistration) => void) | null = null;

/**
 * Set a custom handler for service worker updates
 * @param handler The function to call when a service worker update is detected
 */
export function setUpdateHandler(
  handler: ((registration: ServiceWorkerRegistration) => void) | null
): void {
  updateHandler = handler;
}

/**
 * Get the current update handler
 * @returns The currently registered update handler function or null if none is set
 */
export function getUpdateHandler(): ((registration: ServiceWorkerRegistration) => void) | null {
  return updateHandler;
}

// Re-export core functionality - PLACED AFTER updateHandler definition to avoid circular dependencies
export { 
  register,
  unregister,
  checkValidServiceWorker,
  registerValidSW
} from '../serviceWorkerCore';

// Re-export retry functionality
export { 
  registerWithRetry,
  checkValidServiceWorker as checkServiceWorkerValidity
} from '../serviceWorkerRetry';

// Re-export error functionality
export { 
  isLocalhost,
  handleServiceWorkerError
} from '../serviceWorkerErrors';

// Re-export update functionality
export { 
  checkForUpdates,
  handleRegistration
} from '../serviceWorkerUpdates';
