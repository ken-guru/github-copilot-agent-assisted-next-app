/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param retries Number of retries
 * @param delay Initial delay in milliseconds
 * @param maxDelay Maximum delay in milliseconds
 * @returns Promise that resolves when the function succeeds or rejects after all retries
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  maxDelay = 10000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    // Calculate next delay with exponential backoff
    const nextDelay = Math.min(delay * 2, maxDelay);
    
    // Wait for the delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry with one less retry and increased delay
    return retryWithBackoff(fn, retries - 1, nextDelay, maxDelay);
  }
}

/**
 * Retry a service worker registration
 * @param scriptURL The URL of the service worker script
 * @param options Service worker registration options
 * @returns A promise that resolves to the service worker registration
 */
export async function retryServiceWorkerRegistration(
  scriptURL: string,
  options: RegistrationOptions = {}
): Promise<ServiceWorkerRegistration> {
  return retryWithBackoff(
    () => navigator.serviceWorker.register(scriptURL, options),
    3,
    1000,
    5000
  );
}
