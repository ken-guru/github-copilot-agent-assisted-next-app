/**
 * @jest-environment jsdom
 */

describe('CSS File Handling in Service Worker', () => {
  // Mock the fetch event
  const createFetchEvent = (url) => ({
    request: new Request(url),
    respondWith: jest.fn()
  });

  // Save original functions before mocking
  let originalFetch;
  let originalCacheMatch;
  let originalConsoleLog;

  beforeEach(() => {
    // Mock console to prevent logs during tests
    originalConsoleLog = console.log;
    console.log = jest.fn();
    
    // Save original fetch
    originalFetch = global.fetch;
    
    // Mock caches API
    global.caches = {
      match: jest.fn(),
      open: jest.fn().mockResolvedValue({
        match: jest.fn(),
        put: jest.fn()
      })
    };

    // Reset all mocks
    jest.resetAllMocks();
  });

  afterEach(() => {
    // Restore original functions
    global.fetch = originalFetch;
    console.log = originalConsoleLog;
  });

  test('CSS files in development mode should always fetch from network first', async () => {
    // Import service worker functions - need to use dynamic import to reset module state
    const serviceWorkerModule = await import('../../public/service-worker.js');
    
    // Mock isDevelopment to return true
    serviceWorkerModule.swUtils = {
      isDevelopment: () => true,
      log: jest.fn()
    };
    
    // Create a CSS request
    const cssRequest = new Request('https://localhost:3000/styles.css');
    const fetchEvent = { request: cssRequest, respondWith: jest.fn() };
    
    // Mock successful network response
    global.fetch = jest.fn().mockResolvedValue(new Response('/* CSS content */'));
    
    // Trigger fetch event handler
    const fetchHandler = self.listeners.get('fetch');
    await fetchHandler(fetchEvent);
    
    // Verify network was called first, before checking cache
    expect(global.fetch).toHaveBeenCalledWith(cssRequest);
    expect(global.caches.match).not.toHaveBeenCalled();
    
    // Verify the response was from network, not cache
    const responseCallback = fetchEvent.respondWith.mock.calls[0][0];
    const response = await responseCallback;
    expect(response.bodyUsed).toBe(false);
  });

  test('CSS file in development should bypass cache even if cached version exists', async () => {
    // Import service worker functions
    const serviceWorkerModule = await import('../../public/service-worker.js');
    
    // Force development mode
    serviceWorkerModule.swUtils = {
      isDevelopment: () => true,
      log: jest.fn()
    };
    
    // Setup cache to return a response
    const cachedResponse = new Response('/* Cached CSS */');
    global.caches.match = jest.fn().mockResolvedValue(cachedResponse);
    
    // Mock network response with different content
    const networkResponse = new Response('/* Fresh CSS */');
    global.fetch = jest.fn().mockResolvedValue(networkResponse);
    
    // Create a CSS request and event
    const cssRequest = new Request('https://localhost:3000/component.module.css');
    const fetchEvent = { request: cssRequest, respondWith: jest.fn() };
    
    // Trigger fetch event handler
    const fetchHandler = self.listeners.get('fetch');
    await fetchHandler(fetchEvent);
    
    // Verify network was tried first
    expect(global.fetch).toHaveBeenCalledWith(cssRequest);
    
    // Verify we got the network response, not the cached one
    const responseCallback = fetchEvent.respondWith.mock.calls[0][0];
    const response = await responseCallback;
    const text = await response.clone().text();
    expect(text).toBe('/* Fresh CSS */');
  });
});
