import { useContext } from 'react';
import { ThemeContext } from '@/context/theme/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Utility function to check dark mode state
export const getIsDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark-mode') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches &&
     !document.documentElement.classList.contains('light-mode'));
};