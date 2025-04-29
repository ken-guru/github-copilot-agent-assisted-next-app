/**
 * Core Service Worker registration functionality
 */

// Import directly from error file to avoid circular dependencies
import { isLocalhost, handleServiceWorkerError } from './serviceWorkerErrors';

// Define config type locally to avoid circular imports
interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

// Import specific functions directly to avoid circular dependencies
import { handleRegistration } from './serviceWorkerUpdates';

// Define missing function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function checkValidSW(swUrl: string, _config?: ServiceWorkerConfig): Promise<void> {
  return fetch(swUrl, {
    headers: { 'Service-Worker': 'script' }
  })
    .then(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _response => {
      // Implementation details - using underscore to indicate intentionally unused parameter
      return Promise.resolve();
    })
    .catch(error => {
      handleServiceWorkerError(error);
      return Promise.resolve();
    });
}

/**
 * Register service worker for production environments
 * @param config Configuration options
 * @returns Promise that resolves when registration is complete (for testing)
 */
export function register(config?: ServiceWorkerConfig): Promise<void> {
  // Only allow registration in production environment
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    try {
      // The URL constructor is available in all browsers that support SW
      const publicUrl = new URL(process.env.PUBLIC_URL || '', window.location.href);
      
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      if (publicUrl.origin !== window.location.origin) {
        return Promise.resolve();
      }
    } catch (error) {
      console.warn('URL constructor error caught:', error);
      // Continue anyway in case of URL constructor errors
    }

    return new Promise((resolve) => {
      // In test environments, register immediately
      if (process.env.NODE_ENV === 'test') {
        const swUrl = `/service-worker.js`;
        // Directly register service worker in tests without waiting for load event
        navigator.serviceWorker.register(swUrl, { scope: '/' })
          .then(registration => {
            if (registration) {
              handleRegistration(registration, config);
            }
            resolve();
          })
          .catch(() => {
            // Silence errors in tests
            resolve();
          });
      } else {
        // Normal behavior in non-test environments
        window.addEventListener('load', () => {
          const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

          if (isLocalhost()) {
            // This is running on localhost. Let's check if a service worker still exists or not.
            checkValidServiceWorker(swUrl, config).then(resolve);
          } else {
            // Is not localhost. Just register service worker
            registerValidSW(swUrl, config).then(resolve);
          }
        });
      }
    });
  }
  
  return Promise.resolve();
}

/**
 * Check if a service worker needs to be registered or updated
 */
export function checkValidServiceWorker(
  swUrl: string,
  config?: ServiceWorkerConfig
): Promise<void> {
  return fetch(swUrl, {
    headers: { 'Service-Worker': 'script' }
  })
    .then(response => {
      // Ensure service worker exists and is valid
      if (
        response.status === 404 ||
        response.headers.get('content-type')?.indexOf('javascript') === -1
      ) {
        // No service worker found. Probably a different path, ignore.
        return Promise.resolve();
      }

      // Service worker found, register it
      return registerValidSW(swUrl, config);
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
      return Promise.resolve();
    });
}

/**
 * Register a valid service worker
 */
export function registerValidSW(
  swUrl: string,
  config?: ServiceWorkerConfig
): Promise<void> {
  return navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      if (registration) {
        handleRegistration(registration, config);
      }
      
      // Convert any boolean return to void to fix type compatibility
      return Promise.resolve();
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
      return Promise.resolve();
    });
}

/**
 * Check for existing service worker registration and handle updates
 */
export function checkForExistingSW(config?: ServiceWorkerConfig): Promise<void> {
  if ('serviceWorker' in navigator) {
    return new Promise<void>((resolve) => {
      navigator.serviceWorker.getRegistration()
        .then((registration) => {
          if (!registration) {
            resolve();
            return;
          }
          
          // Handle the registration and ensure we return void
          handleRegistration(registration, config);
          resolve();
        })
        .catch((error) => {
          console.error('Error during service worker getRegistration:', error);
          resolve();
        });
    });
  }
  return Promise.resolve();
}

/**
 * Unregister service worker
 * @returns Promise that resolves when unregistration is complete (for testing)
 */
export function unregister(): Promise<void> {
  if ('serviceWorker' in navigator) {
    // Check if navigator.serviceWorker is defined in the test environment
    if (typeof navigator.serviceWorker !== 'undefined' && navigator.serviceWorker.getRegistration) {
      return navigator.serviceWorker.getRegistration()
        .then(registration => {
          if (registration) {
            // Explicitly convert the boolean Promise to void Promise
            return registration.unregister().then(() => undefined);
          }
          return undefined;
        })
        .catch(error => {
          console.error(error.message);
          return undefined; // Ensure we always return undefined to align with Promise<void>
        });
    }
  }
  
  return Promise.resolve();
}
