/**
 * Service Worker Update Error Test
 * Tests specific edge cases around service worker update failures
 */
import { registerServiceWorker, setUpdateHandler } from '../serviceWorkerRegistration';

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
  let originalServiceWorker: unknown;
  let updateHandlerMock: jest.Mock;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let originalNodeEnv: "development" | "production" | "test" | undefined;
  let originalLocation: Location;
  
  beforeEach(() => {
    // Store original values
    originalServiceWorker = global.navigator.serviceWorker;
    originalNodeEnv = process.env.NODE_ENV as "development" | "production" | "test" | undefined;
    originalLocation = window.location;
    
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
    jest.replaceProperty(process.env, 'NODE_ENV', 'production');
    
    // Mock window.location using defineProperty
    const mockLocation = {
      hostname: 'example.com', // Not localhost
      port: '443',
      protocol: 'https:',
      href: 'https://example.com/',
      // Include other required properties
      search: '',
      pathname: '/',
      hash: '',
      origin: 'https://example.com',
      replace: jest.fn(),
      assign: jest.fn(),
      reload: jest.fn()
    };
    
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true
    });
  });
  
  afterEach(() => {
    // Restore original values
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: originalServiceWorker,
      configurable: true
    });
    
    // Restore NODE_ENV
    if (originalNodeEnv !== undefined) {
      jest.replaceProperty(process.env, 'NODE_ENV', originalNodeEnv);
    }
    
    // Restore window.location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
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
  
  it('should handle various error types in a type-safe manner', async () => {
    // Test case 1: Error object with message property
    mockRegistration.update.mockImplementationOnce(() => 
      Promise.reject(new Error('Standard error with message property'))
    );
    await registerServiceWorker();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Service worker update failed', expect.any(Error));
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Test case 2: String error
    mockRegistration.update.mockImplementationOnce(() => 
      Promise.reject('String error without message property')
    );
    await registerServiceWorker();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Service worker update failed', 'String error without message property');
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Test case 3: Object error without message property
    const customError = { code: 123, details: 'Custom error object' };
    mockRegistration.update.mockImplementationOnce(() => 
      Promise.reject(customError)
    );
    await registerServiceWorker();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Service worker update failed', customError);
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Test case 4: null or undefined error (edge case)
    mockRegistration.update.mockImplementationOnce(() => 
      Promise.reject(null)
    );
    await registerServiceWorker();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Service worker update failed', null);
  });
  
  it('should retry failed updates for non-fetch errors', async () => {
    // Make all update attempts fail with a non-fetch related error
    const updateError = new Error('Some other error not related to fetching');
    mockRegistration.update.mockImplementation(() => Promise.reject(updateError));
    
    // Track setTimeout calls that would schedule retries
    let timeoutCalls = 0;
    
    // Properly mock setTimeout with correct type signature
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockSetTimeout = jest.fn().mockImplementation((cb: () => void, timeout: number) => {
      timeoutCalls++;
      cb(); // Execute callback immediately
      // Return a valid timeout object
      return { ref: () => {}, unref: () => {} } as unknown as NodeJS.Timeout;
    });
    
    // Use jest.spyOn instead of direct assignment
    jest.spyOn(global, 'setTimeout').mockImplementation(mockSetTimeout);
    
    await registerServiceWorker();
    
    // Restore setTimeout
    jest.spyOn(global, 'setTimeout').mockRestore();
    
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
    // Simulate development environment using jest.replaceProperty
    jest.replaceProperty(process.env, 'NODE_ENV', 'development');
    
    // Mock window.location to be localhost using defineProperty
    const mockDevLocation = {
      hostname: 'localhost',
      port: '3000',
      protocol: 'http:',
      href: 'http://localhost:3000/',
      // Include other required properties
      search: '',
      pathname: '/',
      hash: '',
      origin: 'http://localhost:3000',
      replace: jest.fn(),
      assign: jest.fn(),
      reload: jest.fn()
    };
    
    Object.defineProperty(window, 'location', {
      value: mockDevLocation,
      writable: true,
      configurable: true
    });
    
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
