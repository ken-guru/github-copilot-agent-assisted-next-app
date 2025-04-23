// filepath: /Users/ken/Workspace/ken-guru/github-copilot-agent-assisted-next-app/src/utils/__tests__/serviceWorkerRetry.test.ts
import * as ServiceWorkerRetry from '../serviceWorkerRetry';

// Mock the module
jest.mock('../serviceWorkerRetry', () => {
  // Use actual implementations for most functions
  const original = jest.requireActual('../serviceWorkerRetry');
  return {
    ...original,
  };
});

describe('serviceWorkerRetry', () => {
  const originalFetch = global.fetch;
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  
  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
  });
  
  describe('registerWithRetry', () => {
    it('should attempt registration with retry parameters', async () => {
      const mockSwUrl = '/service-worker.js';
      const mockConfig = { onSuccess: jest.fn(), onUpdate: jest.fn() };
      
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/javascript')
        }
      });
      
      const mockRegistration = { scope: '/test' };
      const mockSw = {
        register: jest.fn().mockResolvedValue(mockRegistration)
      };
      
      Object.defineProperty(global.navigator, 'serviceWorker', {
        value: mockSw,
        configurable: true
      });
      
      const result = await ServiceWorkerRetry.registerWithRetry(mockSwUrl, mockConfig);
      
      expect(global.fetch).toHaveBeenCalledWith(mockSwUrl);
      expect(mockSw.register).toHaveBeenCalledWith(mockSwUrl, { scope: '/' });
      expect(result).toBe(mockRegistration);
    });
    
    it('should handle failed attempts correctly', async () => {
      // Use manual mocking instead of fake timers
      jest.useFakeTimers({ advanceTimers: true });
      
      const mockSwUrl = '/service-worker.js';
      const mockConfig = { onSuccess: jest.fn(), onUpdate: jest.fn() };
      
      // Mock fetch to resolve immediately with valid response on second call
      global.fetch = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          status: 200,
          headers: {
            get: jest.fn().mockReturnValue('application/javascript')
          }
        });
      
      const mockRegistration = { scope: '/test' };
      const mockSw = {
        register: jest.fn().mockResolvedValue(mockRegistration)
      };
      
      Object.defineProperty(global.navigator, 'serviceWorker', {
        value: mockSw,
        configurable: true
      });
      
      // Create a spy on the registerWithRetry function to track calls
      const registerWithRetrySpy = jest.spyOn(ServiceWorkerRetry, 'registerWithRetry');
      
      const result = await ServiceWorkerRetry.registerWithRetry(mockSwUrl, mockConfig);
      
      expect(global.fetch).toHaveBeenCalledWith(mockSwUrl);
      expect(mockSw.register).toHaveBeenCalledWith(mockSwUrl, { scope: '/' });
      expect(result).toBe(mockRegistration);
    });
  });
  
  describe('checkValidServiceWorker', () => {
    it('should validate a service worker when fetch is successful', async () => {
      const mockSwUrl = '/service-worker.js';
      
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/javascript')
        }
      });
      
      const result = await ServiceWorkerRetry.checkValidServiceWorker(mockSwUrl);
      expect(result).toBe(true);
    });
    
    it('should return false when service worker response is invalid', async () => {
      const mockSwUrl = '/service-worker.js';
      
      global.fetch = jest.fn().mockResolvedValue({
        status: 404,
        headers: {
          get: jest.fn().mockReturnValue('text/html')
        }
      });
      
      const result = await ServiceWorkerRetry.checkValidServiceWorker(mockSwUrl);
      expect(result).toBe(false);
    });
    
    it('should return false when fetch fails', async () => {
      const mockSwUrl = '/service-worker.js';
      
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      
      const result = await ServiceWorkerRetry.checkValidServiceWorker(mockSwUrl);
      expect(result).toBe(false);
    });
  });
});
