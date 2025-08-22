import '@testing-library/jest-dom';
// jest-axe matcher helpers
try {
  // extend-expect adds toHaveNoViolations matcher
  // require is used so this file still runs even if jest-axe is not installed in some environments
  require('jest-axe/extend-expect');
} catch (e) {
  // ignore when package not installed in certain environments
}

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

// Provide a default mock for next/navigation so components using App Router hooks
// (e.g., usePathname/useRouter) can render in Jest without a mounted Next.js router.
// Individual tests can override these defaults with their own jest.mock calls.
try {
  jest.mock('next/navigation', () => {
    return {
      // Default pathname to root; tests can override via jest.mocked(usePathname).mockReturnValue('/foo')
      usePathname: jest.fn(() => '/'),
      // Minimal router with push stub; tests can assert on calls or override implementation
      useRouter: jest.fn(() => ({ push: jest.fn() })),
      // notFound is sometimes imported in server components; provide a stub that throws when called
      notFound: jest.fn(() => { throw new Error('notFound called'); }),
    };
  });
} catch (e) {
  // In environments where jest.mock is not available or already defined, ignore
}