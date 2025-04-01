import { render, act, renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';
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
    let preferenceCallback: ((e: { matches: boolean }) => void) | null = null;

    mockMatchMedia.mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: light)',
      media: query,
      addEventListener: jest.fn((_, cb) => {
        preferenceCallback = cb;
      }),
      removeEventListener: jest.fn(),
    }));

    render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );

    act(() => {
      if (preferenceCallback) {
        preferenceCallback({ matches: false }); // Simulate change to dark mode
      }
    });

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