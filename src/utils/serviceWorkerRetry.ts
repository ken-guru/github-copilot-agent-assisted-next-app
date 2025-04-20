import { clearUpdateRetryTimeout, removeOnlineEventListener } from './serviceWorkerCore';
import { attemptServiceWorkerUpdate, scheduleUpdateRetry } from './serviceWorkerUpdates';
import { getErrorMessage, swLog } from './serviceWorkerErrors';

const SW_UPDATE_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: process.env.NODE_ENV === 'test' ? 500 : 5000,
  exponentialBackoff: false
};

let updateRetryTimeout: ReturnType<typeof setTimeout> | null = null;
let retryCount = 0;
let pendingRegistration: ServiceWorkerRegistration | null = null;
let onlineEventListener: ((event: Event) => Promise<void>) | null = null;

export function clearUpdateRetryTimeout(): void {
  if (updateRetryTimeout !== null) {
    clearTimeout(updateRetryTimeout);
    updateRetryTimeout = null;
  }
}

export function removeOnlineEventListener(): void {
  if (onlineEventListener) {
    window.removeEventListener('online', onlineEventListener, false);
    onlineEventListener = null;
  }
}

export async function attemptServiceWorkerUpdate(registration: ServiceWorkerRegistration): Promise<void> {
  try {
    if (isDevelopmentEnvironment()) {
      swLog('Development environment detected, skipping service worker update');
      retryCount = 0;
      pendingRegistration = null;
      removeOnlineEventListener();
      return;
    }

    await registration.update();
    swLog('Service worker update retry succeeded');
    retryCount = 0;
    pendingRegistration = null;
    removeOnlineEventListener();
  } catch (retryError: unknown) {
    swLog(`Service worker update retry failed: ${getErrorMessage(retryError)}`, 'error');

    if (retryCount < SW_UPDATE_RETRY_CONFIG.maxRetries) {
      scheduleUpdateRetry(registration);
    } else {
      console.error('Service worker update failed after maximum retry attempts');
      pendingRegistration = null;
      removeOnlineEventListener();
    }
  }
}

export function scheduleUpdateRetry(registration: ServiceWorkerRegistration): void {
  pendingRegistration = registration;

  if (typeof navigator !== 'undefined' && navigator && 'onLine' in navigator && !navigator.onLine) {
    console.log('Network is offline, skipping service worker update retry');

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

  clearUpdateRetryTimeout();

  if (retryCount < SW_UPDATE_RETRY_CONFIG.maxRetries) {
    retryCount++;

    updateRetryTimeout = setTimeout(async () => {
      if (typeof navigator !== 'undefined' && navigator && 'onLine' in navigator && !navigator.onLine) {
        console.log('Network is offline, skipping service worker update retry');

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
