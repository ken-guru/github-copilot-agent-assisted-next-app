import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  systemTheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  systemTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
    
    // Detect system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Set up listener for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => {
      switch (prevTheme) {
        case 'light': return 'dark';
        case 'dark': return 'system';
        case 'system': return 'light';
        default: return 'system';
      }
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, systemTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
