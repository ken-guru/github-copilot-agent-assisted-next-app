import { scheduleUpdateRetry } from './serviceWorkerUpdates';
import { getErrorMessage, swLog } from './serviceWorkerErrors';

type UpdateHandler = (message: string) => void;

let updateHandler: UpdateHandler | null = null;

function isDevelopmentEnvironment(): boolean {
  if (typeof window === 'undefined') return false;

  const isDev = process.env.NODE_ENV === 'development';
  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');
  const isDevPort = typeof window !== 'undefined' &&
    (window.location.port === '3000' ||
      window.location.port === '3001' ||
      window.location.port === '8080');

  return isDev && (isLocalhost || isDevPort);
}

export function setUpdateHandler(handler: UpdateHandler | null): void {
  updateHandler = handler;
}

export async function registerServiceWorker(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }
  if (typeof navigator === 'undefined' || !navigator || !('serviceWorker' in navigator)) {
    swLog('Service workers are not supported in this browser', 'warn');
    return;
  }

  try {
    if (isDevelopmentEnvironment()) {
      swLog('Development environment detected, registering service worker but skipping updates');
    }

    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    });
    swLog('Service worker registered');

    if (isDevelopmentEnvironment()) {
      return;
    }

    try {
      await registration.update();
    } catch (updateError: unknown) {
      swLog(`Service worker update failed: ${getErrorMessage(updateError)}`, 'error');

      const errorMessage = getErrorMessage(updateError);
      if (errorMessage.includes('MIME type') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('An unknown error occurred when fetching')) {
        console.warn('Service worker update error appears to be related to fetch or MIME type issues.');
        console.warn('This is common in development environments - continuing without retrying.');
        return;
      }

      scheduleUpdateRetry(registration);
    }

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            const message = 'A new version is available. Please refresh to update.';
            console.log(message);
            if (updateHandler) {
              updateHandler(message);
            }
          }
        });
      }
    });

  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);

    if (errorMessage.includes('MIME type') || errorMessage.includes('Failed to fetch')) {
      swLog('Service worker registration error may be related to development environment:', 'warn');
      swLog('- Ensure service-worker.js is served with the correct MIME type', 'warn');
      swLog('- Check that the file is accessible at the expected URL', 'warn');
      swLog(errorMessage, 'warn');
    } else {
      swLog(`Service worker registration failed: ${errorMessage}`, 'error');
    }
  }
}

export async function unregisterServiceWorker(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
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
  } catch (error: unknown) {
    console.error('Service worker unregistration failed', error);
  }
}
