'use client';

import { useThemeContext } from '../context/theme/ThemeContext';

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
  } catch {
    // Rethrow with our hook's name for better error messages
    throw new Error('useTheme must be used within a ThemeProvider');
  }
}