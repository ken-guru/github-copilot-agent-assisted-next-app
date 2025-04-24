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
 * Check if current environment is localhost
 */
export function isLocalhost(): boolean {
  return Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.0/8 are considered localhost for IPv4.
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(
        window.location.hostname
      )
  );
}

/**
 * Log service worker content cache event
 */
export function logCacheEvent(message: string): void {
  console.log(message);
}
