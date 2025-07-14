/**
 * Service Worker update handling functionality
 */
// Import error handling directly to avoid circular dependencies
import { handleServiceWorkerError } from './serviceWorkerErrors';

// Import getUpdateHandler directly
import { getUpdateHandler } from './serviceWorker';

// Define config type locally to avoid circular imports
interface Config {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

/**
 * Handle service worker registration status
 */
export function handleRegistration(
  registration: ServiceWorkerRegistration,
  config?: Config
): void {
  // Get the update handler from the serviceWorker directory
  const updateHandler = getUpdateHandler();

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
  config?: Config
): void {
  const installingWorker = registration.installing;
  if (!installingWorker) return;

  // Get the update handler from the serviceWorker directory
  const updateHandler = getUpdateHandler();

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
export function checkForUpdates(registration: ServiceWorkerRegistration): Promise<void> {
  return registration.update()
    .catch(error => {
      console.error('Service worker update failed:', error);
      console.warn('Update failure might be related to fetch or MIME type issues');
      handleServiceWorkerError(error);
    });
}
