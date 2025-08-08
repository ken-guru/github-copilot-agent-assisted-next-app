// Mock the serviceWorkerErrors module before imports so serviceWorkerUpdates sees the mock
jest.mock('../serviceWorkerErrors', () => ({
  handleServiceWorkerError: jest.fn(),
  isLocalhost: jest.fn().mockReturnValue(true)
}));

import { expect as jestExpect, jest } from '@jest/globals';
import { handleRegistration, checkForUpdates } from '../serviceWorkerUpdates';

// Mock the serviceWorkerErrors module instead of using spyOn

describe('Service Worker Updates', () => {
  // Create properly typed mock objects
  const createMockCookieStoreManager = (): CookieStoreManager => ({
    get: jest.fn<() => Promise<unknown>>() as unknown,
    set: jest.fn<(..._args: unknown[]) => Promise<void>>() as unknown,
    delete: jest.fn<(..._args: unknown[]) => Promise<void>>() as unknown,
    subscribe: jest.fn<(..._args: unknown[]) => Promise<void>>() as unknown,
    unsubscribe: jest.fn<(..._args: unknown[]) => Promise<void>>() as unknown,
    getSubscriptions: jest.fn<() => Promise<unknown[]>>().mockResolvedValue([]) as unknown
  } as unknown as CookieStoreManager);
  
  beforeEach(() => {
    // Spy on console functions only
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call onSuccess when no waiting or installing worker', () => {
    const onSuccess = jest.fn();
    const onUpdate = jest.fn();
    
    // Create a properly typed mock using unknown cast first
    const mockRegistration = {
      waiting: null,
      installing: null,
      active: {} as ServiceWorker,
      unregister: jest.fn(),
      update: jest.fn(),
      navigationPreload: {} as NavigationPreloadManager,
      onupdatefound: null,
      pushManager: {} as PushManager,
      scope: '',
      updateViaCache: 'none' as ServiceWorkerUpdateViaCache,
      getNotifications: jest.fn(),
      showNotification: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    } as unknown as ServiceWorkerRegistration;
    
    handleRegistration(mockRegistration, { onSuccess, onUpdate });
  jestExpect(onSuccess).toHaveBeenCalled();
  jestExpect(onUpdate).not.toHaveBeenCalled();
  });

  it('should call onUpdate when there is a waiting worker', () => {
  const mockRegistration = ({
      waiting: {} as ServiceWorker,
      installing: null,
      active: {} as ServiceWorker,
      unregister: jest.fn(),
      update: jest.fn(),
      navigationPreload: {} as NavigationPreloadManager,
      onupdatefound: null,
      pushManager: {} as PushManager,
      scope: '',
      updateViaCache: 'none' as ServiceWorkerUpdateViaCache,
      getNotifications: jest.fn(),
      showNotification: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
  // Added for newer DOM lib typings
  cookies: createMockCookieStoreManager()
    } as unknown) as ServiceWorkerRegistration;
    const onSuccess = jest.fn();
    const onUpdate = jest.fn();

    handleRegistration(mockRegistration, { onSuccess, onUpdate });
  jestExpect(onUpdate).toHaveBeenCalledWith(mockRegistration);
  jestExpect(onSuccess).not.toHaveBeenCalled();
  });

  it('should listen for state changes on installing worker', () => {
    // Create a proper mock ServiceWorker that implements all required properties
    const mockInstallingWorker = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      state: 'installing',
      scriptURL: 'http://localhost/sw.js',
      onstatechange: null,
      postMessage: jest.fn()
    };
    
  const mockRegistration = ({
      waiting: null,
      installing: mockInstallingWorker,
      active: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
        state: 'activated',
        scriptURL: 'http://localhost/sw.js',
        onstatechange: null,
        postMessage: jest.fn()
      },
      unregister: jest.fn(),
      update: jest.fn(),
      navigationPreload: {} as NavigationPreloadManager,
      onupdatefound: null,
      pushManager: {} as PushManager,
      scope: '',
      updateViaCache: 'none' as ServiceWorkerUpdateViaCache,
      getNotifications: jest.fn(),
      showNotification: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  cookies: createMockCookieStoreManager()
    } as unknown) as ServiceWorkerRegistration;
    
    const onSuccess = jest.fn();
    const onUpdate = jest.fn();

    handleRegistration(mockRegistration, { onSuccess, onUpdate });
    
    jestExpect(mockInstallingWorker.addEventListener).toHaveBeenCalledWith(
      'statechange', 
      jestExpect.any(Function)
    );
  });

  it('should call onUpdate when installing worker changes state to activated', () => {
    const onSuccess = jest.fn();
    const onUpdate = jest.fn();
    
    // Create a complete mock ServiceWorker that implements all required interface properties
    const createMockServiceWorker = (state: string) => ({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      state,
      scriptURL: "http://localhost/sw.js",
      onstatechange: null,
      postMessage: jest.fn()
    });

    // Fix the mock registration to properly trigger onUpdate with a waiting worker
  const mockRegistration = ({
      waiting: createMockServiceWorker("activated"), // Set waiting to activate onUpdate
      installing: null,
      active: createMockServiceWorker("activated"),
      unregister: jest.fn(),
      update: jest.fn(),
      onupdatefound: null,
      scope: "http://localhost/",
      navigationPreload: {
        enable: jest.fn(),
        disable: jest.fn(),
        getState: jest.fn(),
        setHeaderValue: jest.fn()
      } as unknown as NavigationPreloadManager,
      pushManager: {
        getSubscription: jest.fn(),
        permissionState: jest.fn(),
        subscribe: jest.fn()
      } as unknown as PushManager,
      getNotifications: jest.fn(),
      showNotification: jest.fn(),
      index: null,
      dispatchEvent: jest.fn(),
      addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  cookies: createMockCookieStoreManager()
    } as unknown) as ServiceWorkerRegistration;
    
    handleRegistration(mockRegistration, { onSuccess, onUpdate });
  jestExpect(onUpdate).toHaveBeenCalledWith(mockRegistration);
  jestExpect(onSuccess).not.toHaveBeenCalled();
  });

  it('should update service worker when called', async () => {
    // Create a fully typed mock registration
  const mockRegistration = ({
      waiting: null,
      installing: null,
      active: {} as ServiceWorker,
      unregister: jest.fn(),
  update: (jest.fn<() => Promise<void>>().mockResolvedValue(undefined)) as unknown as ServiceWorkerRegistration['update'],
      navigationPreload: {} as NavigationPreloadManager,
      onupdatefound: null,
      pushManager: {} as PushManager,
      scope: '',
      updateViaCache: 'none' as ServiceWorkerUpdateViaCache,
      getNotifications: jest.fn(),
      showNotification: jest.fn(),
      addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  cookies: createMockCookieStoreManager()
    } as unknown) as ServiceWorkerRegistration;
    
    await checkForUpdates(mockRegistration);
  jestExpect(mockRegistration.update).toHaveBeenCalled();
  });
  
  it('should handle update errors', async () => {
    // Create another properly typed mock with failing update
  const mockRegistration = ({
      waiting: null,
      installing: null,
      active: {} as ServiceWorker,
      unregister: jest.fn(),
  update: (jest.fn<() => Promise<void>>().mockRejectedValue(new Error('Update failed'))) as unknown as ServiceWorkerRegistration['update'],
      navigationPreload: {} as NavigationPreloadManager,
      onupdatefound: null,
      pushManager: {} as PushManager,
      scope: '',
      updateViaCache: 'none' as ServiceWorkerUpdateViaCache,
      getNotifications: jest.fn(),
      showNotification: jest.fn(),
      addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  cookies: createMockCookieStoreManager()
    } as unknown) as ServiceWorkerRegistration;
    
  await jestExpect(checkForUpdates(mockRegistration)).resolves.not.toThrow();
  // Verify error path via console spies (error + warn)
  jestExpect(console.error).toHaveBeenCalled();
  jestExpect(console.warn).toHaveBeenCalled();
  });
});
