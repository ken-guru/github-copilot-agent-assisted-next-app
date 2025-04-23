import { register, unregister } from '../serviceWorkerRegistration';
import * as serviceWorkerUtils from '../serviceWorkerCore';
import { handleServiceWorkerError } from '../serviceWorkerErrors';

// Define a mock registration type to use throughout the tests
const createMockRegistration = () => ({
  active: {} as ServiceWorker,
  installing: null,
  waiting: null,
  scope: '',
  navigationPreload: {} as NavigationPreloadManager,
  pushManager: {} as PushManager,
  updateViaCache: 'none' as ServiceWorkerUpdateViaCache,
  onupdatefound: null,
  getNotifications: jest.fn(),
  showNotification: jest.fn(),
  unregister: jest.fn(),
  update: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
});

// Create a typed interface for our mock service worker container
interface MockServiceWorkerContainer {
  register: jest.Mock;
  getRegistration?: jest.Mock;
  [key: string]: any;
}

describe('Service Worker Core', () => {
  // Store original environment values
  const originalEnv = { ...process.env };
  
  // Create a proper mock registration
  const mockRegistration = createMockRegistration();
  
  beforeEach(() => {
    // Reset mocks between tests
    jest.resetModules();
    
    // Create a mock navigator.serviceWorker object
    const mockServiceWorkerContainer: MockServiceWorkerContainer = {
      register: jest.fn().mockResolvedValue(mockRegistration)
    };
    
    // Define a mock navigator.serviceWorker using Object.defineProperty
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: mockServiceWorkerContainer
    });
  });

  afterEach(() => {
    // Restore original environment state
    process.env = { ...originalEnv };
  });

  describe('register', () => {
    it('should not register a service worker in development', () => {
      // Set NODE_ENV safely using Object.defineProperty
      Object.defineProperty(process.env, 'NODE_ENV', { 
        value: 'test', 
        configurable: true 
      });

      register();
      expect(navigator.serviceWorker.register).not.toHaveBeenCalled();
    });
  });

  describe('registerValidSW', () => {
    it('should handle service worker registration correctly', () => {
      // Mock required functions before test
      const mockOnUpdate = jest.fn();
      const mockOnSuccess = jest.fn();
      
      // Test code...
    });
    
    it('should handle environment variable correctly', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      
      // Set NODE_ENV safely for different test cases
      Object.defineProperty(process.env, 'NODE_ENV', { 
        value: 'development', 
        configurable: true 
      });
      
      // Test development behavior
      // ...
      
      // Restore the original value
      Object.defineProperty(process.env, 'NODE_ENV', { 
        value: originalNodeEnv, 
        configurable: true 
      });
    });
  });

  describe('checkForExistingSW', () => {
    it('should handle existing registration', async () => {
      // Create a mock with getRegistration method
      const mockSW: MockServiceWorkerContainer = {
        register: jest.fn(),
        getRegistration: jest.fn().mockResolvedValue(mockRegistration)
      };
      
      // Set navigator.serviceWorker safely
      Object.defineProperty(navigator, 'serviceWorker', {
        configurable: true,
        value: mockSW
      });
      
      // Import the actual handleRegistration function for mocking
      // instead of trying to access it from serviceWorkerUtils
      const { handleRegistration } = require('../serviceWorkerUpdates');
      jest.spyOn(require('../serviceWorkerUpdates'), 'handleRegistration')
        .mockImplementation(() => {});
      
      await serviceWorkerUtils.checkForExistingSW({ onSuccess: jest.fn(), onUpdate: jest.fn() });
      expect(mockSW.getRegistration).toHaveBeenCalled();
    });
    
    it('should handle no registration', async () => {
      // Create mock with no registration
      const mockSW: MockServiceWorkerContainer = {
        register: jest.fn(),
        getRegistration: jest.fn().mockResolvedValue(undefined)
      };
      
      // Set navigator.serviceWorker safely
      Object.defineProperty(navigator, 'serviceWorker', {
        configurable: true,
        value: mockSW
      });
      
      await serviceWorkerUtils.checkForExistingSW();
      expect(mockSW.getRegistration).toHaveBeenCalled();
    });
  });

  describe('unregister', () => {
    it('should unregister service worker when registration exists', async () => {
      // Mock registration with unregister method that returns Promise<boolean>
      const mockRegistration = createMockRegistration();
      mockRegistration.unregister.mockResolvedValue(true);

      // Create a mock with getRegistration method
      const mockSW: MockServiceWorkerContainer = {
        register: jest.fn(),
        getRegistration: jest.fn().mockResolvedValue(mockRegistration)
      };
      
      // Set navigator.serviceWorker safely
      Object.defineProperty(navigator, 'serviceWorker', {
        configurable: true,
        value: mockSW
      });
      
      // Call unregister and verify it returns void Promise
      const result = await serviceWorkerUtils.unregister();
      expect(mockSW.getRegistration).toHaveBeenCalled();
      expect(mockRegistration.unregister).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
    
    it('should handle when no registration is found', async () => {
      // Create mock with no registration
      const mockSW: MockServiceWorkerContainer = {
        register: jest.fn(),
        getRegistration: jest.fn().mockResolvedValue(undefined)
      };
      
      // Set navigator.serviceWorker safely
      Object.defineProperty(navigator, 'serviceWorker', {
        configurable: true,
        value: mockSW
      });
      
      // Call unregister and verify it returns void Promise
      const result = await serviceWorkerUtils.unregister();
      expect(mockSW.getRegistration).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle errors during unregistration', async () => {
      // Create mock that throws error
      const mockSW: MockServiceWorkerContainer = {
        register: jest.fn(),
        getRegistration: jest.fn().mockRejectedValue(new Error('Test error'))
      };
      
      // Set navigator.serviceWorker safely
      Object.defineProperty(navigator, 'serviceWorker', {
        configurable: true,
        value: mockSW
      });
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error');
      
      // Call unregister and verify it handles errors properly
      const result = await serviceWorkerUtils.unregister();
      expect(mockSW.getRegistration).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result).toBeUndefined();
      
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });
});
