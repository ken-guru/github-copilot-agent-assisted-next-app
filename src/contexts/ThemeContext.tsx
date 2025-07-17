'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  
  // Initialize theme from localStorage on mount
  useEffect(() => {
    // Add a slight delay to avoid hydration mismatch
    // This ensures the component is fully hydrated before we make any DOM changes
    const timer = setTimeout(() => {
      // Check what's already been applied by the inline script or ThemeToggle
      const currentTheme = document.documentElement.getAttribute('data-theme') as Theme;
      const savedTheme = localStorage.getItem('theme') as Theme;
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme);
        // Only apply if different from what's already set
        if (currentTheme !== savedTheme) {
          applyThemeToDOM(savedTheme);
        }
      } else {
        // Check for system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        setTheme(initialTheme);
        // Only apply if different from what's already set
        if (currentTheme !== initialTheme) {
          applyThemeToDOM(initialTheme);
        }
      }
    }, 50); // Slightly longer delay to let ThemeToggle initialize first
    
    return () => clearTimeout(timer);
  }, []);
  
  // Helper function to apply theme consistently across the app
  const applyThemeToDOM = (themeValue: Theme) => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    
    // Only update if the theme is actually changing
    if (themeValue !== currentTheme) {
      if (themeValue === 'dark') {
        root.classList.add('dark-mode');
        root.classList.add('dark');
        root.classList.remove('light-mode');
        root.setAttribute('data-theme', 'dark');
        root.setAttribute('data-bs-theme', 'dark');
        // Also set on body for Bootstrap Modal portals
        document.body.setAttribute('data-bs-theme', 'dark');
      } else {
        root.classList.add('light-mode');
        root.classList.remove('dark-mode');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        root.setAttribute('data-bs-theme', 'light');
        // Also set on body for Bootstrap Modal portals
        document.body.setAttribute('data-bs-theme', 'light');
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyThemeToDOM(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
