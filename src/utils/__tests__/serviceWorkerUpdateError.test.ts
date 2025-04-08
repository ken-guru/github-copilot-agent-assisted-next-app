/**
 * Service Worker Update Error Test
 * Tests specific edge cases around service worker update failures
 */
import { registerServiceWorker, unregisterServiceWorker, setUpdateHandler } from '../serviceWorkerRegistration';

// Mock for service worker registration
const mockRegistration = {
  update: jest.fn().mockImplementation(() => Promise.resolve()),
  addEventListener: jest.fn(),
  installing: { 
    addEventListener: jest.fn(),
    state: 'installed'
  }
};

// Mock for serviceWorker namespace
const mockServiceWorker = {
  register: jest.fn().mockImplementation(() => Promise.resolve(mockRegistration)),
  controller: {},
  getRegistration: jest.fn().mockImplementation(() => Promise.resolve(mockRegistration))
};

describe('Service Worker Update Error Handling', () => {
  let originalServiceWorker: any;
  let updateHandlerMock: jest.Mock;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  
  beforeEach(() => {
    // Store original navigator.serviceWorker
    originalServiceWorker = global.navigator.serviceWorker;
    
    // Mock navigator.serviceWorker
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: mockServiceWorker,
      configurable: true
    });
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Create update handler mock
    updateHandlerMock = jest.fn();
    setUpdateHandler(updateHandlerMock);
    
    // Make sure fetch is available globally
    if (!global.fetch) {
      global.fetch = jest.fn().mockImplementation(() => 
        Promise.resolve({
          ok: true,
          clone: () => ({ ok: true }),
          status: 200
        })
      );
    }
    
    // Mock console methods to capture logs
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Set up environment for non-development by default
    process.env.NODE_ENV = 'production';
    
    // Mock window.location
    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = {
      hostname: 'example.com', // Not localhost
      port: '443',
      protocol: 'https:',
      href: 'https://example.com/'
    };
  });
  
  afterEach(() => {
    // Restore original navigator.serviceWorker
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: originalServiceWorker,
      configurable: true
    });
    
    // Clear update handler
    setUpdateHandler(null);
    
    // Restore console methods
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('should handle service worker registration properly', async () => {
    await registerServiceWorker();
    
    // Now expects options object with scope
    expect(mockServiceWorker.register).toHaveBeenCalledWith('/service-worker.js', {
      scope: '/'
    });
    expect(mockRegistration.update).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('Service worker registered');
  });
  
  it('should handle update failure with proper error logging', async () => {
    // Make update fail with a specific error
    const updateError = new TypeError('Failed to update a ServiceWorker: An unknown error occurred when fetching the script');
    mockRegistration.update.mockImplementationOnce(() => Promise.reject(updateError));
    
    await registerServiceWorker();
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('Service worker update failed', updateError);
    // Should also log warnings about MIME type/fetch issues
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('fetch or MIME type issues'));
  });
  
  it('should retry failed updates for non-fetch errors', async () => {
    // Make all update attempts fail with a non-fetch related error
    const updateError = new Error('Some other error not related to fetching');
    mockRegistration.update.mockImplementation(() => Promise.reject(updateError));
    
    // Track setTimeout calls that would schedule retries
    const originalSetTimeout = global.setTimeout;
    let timeoutCalls = 0;
    
    global.setTimeout = jest.fn().mockImplementation((cb: any) => {
      timeoutCalls++;
      cb(); // Execute callback immediately
      return 123 as any;
    });
    
    await registerServiceWorker();
    
    // Restore setTimeout to prevent affecting other tests
    global.setTimeout = originalSetTimeout;
    
    // Should call setTimeout for each retry (initial update + retry logic)
    // For our purposes, we're checking that retry logic was invoked
    expect(timeoutCalls).toBeGreaterThan(0);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Service worker update failed', updateError);
  });
  
  it('should adjust retry behavior when offline', async () => {
    // Mock navigator.onLine = false
    Object.defineProperty(global.navigator, 'onLine', {
      value: false,
      configurable: true
    });
    
    // Make update fail with a non-fetch related error to trigger retry
    mockRegistration.update.mockImplementationOnce(() => 
      Promise.reject(new Error('Some other error not related to fetching'))
    );
    
    // Spy on window.addEventListener before registration
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    
    await registerServiceWorker();
    
    // Should log about being offline
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Network is offline'));
    // Should set up online listener since offline
    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function), false);
  });
  
  it('should skip update in development mode with development URL', async () => {
    // Simulate development environment
    process.env.NODE_ENV = 'development';
    
    // Mock window.location to be localhost
    delete (window as any).location;
    (window as any).location = {
      hostname: 'localhost',
      port: '3000',
      protocol: 'http:',
      href: 'http://localhost:3000/'
    };
    
    await registerServiceWorker();
    
    // In dev mode with localhost, should log about skipping update
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Development environment detected'));
    
    // Should have registered but not updated
    expect(mockServiceWorker.register).toHaveBeenCalled();
    expect(mockRegistration.update).not.toHaveBeenCalled();
  });
  
  it('should handle update notification when new service worker installs', async () => {
    // Mock successful registration
    await registerServiceWorker();
    
    // Directly access the updatefound event handler
    const updateFoundHandler = mockRegistration.addEventListener.mock.calls.find(
      call => call[0] === 'updatefound'
    )?.[1];
    
    expect(updateFoundHandler).toBeDefined();
    
    // Mock the installing worker
    const mockInstallingWorker = {
      addEventListener: jest.fn(),
      state: 'installed'
    };
    
    // Update mockRegistration.installing to return our mock worker
    Object.defineProperty(mockRegistration, 'installing', {
      value: mockInstallingWorker
    });
    
    // Ensure controller exists for update notification
    Object.defineProperty(navigator.serviceWorker, 'controller', {
      value: {},
      configurable: true
    });
    
    // Manually trigger updatefound event by calling the handler
    if (updateFoundHandler) updateFoundHandler();
    
    // Should add statechange listener to the installing worker
    expect(mockInstallingWorker.addEventListener).toHaveBeenCalledWith(
      'statechange',
      expect.any(Function)
    );
    
    // Get the statechange handler
    const stateChangeHandler = mockInstallingWorker.addEventListener.mock.calls[0][1];
    
    // Trigger statechange event
    stateChangeHandler();
    
    // Verify update handler was called
    expect(updateHandlerMock).toHaveBeenCalledWith('A new version is available. Please refresh to update.');
  });
});
