/**
 * Type definitions for service worker functionality
 */

/**
 * Configuration options for service worker registration
 */
export interface ServiceWorkerConfig {
  /**
   * Called when the service worker has been installed successfully
   */
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  
  /**
   * Called when an update is available for the service worker
   */
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

/**
 * Custom update handler function type
 */
export type UpdateHandlerFn = (registration: ServiceWorkerRegistration) => void;
