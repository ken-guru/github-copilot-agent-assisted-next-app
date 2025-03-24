import { registerServiceWorker, unregisterServiceWorker } from '../serviceWorkerRegistration';

describe('Service Worker Registration', () => {
  // Original navigator
  const originalNavigator = global.navigator;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock console
    global.console.log = jest.fn();
    global.console.error = jest.fn();
  });
  
  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(global, 'navigator', {
      configurable: true,
      value: originalNavigator,
      writable: true
    });
  });
  
  describe('registerServiceWorker', () => {
    it('should register the service worker when supported', async () => {
      // Arrange
      const mockRegistration = {
        update: jest.fn().mockResolvedValue(undefined)
      };
      const mockServiceWorker = {
        register: jest.fn().mockResolvedValue(mockRegistration)
      };
      Object.defineProperty(global.navigator, 'serviceWorker', {
        configurable: true,
        value: mockServiceWorker,
        writable: true
      });
      
      // Act
      await registerServiceWorker();
      
      // Assert
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/service-worker.js');
      expect(console.log).toHaveBeenCalledWith('Service worker registered');
    });
    
    it('should handle registration errors', async () => {
      // Arrange
      const error = new Error('Registration failed');
      const mockServiceWorker = {
        register: jest.fn().mockRejectedValue(error)
      };
      Object.defineProperty(global.navigator, 'serviceWorker', {
        configurable: true,
        value: mockServiceWorker,
        writable: true
      });
      
      // Act
      await registerServiceWorker();
      
      // Assert
      expect(console.error).toHaveBeenCalledWith('Service worker registration failed', error);
    });
    
    it('should not attempt registration when service workers are not supported', async () => {
      // Arrange - Remove the serviceWorker property entirely
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        value: {},
        writable: true
      });
      
      // Act
      await registerServiceWorker();
      
      // Assert
      expect(console.log).toHaveBeenCalledWith('Service workers are not supported in this browser');
    });
  });
  
  describe('unregisterServiceWorker', () => {
    it('should unregister the service worker when registered', async () => {
      // Arrange
      const mockRegistration = {
        unregister: jest.fn().mockResolvedValue(undefined)
      };
      const mockServiceWorker = {
        getRegistration: jest.fn().mockResolvedValue(mockRegistration)
      };
      Object.defineProperty(global.navigator, 'serviceWorker', {
        configurable: true,
        value: mockServiceWorker,
        writable: true
      });
      
      // Act
      await unregisterServiceWorker();
      
      // Assert
      expect(mockRegistration.unregister).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Service worker unregistered');
    });
    
    it('should handle case when no service worker is registered', async () => {
      // Arrange
      const mockServiceWorker = {
        getRegistration: jest.fn().mockResolvedValue(undefined)
      };
      Object.defineProperty(global.navigator, 'serviceWorker', {
        configurable: true,
        value: mockServiceWorker,
        writable: true
      });
      
      // Act
      await unregisterServiceWorker();
      
      // Assert
      expect(console.log).not.toHaveBeenCalled();
    });
    
    it('should not attempt unregistration when service workers are not supported', async () => {
      // Arrange - Remove the serviceWorker property entirely
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        value: {},
        writable: true
      });
      
      // Act
      await unregisterServiceWorker();
      
      // Assert
      expect(console.log).toHaveBeenCalledWith('Service workers are not supported in this browser');
    });
  });
});