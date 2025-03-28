import { registerServiceWorker, unregisterServiceWorker, setUpdateHandler } from '../serviceWorkerRegistration';

describe('Service Worker Registration', () => {
  // Original navigator
  const originalNavigator = global.navigator;
  // Original setTimeout and clearTimeout functions
  const originalSetTimeout = global.setTimeout;
  const originalClearTimeout = global.clearTimeout;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock console
    global.console.log = jest.fn();
    global.console.error = jest.fn();
    
    // Mock setTimeout and clearTimeout
    global.setTimeout = jest.fn().mockImplementation(() => 123);
    global.clearTimeout = jest.fn();
  });
  
  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(global, 'navigator', {
      configurable: true,
      value: originalNavigator,
      writable: true
    });
    
    // Restore original setTimeout and clearTimeout
    global.setTimeout = originalSetTimeout;
    global.clearTimeout = originalClearTimeout;
  });
  
  describe('registerServiceWorker', () => {
    it('should register the service worker when supported', async () => {
      // Arrange
      const mockRegistration = {
        update: jest.fn().mockResolvedValue(undefined),
        addEventListener: jest.fn()
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

    it('should handle service worker update errors', async () => {
      // Arrange
      const updateError = new TypeError('Failed to update a ServiceWorker');
      const mockRegistration = {
        update: jest.fn().mockRejectedValue(updateError),
        addEventListener: jest.fn()
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
      expect(mockRegistration.update).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Service worker update failed', updateError);
    });
    
    it('should retry service worker update after initial failure', async () => {
      // Arrange
      const updateError = new TypeError('Failed to update a ServiceWorker');
      const mockRegistration = {
        update: jest.fn()
          .mockRejectedValueOnce(updateError) // First call fails
          .mockResolvedValueOnce(undefined),  // Second call succeeds
        addEventListener: jest.fn()
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
      expect(mockRegistration.update).toHaveBeenCalledTimes(1); // Initial call
      expect(console.error).toHaveBeenCalledWith('Service worker update failed', updateError);
      
      // Verify setTimeout was called for retry
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
      
      // Execute the retry callback
      const retryCallback = (setTimeout as jest.Mock).mock.calls[0][0];
      await retryCallback();
      
      // Should have attempted update again
      expect(mockRegistration.update).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith('Service worker update retry succeeded');
    });
    
    it('should handle multiple update retry failures', async () => {
      // Arrange
      const updateError = new TypeError('Failed to update a ServiceWorker');
      const mockRegistration = {
        update: jest.fn().mockRejectedValue(updateError), // All calls fail
        addEventListener: jest.fn()
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
      
      // Assert initial call and first retry
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/service-worker.js');
      expect(mockRegistration.update).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
      
      // Execute first retry callback
      const retryCallback1 = (setTimeout as jest.Mock).mock.calls[0][0];
      await retryCallback1();
      
      // Should have attempted update again and scheduled another retry
      expect(mockRegistration.update).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenCalledTimes(2); // Two failures logged
      expect(setTimeout).toHaveBeenCalledTimes(2); // Second retry scheduled
      
      // Execute second retry callback
      const retryCallback2 = (setTimeout as jest.Mock).mock.calls[1][0];
      await retryCallback2();
      
      // Should have attempted update a third time and scheduled another retry
      expect(mockRegistration.update).toHaveBeenCalledTimes(3);
      expect(console.error).toHaveBeenCalledTimes(3); // Three failures logged
      expect(setTimeout).toHaveBeenCalledTimes(3); // Third retry scheduled
      
      // Execute third retry callback (should be the last attempt)
      const retryCallback3 = (setTimeout as jest.Mock).mock.calls[2][0];
      await retryCallback3();
      
      // Should have attempted update a fourth time but not scheduled another retry
      expect(mockRegistration.update).toHaveBeenCalledTimes(4);
      expect(console.error).toHaveBeenCalledTimes(4); // Four failures logged
      expect(setTimeout).toHaveBeenCalledTimes(3); // No more retries scheduled
      expect(console.error).toHaveBeenCalledWith('Service worker update failed after maximum retry attempts');
    });
    
    it('should clear timeout when unregistering service worker during retry period', async () => {
      // Arrange
      const updateError = new TypeError('Failed to update a ServiceWorker');
      const mockRegistration = {
        update: jest.fn().mockRejectedValue(updateError),
        addEventListener: jest.fn(),
        unregister: jest.fn().mockResolvedValue(undefined)
      };
      const mockServiceWorker = {
        register: jest.fn().mockResolvedValue(mockRegistration),
        getRegistration: jest.fn().mockResolvedValue(mockRegistration)
      };
      Object.defineProperty(global.navigator, 'serviceWorker', {
        configurable: true,
        value: mockServiceWorker,
        writable: true
      });
      
      // Act - register service worker (will schedule retry)
      await registerServiceWorker();
      
      // Verify retry scheduled
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
      
      // Act - unregister service worker during retry period
      await unregisterServiceWorker();
      
      // Verify timeout was cleared
      expect(clearTimeout).toHaveBeenCalledWith(123);
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