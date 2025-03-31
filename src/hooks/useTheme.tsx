'use client';

import { useThemeContext } from '../context/theme/ThemeContext';
import type { Theme } from '../context/theme/ThemeContext';

/**
 * A hook to access and control the application theme
 * 
 * @returns An object containing:
 * - theme: The current theme ('light', 'dark', or 'system')
 * - setTheme: Function to update the theme
 * - isDark: Boolean indicating if dark mode is active
 * - enableTransitions: Function to enable theme transitions
 * - disableTransitions: Function to disable theme transitions
 */
export function useTheme() {
  try {
    const themeContext = useThemeContext();
    
    return {
      theme: themeContext.theme,
      setTheme: themeContext.setTheme,
      isDark: themeContext.isDark,
      enableTransitions: themeContext.enableTransitions,
      disableTransitions: themeContext.disableTransitions
    };
  } catch (error) {
    // Rethrow with our hook's name for better error messages
    throw new Error('useTheme must be used within a ThemeProvider');
  }
}

/**
 * Get the current theme mode without using the React context
 * 
 * @returns Boolean indicating if dark mode is active
 */
export function getIsDarkMode(): boolean {
  if (typeof window === 'undefined') {
    return false; // Default to light during SSR
  }
  
  return document.documentElement.classList.contains('dark-mode') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches &&
     !document.documentElement.classList.contains('light-mode'));
}