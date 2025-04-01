import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, ThemeContext } from '../../context/theme/ThemeContext';
import { useTheme } from '../useTheme';

// Create a test component that uses the useTheme hook
const TestComponent = ({ onThemeChange = () => {} }) => {
  const { theme, setTheme, isDarkMode } = useTheme();
  
  const handleClick = (newTheme) => {
    setTheme(newTheme);
    onThemeChange(newTheme);
  };
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="is-dark-mode">{isDarkMode ? 'dark' : 'light'}</div>
      <button data-testid="set-light" onClick={() => handleClick('light')}>Light</button>
      <button data-testid="set-dark" onClick={() => handleClick('dark')}>Dark</button>
      <button data-testid="set-system" onClick={() => handleClick('system')}>System</button>
    </div>
  );
};

// Mock matchMedia
const mockMatchMedia = (prefersDark = false) => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe('useTheme hook', () => {
  beforeEach(() => {
    // Set up default matchMedia mock (system prefers light)
    mockMatchMedia(false);
    
    // Reset localStorage before each test
    localStorage.clear();
    
    // Reset document classes
    document.documentElement.className = '';
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });
  
  it('throws error when used outside of ThemeProvider', () => {
    // Suppress console.error for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Create a mock context with correct shape but undefined value
    jest.mock('../../context/theme/ThemeContext', () => ({
      ThemeContext: {
        Provider: ({ children }) => children,
        Consumer: jest.fn(),
        displayName: 'ThemeContext',
        $$typeof: Symbol.for('react.context'),
      }
    }));
    
    // Should throw an error when ThemeProvider is not used
    expect(() => {
      // We need to create a custom wrapper that doesn't include ThemeProvider
      renderHook(() => useTheme(), {
        wrapper: ({ children }) => <>{children}</>
      });
    }).toThrow(/useTheme must be used within a ThemeProvider/);
    
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  it('returns the current theme and utility functions', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
    });
    
    // Check the returned values from useTheme hook
    expect(result.current.theme).toBeDefined();
    expect(typeof result.current.setTheme).toBe('function');
    expect(typeof result.current.isDarkMode).toBe('boolean');
    
    // Should start with the system theme by default
    expect(result.current.theme).toBe('system');
  });
  
  it('respects initial theme from localStorage', () => {
    // Set theme in localStorage
    localStorage.setItem('theme', 'dark');
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
    });
    
    // Should use the theme from localStorage
    expect(result.current.theme).toBe('dark');
    
    // Should also set dark mode class on document
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
  });
  
  it('setTheme function changes theme directly', () => {
    const onThemeChange = jest.fn();
    
    render(
      <ThemeProvider>
        <TestComponent onThemeChange={onThemeChange} />
      </ThemeProvider>
    );
    
    // Initial state should be 'system'
    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    
    // Change to dark theme
    fireEvent.click(screen.getByTestId('set-dark'));
    
    // Check that theme was changed
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(onThemeChange).toHaveBeenCalledWith('dark');
    
    // Check localStorage was updated
    expect(localStorage.getItem('theme')).toBe('dark');
    
    // Check that document class was updated
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
  });
  
  it('isDarkMode reflects actual dark mode state', () => {
    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initially not dark mode (system preference is light from mock)
    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('light');
    
    // Change to dark theme
    fireEvent.click(screen.getByTestId('set-dark'));
    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('dark');
    
    // Change to light theme
    fireEvent.click(screen.getByTestId('set-light'));
    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('light');
    
    // Change to system theme (which is light from our mock)
    fireEvent.click(screen.getByTestId('set-system'));
    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('light');
    
    // Clean up before re-rendering
    unmount();
    
    // Now change system preference to dark
    mockMatchMedia(true);
    
    // Re-render with system preference set to dark
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Should now have system theme selected by default, which should be dark
    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('dark');
  });
});