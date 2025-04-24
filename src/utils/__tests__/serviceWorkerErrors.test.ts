import { handleServiceWorkerError, isLocalhost, logCacheEvent } from '../serviceWorkerErrors';

describe('Service Worker Errors', () => {
  describe('handleServiceWorkerError', () => {
    it('should log error message to console', () => {
      // Arrange
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const testError = new Error('Test service worker error');
      
      // Act
      handleServiceWorkerError(testError);
      
      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error during service worker registration:', 
        testError
      );
      
      // Cleanup
      consoleErrorSpy.mockRestore();
    });
  });

  describe('isLocalhost', () => {
    it('should return true when hostname is localhost', () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true
      });
      
      // Act
      const result = isLocalhost();
      
      // Assert
      expect(result).toBe(true);
    });

    it('should return true when hostname is [::1]', () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { hostname: '[::1]' },
        writable: true
      });
      
      // Act
      const result = isLocalhost();
      
      // Assert
      expect(result).toBe(true);
    });

    it('should return true when hostname matches IPv4 localhost pattern', () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { hostname: '127.0.0.1' },
        writable: true
      });
      
      // Act
      const result = isLocalhost();
      
      // Assert
      expect(result).toBe(true);
    });

    it('should return false when hostname is not localhost', () => {
      // Arrange
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true
      });
      
      // Act
      const result = isLocalhost();
      
      // Assert
      expect(result).toBe(false);
    });
  });

  describe('logCacheEvent', () => {
    it('should log message to console', () => {
      // Arrange
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const testMessage = 'Test cache event message';
      
      // Act
      logCacheEvent(testMessage);
      
      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(testMessage);
      
      // Cleanup
      consoleLogSpy.mockRestore();
    });
  });
});
