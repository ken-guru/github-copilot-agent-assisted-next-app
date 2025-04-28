import { 
  registerServiceWorker, 
  unregisterServiceWorker, 
  setUpdateHandler 
} from '../serviceWorkerRegistration';

// Create a proper mock for ServiceWorkerRegistration
class MockServiceWorkerRegistration {
  // Required properties
  scope = '/';
  installing = {
    state: 'installed',
    addEventListener: jest.fn((event, listener) => {
      if (event === 'statechange') {
        // Store listener for direct access in tests
        this.installing._listeners[event] = listener;
        // Call it immediately for tests
        setTimeout(() => listener(), 0);
      }
    }),
    _listeners: {}
  };
  waiting = null;
  active = { state: 'activated' };
  
  // Required methods
  addEventListener = jest.fn((event, listener) => {
    // Store listener for direct access in tests
    this._listeners[event] = listener;
    // Call it immediately for tests
    if (event === 'updatefound') {
      setTimeout(() => listener(), 0);
    }
  });
  
  _listeners = {};
  update = jest.fn().mockResolvedValue(undefined);
  unregister = jest.fn().mockResolvedValue(true);
}

// Mock for navigator.serviceWorker
const mockServiceWorkerContainer = {
  register: jest.fn().mockImplementation(() => {
    const registration = new MockServiceWorkerRegistration();
    return Promise.resolve(registration);
  }),
  getRegistration: jest.fn().mockImplementation(() => {
    const registration = new MockServiceWorkerRegistration();
    return Promise.resolve(registration);
  }),
  ready: Promise.resolve(new MockServiceWorkerRegistration()),
  controller: { state: 'activated' }
};

// Mock the serviceWorker module
jest.mock('../serviceWorker', () => {
  let updateHandlerValue = null;
  
  return {
    // Service worker functions
    register: jest.fn(),
    unregister: jest.fn(),
    checkForUpdates: jest.fn(),
    handleRegistration: jest.fn((reg, config) => {
      // Call the callbacks directly for testing
      if (reg.waiting) {
        if (config?.onUpdate) {
          config.onUpdate(reg);
        }
        if (updateHandlerValue) {
          updateHandlerValue(reg);
        }
      } else if (!navigator.serviceWorker.controller) {
        if (config?.onSuccess) {
          config.onSuccess(reg);
        }
      }
    }),
    isLocalhost: jest.fn().mockReturnValue(true),
    handleServiceWorkerError: jest.fn(),
    registerWithRetry: jest.fn().mockImplementation(() => {
      const registration = new MockServiceWorkerRegistration();
      return Promise.resolve(registration);
    }),
    checkValidServiceWorker: jest.fn().mockResolvedValue(true),
    checkServiceWorkerValidity: jest.fn().mockResolvedValue(true),
    
    // Update handler functions
    setUpdateHandler: jest.fn(handler => {
      updateHandlerValue = handler;
    }),
    getUpdateHandler: jest.fn(() => updateHandlerValue),
    
    // Config type
    ServiceWorkerConfig: {}
  };
});

describe('Service Worker Registration', () => {
  // Store original environment
  const originalNavigator = global.navigator;
  const originalWindow = global.window;
  const originalNodeEnv = process.env.NODE_ENV;
  
  beforeEach(() => {
    // Set up mock navigator
    Object.defineProperty(global, 'navigator', {
      value: {
        serviceWorker: mockServiceWorkerContainer
      },
      writable: true
    });
    
    // Set up mock window
    Object.defineProperty(global, 'window', {
      value: {
        addEventListener: jest.fn(),
        location: {
          hostname: 'localhost',
          origin: 'http://localhost:3000'
        }
      },
      writable: true
    });
    
    // Set NODE_ENV for tests
    process.env.NODE_ENV = 'test';
    
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore original environment
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true
    });
    
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      writable: true
    });
    
    process.env.NODE_ENV = originalNodeEnv;
    
    // Clear update handler
    setUpdateHandler(null);
  });
  
  describe('registerServiceWorker', () => {
    it('registers a service worker when service workers are supported', async () => {
      // Call registerServiceWorker - important to await the result
      const result = await registerServiceWorker();
      
      // Verify that the service worker was registered
      expect(result).toBeDefined();
      expect(mockServiceWorkerContainer.register).toHaveBeenCalledWith(
        '/service-worker.js',
        { scope: '/' }
      );
    });
    
    it('calls onSuccess callback when registration is successful', async () => {
      // Create a mock success callback
      const onSuccess = jest.fn();
      
      // Remove controller to simulate first install
      const originalController = mockServiceWorkerContainer.controller;
      mockServiceWorkerContainer.controller = null;
      
      // Call registerServiceWorker with the callback
      await registerServiceWorker({ onSuccess });
      
      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify onSuccess was called
      expect(onSuccess).toHaveBeenCalled();
      
      // Restore controller
      mockServiceWorkerContainer.controller = originalController;
    });
    
    it('calls onUpdate callback when an update is available', async () => {
      // Create a mock update callback
      const onUpdate = jest.fn();
      
      // Set up a waiting service worker to simulate an update
      mockServiceWorkerContainer.register.mockImplementationOnce(() => {
        const registration = new MockServiceWorkerRegistration();
        registration.waiting = { state: 'waiting' };
        return Promise.resolve(registration);
      });
      
      // Call registerServiceWorker with the callback
      await registerServiceWorker({ onUpdate });
      
      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify onUpdate was called
      expect(onUpdate).toHaveBeenCalled();
    });
    
    it('calls custom update handler when set', async () => {
      // Create a mock update handler
      const updateHandler = jest.fn();
      setUpdateHandler(updateHandler);
      
      // Set up a waiting service worker to simulate an update
      mockServiceWorkerContainer.register.mockImplementationOnce(() => {
        const registration = new MockServiceWorkerRegistration();
        registration.waiting = { state: 'waiting' };
        return Promise.resolve(registration);
      });
      
      // Call registerServiceWorker
      await registerServiceWorker();
      
      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify update handler was called
      expect(updateHandler).toHaveBeenCalled();
      
      // Clean up
      setUpdateHandler(null);
    });
  });
  
  describe('unregisterServiceWorker', () => {
    it('unregisters the service worker if one is active', async () => {
      // Call unregisterServiceWorker
      await unregisterServiceWorker();
      
      // Verify that getRegistration was called
      expect(mockServiceWorkerContainer.getRegistration).toHaveBeenCalled();
    });
    
    it('handles the case where no service worker is registered', async () => {
      // Mock getRegistration to return null
      mockServiceWorkerContainer.getRegistration.mockResolvedValueOnce(null);
      
      // Call unregisterServiceWorker
      await expect(unregisterServiceWorker()).resolves.not.toThrow();
    });
    
    it('handles errors during unregistration', async () => {
      // Mock getRegistration to throw an error
      mockServiceWorkerContainer.getRegistration.mockRejectedValueOnce(new Error('Registration failed'));
      
      // Call unregisterServiceWorker
      await expect(unregisterServiceWorker()).resolves.not.toThrow();
    });
  });
});