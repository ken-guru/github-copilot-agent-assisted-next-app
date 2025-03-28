// Event handler type for ServiceWorker update events
type UpdateHandler = (message: string) => void;

let updateHandler: UpdateHandler | null = null;

/**
 * Set a handler for service worker update notifications
 */
export function setUpdateHandler(handler: UpdateHandler | null): void {
  updateHandler = handler;
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
    
    // Check for updates on registration with error handling
    try {
      await registration.update();
    } catch (updateError) {
      console.error('Service worker update failed', updateError);
      // Continue execution despite update failure
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