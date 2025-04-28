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
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme);
        applyThemeToDOM(savedTheme);
      } else {
        // Check for system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        setTheme(initialTheme);
        applyThemeToDOM(initialTheme);
      }
    }, 0);
    
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
      } else {
        root.classList.add('light-mode');
        root.classList.remove('dark-mode');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
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
