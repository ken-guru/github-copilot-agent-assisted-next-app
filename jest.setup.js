import '@testing-library/jest-dom';
import React from 'react';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ThemeContext for components that use the useTheme hook
jest.mock('./src/context/theme/ThemeContext', () => {
  const actualContext = jest.requireActual('./src/context/theme/ThemeContext');
  return {
    ...actualContext,
    ThemeContext: {
      Provider: ({ children }) => children,
      Consumer: ({ children }) => children({ 
        theme: 'system', 
        setTheme: jest.fn(),
        isDark: false,
        enableTransitions: jest.fn(),
        disableTransitions: jest.fn()
      }),
      $$typeof: Symbol.for('react.context'),
    },
    ThemeProvider: ({ children }) => children,
    useThemeContext: () => ({
      theme: 'system',
      setTheme: jest.fn(),
      isDark: false,
      enableTransitions: jest.fn(),
      disableTransitions: jest.fn()
    }),
  };
});

// For backward compatibility with any code still attempting to import from old path
// jest.mock('./src/context/ThemeContext', () => {
//   return jest.requireActual('./src/context/theme/ThemeContext');
// });