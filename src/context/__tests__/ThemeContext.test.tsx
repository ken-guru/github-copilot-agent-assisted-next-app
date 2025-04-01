import { render, act, renderHook } from '@testing-library/react';
import { ThemeProvider } from '../theme/ThemeContext';
import { useTheme } from '../../hooks/useTheme';
import '@testing-library/jest-dom';

describe('ThemeContext', () => {
  const mockMatchMedia = jest.fn();
  const originalMatchMedia = window.matchMedia;
  let localStorageMock: { [key: string]: string } = {};

  beforeAll(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(key => localStorageMock[key]),
        setItem: jest.fn((key, value) => {
          localStorageMock[key] = value;
        }),
        removeItem: jest.fn(key => {
          delete localStorageMock[key];
        }),
      },
      writable: true,
    });

    // Mock matchMedia
    window.matchMedia = mockMatchMedia;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock = {};
    document.documentElement.className = '';

    // Default to light mode system preference
    mockMatchMedia.mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: light)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('applies system theme by default', () => {
    render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('light-mode')).toBe(true);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
  });

  it('applies saved theme from localStorage on mount', () => {
    localStorageMock.theme = 'dark';

    render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    expect(document.documentElement.classList.contains('light-mode')).toBe(false);
  });

  it('updates theme when system preference changes', () => {
    // Keep track of event listeners
    const listeners: Record<string, Array<(e: { matches: boolean }) => void>> = {};
    
    mockMatchMedia.mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: light)',
      media: query,
      addEventListener: jest.fn((event, handler) => {
        if (!listeners[query]) {
          listeners[query] = [];
        }
        listeners[query].push(handler);
      }),
      removeEventListener: jest.fn(),
    }));

    // Initial render with light mode
    render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );
    
    // First, force reset the document class to ensure we're starting fresh
    document.documentElement.classList.remove('dark-mode');
    document.documentElement.classList.add('light-mode');
    
    // Simulate a change in system preference to dark mode
    act(() => {
      // Update the matchMedia mock to return dark mode
      mockMatchMedia.mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
      
      // Trigger all saved handlers for the dark mode query
      if (listeners['(prefers-color-scheme: dark)']) {
        listeners['(prefers-color-scheme: dark)'].forEach(handler => {
          handler({ matches: true });
        });
      }
    });

    // Verify dark mode is applied
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
  });

  describe('useTheme hook', () => {
    it('provides current theme and setTheme function', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('system');

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    });

    it('persists theme preference in localStorage', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');

      act(() => {
        result.current.setTheme('system');
      });

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('theme');
    });

    it('throws error when used outside ThemeProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => renderHook(() => useTheme())).toThrow(
        'useTheme must be used within a ThemeProvider'
      );

      consoleSpy.mockRestore();
    });
  });
});