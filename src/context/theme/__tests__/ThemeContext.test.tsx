import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useThemeContext } from '../ThemeContext';

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
  value: jest.fn((query) => ({
    matches: false, // Default to light mode for tests
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// A test component that uses the theme hook
const TestComponent = () => {
  const { theme, setTheme, isDark } = useThemeContext();
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="is-dark">{isDark ? 'dark' : 'light'}</div>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light Theme
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark Theme
      </button>
      <button onClick={() => setTheme('system')} data-testid="set-system">
        Set System Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    document.documentElement.classList.remove('dark-mode', 'light-mode');
  });

  it('should initialize with system theme if no stored preference', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme').textContent).toBe('system');
  });

  it('should initialize with stored theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme').textContent).toBe('dark');
  });

  it('should update theme when setTheme is called', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('set-dark'));
    expect(screen.getByTestId('current-theme').textContent).toBe('dark');
    expect(screen.getByTestId('is-dark').textContent).toBe('dark');
    
    fireEvent.click(screen.getByTestId('set-light'));
    expect(screen.getByTestId('current-theme').textContent).toBe('light');
    expect(screen.getByTestId('is-dark').textContent).toBe('light');
  });

  it('should apply appropriate CSS classes when theme changes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Initially system theme (mocked to light)
    expect(document.documentElement.classList.contains('light-mode')).toBeTruthy();
    expect(document.documentElement.classList.contains('dark-mode')).toBeFalsy();

    // Change to dark
    fireEvent.click(screen.getByTestId('set-dark'));
    expect(document.documentElement.classList.contains('dark-mode')).toBeTruthy();
    expect(document.documentElement.classList.contains('light-mode')).toBeFalsy();

    // Change to light
    fireEvent.click(screen.getByTestId('set-light'));
    expect(document.documentElement.classList.contains('light-mode')).toBeTruthy();
    expect(document.documentElement.classList.contains('dark-mode')).toBeFalsy();
  });

  it('should save theme preference to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('set-dark'));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');

    fireEvent.click(screen.getByTestId('set-light'));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');

    fireEvent.click(screen.getByTestId('set-system'));
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('theme');
  });

  it('should respond to system preference changes', () => {
    // Mock system preference as dark
    const darkMediaQueryList = {
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: jest.fn((event, handler) => {
        // Store the handler to trigger later
        darkMediaQueryList.handler = handler;
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      handler: null as any
    };

    window.matchMedia = jest.fn().mockImplementation((query) => {
      if (query === '(prefers-color-scheme: dark)') {
        return darkMediaQueryList;
      }
      return {
        matches: false,
        media: query,
        onchange: null,
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

    // Initially dark (based on mocked system preference)
    expect(screen.getByTestId('is-dark').textContent).toBe('dark');
    
    // Simulate system preference change to light
    act(() => {
      darkMediaQueryList.matches = false;
      darkMediaQueryList.handler({ matches: false } as MediaQueryListEvent);
    });
    
    // Should now be light
    expect(screen.getByTestId('is-dark').textContent).toBe('light');

    // Simulate system preference change back to dark
    act(() => {
      darkMediaQueryList.matches = true;
      darkMediaQueryList.handler({ matches: true } as MediaQueryListEvent);
    });
    
    // Should now be dark again
    expect(screen.getByTestId('is-dark').textContent).toBe('dark');
  });
});