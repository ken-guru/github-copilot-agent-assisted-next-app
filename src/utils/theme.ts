/**
 * Theme utility functions for managing application theme
 */

/**
 * Check if dark theme is currently applied
 * @returns boolean indicating whether dark theme is active
 */
export const isDarkTheme = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark-mode');
};

/**
 * Apply dark theme to the document
 */
export const applyDarkTheme = (): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.add('dark-mode');
  document.documentElement.classList.remove('light-mode');
};

/**
 * Apply light theme to the document
 */
export const applyLightTheme = (): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.add('light-mode');
  document.documentElement.classList.remove('dark-mode');
};

/**
 * Apply system theme based on user's preference
 * @returns string indicating which theme was applied ('dark' or 'light')
 */
export const applySystemTheme = (): string => {
  const prefersDark = typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (prefersDark) {
    applyDarkTheme();
    return 'dark';
  } else {
    applyLightTheme();
    return 'light';
  }
};

/**
 * Get user's preferred theme from localStorage or system preference
 * @returns string representing the theme ('dark', 'light', or null for system preference)
 */
export const getUserThemePreference = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('theme');
};

/**
 * Set user's theme preference in localStorage
 * @param theme - 'dark', 'light', or null for system preference
 */
export const setUserThemePreference = (theme: string | null): void => {
  if (typeof window === 'undefined') return;
  
  if (theme === null) {
    window.localStorage.removeItem('theme');
  } else {
    window.localStorage.setItem('theme', theme);
  }
};
