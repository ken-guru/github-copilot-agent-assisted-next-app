'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
};

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  setDarkMode: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize dark mode based on system preference, but default to false if SSR
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Initialize dark mode from system preference on mount (client-side only)
  useEffect(() => {
    // Check if browser prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check if user has a saved preference
    const savedPreference = localStorage.getItem('darkMode');
    
    if (savedPreference !== null) {
      // Use the saved preference if it exists
      setIsDarkMode(savedPreference === 'true');
    } else {
      // Otherwise use the system preference
      setIsDarkMode(prefersDark);
    }
  }, []);
  
  // Apply dark mode class to document body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    
    // Save user preference to localStorage
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);
  
  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };
    
    // Add event listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  // Set dark mode explicitly
  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}