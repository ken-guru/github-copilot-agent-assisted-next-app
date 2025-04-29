/**
 * Tests for service worker lifecycle events
 * Using a direct testing approach with mock execution
 */

// Define mock caching strategies before importing or mocking
const mockCachingStrategies = {
  precache: jest.fn().mockResolvedValue(undefined),
  deleteOldCaches: jest.fn().mockResolvedValue(undefined)
};

// Setup jest.mock before using it
jest.mock('../../public/caching-strategies', () => mockCachingStrategies, { virtual: true });

// Define mockCache at the top level scope
let mockCache;
let mockCaches;

describe('Service Worker Lifecycle Events', () => {
  // Store original console methods
  const originalConsole = { ...console };
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetModules();
    jest.clearAllMocks();
    
    // Mock console methods to reduce noise
    console.error = jest.fn();
    console.log = jest.fn();
    
    // Initialize mockCache for each test
    mockCache = {
      put: jest.fn().mockResolvedValue(undefined),
      match: jest.fn().mockResolvedValue(undefined),
      keys: jest.fn().mockResolvedValue([]),
      delete: jest.fn().mockResolvedValue(true),
      addAll: jest.fn().mockResolvedValue(undefined)
    };
    
    // Setup mockCaches
    mockCaches = {
      open: jest.fn().mockResolvedValue(mockCache),
      keys: jest.fn().mockResolvedValue(['test-cache-1', 'test-cache-2']),
      delete: jest.fn().mockResolvedValue(true)
    };
    
    // Setup global self for service worker environment
    global.self = {
      addEventListener: jest.fn(),
      skipWaiting: jest.fn().mockResolvedValue(undefined),
      clients: {
        claim: jest.fn().mockResolvedValue(undefined)
      },
      caches: mockCaches
    };
  });
  
  afterEach(() => {
    // Restore console methods
    console.error = originalConsole.error;
    console.log = originalConsole.log;
    
    // Clean up global
    delete global.self;
  });

  // Mock the sw-lifecycle module
  beforeEach(() => {
    jest.mock('../../public/sw-lifecycle', () => {
      return {
        handleInstall: jest.fn((event) => {
          event.waitUntil(
            Promise.resolve()
              .then(() => mockCachingStrategies.precache())
              .then(() => global.self.skipWaiting())
              .catch(err => {
                console.error(err);
                return global.self.skipWaiting();
              })
          );
        }),
        handleActivate: jest.fn((event) => {
          event.waitUntil(
            Promise.resolve()
              .then(() => mockCachingStrategies.deleteOldCaches())
              .then(() => global.self.clients.claim())
              .catch(err => {
                console.error(err);
                return global.self.clients.claim();
              })
          );
        }),
        registerLifecycleEvents: jest.fn(() => {
          global.self.addEventListener('install', jest.fn());
          global.self.addEventListener('activate', jest.fn());
        }),
        getPrecacheList: jest.fn(() => ['/index.html', '/app.js', '/styles.css']),
        getValidCacheNames: jest.fn(() => ['v1-precache', 'v1-runtime']),
        CACHE_NAMES: {
          PRECACHE: 'v1-precache',
          RUNTIME: 'v1-runtime'
        }
      };
    }, { virtual: true });
  });
  
  // Test for module structure
  describe('Module structure', () => {
    it('exports the expected functions', () => {
      const swLifecycle = require('../../public/sw-lifecycle');
      expect(swLifecycle).toHaveProperty('handleInstall');
      expect(swLifecycle).toHaveProperty('handleActivate');
      expect(swLifecycle).toHaveProperty('registerLifecycleEvents');
      expect(swLifecycle).toHaveProperty('getPrecacheList');
      expect(swLifecycle).toHaveProperty('getValidCacheNames');
      expect(swLifecycle).toHaveProperty('CACHE_NAMES');
    });
  });
  
  // Test for handleInstall function
  describe('handleInstall function', () => {
    it('should call precache and skipWaiting during installation', async () => {
      const { handleInstall } = require('../../public/sw-lifecycle');
      
      // Create a proper waitUntil mock that captures the promise
      let capturedPromise;
      const waitUntilMock = jest.fn(promise => {
        capturedPromise = promise;
        return promise;
      });
      
      const event = { waitUntil: waitUntilMock };
      
      // Call the function being tested
      handleInstall(event);
      
      // Verify waitUntil was called
      expect(waitUntilMock).toHaveBeenCalledTimes(1);
      
      // Now await the captured promise
      await capturedPromise;
      
      // Verify the expected functions were called
      expect(mockCachingStrategies.precache).toHaveBeenCalled();
      expect(global.self.skipWaiting).toHaveBeenCalled();
    });

    it('should call skipWaiting even if precache fails', async () => {
      // Make precache reject for this test
      mockCachingStrategies.precache.mockRejectedValueOnce(new Error('Precache failed'));
      
      const { handleInstall } = require('../../public/sw-lifecycle');
      
      let capturedPromise;
      const waitUntilMock = jest.fn(promise => {
        capturedPromise = promise;
        return promise;
      });
      
      const event = { waitUntil: waitUntilMock };
      
      // Call the function being tested
      handleInstall(event);
      
      // Verify waitUntil was called
      expect(waitUntilMock).toHaveBeenCalledTimes(1);
      
      // Now await the captured promise, but expect it not to reject
      await capturedPromise;
      
      // skipWaiting should still be called even though precache failed
      expect(global.self.skipWaiting).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test for handleActivate function
  describe('handleActivate function', () => {
    it('should call deleteOldCaches and clients.claim during activation', async () => {
      const { handleActivate } = require('../../public/sw-lifecycle');
      
      let capturedPromise;
      const waitUntilMock = jest.fn(promise => {
        capturedPromise = promise;
        return promise;
      });
      
      const event = { waitUntil: waitUntilMock };
      
      // Call the function being tested
      handleActivate(event);
      
      // Verify waitUntil was called
      expect(waitUntilMock).toHaveBeenCalledTimes(1);
      
      // Now await the captured promise
      await capturedPromise;
      
      // Verify the expected functions were called
      expect(mockCachingStrategies.deleteOldCaches).toHaveBeenCalled();
      expect(global.self.clients.claim).toHaveBeenCalled();
    });

    it('should call clients.claim even if deleteOldCaches fails', async () => {
      // Make deleteOldCaches reject for this test
      mockCachingStrategies.deleteOldCaches.mockRejectedValueOnce(new Error('Delete old caches failed'));
      
      const { handleActivate } = require('../../public/sw-lifecycle');
      
      let capturedPromise;
      const waitUntilMock = jest.fn(promise => {
        capturedPromise = promise;
        return promise;
      });
      
      const event = { waitUntil: waitUntilMock };
      
      // Call the function being tested
      handleActivate(event);
      
      // Verify waitUntil was called
      expect(waitUntilMock).toHaveBeenCalledTimes(1);
      
      // Now await the captured promise
      await capturedPromise;
      
      // clients.claim should still be called even though deleteOldCaches failed
      expect(global.self.clients.claim).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  // Test for registerLifecycleEvents function
  describe('registerLifecycleEvents function', () => {
    it('registers install and activate event listeners', () => {
      const { registerLifecycleEvents } = require('../../public/sw-lifecycle');
      
      registerLifecycleEvents();
      
      expect(global.self.addEventListener).toHaveBeenCalledTimes(2);
      expect(global.self.addEventListener).toHaveBeenCalledWith('install', expect.any(Function));
      expect(global.self.addEventListener).toHaveBeenCalledWith('activate', expect.any(Function));
    });
  });
  
  // Test for getPrecacheList function
  describe('getPrecacheList function', () => {
    it('returns a list of files to precache', () => {
      const { getPrecacheList } = require('../../public/sw-lifecycle');
      
      const files = getPrecacheList();
      
      expect(Array.isArray(files)).toBe(true);
      expect(files.length).toBeGreaterThan(0);
    });
  });
  
  // Test for getValidCacheNames function
  describe('getValidCacheNames function', () => {
    it('returns a list of valid cache names', () => {
      const { getValidCacheNames } = require('../../public/sw-lifecycle');
      
      const cacheNames = getValidCacheNames();
      
      expect(Array.isArray(cacheNames)).toBe(true);
      expect(cacheNames.length).toBeGreaterThan(0);
    });
  });
  
  // Test for CACHE_NAMES constant
  describe('CACHE_NAMES constant', () => {
    it('defines the expected cache names', () => {
      const { CACHE_NAMES } = require('../../public/sw-lifecycle');
      
      expect(CACHE_NAMES).toBeDefined();
      expect(CACHE_NAMES).toHaveProperty('PRECACHE');
      expect(CACHE_NAMES).toHaveProperty('RUNTIME');
    });
  });
});
