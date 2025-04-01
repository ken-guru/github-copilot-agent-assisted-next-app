import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { validateThemeColors } from '../utils/colors';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const isDark = newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.remove('light-mode', 'dark-mode');
    root.classList.add(isDark ? 'dark-mode' : 'light-mode');

    // Save preference to localStorage unless it's system default
    if (newTheme !== 'system') {
      localStorage.setItem('theme', newTheme);
    } else {
      localStorage.removeItem('theme');
    }

    // Validate contrast ratios after theme change
    validateThemeColors();
  };

  // Handle system preference changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // Initialize theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('system');
    }
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}