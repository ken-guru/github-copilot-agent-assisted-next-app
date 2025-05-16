import { SW_STATUS, SERVICE_WORKER_EVENTS, ServiceWorkerListener } from './core';

/**
 * Register a service worker in the browser
 * @param scriptURL The URL of the service worker script
 * @param options Service worker registration options
 * @returns A promise that resolves to the service worker registration
 */
export async function registerServiceWorker(
  scriptURL: string,
  options: RegistrationOptions = {}
): Promise<ServiceWorkerRegistration> {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported in this browser');
  }

  try {
    return await navigator.serviceWorker.register(scriptURL, options);
  } catch (error) {
    console.error('Service worker registration failed:', error);
    throw error;
  }
}

/**
 * Get the current service worker registration
 * @returns A promise that resolves to the service worker registration or undefined if none exists
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | undefined> {
  if (!('serviceWorker' in navigator)) {
    return undefined;
  }

  try {
    return await navigator.serviceWorker.getRegistration();
  } catch (error) {
    console.error('Failed to get service worker registration:', error);
    return undefined;
  }
}

/**
 * Check if service workers are supported in this browser
 * @returns True if service workers are supported
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}
