import { registerServiceWorker, unregisterServiceWorker } from '../serviceWorkerRegistration';

// Mock service worker registration
const mockRegistration = {
  unregister: jest.fn().mockResolvedValue(undefined),
  update: jest.fn().mockResolvedValue(undefined),
  addEventListener: jest.fn(),
  installing: {
    addEventListener: jest.fn()
  }
};

const mockNavigator = {
  serviceWorker: {
    register: jest.fn().mockResolvedValue(mockRegistration),
    getRegistration: jest.fn().mockResolvedValue(mockRegistration),
    ready: Promise.resolve(mockRegistration),
    controller: { state: 'activated' },
  } as unknown as ServiceWorkerContainer,
};

describe('Service Worker Registration', () => {
  const originalNavigator = global.navigator;
  const originalWindow = global.window;
  
  beforeEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: mockNavigator,
      writable: true,
    });
    
    Object.defineProperty(global, 'window', {
      value: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
        location: {
          hostname: 'localhost',
        },
      },
      writable: true,
    });
    
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      writable: true,
    });
  });
  
  describe('registerServiceWorker', () => {
    it('registers a service worker when in production and service workers are supported', async () => {
      await registerServiceWorker();
      expect(mockNavigator.serviceWorker.register).toHaveBeenCalledWith('/service-worker.js', { scope: '/' });
    });
  });
  
  describe('unregisterServiceWorker', () => {
    it('unregisters the service worker if one is active', async () => {
      await unregisterServiceWorker();
      expect(mockNavigator.serviceWorker.getRegistration).toHaveBeenCalled();
      expect(mockRegistration.unregister).toHaveBeenCalled();
    });
  });
});
