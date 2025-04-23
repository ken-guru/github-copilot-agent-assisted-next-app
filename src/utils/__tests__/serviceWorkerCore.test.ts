// filepath: /Users/ken/Workspace/ken-guru/github-copilot-agent-assisted-next-app/src/utils/__tests__/serviceWorkerCore.test.ts
import { register, unregister } from '../serviceWorkerCore';

// Mock the service worker module
jest.mock('../serviceWorkerRetry', () => ({
  registerWithRetry: jest.fn().mockImplementation((url, config) => {
    return Promise.resolve({ scope: '/test-scope' });
  }),
  checkValidServiceWorker: jest.fn().mockResolvedValue(true)
}));

describe('serviceWorkerCore', () => {
  const originalNavigator = global.navigator;
  const mockServiceWorkerContainer = {
    register: jest.fn().mockResolvedValue({ scope: '/test-scope' }),
  };

  beforeEach(() => {
    // Mock serviceWorker
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: mockServiceWorkerContainer,
      configurable: true,
    });
    
    // Override NODE_ENV to test for testing
    process.env.NODE_ENV = 'test';
    
    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore navigator
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      configurable: true,
    });
  });

  describe('register', () => {
    it('should register a service worker when available', async () => {
      const config = {
        onSuccess: jest.fn(),
        onUpdate: jest.fn(),
      };

      // Directly mock the URL to avoid issues with window.location
      const mockUrl = '/service-worker.js';
      
      // Mock the implementation of the serviceWorkerCore's internal function
      const registerPromise = register(config);
      
      // Force the mock to call the register function
      await registerPromise;
      
      // Verify that in test mode we call register directly
      expect(mockServiceWorkerContainer.register).toHaveBeenCalledWith('/service-worker.js', {
        scope: '/',
      });
    });

    it('should not register when in development mode', async () => {
      // Mock development environment
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const config = {
        onSuccess: jest.fn(),
        onUpdate: jest.fn(),
      };

      await register(config);
      
      // Should not call register in dev mode
      expect(mockServiceWorkerContainer.register).not.toHaveBeenCalled();
      
      // Restore NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('unregister', () => {
    it('should unregister any existing service workers', async () => {
      const mockRegistration = {
        unregister: jest.fn().mockResolvedValue(true),
      };

      mockServiceWorkerContainer.getRegistration = jest.fn().mockResolvedValue(mockRegistration);

      await unregister();
      expect(mockServiceWorkerContainer.getRegistration).toHaveBeenCalled();
      expect(mockRegistration.unregister).toHaveBeenCalled();
    });

    it('should handle case when no service worker is registered', async () => {
      mockServiceWorkerContainer.getRegistration = jest.fn().mockResolvedValue(undefined);

      await unregister();
      expect(mockServiceWorkerContainer.getRegistration).toHaveBeenCalled();
      // No registration, so unregister should not be called
    });
  });
});
