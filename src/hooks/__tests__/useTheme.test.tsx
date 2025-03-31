import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../../hooks/useTheme';
import { ThemeProvider } from '../../context/theme/ThemeContext';
import React from 'react';

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

// More sophisticated matchMedia mock that allows dynamic changes
const createMatchMedia = (initialMatches: boolean) => {
  let listeners: ((e: MediaQueryListEvent) => void)[] = [];
  let matches = initialMatches;
  
  return {
    mockImplementation: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: jest.fn((event, listener) => {
        listeners.push(listener);
      }),
      removeEventListener: jest.fn((event, listener) => {
        listeners = listeners.filter(l => l !== listener);
      }),
      dispatchEvent: jest.fn(),
    })),
    setMatches: (newMatches: boolean) => {
      matches = newMatches;
      // Call listeners with mock event
      listeners.forEach(listener => {
        listener({ matches } as MediaQueryListEvent);
      });
    }
  };
};

describe('useTheme hook', () => {
  // Initialize with more sophisticated mock
  const matchMediaMock = createMatchMedia(false);
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    document.documentElement.classList.remove('dark-mode', 'light-mode');
    window.matchMedia = matchMediaMock.mockImplementation;
  });

  it('should throw an error when used outside ThemeProvider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleErrorSpy.mockRestore();
  });

  it('should provide theme state and functions', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(result.current.theme).toBe('system');
    expect(typeof result.current.setTheme).toBe('function');
    expect(typeof result.current.isDark).toBe('boolean');
  });

  it('should allow changing theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark-mode')).toBeTruthy();

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('light-mode')).toBeTruthy();
  });

  it('should reflect system preference when set to system theme', () => {
    // Start with system preference light (false)
    matchMediaMock.setMatches(false);
    
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    act(() => {
      result.current.setTheme('system');
    });

    expect(result.current.theme).toBe('system');
    expect(result.current.isDark).toBe(false);
    
    // Change system preference to dark via our better mock
    act(() => {
      matchMediaMock.setMatches(true);
    });
    
    expect(result.current.isDark).toBe(true);
    
    // And back to light
    act(() => {
      matchMediaMock.setMatches(false);
    });
    
    expect(result.current.isDark).toBe(false);
  });

  it('should provide theme transition utilities', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    
    expect(typeof result.current.enableTransitions).toBe('function');
    expect(typeof result.current.disableTransitions).toBe('function');
    
    act(() => {
      result.current.enableTransitions();
    });
    
    expect(document.documentElement.classList.contains('theme-transitions')).toBeTruthy();
    
    act(() => {
      result.current.disableTransitions();
    });
    
    expect(document.documentElement.classList.contains('theme-transitions')).toBeFalsy();
  });
});