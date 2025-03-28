// Event handler type for ServiceWorker update events
type UpdateHandler = (message: string) => void;

// Configuration for service worker update retries
const SW_UPDATE_RETRY_CONFIG = {
  maxRetries: 3,              // Maximum number of retry attempts
  retryDelay: 5000,           // Delay between retries in milliseconds (5 seconds)
  exponentialBackoff: false   // Whether to use exponential backoff (not implemented yet)
};

let updateHandler: UpdateHandler | null = null;
let updateRetryTimeout: ReturnType<typeof setTimeout> | null = null;
let retryCount = 0;

/**
 * Set a handler for service worker update notifications
 */
export function setUpdateHandler(handler: UpdateHandler | null): void {
  updateHandler = handler;
}

/**
 * Clear any pending service worker update retry timeouts
 */
function clearUpdateRetryTimeout(): void {
  if (updateRetryTimeout !== null) {
    clearTimeout(updateRetryTimeout);
    updateRetryTimeout = null;
  }
}

/**
 * Schedule a retry for service worker update
 * @param registration The ServiceWorkerRegistration to retry update for
 */
function scheduleUpdateRetry(registration: ServiceWorkerRegistration): void {
  // Clear any existing timeout
  clearUpdateRetryTimeout();

  // Only schedule retry if we haven't exceeded max retries
  if (retryCount < SW_UPDATE_RETRY_CONFIG.maxRetries) {
    retryCount++;
    
    // Schedule retry after delay
    updateRetryTimeout = setTimeout(async () => {
      try {
        await registration.update();
        console.log('Service worker update retry succeeded');
        // Reset retry count on success
        retryCount = 0;
      } catch (retryError) {
        console.error('Service worker update retry failed', retryError);
        
        // If we've reached max retries, log a final error
        if (retryCount >= SW_UPDATE_RETRY_CONFIG.maxRetries) {
          console.error('Service worker update failed after maximum retry attempts');
        } else {
          // Otherwise, schedule another retry
          scheduleUpdateRetry(registration);
        }
      }
    }, SW_UPDATE_RETRY_CONFIG.retryDelay);
  }
}

/**
 * Registers a service worker for offline functionality
 */
export async function registerServiceWorker(): Promise<void> {
  if (typeof window === 'undefined') {
    return; // SSR check
  }
  if (typeof navigator === 'undefined' || !navigator || !('serviceWorker' in navigator)) {
    console.log('Service workers are not supported in this browser');
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service worker registered');
    
    // Reset retry count on registration
    retryCount = 0;
    
    // Check for updates on registration with error handling
    try {
      await registration.update();
    } catch (updateError) {
      console.error('Service worker update failed', updateError);
      
      // Schedule retry for the update
      scheduleUpdateRetry(registration);
    }
    
    // Listen for new service worker installation
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available
            const message = 'A new version is available. Please refresh to update.';
            console.log(message);
            if (updateHandler) {
              updateHandler(message);
            }
          }
        });
      }
    });

  } catch (error) {
    console.error('Service worker registration failed', error);
  }
}

/**
 * Unregisters the service worker
 */
export async function unregisterServiceWorker(): Promise<void> {
  // Clear any pending update retry timeout
  clearUpdateRetryTimeout();
  
  if (typeof window === 'undefined') {
    return; // SSR check
  }
  if (typeof navigator === 'undefined' || !navigator || !('serviceWorker' in navigator)) {
    console.log('Service workers are not supported in this browser');
    return;
  }
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('Service worker unregistered');
    }
  } catch (error) {
    console.error('Service worker unregistration failed', error);
  }
}