import { jest } from '@jest/globals';
/**
 * Service Worker testing utilities
 * 
 * These utilities provide standardized ways to mock service workers
 * for consistent testing across components.
 */

interface MockServiceWorkerOptions {
  initialWaitingState?: boolean;
}

// Create a type for the event listeners
type ServiceWorkerEventListener = (event?: Event) => void;

/**
 * Creates a mock for navigator.serviceWorker
 * 
 * @param options Configuration options for the mock
 * @returns Object with mock service worker API and control functions
 */
export function mockServiceWorker(options: MockServiceWorkerOptions = {}) {
  // Apply default options
  const { initialWaitingState = false } = options;
  
  // Store the original service worker
  const originalServiceWorker = global.navigator.serviceWorker;
  
  // Mock for postMessage function
  const postMessageMock = jest.fn<(..._args: unknown[]) => void>();
  
  // Maps to store event listeners
  const globalListeners = new Map<string, ServiceWorkerEventListener[]>();
  const registrationListeners = new Map<string, ServiceWorkerEventListener[]>();
  
  // Mock registration object
  const mockRegistration = {
    installing: null,
    waiting: initialWaitingState ? { 
      state: 'installed',
      postMessage: postMessageMock
    } : null,
    active: { 
      state: 'activated',
      postMessage: postMessageMock
    },
    scope: '/',
    updateFound: false,
  update: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  unregister: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  addEventListener: jest.fn((event: string, callback: ServiceWorkerEventListener) => {
      if (!registrationListeners.has(event)) {
        registrationListeners.set(event, []);
      }
      registrationListeners.get(event)?.push(callback);
    }),
  removeEventListener: jest.fn((event: string, callback: ServiceWorkerEventListener) => {
      const eventListeners = registrationListeners.get(event) || [];
      const index = eventListeners.indexOf(callback);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }),
    onupdatefound: null as ServiceWorkerEventListener | null,
  };
  
  // Mock controller
  const mockController = {
    scriptURL: '/service-worker.js',
    state: 'activated',
    postMessage: postMessageMock,
  addEventListener: jest.fn<(..._args: unknown[]) => void>(),
  removeEventListener: jest.fn<(..._args: unknown[]) => void>(),
  };
  
  // Mock navigator.serviceWorker
  const mockServiceWorkerContainer = {
    controller: mockController,
    ready: Promise.resolve(mockRegistration),
  register: jest.fn<() => Promise<typeof mockRegistration>>().mockResolvedValue(mockRegistration),
  getRegistration: jest.fn<() => Promise<typeof mockRegistration>>().mockResolvedValue(mockRegistration),
  getRegistrations: jest.fn<() => Promise<typeof mockRegistration[]>>().mockResolvedValue([mockRegistration]),
  addEventListener: jest.fn((event: string, callback: ServiceWorkerEventListener) => {
      if (!globalListeners.has(event)) {
        globalListeners.set(event, []);
      }
      globalListeners.get(event)?.push(callback);
    }),
  removeEventListener: jest.fn((event: string, callback: ServiceWorkerEventListener) => {
      const eventListeners = globalListeners.get(event) || [];
      const index = eventListeners.indexOf(callback);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }),
  };
  
  // Replace navigator.serviceWorker
  Object.defineProperty(global.navigator, 'serviceWorker', {
    value: mockServiceWorkerContainer,
    configurable: true,
    writable: true,
  });
  
  /**
   * Simulate a service worker update
   */
  const simulateUpdate = () => {
    // Create a new waiting service worker if it doesn't exist
    if (!mockRegistration.waiting) {
      mockRegistration.waiting = { 
        state: 'installed',
        postMessage: postMessageMock
      };
    }
    
    // Trigger registration updatefound event listeners
    const registrationUpdateFoundListeners = registrationListeners.get('updatefound') || [];
    registrationUpdateFoundListeners.forEach(listener => listener());
    
    // Trigger global updatefound event listeners
    const globalUpdateFoundListeners = globalListeners.get('updatefound') || [];
    globalUpdateFoundListeners.forEach(listener => listener());
    
    // Trigger onupdatefound if defined
    if (typeof mockRegistration.onupdatefound === 'function') {
      mockRegistration.onupdatefound();
    }
  };
  
  /**
   * Simulate service worker activation
   */
  const simulateActivation = () => {
    if (mockRegistration.waiting) {
      // Move waiting to active
      mockRegistration.active = mockRegistration.waiting;
      mockRegistration.active.state = 'activated';
      mockRegistration.waiting = null;
      
      // Trigger controllerchange event listeners
      const controllerChangeListeners = globalListeners.get('controllerchange') || [];
      controllerChangeListeners.forEach(listener => listener());
    }
  };
  
  /**
   * Cleanup function to restore original service worker
   */
  const cleanup = () => {
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: originalServiceWorker,
      configurable: true,
      writable: true,
    });
    globalListeners.clear();
    registrationListeners.clear();
  };
  
  return {
    mockRegistration,
    mockController,
    mockServiceWorkerContainer,
    postMessageMock,
    simulateUpdate,
    simulateActivation,
    cleanup,
  };
}

/**
 * Creates mocks for navigator.onLine property
 * 
 * @returns Object with functions to control online status
 */
export function mockOnlineStatus() {
  // Store listeners
  const onlineListeners: EventListener[] = [];
  const offlineListeners: EventListener[] = [];
  
  // Store original descriptor
  const originalDescriptor = Object.getOwnPropertyDescriptor(navigator, 'onLine') || {
    configurable: true,
    get: () => true,
  };
  
  // Set initial status
  let isOnline = true;
  
  // Override window.addEventListener
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = jest.fn((event: string, listener: EventListenerOrEventListenerObject) => {
    if (event === 'online') {
      onlineListeners.push(listener as EventListener);
    } else if (event === 'offline') {
      offlineListeners.push(listener as EventListener);
    } else {
      originalAddEventListener.call(window, event as string, listener as EventListenerOrEventListenerObject);
    }
  });
  
  // Override window.removeEventListener
  const originalRemoveEventListener = window.removeEventListener;
  window.removeEventListener = jest.fn((event: string, listener: EventListenerOrEventListenerObject) => {
    if (event === 'online') {
      const index = onlineListeners.indexOf(listener as EventListener);
      if (index !== -1) {
        onlineListeners.splice(index, 1);
      }
    } else if (event === 'offline') {
      const index = offlineListeners.indexOf(listener as EventListener);
      if (index !== -1) {
        offlineListeners.splice(index, 1);
      }
    } else {
      originalRemoveEventListener.call(window, event as string, listener as EventListenerOrEventListenerObject);
    }
  });
  
  // Define navigator.onLine getter
  Object.defineProperty(navigator, 'onLine', {
    configurable: true,
    get: () => isOnline,
  });
  
  /**
   * Set online status and trigger appropriate event
   */
  const setOnlineStatus = (online: boolean) => {
    if (online === isOnline) return;
    
    isOnline = online;
    const event = new Event(online ? 'online' : 'offline');
    
    if (online) {
      onlineListeners.forEach(listener => listener(event));
    } else {
      offlineListeners.forEach(listener => listener(event));
    }
  };
  
  /**
   * Cleanup function to restore original behavior
   */
  const cleanup = () => {
    Object.defineProperty(navigator, 'onLine', originalDescriptor);
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
  };
  
  return {
    setOnlineStatus,
    cleanup,
  };
}