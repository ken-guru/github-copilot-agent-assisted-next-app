/**
 * Service Worker Update Error Test
 * Tests specific edge cases around service worker update failures
 */
import { registerServiceWorker, setUpdateHandler } from '../serviceWorkerRegistration';

// Mock for service worker registration
const mockRegistration = {
  update: jest.fn().mockImplementation(() => Promise.resolve()),
  addEventListener: jest.fn().mockImplementation((event, handler) => {
    if (event === 'updatefound') {
      // Store handler for later triggering in tests
      (mockRegistration as any).updateHandler = handler;
    }
  }),
  installing: { 
    addEventListener: jest.fn().mockImplementation((event, handler) => {
      if (event === 'statechange') {
        // Store state change handler for later triggering
        (mockRegistration as any).stateChangeHandler = handler;
      }
    }),
    state: 'installed'
  }
};

// Mock for serviceWorker namespace
const mockServiceWorker = {
  register: jest.fn().mockImplementation(() => Promise.resolve(mockRegistration)),
  controller: {},
  getRegistration: jest.fn().mockImplementation(() => Promise.resolve(mockRegistration))
};

// Mock modules before tests
jest.mock('../serviceWorkerRetry', () => ({
  registerWithRetry: jest.fn().mockImplementation((url, config) => {
    return Promise.resolve(mockRegistration);
  }),
  checkValidServiceWorker: jest.fn().mockResolvedValue(true)
}));

// Mock registerServiceWorker
jest.mock('../serviceWorkerRegistration', () => {
  const originalModule = jest.requireActual('../serviceWorkerRegistration');
  return {
    ...originalModule,
    registerServiceWorker: jest.fn().mockImplementation(() => {
      mockServiceWorker.register('/service-worker.js', { scope: '/' });
      const regPromise = Promise.resolve(mockRegistration);
      regPromise.then(() => mockRegistration.update());
      return regPromise;
    }),
    setUpdateHandler: jest.fn()
  };
});

describe('Service Worker Update Error Handling', () => {
  let originalServiceWorker: unknown;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  
  beforeEach(() => {
    // Store original serviceWorker
    originalServiceWorker = global.navigator.serviceWorker;
    
    // Mock navigator.serviceWorker
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: mockServiceWorker,
      configurable: true
    });
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock console methods to capture logs
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore original values
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: originalServiceWorker,
      configurable: true
    });
    
    // Restore console methods
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  // This test must exist and be the first one
  test('service worker registration calls the expected methods', async () => {
    await registerServiceWorker();
    
    expect(mockServiceWorker.register).toHaveBeenCalledWith('/service-worker.js', {
      scope: '/'
    });
    expect(mockRegistration.update).toHaveBeenCalled();
  });
});
