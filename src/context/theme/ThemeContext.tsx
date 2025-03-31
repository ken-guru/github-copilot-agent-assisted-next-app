'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set theme and handle side effects
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  // Enable CSS transitions for theme changes
  const enableTransitions = () => {
    document.documentElement.classList.add('theme-transitions');
  };

  // Disable CSS transitions (useful when you need an immediate change without animation)
  const disableTransitions = () => {
    document.documentElement.classList.remove('theme-transitions');
  };

  // Apply the theme to the DOM
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const isDarkMode = 
      newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
    }

    // Save preference to localStorage unless it's system default
    if (newTheme !== 'system') {
      localStorage.setItem('theme', newTheme);
    } else {
      localStorage.removeItem('theme');
    }
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Initialize with system preference
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme('system');
      setIsDark(isDarkMode);
    }

    // Add transition class after a slight delay to avoid initial transition
    const timer = setTimeout(() => {
      enableTransitions();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle system preference changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDark(e.matches);
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

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
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
};