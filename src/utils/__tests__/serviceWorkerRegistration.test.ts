import { registerServiceWorker, unregisterServiceWorker } from '../serviceWorkerRegistration';

interface MockServiceWorkerContainer extends Partial<ServiceWorkerContainer> {
  register: jest.Mock;
  getRegistration: jest.Mock;
}

describe('Service Worker Registration', () => {
  // Mock service worker registration
  const mockRegistration = {
    unregister: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
    scope: '/'
  };
  
  // Original navigator.serviceWorker
  const originalServiceWorker = global.navigator.serviceWorker;
  
  beforeEach(() => {
    // Clear mocks between tests
    jest.clearAllMocks();
    
    // Mock navigator.serviceWorker
    const mockServiceWorker: MockServiceWorkerContainer = {
      register: jest.fn().mockResolvedValue(mockRegistration),
      getRegistration: jest.fn().mockResolvedValue(mockRegistration)
    };
    
    Object.defineProperty(global.navigator, 'serviceWorker', {
      configurable: true,
      value: mockServiceWorker,
      writable: true
    });
    
    // Mock console
    global.console.log = jest.fn();
    global.console.error = jest.fn();
  });
  
  afterEach(() => {
    // Restore navigator.serviceWorker after each test
    Object.defineProperty(global.navigator, 'serviceWorker', {
      configurable: true,
      value: originalServiceWorker,
      writable: true
    });
  });
  
  describe('registerServiceWorker', () => {
    it('should register the service worker when supported', async () => {
      // Act
      await registerServiceWorker();
      
      // Assert
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/service-worker.js');
      expect(console.log).toHaveBeenCalledWith('Service worker registered');
    });
    
    it('should handle registration errors', async () => {
      // Arrange
      const error = new Error('Registration failed');
      (navigator.serviceWorker.register as jest.Mock).mockRejectedValueOnce(error);
      
      // Act
      await registerServiceWorker();
      
      // Assert
      expect(console.error).toHaveBeenCalledWith('Service worker registration failed', error);
    });
    
    it('should not attempt registration when service workers are not supported', async () => {
      // Arrange
      Object.defineProperty(global.navigator, 'serviceWorker', {
        configurable: true,
        value: undefined,
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
      // Act
      await unregisterServiceWorker();
      
      // Assert
      expect(navigator.serviceWorker.getRegistration).toHaveBeenCalled();
      expect(mockRegistration.unregister).toHaveBeenCalled();
    });
    
    it('should handle case when no service worker is registered', async () => {
      // Arrange
      (navigator.serviceWorker.getRegistration as jest.Mock).mockResolvedValueOnce(undefined);
      
      // Act
      await unregisterServiceWorker();
      
      // Assert
      expect(mockRegistration.unregister).not.toHaveBeenCalled();
    });
    
    it('should not attempt unregistration when service workers are not supported', async () => {
      // Arrange
      Object.defineProperty(global.navigator, 'serviceWorker', {
        configurable: true,
        value: undefined,
        writable: true
      });
      
      // Act
      await unregisterServiceWorker();
      
      // Assert
      expect(console.log).toHaveBeenCalledWith('Service workers are not supported in this browser');
    });
  });
});