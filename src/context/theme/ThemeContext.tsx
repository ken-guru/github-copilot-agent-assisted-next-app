'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';

// Define the Theme type
export type Theme = 'light' | 'dark' | 'system';

// Define the context shape
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  enableTransitions: () => void;
  disableTransitions: () => void;
}

// Create the context with a default value that will be overridden
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Constant for theme preference key
const THEME_PREFERENCE_KEY = 'theme-preference';
const THEME_KEY = 'theme'; // Secondary key for compatibility

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  // Check if system prefers dark mode
  const isSystemDarkMode = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  // Apply the theme to the DOM by adding appropriate classes
  const applyThemeClasses = useCallback((isDarkMode: boolean) => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    root.classList.remove('dark-mode', 'light-mode');
    root.classList.add(isDarkMode ? 'dark-mode' : 'light-mode');
  }, []);

  // Apply the theme to state and DOM
  const applyTheme = useCallback((newTheme: Theme) => {
    const isDarkMode = 
      newTheme === 'dark' || 
      (newTheme === 'system' && isSystemDarkMode());

    setIsDark(isDarkMode);
    applyThemeClasses(isDarkMode);
  }, [isSystemDarkMode, applyThemeClasses]);

  // Set theme and handle side effects
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      if (newTheme === 'system') {
        localStorage.removeItem(THEME_PREFERENCE_KEY);
        localStorage.removeItem(THEME_KEY);
      } else {
        localStorage.setItem(THEME_PREFERENCE_KEY, newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
      }
    }
  }, [applyTheme]);

  // Enable CSS transitions for theme changes
  const enableTransitions = useCallback(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.add('theme-transitions');
  }, []);

  // Disable CSS transitions
  const disableTransitions = useCallback(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.remove('theme-transitions');
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Get theme from localStorage
    const storedThemePreference = localStorage.getItem(THEME_PREFERENCE_KEY) as Theme | null;
    const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const validThemes: Theme[] = ['light', 'dark', 'system'];
    
    if (storedThemePreference && validThemes.includes(storedThemePreference)) {
      setThemeState(storedThemePreference);
      applyTheme(storedThemePreference);
    } else if (storedTheme && validThemes.includes(storedTheme)) {
      setThemeState(storedTheme);
      applyTheme(storedTheme);
    } else {
      setThemeState('system');
      applyTheme('system');
    }

    // Add transition class after a slight delay
    const timer = setTimeout(() => {
      enableTransitions();
    }, 100);

    return () => clearTimeout(timer);
  }, [applyTheme, enableTransitions]);

  // Handle system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDark(e.matches);
        applyThemeClasses(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyThemeClasses]);

  // Provide the context value
  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    isDark,
    enableTransitions,
    disableTransitions
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Context consumer hook
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Export a more concisely named hook for better usability
export const useTheme = useThemeContext;