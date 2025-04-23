import { handleRegistration, checkForUpdates } from '../serviceWorkerUpdates';
import * as serviceWorkerErrors from '../serviceWorkerErrors'; 

describe('Service Worker Updates', () => {
  // Create properly typed mock objects
  
  beforeEach(() => {
    // Spy on error handling functions
    jest.spyOn(serviceWorkerErrors, 'handleServiceWorkerError').mockImplementation(() => {});
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
    expect(onSuccess).toHaveBeenCalled();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('should call onUpdate when there is a waiting worker', () => {
    const mockRegistration = {
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
      dispatchEvent: jest.fn()
    } as ServiceWorkerRegistration;
    const onSuccess = jest.fn();
    const onUpdate = jest.fn();

    handleRegistration(mockRegistration, { onSuccess, onUpdate });
    expect(onUpdate).toHaveBeenCalledWith(mockRegistration);
    expect(onSuccess).not.toHaveBeenCalled();
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
    
    const mockRegistration = {
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
      dispatchEvent: jest.fn()
    } as unknown as ServiceWorkerRegistration;
    
    const onSuccess = jest.fn();
    const onUpdate = jest.fn();

    handleRegistration(mockRegistration, { onSuccess, onUpdate });
    
    expect(mockInstallingWorker.addEventListener).toHaveBeenCalledWith(
      'statechange', 
      expect.any(Function)
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

    // Fix the mock registration by using the proper ServiceWorker interface
    const mockRegistration = {
      waiting: null,
      installing: createMockServiceWorker("installing"),
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
      removeEventListener: jest.fn()
    } as unknown as ServiceWorkerRegistration;
    
    handleRegistration(mockRegistration, { onSuccess, onUpdate });
    expect(onUpdate).toHaveBeenCalledWith(mockRegistration);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should update service worker when called', async () => {
    // Create a fully typed mock registration
    const mockRegistration = {
      waiting: null,
      installing: null,
      active: {} as ServiceWorker,
      unregister: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
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
    
    await checkForUpdates(mockRegistration);
    expect(mockRegistration.update).toHaveBeenCalled();
  });
  
  it('should handle update errors', async () => {
    // Create another properly typed mock with failing update
    const mockRegistration = {
      waiting: null,
      installing: null,
      active: {} as ServiceWorker,
      unregister: jest.fn(),
      update: jest.fn().mockRejectedValue(new Error('Update failed')),
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
    
    await expect(checkForUpdates(mockRegistration)).resolves.not.toThrow();
    expect(serviceWorkerErrors.handleServiceWorkerError).toHaveBeenCalled();
  });
});
