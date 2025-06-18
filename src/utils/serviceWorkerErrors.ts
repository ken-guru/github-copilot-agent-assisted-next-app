/**
 * Service Worker error handling functionality
 */

/**
 * Handle service worker registration errors
 */
export function handleServiceWorkerError(error: Error): void {
  console.error('Error during service worker registration:', error);
}

/**
 * Check if a hostname is localhost
 * Extracted as a pure function for testing
 */
export function isHostnameLocalhost(hostname: string): boolean {
  return Boolean(
    hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      hostname === '[::1]' ||
      // 127.0.0.0/8 are considered localhost for IPv4.
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(hostname)
  );
}

/**
 * Check if current environment is localhost
 */
export function isLocalhost(): boolean {
  return isHostnameLocalhost(window.location.hostname);
}

/**
 * Log service worker content cache event
 */
export function logCacheEvent(message: string): void {
  console.log(message);
}
