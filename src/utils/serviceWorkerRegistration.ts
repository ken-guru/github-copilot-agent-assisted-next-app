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
    
    // Check for updates
    await registration.update();
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