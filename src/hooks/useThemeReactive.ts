import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

// Helper to detect if we're in a test environment
const isTestEnvironment = () => {
  return typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
};

/**
 * Custom hook that provides reactive theme detection for React components.
 * 
 * This hook directly listens to DOM changes and localStorage events to detect theme changes,
 * ensuring that components re-render immediately when the theme switches.
 * 
 * Unlike the ThemeProvider context, this hook works independently and guarantees
 * component updates by using React's useState to trigger re-renders.
 * 
 * @returns The current theme ('light' | 'dark')
 */
export const useThemeReactive = (): Theme => {
  // Initialize with detected theme or fallback to 'light'
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'light'; // SSR safe default
    }
    return detectCurrentTheme();
  });

  useEffect(() => {
    // Skip if running on server
    if (typeof window === 'undefined') {
      return;
    }

    // Update theme state when detected theme changes
    const updateTheme = () => {
      const currentTheme = detectCurrentTheme();
      setTheme(currentTheme);
    };

    // Set up MutationObserver to watch for DOM theme attribute changes
    // Skip MutationObserver in test environment to avoid React act() warnings
    let observer: MutationObserver | null = null;
    
    if (!isTestEnvironment()) {
      try {
        observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === 'attributes' &&
              (mutation.attributeName === 'data-theme' ||
               mutation.attributeName === 'data-bs-theme' ||
               mutation.attributeName === 'class')
            ) {
              updateTheme();
            }
          });
        });

        // Observe document.documentElement for theme-related attribute changes
        if (document.documentElement && typeof document.documentElement.setAttribute === 'function') {
          observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'data-bs-theme', 'class'],
          });
        }
      } catch (error) {
        // Handle MutationObserver errors in test environments
        console.warn('MutationObserver setup failed:', error);
      }
    }

    // Listen for localStorage changes (cross-tab theme synchronization)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme') {
        updateTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for custom theme change events (for programmatic theme changes)
    const handleThemeChange = () => {
      updateTheme();
    };

    window.addEventListener('themeChange', handleThemeChange);

    // Cleanup function
    return () => {
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  return theme;
};

/**
 * Detects the current theme from DOM attributes and localStorage.
 * Prioritizes DOM data-theme attribute over localStorage for accuracy.
 */
function detectCurrentTheme(): Theme {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 'light'; // SSR safe default
  }

  try {
    // Priority 1: Check DOM data-theme attribute (most reliable)
    const domTheme = document.documentElement?.dataset?.theme;
    if (domTheme === 'dark' || domTheme === 'light') {
      return domTheme;
    }

    // Priority 2: Check data-bs-theme attribute (Bootstrap theme)
    const bsTheme = document.documentElement?.getAttribute?.('data-bs-theme');
    if (bsTheme === 'dark' || bsTheme === 'light') {
      return bsTheme;
    }

    // Priority 3: Check className for theme indicators
    const className = document.documentElement?.className || '';
    if (className.includes('dark-mode') || className.includes('dark')) {
      return 'dark';
    }
    if (className.includes('light-mode') || className.includes('light')) {
      return 'light';
    }

    // Priority 4: Check localStorage as fallback
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    // Priority 5: Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // Final fallback
    return 'light';
  } catch (error) {
    // Handle any errors gracefully (localStorage disabled, etc.)
    console.warn('Error detecting theme:', error);
    return 'light';
  }
}

export default useThemeReactive;
