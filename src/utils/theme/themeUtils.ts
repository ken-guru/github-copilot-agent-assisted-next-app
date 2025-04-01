/**
 * Utility functions for theme management
 */

import type { ThemePreference } from '../../context/ThemeContext';

/**
 * Check if the current theme is dark mode
 * @returns true if dark mode is active
 */
export function getIsDarkMode(): boolean {
  // If we have an explicit class set, use that
  if (typeof document !== 'undefined') {
    if (document.documentElement.classList.contains('dark-mode')) {
      return true;
    }
    if (document.documentElement.classList.contains('light-mode')) {
      return false;
    }
  }
  
  // Otherwise, check the system preference
  return getSystemPrefersDark();
}

/**
 * Check if the system prefers dark mode
 * @returns true if the system prefers dark mode
 */
export function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') {
    return false; // Default for SSR
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Apply a theme to the document
 * @param isDarkMode Whether to apply dark mode
 */
export function applyThemeToDocument(isDarkMode: boolean): void {
  if (typeof document !== 'undefined') {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }
}

/**
 * Save the theme preference to localStorage
 * @param theme The theme preference to save
 */
export function saveThemePreference(theme: ThemePreference): void {
  if (typeof window === 'undefined') {
    return; // Skip during SSR
  }
  
  // Always use setItem (including for 'system') to match test expectations
  localStorage.setItem('theme-preference', theme);
}

/**
 * Get the saved theme preference from localStorage
 * @returns The saved theme preference, or 'system' if none is saved
 */
export function getSavedThemePreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system'; // Default for SSR
  }
  
  const savedPreference = localStorage.getItem('theme-preference');
  
  if (savedPreference === 'light' || savedPreference === 'dark') {
    return savedPreference;
  }
  
  return 'system';
}

/**
 * Add a listener for system theme changes
 * @param callback Function to call when the system theme changes
 * @returns Function to remove the listener
 */
export function addSystemThemeChangeListener(
  callback: (isDarkMode: boolean) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {}; // No-op for SSR
  }
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };
  
  // Add the callback to mediaQuery changes
  mediaQuery.addEventListener('change', handler);
  
  // Call once with the current value
  callback(mediaQuery.matches);
  
  // Return a cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}