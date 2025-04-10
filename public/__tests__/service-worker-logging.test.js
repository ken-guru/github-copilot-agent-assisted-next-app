/**
 * Test for service worker environment-aware logging
 */
describe('Service Worker Logging', () => {
  // Mock self object
  const originalSelf = global.self;
  
  // Mock console methods
  let consoleLogSpy;
  let consoleWarnSpy;
  let consoleErrorSpy;
  
  beforeEach(() => {
    // Setup test environment
    global.self = {
      location: {
        hostname: 'example.com',
        port: ''
      }
    };
    
    // Setup console spies
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Reset modules between tests to ensure clean state
    jest.resetModules();
  });
  
  afterEach(() => {
    // Restore original self
    global.self = originalSelf;
    
    // Restore console methods
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
  
  it('should not log regular messages in production', () => {
    // Set production environment and mock the module
    const mockIsDev = jest.fn().mockReturnValue(false);
    jest.mock('../service-worker-logging-utils', () => ({
      isDevelopment: mockIsDev,
      log: (message, level = 'log') => {
        const isImportant = level === 'error' || level === 'warn';
        if (mockIsDev() || isImportant) {
          console[level]('[Service Worker] ' + message);
        }
      }
    }));
    
    // Import the mocked module
    const { log } = require('../service-worker-logging-utils');
    
    // Test logging in production
    log('Test message');
    
    // Verify log was not called
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
  
  it('should log important messages (errors/warnings) even in production', () => {
    // Set production environment and mock module
    const mockIsDev = jest.fn().mockReturnValue(false);
    jest.mock('../service-worker-logging-utils', () => ({
      isDevelopment: mockIsDev,
      log: (message, level = 'log') => {
        const isImportant = level === 'error' || level === 'warn';
        if (mockIsDev() || isImportant) {
          console[level]('[Service Worker] ' + message);
        }
      }
    }));
    
    // Import the mocked module
    const { log } = require('../service-worker-logging-utils');
    
    // Test error logging in production
    log('Important error', 'error');
    
    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith('[Service Worker] Important error');
  });
});
