import { registerServiceWorker, unregisterServiceWorker } from '../serviceWorkerRegistration';
// Remove setUpdateHandler from import if not used in tests

// Mock service worker registration
const mockRegistration = {
  unregister: jest.fn().mockResolvedValue(undefined),
  update: jest.fn().mockResolvedValue(undefined),
  addEventListener: jest.fn(),
  installing: {
    addEventListener: jest.fn()
  }
};

// Fix function type definition
const mockNavigator = {
  serviceWorker: {
    register: jest.fn().mockResolvedValue(mockRegistration),
    getRegistration: jest.fn().mockResolvedValue(mockRegistration),
    ready: Promise.resolve(mockRegistration),
    controller: { state: 'activated' },
  } as unknown as ServiceWorkerContainer,
};

// Remove the unused triggerOnlineEvent function or use it in tests
// const triggerOnlineEvent = () => {
//   window.dispatchEvent(new Event('online'));
// };

describe('Service Worker Registration', () => {
  // Save original navigator and window
  const originalNavigator = global.navigator;
  const originalWindow = global.window;
  
  beforeEach(() => {
    // Setup navigator mock
    Object.defineProperty(global, 'navigator', {
      value: mockNavigator,
      writable: true,
    });
    
    // Setup window mock
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
    
    // Reset mocks
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore original navigator and window
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
    // Remove unused options parameter
    it('registers a service worker when in production and service workers are supported', async () => {
      // Test implementation
      await registerServiceWorker();
      expect(mockNavigator.serviceWorker.register).toHaveBeenCalledWith('/service-worker.js');
    });
  });
  
  describe('unregisterServiceWorker', () => {
    // Remove unused options parameter  
    it('unregisters the service worker if one is active', async () => {
      await unregisterServiceWorker();
      expect(mockNavigator.serviceWorker.getRegistration).toHaveBeenCalled();
      expect(mockRegistration.unregister).toHaveBeenCalled();
    });
  });
});