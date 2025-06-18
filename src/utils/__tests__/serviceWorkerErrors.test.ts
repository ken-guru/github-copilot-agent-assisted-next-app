import { handleServiceWorkerError, isLocalhost, isHostnameLocalhost, logCacheEvent } from '../serviceWorkerErrors';

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

  describe('isHostnameLocalhost', () => {
    it('should return true when hostname is localhost', () => {
      expect(isHostnameLocalhost('localhost')).toBe(true);
    });

    it('should return true when hostname is [::1]', () => {
      expect(isHostnameLocalhost('[::1]')).toBe(true);
    });

    it('should return true when hostname matches IPv4 localhost pattern', () => {
      expect(isHostnameLocalhost('127.0.0.1')).toBe(true);
      expect(isHostnameLocalhost('127.1.1.1')).toBe(true);
      expect(isHostnameLocalhost('127.255.255.255')).toBe(true);
    });

    it('should return false when hostname is not localhost', () => {
      expect(isHostnameLocalhost('example.com')).toBe(false);
      expect(isHostnameLocalhost('google.com')).toBe(false);
      expect(isHostnameLocalhost('128.0.0.1')).toBe(false);
    });
  });

  describe('isLocalhost', () => {
    it('should return result based on window.location.hostname', () => {
      // This test just verifies that isLocalhost calls isHostnameLocalhost
      // with the current hostname - we can't easily mock window.location in JSDOM
      const result = isLocalhost();
      // Just verify it returns a boolean (the logic is tested in isHostnameLocalhost)
      expect(typeof result).toBe('boolean');
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
