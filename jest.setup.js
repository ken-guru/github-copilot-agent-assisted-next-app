import '@testing-library/jest-dom';

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

// Add mock for React 18 features
global.IS_REACT_ACT_ENVIRONMENT = true;

// Suppress React Bootstrap transition warnings in tests
// These warnings occur due to React Bootstrap's internal state updates
// and are not related to our application logic
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = typeof args[0] === 'string' ? args[0] : '';
  
  // Suppress React Bootstrap transition/modal act warnings
  if (
    message.includes('An update to Transition inside a test was not wrapped in act') ||
    message.includes('An update to Modal inside a test was not wrapped in act') ||
    message.includes('An update to ActivityModificationWarningModal inside a test was not wrapped in act')
  ) {
    return;
  }
  
  originalConsoleError.apply(console, args);
};