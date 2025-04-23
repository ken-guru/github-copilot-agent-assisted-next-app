import { handleServiceWorkerError, isLocalhost } from '../serviceWorkerErrors';

describe('serviceWorkerErrors', () => {
  describe('handleServiceWorkerError', () => {
    const originalConsoleError = console.error;
    
    beforeEach(() => {
      console.error = jest.fn();
    });
    
    afterEach(() => {
      console.error = originalConsoleError;
    });
    
    it('should log error message to console', () => {
      const error = new Error('Test error');
      handleServiceWorkerError(error);
      
      expect(console.error).toHaveBeenCalledWith('Error during service worker registration:', error);
    });
  });
  
  describe('isLocalhost', () => {
    it('should return true for localhost hostname', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'localhost',
        },
        configurable: true,
      });
      
      expect(isLocalhost()).toBe(true);
    });
    
    it('should return true for 127.0.0.1', () => {
      Object.defineProperty(window, 'location', {
        value: {
          hostname: '127.0.0.1',
        },
        configurable: true,
      });
      
      expect(isLocalhost()).toBe(true);
    });
    
    it('should return false for other hostnames', () => {
      // Store the original defineProperty function
      const originalDefineProperty = Object.defineProperty;
      
      // Mock window.location with a non-localhost hostname
      Object.defineProperty(window, 'location', {
        value: {
          hostname: 'example.com',
        },
        configurable: true,
      });
      
      try {
        expect(isLocalhost()).toBe(false);
      } finally {
        // No need to restore as the test environment is reset between tests
        // and our mock is configured with configurable: true
      }
    });
  });
});
