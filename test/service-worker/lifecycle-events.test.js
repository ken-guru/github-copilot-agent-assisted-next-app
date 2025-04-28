/**
 * Tests for service worker lifecycle events
 * Using a direct testing approach with mock execution
 */

// First, let's create our mock implementation for sw-cache-strategies
const mockCachingStrategies = {
  precache: jest.fn().mockResolvedValue(undefined),
  deleteOldCaches: jest.fn().mockResolvedValue(undefined)
};

// Mock the module before any imports happen
jest.mock('../../public/sw-cache-strategies', () => mockCachingStrategies);

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
  });
  
  afterEach(() => {
    // Restore console methods
    console.error = originalConsole.error;
    console.log = originalConsole.log;
    
    // Clean up global
    delete global.self;
  });

  describe('Module structure', () => {
    it('exports the expected functions', () => {
      // Import the module
      const lifecycleModule = require('../../public/sw-lifecycle');
      
      // Verify exported functions exist
      expect(typeof lifecycleModule.handleInstall).toBe('function');
      expect(typeof lifecycleModule.handleActivate).toBe('function');
      expect(typeof lifecycleModule.registerLifecycleEvents).toBe('function');
      expect(typeof lifecycleModule.getPrecacheList).toBe('function');
      expect(typeof lifecycleModule.getValidCacheNames).toBe('function');
    });
  });

  describe('handleInstall function', () => {
    it('should call precache and skipWaiting during installation', async () => {
      // Create specific mocks needed by this test
      const skipWaitingMock = jest.fn().mockResolvedValue(undefined);
      
      // Set up global self for the module
      global.self = {
        skipWaiting: skipWaitingMock
      };
      
      // Now import the module
      const { handleInstall } = require('../../public/sw-lifecycle');
      
      // Mock the waitUntil function
      const waitUntilMock = jest.fn();
      const event = { waitUntil: waitUntilMock };
      
      // Call the function being tested
      handleInstall(event);
      
      // Verify waitUntil was called
      expect(waitUntilMock).toHaveBeenCalledTimes(1);
      
      // Extract the function passed to waitUntil
      const iife = waitUntilMock.mock.calls[0][0];
      
      // Execute the function passed to waitUntil
      await iife;
      
      // Verify the expected functions were called
      expect(mockCachingStrategies.precache).toHaveBeenCalled();
      expect(skipWaitingMock).toHaveBeenCalled();
    });
    
    it('should call skipWaiting even if precache fails', async () => {
      // Create specific mocks needed by this test
      const skipWaitingMock = jest.fn().mockResolvedValue(undefined);
      
      // Set up global self for the module
      global.self = {
        skipWaiting: skipWaitingMock
      };
      
      // Make precache throw an error
      mockCachingStrategies.precache.mockRejectedValueOnce(new Error('Test error'));
      
      // Import the module
      const { handleInstall } = require('../../public/sw-lifecycle');
      
      // Create mock event with waitUntil
      const waitUntilMock = jest.fn(promise => promise);
      const event = { waitUntil: waitUntilMock };
      
      // Call handleInstall
      handleInstall(event);
      
      // Get the promise passed to waitUntil
      const promiseFromWaitUntil = waitUntilMock.mock.calls[0][0];
      
      // Execute the promise - should not throw
      await promiseFromWaitUntil;
      
      // Verify skipWaiting was still called
      expect(skipWaitingMock).toHaveBeenCalled();
      
      // Also verify that console.error was called for the error
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('handleActivate function', () => {
    it('should call deleteOldCaches and clients.claim during activation', async () => {
      // Create specific mocks needed by this test
      const claimMock = jest.fn().mockResolvedValue(undefined);
      
      // Set up global self for the module
      global.self = {
        clients: { claim: claimMock }
      };
      
      // Now import the module
      const { handleActivate } = require('../../public/sw-lifecycle');
      
      // Mock the waitUntil function
      const waitUntilMock = jest.fn();
      const event = { waitUntil: waitUntilMock };
      
      // Call the function being tested
      handleActivate(event);
      
      // Verify waitUntil was called
      expect(waitUntilMock).toHaveBeenCalledTimes(1);
      
      // Extract the function passed to waitUntil
      const iife = waitUntilMock.mock.calls[0][0];
      
      // Execute the function passed to waitUntil
      await iife;
      
      // Verify the expected functions were called
      expect(mockCachingStrategies.deleteOldCaches).toHaveBeenCalled();
      expect(claimMock).toHaveBeenCalled();
    });
    
    it('should call clients.claim even if deleteOldCaches fails', async () => {
      // Create specific mocks needed by this test
      const claimMock = jest.fn().mockResolvedValue(undefined);
      
      // Set up global self for the module
      global.self = {
        clients: { claim: claimMock }
      };
      
      // Make deleteOldCaches throw an error
      mockCachingStrategies.deleteOldCaches.mockRejectedValueOnce(new Error('Test error'));
      
      // Import the module
      const { handleActivate } = require('../../public/sw-lifecycle');
      
      // Create mock event with waitUntil
      const waitUntilMock = jest.fn(promise => promise);
      const event = { waitUntil: waitUntilMock };
      
      // Call handleActivate
      handleActivate(event);
      
      // Get the promise passed to waitUntil
      const promiseFromWaitUntil = waitUntilMock.mock.calls[0][0];
      
      // Execute the promise - should not throw
      await promiseFromWaitUntil;
      
      // Verify clients.claim was still called
      expect(claimMock).toHaveBeenCalled();
      
      // Also verify that console.error was called for the error
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('registerLifecycleEvents function', () => {
    it('registers install and activate event listeners', () => {
      // Mock addEventListener
      const addEventListenerMock = jest.fn();
      
      // Set up global self
      global.self = { 
        addEventListener: addEventListenerMock 
      };
      
      // Import the module
      const { registerLifecycleEvents, handleInstall, handleActivate } = require('../../public/sw-lifecycle');
      
      // Call the function
      registerLifecycleEvents();
      
      // Verify addEventListener was called with the correct event types and handlers
      expect(addEventListenerMock).toHaveBeenCalledTimes(2);
      expect(addEventListenerMock).toHaveBeenCalledWith('install', handleInstall);
      expect(addEventListenerMock).toHaveBeenCalledWith('activate', handleActivate);
    });
  });
  
  describe('getPrecacheList function', () => {
    it('returns a list of files to precache', () => {
      // Import the module
      const { getPrecacheList } = require('../../public/sw-lifecycle');
      
      // Call the function
      const result = getPrecacheList();
      
      // Verify it returns an array of strings
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(typeof result[0]).toBe('string');
    });
  });
  
  describe('getValidCacheNames function', () => {
    it('returns a list of valid cache names', () => {
      // Import the module
      const { getValidCacheNames, CACHE_NAMES } = require('../../public/sw-lifecycle');
      
      // Call the function
      const result = getValidCacheNames();
      
      // Verify it returns an array of strings
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(typeof result[0]).toBe('string');
      
      // Verify it contains the expected cache names
      Object.values(CACHE_NAMES).forEach(cacheName => {
        expect(result).toContain(cacheName);
      });
    });
  });

  describe('CACHE_NAMES constant', () => {
    it('defines the expected cache names', () => {
      // Import the module
      const { CACHE_NAMES } = require('../../public/sw-lifecycle');
      
      // Verify the structure of CACHE_NAMES
      expect(CACHE_NAMES).toBeDefined();
      expect(CACHE_NAMES.STATIC).toBeDefined();
      expect(CACHE_NAMES.DYNAMIC).toBeDefined();
      expect(CACHE_NAMES.PAGES).toBeDefined();
      expect(CACHE_NAMES.IMAGES).toBeDefined();
      
      // Verify the values are strings
      expect(typeof CACHE_NAMES.STATIC).toBe('string');
      expect(typeof CACHE_NAMES.DYNAMIC).toBe('string');
      expect(typeof CACHE_NAMES.PAGES).toBe('string');
      expect(typeof CACHE_NAMES.IMAGES).toBe('string');
    });
  });
});
