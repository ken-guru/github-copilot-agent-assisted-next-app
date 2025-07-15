import { SERVICE_WORKER_EVENTS, ServiceWorkerListener } from './core';

/**
 * Check for service worker updates
 * @param registration The service worker registration to check
 * @returns A promise that resolves when the update check is complete
 */
export async function checkForServiceWorkerUpdate(registration: ServiceWorkerRegistration): Promise<boolean> {
  try {
    await registration.update();
    return !!registration.waiting;
  } catch (error) {
    console.error('Failed to check for updates:', error);
    return false;
  }
}

/**
 * Force a service worker update
 * @param registration The service worker registration to update
 */
export function forceServiceWorkerUpdate(registration: ServiceWorkerRegistration): void {
  if (registration.waiting) {
    // Use postMessage to trigger the skipWaiting() call in the waiting service worker
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
}

/**
 * Set up listeners for service worker update events
 * @param registration The service worker registration to listen for
 * @param listener The callback to call when an update is detected
 */
export function setupUpdateListeners(
  registration: ServiceWorkerRegistration,
  listener: ServiceWorkerListener
): () => void {
  // Handler for update found events
  const handleUpdateFound = () => {
    const newWorker = registration.installing;
    
    if (!newWorker) {
      return;
    }
    
    // Listen for state changes on the installing worker
    const handleStateChange = () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New service worker installed and ready to take over
        listener({
          type: SERVICE_WORKER_EVENTS.UPDATE_READY,
          payload: { registration }
        });
      }
    };
    
    newWorker.addEventListener('statechange', handleStateChange);
    
    // Initial state check
    handleStateChange();
  };
  
  // Listen for update found events
  registration.addEventListener('updatefound', handleUpdateFound);
  
  // Listen for controller change events
  const handleControllerChange = () => {
    listener({
      type: SERVICE_WORKER_EVENTS.UPDATE_INSTALLED,
      payload: { registration }
    });
  };
  
  navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
  
  // Return cleanup function
  return () => {
    registration.removeEventListener('updatefound', handleUpdateFound);
    navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
  };
}
