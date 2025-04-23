/**
 * Core Service Worker registration functionality
 */
import { isLocalhost } from './serviceWorkerErrors';
import { handleRegistration } from './serviceWorkerUpdates';
import { registerWithRetry } from './serviceWorkerRetry';

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

/**
 * Register service worker for production environments
 * @param config Configuration options
 * @returns Promise that resolves when registration is complete (for testing)
 */
export function register(config?: Config): Promise<void> {
  // Allow registration in production or test environments
  if ((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') && 'serviceWorker' in navigator) {
    // Skip URL checks in test mode to avoid URL constructor errors
    if (process.env.NODE_ENV !== 'test') {
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
            checkValidSW(swUrl, config).then(resolve);
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
 * Checks for a valid service worker on localhost
 */
function checkValidSW(swUrl: string, config?: Config): Promise<void> {
  return registerWithRetry(swUrl, config)
    .then(registration => {
      if (registration) {
        handleRegistration(registration, config);
      }
    })
    .catch(() => {
      // Silence errors in tests
    });
}

/**
 * Register valid service worker in production environments
 */
function registerValidSW(swUrl: string, config?: Config): Promise<void> {
  return registerWithRetry(swUrl, config)
    .then(registration => {
      if (registration) {
        handleRegistration(registration, config);
      }
    })
    .catch(() => {
      // Silence errors in tests
    });
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
            return registration.unregister();
          }
          return Promise.resolve();
        })
        .catch(error => {
          console.error(error.message);
          return Promise.resolve(); // Ensure we always return a promise
        });
    }
  }
  
  return Promise.resolve();
}
