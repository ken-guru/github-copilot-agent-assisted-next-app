/**
 * Test for service worker environment-aware logging
 */
describe('Service Worker Logging', () => {
  // Mock console methods
  let consoleLogSpy;
  let consoleWarnSpy;
  let consoleErrorSpy;
  
  beforeEach(() => {
    // Setup console spies
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore console methods
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
  
  it('should log in development environment', () => {
    // Create mock self with development environment
    global.self = {
      ENVIRONMENT: 'development',
      location: { hostname: 'localhost' }
    };
    
    // Import the log function from service worker
    const { log } = require('../service-worker-logging-util');
    
    // Test logging in development
    log('Test message');
    
    // Verify log was called
    expect(consoleLogSpy).toHaveBeenCalledWith('[Service Worker] Test message');
  });
  
  it('should not log regular messages in production', () => {
    // Create mock self with production environment
    global.self = {
      ENVIRONMENT: 'production',
      location: { hostname: 'example.com' }
    };
    
    // Import the log function from service worker
    const { log } = require('../service-worker-logging-util');
    
    // Test logging in production
    log('Test message');
    
    // Verify log was not called
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
  
  it('should log important messages (errors/warnings) even in production', () => {
    // Create mock self with production environment
    global.self = {
      ENVIRONMENT: 'production',
      location: { hostname: 'example.com' }
    };
    
    // Import the log function from service worker
    const { log } = require('../service-worker-logging-util');
    
    // Test error logging in production
    log('Important error', 'error');
    
    // Verify error was logged even in production
    expect(consoleErrorSpy).toHaveBeenCalledWith('[Service Worker] Important error');
  });
  
  it('should detect development environment based on hostname', () => {
    // Create mock self without explicit ENVIRONMENT
    global.self = {
      location: { hostname: 'localhost', port: '3000' }
    };
    
    // Import the log function from service worker
    const { log } = require('../service-worker-logging-util');
    
    // Test logging with implicit development environment
    log('Local development message');
    
    // Verify log was called (detected development environment)
    expect(consoleLogSpy).toHaveBeenCalledWith('[Service Worker] Local development message');
  });
});
