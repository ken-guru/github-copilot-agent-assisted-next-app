'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getSystemPrefersDark, applyThemeToDocument, saveThemePreference, getSavedThemePreference, addSystemThemeChangeListener } from '../utils/theme/themeUtils';

// Define theme types
export type ThemePreference = 'light' | 'dark' | 'system';

// Define context type
export interface ThemeContextType {
  theme: ThemePreference;
  isDarkMode: boolean;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
}

// Create context with default values
export const ThemeContext = createContext<ThemeContextType | null>(null);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or default to system
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    // Use system preference by default
    return getSavedThemePreference();
  });

  // Track whether dark mode is active based on theme and system preference
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    return getSystemPrefersDark();
  });

  // Handle theme changes
  const setTheme = useCallback((newTheme: ThemePreference) => {
    setThemeState(newTheme);
    saveThemePreference(newTheme);
  }, []);

  // Toggle between light, dark, and system
  const toggleTheme = useCallback(() => {
    setThemeState(currentTheme => {
      const nextTheme = currentTheme === 'light' ? 'dark' : 
                        currentTheme === 'dark' ? 'system' : 'light';
      saveThemePreference(nextTheme);
      return nextTheme;
    });
  }, []);

  // Derive isDarkMode from theme and system preference
  const isDarkMode = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return systemPrefersDark;
  }, [theme, systemPrefersDark]);

  // Listen for system theme changes and update the UI
  useEffect(() => {
    const removeListener = addSystemThemeChangeListener((prefersDark) => {
      setSystemPrefersDark(prefersDark);
    });
    
    // Clean up listener on unmount
    return () => removeListener();
  }, []);

  // Apply theme to document when it changes
  useEffect(() => {
    applyThemeToDocument(isDarkMode);
  }, [isDarkMode]);

  // Create context value
  const contextValue = useMemo(() => ({
    theme,
    isDarkMode,
    setTheme,
    toggleTheme,
  }), [theme, isDarkMode, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};