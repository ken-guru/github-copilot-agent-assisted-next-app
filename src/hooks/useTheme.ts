import { useThemeContext, type Theme } from '@/context/theme/ThemeContext';

export interface ThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  enableTransitions: () => void;
  disableTransitions: () => void;
}

export const useTheme = (): ThemeContext => {
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
};

// Utility function to check dark mode state
export const getIsDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark-mode') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches &&
     !document.documentElement.classList.contains('light-mode'));
};