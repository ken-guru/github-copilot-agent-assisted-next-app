import '@testing-library/jest-dom';

// Setup for Node.js environment (API routes)
if (typeof global.crypto === 'undefined') {
  const { webcrypto } = require('crypto');
  global.crypto = webcrypto;
}

// Only setup browser-specific mocks if window is available
if (typeof window !== 'undefined') {
  // Set up window.matchMedia mock
  Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
  });

  // Mock localStorage
  const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  // Mock IntersectionObserver
  class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
  }

  window.IntersectionObserver = MockIntersectionObserver;

  // Add missing DOM APIs needed for tests
  if (typeof window.URL.createObjectURL === 'undefined') {
    Object.defineProperty(window.URL, 'createObjectURL', { value: () => 'mock-url' });
  }
}

// Add mock for React 18 features
global.IS_REACT_ACT_ENVIRONMENT = true;