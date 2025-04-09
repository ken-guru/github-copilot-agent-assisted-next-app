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
 * Helper function to safely get error message from unknown error type
 * @param error Any error value from catch block
 * @returns A string representation of the error
 */
function getErrorMessage(error: unknown): string {
  if (error === null) {
    return 'null';
  }
  if (error === undefined) {
    return 'undefined';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return String(error);
}

/**
 * Check if we're in a development environment
 * Used to conditionally disable service worker updates in development
 */
function isDevelopmentEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  
  const isDev = process.env.NODE_ENV === 'development';
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1');
  const isDevPort = typeof window !== 'undefined' && 
    (window.location.port === '3000' || 
     window.location.port === '3001' || 
     window.location.port === '8080');
    
  return isDev && (isLocalhost || isDevPort);
}

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
    // In development mode, skip the actual update but consider it successful
    if (isDevelopmentEnvironment()) {
      console.log('Development environment detected, skipping service worker update');
      retryCount = 0;
      pendingRegistration = null;
      removeOnlineEventListener();
      return;
    }
    
    await registration.update();
    console.log('Service worker update retry succeeded');
    // Reset retry count on success
    retryCount = 0;
    // Clear pending registration after successful update
    pendingRegistration = null;
    // Remove any online event listener since we succeeded
    removeOnlineEventListener();
  } catch (retryError: unknown) {
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
    // Check if we're in development mode - log but continue with registration
    if (isDevelopmentEnvironment()) {
      console.log('Development environment detected, registering service worker but skipping updates');
    }
    
    // Register service worker
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      // Increase scope to cover entire origin
      scope: '/'
    });
    console.log('Service worker registered');
    
    // Reset retry count on registration
    retryCount = 0;
    
    // In development mode, skip the update process to avoid errors
    if (isDevelopmentEnvironment()) {
      return;
    }
    
    // Check for updates on registration with error handling
    try {
      await registration.update();
    } catch (updateError: unknown) {
      console.error('Service worker update failed', updateError);
      
      // If error is related to MIME type or fetch failure, this may be due to
      // development server issues - skip retry in that case
      const errorMessage = getErrorMessage(updateError);
      if (errorMessage.includes('MIME type') || 
          errorMessage.includes('Failed to fetch') ||
          errorMessage.includes('An unknown error occurred when fetching')) {
        console.warn('Service worker update error appears to be related to fetch or MIME type issues.');
        console.warn('This is common in development environments - continuing without retrying.');
        return;
      }
      
      // Schedule retry for other types of update errors
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

  } catch (error: unknown) {
    // Check for specific error types that indicate server/development issues
    const errorMessage = getErrorMessage(error);
    
    if (errorMessage.includes('MIME type') || errorMessage.includes('Failed to fetch')) {
      console.warn('Service worker registration error may be related to development environment:');
      console.warn('- Ensure service-worker.js is served with the correct MIME type');
      console.warn('- Check that the file is accessible at the expected URL');
      console.warn(error);
    } else {
      console.error('Service worker registration failed', error);
    }
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
  } catch (error: unknown) {
    console.error('Service worker unregistration failed', error);
  }
}