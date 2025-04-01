import {
  getIsDarkMode,
  getSystemPrefersDark,
  applyThemeToDocument,
  saveThemePreference,
  getSavedThemePreference,
  addSystemThemeChangeListener
} from '../themeUtils';

describe('Theme Utilities', () => {
  // Mock document object
  beforeEach(() => {
    // Reset document class list between tests
    document.documentElement.classList.remove('dark-mode', 'light-mode');
    
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
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
  });

  describe('getIsDarkMode', () => {
    test('returns true when dark-mode class is present', () => {
      document.documentElement.classList.add('dark-mode');
      expect(getIsDarkMode()).toBe(true);
    });

    test('returns false when light-mode class is present', () => {
      document.documentElement.classList.add('light-mode');
      expect(getIsDarkMode()).toBe(false);
    });

    test('returns system preference when no class is present', () => {
      // Mock system preference to dark
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      expect(getIsDarkMode()).toBe(true);
    });
  });

  describe('getSystemPrefersDark', () => {
    test('returns true when system prefers dark mode', () => {
      // Mock system preference to dark
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      expect(getSystemPrefersDark()).toBe(true);
    });

    test('returns false when system prefers light mode', () => {
      // Mock system preference to light
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          matches: false,
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      expect(getSystemPrefersDark()).toBe(false);
    });
  });

  describe('applyThemeToDocument', () => {
    test('applies dark mode class to document', () => {
      applyThemeToDocument(true);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
      expect(document.documentElement.classList.contains('light-mode')).toBe(false);
    });

    test('applies light mode class to document', () => {
      applyThemeToDocument(false);
      expect(document.documentElement.classList.contains('light-mode')).toBe(true);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    });

    test('removes previous theme class when switching', () => {
      // Apply dark mode first
      document.documentElement.classList.add('dark-mode');
      
      // Then switch to light mode
      applyThemeToDocument(false);
      expect(document.documentElement.classList.contains('light-mode')).toBe(true);
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    });
  });

  describe('saveThemePreference', () => {
    test('saves theme preference to localStorage', () => {
      saveThemePreference('dark');
      expect(localStorage.getItem('theme-preference')).toBe('dark');
      
      saveThemePreference('light');
      expect(localStorage.getItem('theme-preference')).toBe('light');
      
      saveThemePreference('system');
      expect(localStorage.getItem('theme-preference')).toBe('system');
    });
  });

  describe('getSavedThemePreference', () => {
    test('returns saved theme preference from localStorage', () => {
      localStorage.setItem('theme-preference', 'dark');
      expect(getSavedThemePreference()).toBe('dark');
      
      localStorage.setItem('theme-preference', 'light');
      expect(getSavedThemePreference()).toBe('light');
      
      localStorage.setItem('theme-preference', 'system');
      expect(getSavedThemePreference()).toBe('system');
    });

    test('returns system when no preference is saved', () => {
      expect(getSavedThemePreference()).toBe('system');
    });

    test('returns system when invalid preference is saved', () => {
      localStorage.setItem('theme-preference', 'invalid');
      expect(getSavedThemePreference()).toBe('system');
    });
  });

  describe('addSystemThemeChangeListener', () => {
    test('adds event listener for system theme changes', () => {
      const mockMediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockReturnValue(mockMediaQuery),
      });

      const mockCallback = jest.fn();
      addSystemThemeChangeListener(mockCallback);

      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    test('removal function removes event listener', () => {
      const mockMediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockReturnValue(mockMediaQuery),
      });

      const mockCallback = jest.fn();
      const removeListener = addSystemThemeChangeListener(mockCallback);
      
      removeListener();
      
      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    test('callback is called with current system preference', () => {
      const mockMediaQuery = {
        matches: true, // System prefers dark mode
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockReturnValue(mockMediaQuery),
      });

      const mockCallback = jest.fn();
      addSystemThemeChangeListener(mockCallback);
      
      // Simulate a theme change event
      const [[, changeListener]] = mockMediaQuery.addEventListener.mock.calls;
      changeListener({ matches: true });
      
      expect(mockCallback).toHaveBeenCalledWith(true);
    });
  });
});