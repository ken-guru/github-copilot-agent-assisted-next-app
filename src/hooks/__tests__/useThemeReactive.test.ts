import { renderHook, act } from '@testing-library/react';
import { useThemeReactive } from '../useThemeReactive';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useThemeReactive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage mock
    localStorageMock.getItem.mockReturnValue('light');
    
    // Reset document.documentElement
    if (document.documentElement) {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.className = 'light-mode';
    }
  });

  afterEach(() => {
    // Clean up any event listeners
    jest.restoreAllMocks();
  });

  describe('Initial theme detection', () => {
    it('should return light theme by default', () => {
      const { result } = renderHook(() => useThemeReactive());
      expect(result.current).toBe('light');
    });

    it('should detect dark theme from DOM data-theme attribute', () => {
      document.documentElement?.setAttribute('data-theme', 'dark');
      const { result } = renderHook(() => useThemeReactive());
      expect(result.current).toBe('dark');
    });

    it('should detect theme from localStorage when DOM attribute missing', () => {
      document.documentElement?.removeAttribute('data-theme');
      document.documentElement?.removeAttribute('data-bs-theme');
      document.documentElement.className = '';
      localStorageMock.getItem.mockReturnValue('dark');
      const { result } = renderHook(() => useThemeReactive());
      expect(result.current).toBe('dark');
    });

    it('should fallback to light theme when both DOM and localStorage are unavailable', () => {
      document.documentElement?.removeAttribute('data-theme');
      document.documentElement?.removeAttribute('data-bs-theme');
      document.documentElement.className = '';
      localStorageMock.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useThemeReactive());
      expect(result.current).toBe('light');
    });
  });

  describe('Theme change reactivity', () => {
    it('should update when localStorage theme changes', () => {
      // Remove DOM theme indicators so localStorage takes precedence
      document.documentElement?.removeAttribute('data-theme');
      document.documentElement?.removeAttribute('data-bs-theme');
      document.documentElement.className = '';
      localStorageMock.getItem.mockReturnValue('light');
      
      const { result } = renderHook(() => useThemeReactive());
      expect(result.current).toBe('light');

      // Simulate localStorage change
      act(() => {
        localStorageMock.getItem.mockReturnValue('dark');
        const storageEvent = new StorageEvent('storage', {
          key: 'theme',
          newValue: 'dark',
          oldValue: 'light',
        });
        window.dispatchEvent(storageEvent);
      });

      expect(result.current).toBe('dark');
    });

    it('should ignore irrelevant localStorage changes', () => {
      const { result } = renderHook(() => useThemeReactive());
      const initialTheme = result.current;

      // Simulate localStorage change for different key
      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: 'other-key',
          newValue: 'some-value',
          oldValue: 'old-value',
        });
        window.dispatchEvent(storageEvent);
      });

      expect(result.current).toBe(initialTheme);
    });

    it('should update when custom themeChange event is dispatched', () => {
      const { result } = renderHook(() => useThemeReactive());
      expect(result.current).toBe('light');

      // Simulate theme change via custom event
      act(() => {
        document.documentElement?.setAttribute('data-theme', 'dark');
        const themeChangeEvent = new CustomEvent('themeChange');
        window.dispatchEvent(themeChangeEvent);
      });

      expect(result.current).toBe('dark');
    });
  });

  describe('SSR safety', () => {
    it('should handle server-side rendering without window object', () => {
      const originalWindow = global.window;
      // @ts-expect-error Testing environment cleanup
      delete global.window;

      expect(() => {
        renderHook(() => useThemeReactive());
      }).not.toThrow();

      global.window = originalWindow;
    });

    it('should handle missing localStorage gracefully', () => {
      const originalLocalStorage = window.localStorage;
      // @ts-expect-error Testing environment cleanup
      delete window.localStorage;

      const { result } = renderHook(() => useThemeReactive());
      expect(result.current).toBe('light'); // Should fallback to default

      window.localStorage = originalLocalStorage;
    });
  });

  describe('Performance and cleanup', () => {
    it('should clean up event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const { unmount } = renderHook(() => useThemeReactive());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('themeChange', expect.any(Function));
    });

    it('should not create memory leaks with multiple hook instances', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      
      const { unmount: unmount1 } = renderHook(() => useThemeReactive());
      const { unmount: unmount2 } = renderHook(() => useThemeReactive());

      // Should have added listeners for both instances
      expect(addEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('themeChange', expect.any(Function));

      unmount1();
      unmount2();
    });
  });

  describe('Edge cases', () => {
    it('should handle invalid theme values gracefully', () => {
      document.documentElement?.setAttribute('data-theme', 'invalid-theme');
      const { result } = renderHook(() => useThemeReactive());
      expect(result.current).toBe('light'); // Should fallback to default
    });

    it('should detect Bootstrap data-bs-theme attribute', () => {
      document.documentElement?.removeAttribute('data-theme');
      document.documentElement?.setAttribute('data-bs-theme', 'dark');
      const { result } = renderHook(() => useThemeReactive());
      expect(result.current).toBe('dark');
    });

    it('should detect theme from className when attributes missing', () => {
      document.documentElement?.removeAttribute('data-theme');
      document.documentElement?.removeAttribute('data-bs-theme');
      document.documentElement.className = 'dark-mode';
      localStorageMock.getItem.mockReturnValue(null);
      const { result } = renderHook(() => useThemeReactive());
      expect(result.current).toBe('dark');
    });

    it('should prioritize DOM attribute over localStorage', () => {
      document.documentElement?.setAttribute('data-theme', 'dark');
      localStorageMock.getItem.mockReturnValue('light');
      const { result } = renderHook(() => useThemeReactive());
      expect(result.current).toBe('dark'); // DOM should take precedence
    });
  });
});
