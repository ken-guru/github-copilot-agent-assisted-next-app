import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useThemeContext } from '@/context/theme/ThemeContext';

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

// Mock matchMedia - default to light mode
const createMediaQueryList = (matches: boolean) => ({
  matches,
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => {
    if (query === '(prefers-color-scheme: dark)') {
      return createMediaQueryList(false); // Default to light mode
    }
    return createMediaQueryList(false);
  }),
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
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'theme-preference' || key === 'theme') {
        return 'dark';
      }
      return null;
    });

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
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'dark');

    fireEvent.click(screen.getByTestId('set-light'));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'light');

    fireEvent.click(screen.getByTestId('set-system'));
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('theme-preference');
  });

  it('should respond to system preference changes', () => {
    // Mock system preference as dark
    type Handler = (e: MediaQueryListEvent) => void;
    const darkMediaQueryList = {
      matches: true, // Start with dark mode
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: jest.fn((event, handler: Handler) => {
        darkMediaQueryList.handler = handler;
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      handler: null as Handler | null
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
      if (darkMediaQueryList.handler) {
        darkMediaQueryList.handler({ matches: false } as MediaQueryListEvent);
      }
    });
    
    // Should now be light
    expect(screen.getByTestId('is-dark').textContent).toBe('light');

    // Simulate system preference change back to dark
    act(() => {
      darkMediaQueryList.matches = true;
      if (darkMediaQueryList.handler) {
        darkMediaQueryList.handler({ matches: true } as MediaQueryListEvent);
      }
    });
    
    // Should now be dark again
    expect(screen.getByTestId('is-dark').textContent).toBe('dark');
  });
});