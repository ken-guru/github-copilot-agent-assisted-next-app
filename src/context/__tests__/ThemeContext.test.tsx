import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, ThemeContext } from '../ThemeContext';
import '@testing-library/jest-dom';

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
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
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

// Test component that consumes ThemeContext
const TestComponent = () => {
  // Add a non-null assertion since we know ThemeContext will be provided
  const { theme, toggleTheme, setTheme } = React.useContext(ThemeContext)!;
  
  return (
    <div>
      <div data-testid="theme-value">{theme}</div>
      <button data-testid="toggle-theme" onClick={toggleTheme}>Toggle Theme</button>
      <button data-testid="set-light" onClick={() => setTheme('light')}>Set Light</button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>Set Dark</button>
      <button data-testid="set-system" onClick={() => setTheme('system')}>Set System</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    // Reset document's class list
    document.documentElement.classList.remove('light-mode', 'dark-mode');
  });
  
  test('provides default theme value (system) when no localStorage value exists', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-value').textContent).toBe('system');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme-preference');
  });
  
  test('loads theme preference from localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce('dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme-preference');
  });
  
  test('toggles between light and dark themes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial state is 'system'
    expect(screen.getByTestId('theme-value').textContent).toBe('system');
    
    // Toggle to 'light'
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
    expect(document.documentElement.classList.contains('light-mode')).toBe(true);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'light');
    
    // Toggle to 'dark'
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    expect(document.documentElement.classList.contains('light-mode')).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'dark');
    
    // Toggle back to 'system'
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('theme-value').textContent).toBe('system');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'system');
  });
  
  test('directly sets theme with setTheme function', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Set to light
    fireEvent.click(screen.getByTestId('set-light'));
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
    expect(document.documentElement.classList.contains('light-mode')).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'light');
    
    // Set to dark
    fireEvent.click(screen.getByTestId('set-dark'));
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'dark');
    
    // Set to system
    fireEvent.click(screen.getByTestId('set-system'));
    expect(screen.getByTestId('theme-value').textContent).toBe('system');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'system');
  });
  
  test('responds to system preference changes', () => {
    // Mock system preference to dark
    const darkModeMediaQuery = {
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
    
    window.matchMedia = jest.fn().mockImplementation((query) => {
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
    });
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Set to system theme
    fireEvent.click(screen.getByTestId('set-system'));
    expect(screen.getByTestId('theme-value').textContent).toBe('system');
    
    // System theme should apply dark mode since system preference is dark
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    
    // Simulate system preference change to light
    act(() => {
      darkModeMediaQuery.matches = false;
      // Simulate the change event
      if (darkModeMediaQuery.addEventListener.mock.calls.length > 0) {
        const [[, listener]] = darkModeMediaQuery.addEventListener.mock.calls;
        listener({ matches: false });
      }
    });
    
    // System theme should now apply light mode
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    expect(document.documentElement.classList.contains('light-mode')).toBe(true);
  });
  
  test('handles cleanup on unmount', () => {
    const darkModeMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
    
    window.matchMedia = jest.fn().mockImplementation((query) => {
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
    });
    
    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    unmount();
    
    // Verify that event listener was removed
    expect(darkModeMediaQuery.removeEventListener).toHaveBeenCalled();
  });
});