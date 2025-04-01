import { useThemeContext, type Theme } from '@/context/theme/ThemeContext';
import { getIsDarkMode } from '@/utils/themeUtils';

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

export { getIsDarkMode };