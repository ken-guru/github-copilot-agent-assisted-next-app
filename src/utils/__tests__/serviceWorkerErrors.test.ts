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
    it('should delegate to isHostnameLocalhost with current hostname', () => {
      // Since we import the function directly, we can't easily spy on it
      // Instead, we verify the behavior by testing the integration
      const currentHostname = window.location.hostname;
      const expectedResult = isHostnameLocalhost(currentHostname);
      const actualResult = isLocalhost();
      
      // Verify that isLocalhost returns the same result as calling isHostnameLocalhost 
      // with the current hostname, proving delegation works correctly
      expect(actualResult).toBe(expectedResult);
      
      // Verify result is a boolean
      expect(typeof actualResult).toBe('boolean');
    });

    it('should return correct boolean value based on hostname logic', () => {
      // Test the integration by verifying isLocalhost returns a boolean
      // and that it's consistent with the hostname checking logic
      const result = isLocalhost();
      const currentHostname = window.location.hostname;
      
      expect(typeof result).toBe('boolean');
      
      // Verify that the result matches what we'd expect from the hostname
      if (currentHostname === 'localhost' || 
          currentHostname === '[::1]' || 
          /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(currentHostname)) {
        expect(result).toBe(true);
      } else {
        expect(result).toBe(false);
      }
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
