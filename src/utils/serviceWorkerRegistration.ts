// Event handler type for ServiceWorker update events
type UpdateHandler = (message: string) => void;

// Configuration for service worker update retries
const SW_UPDATE_RETRY_CONFIG = {
  maxRetries: 3,              // Maximum number of retry attempts
  retryDelay: process.env.NODE_ENV === 'test' ? 500 : 5000,   // 500ms for tests, 5s for production
  exponentialBackoff: false   // Whether to use exponential backoff (not implemented yet)
};

let updateHandler: UpdateHandler | null = null;
let updateRetryTimeout: ReturnType<typeof setTimeout> | null = null;
let retryCount = 0;
let pendingRegistration: ServiceWorkerRegistration | null = null;
let onlineEventListener: ((event: Event) => Promise<void>) | null = null;

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
 * Remove any online event listeners
 */
function removeOnlineEventListener(): void {
  if (onlineEventListener) {
    window.removeEventListener('online', onlineEventListener, false);
    onlineEventListener = null;
  }
}

/**
 * Clean up all pending operations and listeners
 */
function cleanupAllPendingOperations(): void {
  clearUpdateRetryTimeout();
  removeOnlineEventListener();
  pendingRegistration = null;
}

/**
 * Attempt to update service worker
 * @param registration The ServiceWorkerRegistration to update
 * @returns Promise that resolves when update is attempted
 */
async function attemptServiceWorkerUpdate(registration: ServiceWorkerRegistration): Promise<void> {
  try {
    await registration.update();
    console.log('Service worker update retry succeeded');
    // Reset retry count on success
    retryCount = 0;
    // Clear pending registration after successful update
    pendingRegistration = null;
    // Remove any online event listener since we succeeded
    removeOnlineEventListener();
  } catch (retryError) {
    console.error('Service worker update retry failed', retryError);
    
    // Schedule another retry if we haven't reached max retries
    if (retryCount < SW_UPDATE_RETRY_CONFIG.maxRetries) {
      scheduleUpdateRetry(registration);
    } else {
      console.error('Service worker update failed after maximum retry attempts');
      pendingRegistration = null;
      removeOnlineEventListener();
    }
  }
}

/**
 * Schedule a retry for service worker update
 * @param registration The ServiceWorkerRegistration to retry update for
 */
function scheduleUpdateRetry(registration: ServiceWorkerRegistration): void {
  // Store registration for future retries
  pendingRegistration = registration;
  
  // Check network status
  if (typeof navigator !== 'undefined' && navigator && 'onLine' in navigator && !navigator.onLine) {
    console.log('Network is offline, skipping service worker update retry');
    
    // Setup listener for online event if not already set
    if (!onlineEventListener && typeof window !== 'undefined') {
      onlineEventListener = async () => {
        if (pendingRegistration && navigator.onLine) {
          console.log('Network is back online, retrying service worker update');
          await attemptServiceWorkerUpdate(pendingRegistration);
        }
      };
      window.addEventListener('online', onlineEventListener, false);
    }
    return;
  }
  
  // Clear any existing timeout
  clearUpdateRetryTimeout();

  // Only schedule retry if we haven't exceeded max retries
  if (retryCount < SW_UPDATE_RETRY_CONFIG.maxRetries) {
    retryCount++;
    
    // Schedule retry after delay
    updateRetryTimeout = setTimeout(async () => {
      // Check if network is online before attempting update
      if (typeof navigator !== 'undefined' && navigator && 'onLine' in navigator && !navigator.onLine) {
        console.log('Network is offline, skipping service worker update retry');
        
        // Setup listener for online event if not already set
        if (!onlineEventListener && typeof window !== 'undefined') {
          onlineEventListener = async () => {
            if (pendingRegistration && navigator.onLine) {
              console.log('Network is back online, retrying service worker update');
              await attemptServiceWorkerUpdate(pendingRegistration);
            }
          };
          window.addEventListener('online', onlineEventListener, false);
        }
        return;
      }
      
      await attemptServiceWorkerUpdate(registration);
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
  // Clean up any pending operations
  cleanupAllPendingOperations();
  
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