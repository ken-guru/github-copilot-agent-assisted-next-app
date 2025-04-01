import { useThemeContext } from '../context/theme/ThemeContext';
import type { Theme } from '../context/theme/ThemeContext';

/**
 * Hook to access and manipulate theme settings
 */
export function useTheme() {
  const themeContext = useThemeContext();
  
  return {
    theme: themeContext.theme,
    setTheme: themeContext.setTheme,
    isDarkMode: themeContext.isDark,
    enableTransitions: themeContext.enableTransitions,
    disableTransitions: themeContext.disableTransitions
  };
}