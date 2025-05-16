/**
 * Core service worker functionality
 */
export const SERVICE_WORKER_EVENTS = {
  INSTALLING: 'installing',
  INSTALLED: 'installed', 
  ACTIVATING: 'activating',
  ACTIVATED: 'activated',
  REDUNDANT: 'redundant',
  CONTROLLING: 'controlling',
  UPDATE_FOUND: 'updatefound',
  ERROR: 'error',
  UPDATE_READY: 'updateReady',
  UPDATE_INSTALLED: 'updateInstalled',
  OFFLINE: 'offline',
  ONLINE: 'online'
};

export interface ServiceWorkerEvent {
  type: string;
  payload?: unknown;
}

export type ServiceWorkerListener = (event: ServiceWorkerEvent) => void;

export interface ServiceWorkerRegistrationInfo {
  scope: string;
  installing: ServiceWorker | null;
  waiting: ServiceWorker | null;
  active: ServiceWorker | null;
  updateViaCache: ServiceWorkerUpdateViaCache;
}

export const SW_STATUS = {
  PENDING: 'pending', 
  REGISTERED: 'registered',
  REGISTERING: 'registering',
  REGISTRATION_ERROR: 'registrationError',
  UNSUPPORTED: 'unsupported',
  UPDATE_AVAILABLE: 'updateAvailable',
  UPDATE_INSTALLED: 'updateInstalled',
  UPDATE_INSTALLING: 'updateInstalling'
};
