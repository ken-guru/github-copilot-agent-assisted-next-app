import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Default context value - must be the same on server and client for initial render
const defaultThemeContext: ThemeContextType = {
  isDarkMode: false, // Always start with light mode for consistent SSR
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Always initialize with light mode for consistent SSR
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Track client-side hydration status
  const [isClient, setIsClient] = useState(false);
  
  // Use a ref to track if we've applied the initial theme
  const initialThemeApplied = React.useRef(false);
  
  // Effect to check for stored preference - client side only
  useEffect(() => {
    if (typeof window !== 'undefined' && !initialThemeApplied.current) {
      initialThemeApplied.current = true;
      setIsClient(true);
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        setIsDarkMode(true);
        // Defer DOM manipulation until after hydration is complete
        setTimeout(() => {
          document.documentElement.classList.add('dark-mode');
        }, 0);
      } else {
        // Ensure dark-mode class is removed if preference is light
        // Defer DOM manipulation until after hydration is complete
        setTimeout(() => {
          document.documentElement.classList.remove('dark-mode');
        }, 0);
      }
    }
  }, []);
  
  // Effect to update class and store preference when theme changes
  useEffect(() => {
    if (isClient) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDarkMode, isClient]);
  
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  
  const value = {
    isDarkMode,
    toggleTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
