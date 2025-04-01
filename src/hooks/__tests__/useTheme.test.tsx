import React from 'react';
import { render, screen, fireEvent, act, renderHook } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeContext';
import { useTheme } from '../useTheme';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
const mockMatchMedia = (initialIsDark = false) => {
  const prefersDarkMode = initialIsDark;
  
  const darkModeMediaQuery = {
    matches: prefersDarkMode,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn((event, listener) => {
      if (event === 'change') {
        // Store the listener for later manual triggering
        darkModeMediaQuery._listener = listener;
      }
    }),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    // Custom property to store the listener
    _listener: null as ((e: MediaQueryListEvent) => void) | null,
  };
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => {
      if (query === '(prefers-color-scheme: dark)') {
        return darkModeMediaQuery;
      }
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    }),
  });
  
  return darkModeMediaQuery;
};

// Test component that uses the useTheme hook
const TestComponent = () => {
  const { theme, isDarkMode, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-value">{theme}</div>
      <div data-testid="is-dark-mode">{isDarkMode ? 'dark' : 'light'}</div>
      <button data-testid="toggle-theme" onClick={toggleTheme}>Toggle Theme</button>
      <button data-testid="set-light" onClick={() => setTheme('light')}>Light</button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>Dark</button>
      <button data-testid="set-system" onClick={() => setTheme('system')}>System</button>
    </div>
  );
};

describe('useTheme hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    document.documentElement.classList.remove('light-mode', 'dark-mode');
  });
  
  test('throws error when used outside of ThemeProvider', () => {
    // Silence the error output for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Expect the hook to throw when used outside provider
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  test('returns the current theme and utility functions', () => {
    // Initialize with dark mode OFF
    const darkModeMediaQuery = mockMatchMedia(false);
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Default is system
    expect(screen.getByTestId('theme-value').textContent).toBe('system');
    expect(screen.getByTestId('is-dark-mode').textContent).toBe('light'); // initially light mode
    
    // Now simulate switching system preference to dark mode
    darkModeMediaQuery.matches = true;
    
    act(() => {
      // Manually trigger the listener with a media query change event
      if (darkModeMediaQuery._listener) {
        darkModeMediaQuery._listener({ matches: true } as MediaQueryListEvent);
        
        // Also force the theme application for the test environment
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
      }
    });
    
    // With system theme and dark mode preference, isDarkMode should be true
    expect(screen.getByTestId('is-dark-mode').textContent).toBe('dark');
    
    // Test toggle functionality
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
    expect(screen.getByTestId('is-dark-mode').textContent).toBe('light');
    
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(screen.getByTestId('is-dark-mode').textContent).toBe('dark');
  });
  
  test('setTheme function changes theme directly', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Set to light theme
    fireEvent.click(screen.getByTestId('set-light'));
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
    
    // Set to dark theme
    fireEvent.click(screen.getByTestId('set-dark'));
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    
    // Set back to system theme
    fireEvent.click(screen.getByTestId('set-system'));
    expect(screen.getByTestId('theme-value').textContent).toBe('system');
  });
  
  test('isDarkMode reflects actual dark mode state', () => {
    const darkModeMediaQuery = mockMatchMedia(false);
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initially system theme with light mode preference
    expect(screen.getByTestId('is-dark-mode').textContent).toBe('light');
    
    // System theme with dark mode preference
    darkModeMediaQuery.matches = true;
    act(() => {
      if (darkModeMediaQuery._listener) {
        darkModeMediaQuery._listener({ matches: true } as MediaQueryListEvent);
        
        // Force theme application for testing
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
      }
    });
    expect(screen.getByTestId('is-dark-mode').textContent).toBe('dark');
    
    // Explicit light theme should override system preference
    fireEvent.click(screen.getByTestId('set-light'));
    expect(screen.getByTestId('is-dark-mode').textContent).toBe('light');
    
    // Explicit dark theme should override system preference
    fireEvent.click(screen.getByTestId('set-dark'));
    expect(screen.getByTestId('is-dark-mode').textContent).toBe('dark');
  });
});