/**
 * Service Worker update handling functionality
 */
// Local types for the serviceWorker utilities (kept local to this folder on purpose)
import { ServiceWorkerConfig, UpdateHandlerFn } from './types';
import { handleServiceWorkerError } from './errors';

// Store the custom update handler
let updateHandler: UpdateHandlerFn | null = null;

/**
 * Set a custom handler for service worker updates
 */
export function setUpdateHandler(handler: UpdateHandlerFn | null): void {
  updateHandler = handler;
}

/**
 * Get the current update handler
 * @internal For testing purposes
 */
export function getUpdateHandler(): UpdateHandlerFn | null {
  return updateHandler;
}

/**
 * Handle service worker registration status
 */
export function handleRegistration(
  registration: ServiceWorkerRegistration,
  config?: ServiceWorkerConfig
): void {
  // When the service worker is first installed
  if (registration.waiting) {
    if (config && config.onUpdate) {
      config.onUpdate(registration);
    }
    
    // Call custom update handler if set
    if (updateHandler) {
      updateHandler(registration);
    }
  } else if (registration.installing) {
    trackInstallation(registration, config);
  } else {
    // Service worker is active
    if (config && config.onSuccess) {
      config.onSuccess(registration);
    }
  }
}

/**
 * Track the installation status of a service worker
 */
function trackInstallation(
  registration: ServiceWorkerRegistration,
  config?: ServiceWorkerConfig
): void {
  const installingWorker = registration.installing;
  if (!installingWorker) return;

  installingWorker.addEventListener('statechange', () => {
    if (installingWorker.state === 'installed') {
      if (navigator.serviceWorker.controller) {
        // At this point, the updated precached content has been fetched,
        // but the previous service worker will still serve the older
        // content until all client tabs are closed.
        console.log(
          'New content is available and will be used when all tabs for this page are closed.'
        );

        // Execute callback
        if (config && config.onUpdate) {
          config.onUpdate(registration);
        }
        
        // Call custom update handler if set
        if (updateHandler) {
          updateHandler(registration);
        }
      } else {
        // At this point, everything has been precached.
        // It's the perfect time to display a
        // "Content is cached for offline use." message.
        console.log('Content is cached for offline use.');

        // Execute callback
        if (config && config.onSuccess) {
          config.onSuccess(registration);
        }
      }
    }
  });
}

/**
 * Check for service worker updates
 */
export async function checkForUpdates(
  registration: ServiceWorkerRegistration
): Promise<void> {
  try {
    await registration.update();
  } catch (error) {
    console.error('Service worker update failed:', error);
    console.warn('Update failure might be related to fetch or MIME type issues');
    handleServiceWorkerError(error as Error);
  }
}
