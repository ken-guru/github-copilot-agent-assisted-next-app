/**
 * Extended tests for service worker caching strategies
 */
describe('Service Worker Cache Strategies', () => {
  // Mock cache implementation
  let mockCache;
  
  // Mock Cache API
  let mockCaches = {
    open: jest.fn().mockImplementation(() => Promise.resolve(mockCache)),
    match: jest.fn(),
    keys: jest.fn().mockResolvedValue([]),
    delete: jest.fn().mockResolvedValue(true)
  };
  
  // Mock fetch API
  let mockFetch;
  
  // Mock Response constructor (declared but not currently used)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockResponse;
  
  // Original globals
  const originalCaches = global.caches;
  const originalFetch = global.fetch;
  const originalResponse = global.Response;
  
  beforeEach(() => {
    // Create a fresh mock cache for each test
    mockCache = {
      put: jest.fn().mockResolvedValue(undefined),
      match: jest.fn().mockResolvedValue(undefined),
      keys: jest.fn().mockResolvedValue([]),
      delete: jest.fn().mockResolvedValue(true),
      addAll: jest.fn().mockResolvedValue(undefined)
    };
    
    // Define mock Response class before using it
    global.Response = class Response {
      constructor(body, options = {}) {
        this.body = body;
        this.status = options.status || 200;
        this.ok = this.status >= 200 && this.status < 300;
        this.headers = new Map(Object.entries(options.headers || {}));
        
        // Add common Response methods
        this.text = jest.fn().mockResolvedValue(typeof body === 'string' ? body : JSON.stringify(body));
        
        // Fix the JSON parsing for text responses - fixed syntax
        this.json = jest.fn().mockImplementation(() => {
          if (typeof this.body === 'string') {
            try {
              return Promise.resolve(JSON.parse(this.body));
            } catch {
              // If it's not valid JSON, return an empty object
              return Promise.resolve({});
            }
          }
          return Promise.resolve(this.body);
        });
        
        this.clone = jest.fn().mockImplementation(() => {
          const clone = new Response(this.body, {
            status: this.status,
            headers: Object.fromEntries(this.headers)
          });
          return clone;
        });
      }
    };
    
    // Define mock Request class that might be needed
    global.Request = class Request {
      constructor(input, options = {}) {
        this.url = typeof input === 'string' ? input : input.url;
        this.method = options.method || 'GET';
        this.headers = new Map(Object.entries(options.headers || {}));
      }
      
      clone() {
        return new Request(this.url, {
          method: this.method,
          headers: Object.fromEntries(this.headers)
        });
      }
    };
    
    // Set up fetch mock with default success response
    mockFetch = jest.fn().mockResolvedValue(new global.Response('Test response body'));
    global.fetch = mockFetch;
    
    // Set up caches
    global.caches = mockCaches;
    
    // Mock Headers class if needed
    global.Headers = class Headers extends Map {};
    
    // Clear all mock statuses
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore original globals
    global.caches = originalCaches;
    global.fetch = originalFetch;
    global.Response = originalResponse;
    
    // Also remove Request and Headers if they didn't exist before
    if (!originalResponse) {
      delete global.Request;
      delete global.Headers;
    }
  });
  
  describe('cachingStrategies.networkFirst', () => {
    it('should try network first, then fall back to cache', async () => {
      // Import the module under test
      const { networkFirst } = require('../../../public/sw-cache-strategies');
      
      // Set up the request and cache key
      const request = new global.Request('/test-network-first');
      const cacheKey = 'test-cache';
      
      // Mock network success
      mockFetch.mockResolvedValueOnce(new global.Response('Network response'));
      
      // Execute strategy
      const response = await networkFirst(request, cacheKey);
      
      // Verify network was tried
      expect(mockFetch).toHaveBeenCalledWith(request);
      
      // Verify response from network was cached
      expect(mockCaches.open).toHaveBeenCalledWith(cacheKey);
      expect(mockCache.put).toHaveBeenCalled();
      
      // Verify we got the network response
      expect(await response.text()).toBe('Network response');
    });
    
    it('should fall back to cache when network fails', async () => {
      // Import the module under test
      const { networkFirst } = require('../../../public/sw-cache-strategies');
      
      // Set up the request and cache key
      const request = new global.Request('/test-network-first');
      const cacheKey = 'test-cache';
      
      // Mock network failure
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Mock cache hit
      const cachedResponse = new global.Response('Cached response');
      mockCache.match.mockResolvedValueOnce(cachedResponse);
      
      // Execute strategy
      const response = await networkFirst(request, cacheKey);
      
      // Verify network was tried
      expect(mockFetch).toHaveBeenCalledWith(request);
      
      // Verify cache was checked
      expect(mockCaches.open).toHaveBeenCalledWith(cacheKey);
      expect(mockCache.match).toHaveBeenCalledWith(request);
      
      // Verify we got the cached response
      expect(response).toBe(cachedResponse);
    });
    
    it('should throw if both network and cache fail', async () => {
      // Import the module under test
      const { networkFirst } = require('../../../public/sw-cache-strategies');
      
      // Set up the request and cache key
      const request = new global.Request('/test-network-first');
      const cacheKey = 'test-cache';
      
      // Mock network failure
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Mock cache miss
      mockCache.match.mockResolvedValueOnce(undefined);
      
      // Execute strategy and expect it to throw
      await expect(networkFirst(request, cacheKey))
        .rejects.toThrow('NetworkFirst: Both network and cache failed');
    });
  });
  
  describe('cachingStrategies.cacheFirst', () => {
    it('should try cache first, then fall back to network', async () => {
      // Import the module under test
      const { cacheFirst } = require('../../../public/sw-cache-strategies');
      
      // Set up the request and cache key
      const request = new global.Request('/test-cache-first');
      const cacheKey = 'test-cache';
      
      // Mock cache hit
      const cachedResponse = new global.Response('Cached response');
      mockCache.match.mockResolvedValueOnce(cachedResponse);
      
      // Execute strategy
      const response = await cacheFirst(request, cacheKey);
      
      // Verify cache was checked first
      expect(mockCaches.open).toHaveBeenCalledWith(cacheKey);
      expect(mockCache.match).toHaveBeenCalledWith(request);
      
      // Verify network was not tried
      expect(mockFetch).not.toHaveBeenCalled();
      
      // Verify we got the cached response
      expect(response).toBe(cachedResponse);
    });
    
    it('should fall back to network when cache misses', async () => {
      // Import the module under test
      const { cacheFirst } = require('../../../public/sw-cache-strategies');
      
      // Set up the request and cache key
      const request = new global.Request('/test-cache-first');
      const cacheKey = 'test-cache';
      
      // Mock cache miss
      mockCache.match.mockResolvedValueOnce(undefined);
      
      // Mock network success
      const networkResponse = new global.Response('Network response');
      mockFetch.mockResolvedValueOnce(networkResponse);
      
      // Execute strategy
      const response = await cacheFirst(request, cacheKey);
      
      // Verify cache was checked first
      expect(mockCaches.open).toHaveBeenCalledWith(cacheKey);
      expect(mockCache.match).toHaveBeenCalledWith(request);
      
      // Verify network was tried as fallback
      expect(mockFetch).toHaveBeenCalledWith(request);
      
      // Verify response was cached
      expect(mockCache.put).toHaveBeenCalled();
      
      // Verify we got the network response
      expect(await response.text()).toBe('Network response');
    });
  });
  
  describe('cachingStrategies.staleWhileRevalidate', () => {
    it('should return cached response and update cache in background', async () => {
      // Import the module under test
      const { staleWhileRevalidate } = require('../../../public/sw-cache-strategies');
      
      // Set up the request and cache key
      const request = new global.Request('/test-stale-while-revalidate');
      const cacheKey = 'test-cache';
      
      // Mock cache hit
      const cachedResponse = new global.Response('Cached response');
      mockCache.match.mockResolvedValueOnce(cachedResponse);
      
      // Mock network success
      mockFetch.mockResolvedValueOnce(new global.Response('Fresh network response'));
      
      // Execute strategy
      const response = await staleWhileRevalidate(request, cacheKey);
      
      // Verify cache was checked
      expect(mockCaches.open).toHaveBeenCalledWith(cacheKey);
      expect(mockCache.match).toHaveBeenCalledWith(request);
      
      // Verify we immediately got the cached response
      expect(response).toBe(cachedResponse);
      
      // Let any promises resolve
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Verify network was tried in background
      expect(mockFetch).toHaveBeenCalledWith(request);
      
      // Verify cache was updated with new response
      expect(mockCache.put).toHaveBeenCalled();
    });
    
    it('should fetch from network when cache misses', async () => {
      // Import the module under test
      const { staleWhileRevalidate } = require('../../../public/sw-cache-strategies');
      
      // Set up the request and cache key
      const request = new global.Request('/test-stale-while-revalidate');
      const cacheKey = 'test-cache';
      
      // Mock cache miss
      mockCache.match.mockResolvedValueOnce(undefined);
      
      // Mock network success
      const networkResponse = new global.Response('Network response');
      mockFetch.mockResolvedValueOnce(networkResponse);
      
      // Execute strategy
      const response = await staleWhileRevalidate(request, cacheKey);
      
      // Verify cache was checked
      expect(mockCaches.open).toHaveBeenCalledWith(cacheKey);
      expect(mockCache.match).toHaveBeenCalledWith(request);
      
      // Verify network was tried
      expect(mockFetch).toHaveBeenCalledWith(request);
      
      // Verify we got the network response
      expect(await response.text()).toBe('Network response');
      
      // Verify cache was updated
      expect(mockCache.put).toHaveBeenCalled();
    });
  });
  
  describe('cachingStrategies.cacheOnly', () => {
    it('should return cached response or throw', async () => {
      // Import the module under test
      const { cacheOnly } = require('../../../public/sw-cache-strategies');
      
      // Set up the request and cache key
      const request = new global.Request('/test-cache-only');
      const cacheKey = 'test-cache';
      
      // Mock cache hit
      const cachedResponse = new global.Response('Cached response');
      mockCache.match.mockResolvedValueOnce(cachedResponse);
      
      // Execute strategy
      const response = await cacheOnly(request, cacheKey);
      
      // Verify cache was checked
      expect(mockCaches.open).toHaveBeenCalledWith(cacheKey);
      expect(mockCache.match).toHaveBeenCalledWith(request);
      
      // Verify network was not tried
      expect(mockFetch).not.toHaveBeenCalled();
      
      // Verify we got the cached response
      expect(response).toBe(cachedResponse);
    });
    
    it('should throw if cache misses', async () => {
      // Import the module under test
      const { cacheOnly } = require('../../../public/sw-cache-strategies');
      
      // Set up the request and cache key
      const request = new global.Request('/test-cache-only');
      const cacheKey = 'test-cache';
      
      // Mock cache miss
      mockCache.match.mockResolvedValueOnce(undefined);
      
      // Execute strategy and expect it to throw
      await expect(cacheOnly(request, cacheKey))
        .rejects.toThrow('CacheOnly: Cache miss');
    });
  });
  
  describe('cachingStrategies.networkOnly', () => {
    it('should fetch from network only', async () => {
      // Import the module under test
      const { networkOnly } = require('../../../public/sw-cache-strategies');
      
      // Set up the request
      const request = new global.Request('/test-network-only');
      
      // Mock network success
      const networkResponse = new global.Response('Network response');
      mockFetch.mockResolvedValueOnce(networkResponse);
      
      // Execute strategy
      const response = await networkOnly(request);
      
      // Verify network was tried
      expect(mockFetch).toHaveBeenCalledWith(request);
      
      // Verify cache was not used
      expect(mockCaches.open).not.toHaveBeenCalled();
      
      // Verify we got the network response
      expect(await response.text()).toBe('Network response');
    });
    
    it('should throw if network fails', async () => {
      // Import the module under test
      const { networkOnly } = require('../../../public/sw-cache-strategies');
      
      // Set up the request
      const request = new global.Request('/test-network-only');
      
      // Mock network failure
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Execute strategy and expect it to throw
      await expect(networkOnly(request))
        .rejects.toThrow('NetworkOnly: Network error');
    });
  });
});
