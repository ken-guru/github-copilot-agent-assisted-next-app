/**
 * Tests for service worker fetch handlers
 */
describe('Service Worker Fetch Handlers', () => {
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
  
  // Mock service worker caching strategies
  const mockCachingStrategies = {
    networkFirst: jest.fn(),
    cacheFirst: jest.fn(),
    staleWhileRevalidate: jest.fn(),
    cacheOnly: jest.fn(),
    networkOnly: jest.fn()
  };
  
  // Original globals
  const originalCaches = global.caches;
  const originalFetch = global.fetch;
  
  // Mock cache names
  const CACHE_NAMES = {
    STATIC: 'static-assets-v1',
    DYNAMIC: 'dynamic-content-v1',
    PAGES: 'pages-cache-v1',
    IMAGES: 'images-cache-v1',
    API: 'api-cache-v1',
    FONTS: 'fonts-cache-v1'
  };
  
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
        this.text = jest.fn().mockImplementation(() => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)));
        
        // Fix the JSON parsing for text responses
        this.json = jest.fn().mockImplementation(() => {
          if (typeof this.body === 'string') {
            try {
              return Promise.resolve(JSON.parse(this.body));
            } catch (e) {
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
    
    // Reset caching strategies mocks
    Object.keys(mockCachingStrategies).forEach(key => {
      mockCachingStrategies[key].mockReset();
      mockCachingStrategies[key].mockResolvedValue(new Response('Mocked strategy response'));
    });
    
    // Mock the caching strategies module
    jest.mock('../../../public/sw-cache-strategies', () => mockCachingStrategies);
    
    // Clear all mock statuses
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore original globals
    global.caches = originalCaches;
    global.fetch = originalFetch;
    
    if (!originalFetch) {
      delete global.Request;
      delete global.Response;
      delete global.Headers;
    }
    
    // Clear the jest mock for caching strategies
    jest.resetModules();
  });

  describe('handleFetch', () => {
    it('should route API requests to networkFirst strategy', async () => {
      // Import the module under test
      const { handleFetch } = require('../../../public/sw-fetch-handlers');
      
      // Set up an API request
      const request = new Request('/api/data');
      
      // Execute handler
      await handleFetch(request);
      
      // Verify the networkFirst strategy was used
      expect(mockCachingStrategies.networkFirst).toHaveBeenCalledWith(
        request,
        expect.stringContaining('api-cache')
      );
    });
    
    it('should route page navigation requests to networkFirst strategy', async () => {
      // Import the module under test
      const { handleFetch } = require('../../../public/sw-fetch-handlers');
      
      // Set up a navigation request with appropriate headers
      const request = new Request('/dashboard', {
        headers: { 'Accept': 'text/html' }
      });
      
      // Execute handler
      await handleFetch(request);
      
      // Verify the networkFirst strategy was used
      expect(mockCachingStrategies.networkFirst).toHaveBeenCalledWith(
        request,
        expect.stringContaining('pages-cache')
      );
    });
    
    it('should route static asset requests to cacheFirst strategy', async () => {
      // Import the module under test
      const { handleFetch } = require('../../../public/sw-fetch-handlers');
      
      // Set up a static asset request
      const request = new Request('/assets/logo.png');
      
      // Execute handler
      await handleFetch(request);
      
      // Verify the cacheFirst strategy was used
      expect(mockCachingStrategies.cacheFirst).toHaveBeenCalledWith(
        request,
        expect.stringContaining('static-assets')
      );
    });
    
    it('should route image requests to cacheFirst strategy', async () => {
      // Import the module under test
      const { handleFetch } = require('../../../public/sw-fetch-handlers');
      
      // Set up an image request
      const request = new Request('/images/profile.jpg');
      
      // Execute handler
      await handleFetch(request);
      
      // Verify the cacheFirst strategy was used
      expect(mockCachingStrategies.cacheFirst).toHaveBeenCalledWith(
        request,
        expect.stringContaining('images-cache')
      );
    });
    
    it('should route font requests to staleWhileRevalidate strategy', async () => {
      // Import the module under test
      const { handleFetch } = require('../../../public/sw-fetch-handlers');
      
      // Set up a font request
      const request = new Request('/fonts/roboto.woff2');
      
      // Execute handler
      await handleFetch(request);
      
      // Verify the staleWhileRevalidate strategy was used
      expect(mockCachingStrategies.staleWhileRevalidate).toHaveBeenCalledWith(
        request,
        expect.stringContaining('fonts-cache')
      );
    });
    
    it('should fall back to networkOnly for unmatched requests', async () => {
      // Import the module under test
      const { handleFetch } = require('../../../public/sw-fetch-handlers');
      
      // Set up an unmatched request
      const request = new Request('/some-other-path');
      
      // Execute handler
      await handleFetch(request);
      
      // Verify the networkOnly strategy was used
      expect(mockCachingStrategies.networkOnly).toHaveBeenCalledWith(request);
    });
    
    it('should handle errors gracefully', async () => {
      // Import the module under test
      const { handleFetch } = require('../../../public/sw-fetch-handlers');
      
      // Set up a request
      const request = new Request('/api/data');
      
      // Make networkFirst throw an error
      mockCachingStrategies.networkFirst.mockRejectedValueOnce(new Error('Network error'));
      
      // Should not throw when executing handler
      await expect(handleFetch(request)).resolves.not.toThrow();
      
      // Verify it tried to use the networkFirst strategy
      expect(mockCachingStrategies.networkFirst).toHaveBeenCalled();
    });
    
    it('should return a fallback offline response for HTML requests when all strategies fail', async () => {
      // Import the module under test
      const { handleFetch } = require('../../../public/sw-fetch-handlers');
      
      // Set up an HTML navigation request
      const request = new Request('/dashboard', {
        headers: { 'Accept': 'text/html' }
      });
      
      // Make networkFirst throw an error
      mockCachingStrategies.networkFirst.mockRejectedValueOnce(new Error('Network error'));
      
      // Execute handler
      const response = await handleFetch(request);
      
      // Verify it tried to use the networkFirst strategy
      expect(mockCachingStrategies.networkFirst).toHaveBeenCalled();
      
      // Check that we got a response with offline fallback content
      expect(response).toBeInstanceOf(Response);
      const text = await response.text();
      expect(text).toContain('offline');
    });
  });
  
  describe('isNavigationRequest', () => {
    it('should identify navigation requests correctly based on headers', async () => {
      // Import the module under test
      const { isNavigationRequest } = require('../../../public/sw-fetch-handlers');
      
      // Create a navigation request
      const navRequest = new Request('/page', {
        headers: { 'Accept': 'text/html' }
      });
      
      // Create a non-navigation request
      const apiRequest = new Request('/api/data', {
        headers: { 'Accept': 'application/json' }
      });
      
      // Test the function
      expect(isNavigationRequest(navRequest)).toBe(true);
      expect(isNavigationRequest(apiRequest)).toBe(false);
    });
    
    it('should identify navigation requests based on URL patterns', async () => {
      // Import the module under test
      const { isNavigationRequest } = require('../../../public/sw-fetch-handlers');
      
      // Create requests with different URL patterns
      const htmlRequest = new Request('/page.html');
      const jsRequest = new Request('/script.js');
      
      // Test the function
      expect(isNavigationRequest(htmlRequest)).toBe(true);
      expect(isNavigationRequest(jsRequest)).toBe(false);
    });
  });
  
  describe('isStaticAsset', () => {
    it('should identify static assets based on file extensions', async () => {
      // Import the module under test
      const { isStaticAsset } = require('../../../public/sw-fetch-handlers');
      
      // Create various requests
      const jsRequest = new Request('/assets/app.js');
      const cssRequest = new Request('/styles/main.css');
      const htmlRequest = new Request('/page.html');
      
      // Test the function
      expect(isStaticAsset(jsRequest)).toBe(true);
      expect(isStaticAsset(cssRequest)).toBe(true);
      expect(isStaticAsset(htmlRequest)).toBe(false); // HTML is not considered a static asset
    });
    
    it('should identify static assets based on URL patterns', async () => {
      // Import the module under test
      const { isStaticAsset } = require('../../../public/sw-fetch-handlers');
      
      // Create requests with specific paths
      const assetsRequest = new Request('/assets/logo.svg');
      const staticRequest = new Request('/static/icon.png');
      const apiRequest = new Request('/api/data');
      
      // Test the function
      expect(isStaticAsset(assetsRequest)).toBe(true);
      expect(isStaticAsset(staticRequest)).toBe(true);
      expect(isStaticAsset(apiRequest)).toBe(false);
    });
  });
  
  describe('isImageRequest', () => {
    it('should identify image requests based on file extensions', async () => {
      // Import the module under test
      const { isImageRequest } = require('../../../public/sw-fetch-handlers');
      
      // Create various requests
      const pngRequest = new Request('/images/logo.png');
      const jpgRequest = new Request('/user/avatar.jpg');
      const textRequest = new Request('/readme.txt');
      
      // Test the function
      expect(isImageRequest(pngRequest)).toBe(true);
      expect(isImageRequest(jpgRequest)).toBe(true);
      expect(isImageRequest(textRequest)).toBe(false);
    });
    
    it('should identify image requests based on URL patterns', async () => {
      // Import the module under test
      const { isImageRequest } = require('../../../public/sw-fetch-handlers');
      
      // Create requests with specific paths
      const imagesRequest = new Request('/images/header.webp');
      const profileRequest = new Request('/profile/1234/picture');
      const apiRequest = new Request('/api/data');
      
      // Test the function
      expect(isImageRequest(imagesRequest)).toBe(true);
      expect(isImageRequest(profileRequest)).toBe(true); // Assuming this matches our image pattern
      expect(isImageRequest(apiRequest)).toBe(false);
    });
  });
  
  describe('isApiRequest', () => {
    it('should identify API requests based on URL patterns', async () => {
      // Import the module under test
      const { isApiRequest } = require('../../../public/sw-fetch-handlers');
      
      // Create various requests
      const apiDataRequest = new Request('/api/data');
      const apiUsersRequest = new Request('/api/users/123');
      const pageRequest = new Request('/dashboard');
      
      // Test the function
      expect(isApiRequest(apiDataRequest)).toBe(true);
      expect(isApiRequest(apiUsersRequest)).toBe(true);
      expect(isApiRequest(pageRequest)).toBe(false);
    });
  });
  
  describe('isFontRequest', () => {
    it('should identify font requests based on file extensions', async () => {
      // Import the module under test
      const { isFontRequest } = require('../../../public/sw-fetch-handlers');
      
      // Create various requests
      const woffRequest = new Request('/fonts/roboto.woff');
      const woff2Request = new Request('/assets/fonts/opensans.woff2');
      const ttfRequest = new Request('/static/fonts/arial.ttf');
      const textRequest = new Request('/readme.txt');
      
      // Test the function
      expect(isFontRequest(woffRequest)).toBe(true);
      expect(isFontRequest(woff2Request)).toBe(true);
      expect(isFontRequest(ttfRequest)).toBe(true);
      expect(isFontRequest(textRequest)).toBe(false);
    });
    
    it('should identify font requests based on URL patterns', async () => {
      // Import the module under test
      const { isFontRequest } = require('../../../public/sw-fetch-handlers');
      
      // Create requests with specific paths
      const fontsRequest = new Request('/fonts/lato.otf');
      const googleFontRequest = new Request('https://fonts.googleapis.com/css?family=Roboto');
      const apiRequest = new Request('/api/data');
      
      // Test the function
      expect(isFontRequest(fontsRequest)).toBe(true);
      expect(isFontRequest(googleFontRequest)).toBe(true);
      expect(isFontRequest(apiRequest)).toBe(false);
    });
  });
});
