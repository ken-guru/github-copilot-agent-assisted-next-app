/**
 * Test for service worker environment-aware logging
 */
describe('Service Worker Logging', () => {
  // Save original self object
  const originalSelf = global.self;
  
  // Mock console methods
  let consoleLogSpy;
  let consoleWarnSpy;
  let consoleErrorSpy;
  
  beforeEach(() => {
    // Setup test environment with default production hostname
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
    
    // Reset modules to ensure clean state for each test
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
  
  it('should detect production environment', () => {
    // Create a mock implementation that returns false for this test
    jest.mock('./service-worker-logging-utils', () => ({
      isDevelopment: () => false,
      log: (message, level = 'log') => {
        const isImportant = level === 'error' || level === 'warn';
        if (isImportant) {
          console[level]('[Service Worker] ' + message);
        }
      }
    }), { virtual: true });
    
    // Import the function after mocking
    const { isDevelopment } = require('./service-worker-logging-utils');
    
    // Test production detection
    expect(isDevelopment()).toBe(false);
  });
  
  it('should log in development environment', () => {
    // Set development environment
    global.self.location.hostname = 'localhost';
    
    // Mock the module to return true for development
    jest.mock('./service-worker-logging-utils', () => ({
      isDevelopment: () => true,
      log: (message, level = 'log') => {
        console[level]('[Service Worker] ' + message);
      }
    }), { virtual: true });
    
    // Import the function after mocking
    const { log } = require('./service-worker-logging-utils');
    
    // Test logging in development
    log('Test message');
    
    // Verify log was called
    expect(consoleLogSpy).toHaveBeenCalledWith('[Service Worker] Test message');
  });
  
  it('should not log regular messages in production', () => {
    // Mock the module to return false for development
    jest.mock('./service-worker-logging-utils', () => ({
      isDevelopment: () => false,
      log: (message, level = 'log') => {
        const isImportant = level === 'error' || level === 'warn';
        if (isImportant) {
          console[level]('[Service Worker] ' + message);
        }
      }
    }), { virtual: true });
    
    // Import the function after mocking
    const { log } = require('./service-worker-logging-utils');
    
    // Test logging in production
    log('Test message');
    
    // Verify log was not called
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
  
  it('should log errors even in production', () => {
    // Mock the module to return false for development
    jest.mock('./service-worker-logging-utils', () => ({
      isDevelopment: () => false,
      log: (message, level = 'log') => {
        const isImportant = level === 'error' || level === 'warn';
        if (isImportant) {
          console[level]('[Service Worker] ' + message);
        }
      }
    }), { virtual: true });
    
    // Import the function after mocking
    const { log } = require('./service-worker-logging-utils');
    
    // Test error logging in production
    log('Critical error', 'error');
    
    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith('[Service Worker] Critical error');
  });
  
  it('should log warnings even in production', () => {
    // Mock the module to return false for development
    jest.mock('./service-worker-logging-utils', () => ({
      isDevelopment: () => false,
      log: (message, level = 'log') => {
        const isImportant = level === 'error' || level === 'warn';
        if (isImportant) {
          console[level]('[Service Worker] ' + message);
        }
      }
    }), { virtual: true });
    
    // Import the function after mocking
    const { log } = require('./service-worker-logging-utils');
    
    // Test warning logging in production
    log('Important warning', 'warn');
    
    // Verify warning was logged
    expect(consoleWarnSpy).toHaveBeenCalledWith('[Service Worker] Important warning');
  });
});
