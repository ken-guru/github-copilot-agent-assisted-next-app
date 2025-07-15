/**
 * Creates a waitUntil mock that properly captures and returns the passed promise
 * @returns {Object} An object with waitUntilMock and methods to access the captured promise
 */
function createWaitUntilMock() {
  let capturedPromise;
  const waitUntilMock = jest.fn(promise => {
    capturedPromise = promise;
    return promise;
  });
  
  return {
    waitUntilMock,
    getCapturedPromise: () => capturedPromise,
    executeCapturedPromise: async () => await capturedPromise
  };
}

/**
 * Creates mock cache objects for service worker tests
 * @returns {Object} An object with mockCache and mockCaches
 */
function createMockCaches() {
  const mockCache = {
    put: jest.fn().mockResolvedValue(undefined),
    match: jest.fn().mockResolvedValue(undefined),
    keys: jest.fn().mockResolvedValue([]),
    delete: jest.fn().mockResolvedValue(true),
    addAll: jest.fn().mockResolvedValue(undefined)
  };
  
  const mockCaches = {
    open: jest.fn().mockResolvedValue(mockCache),
    keys: jest.fn().mockResolvedValue(['test-cache-1', 'test-cache-2']),
    delete: jest.fn().mockResolvedValue(true)
  };
  
  return {
    mockCache,
    mockCaches
  };
}

/**
 * Sets up the global service worker environment for tests
 * @param {Object} options - Configuration options for the mock environment
 * @returns {Object} The mock objects and cleanup function
 */
function setupServiceWorkerEnv(options = {}) {
  const { mockCache, mockCaches } = createMockCaches();
  
  // Setup global self for service worker environment
  global.self = {
    addEventListener: jest.fn(),
    skipWaiting: jest.fn().mockResolvedValue(undefined),
    clients: {
      claim: jest.fn().mockResolvedValue(undefined)
    },
    caches: mockCaches,
    ...options
  };
  
  const cleanup = () => {
    delete global.self;
  };
  
  return {
    mockCache,
    mockCaches,
    cleanup
  };
}

module.exports = {
  createWaitUntilMock,
  createMockCaches,
  setupServiceWorkerEnv
};
