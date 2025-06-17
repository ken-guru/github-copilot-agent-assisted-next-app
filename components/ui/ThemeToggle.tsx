'use client';

import { useState, useEffect } from 'react';
import { validateThemeColors } from '@lib/utils/colors';  // Updated import path

/**
 * Props for the ThemeToggle component
 * Currently, this component doesn't accept any props but we define the interface
 * for consistency and future extensibility
 * 
 * @interface ThemeToggleProps
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ThemeToggleProps {}

/**
 * ThemeToggle component allows users to switch between light, dark, and system themes
 * The selected theme is stored in localStorage and applied to the document
 */
export default function ThemeToggle({}: ThemeToggleProps) {
  const [theme, setTheme] = useState('system');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Apply system preference on initial load
      const darkModePreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(darkModePreferred ? 'dark' : 'light');
    }
  }, []);

  // Handle system preference changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    // Return a placeholder or null to avoid rendering mismatch during SSR
    // Or, better, ensure this component is only rendered client-side if it heavily relies on window/localStorage
    return <div /* className={styles.themeToggle} */ aria-hidden="true" />;
  }

  return (
    <div /* className={styles.themeToggle} */ data-testid="theme-toggle-container">
      <button 
        // className={`${styles.button} ${theme === 'light' ? styles.active : ''}`}
        onClick={() => handleThemeChange('light')}
        aria-pressed={theme === 'light'}
        data-testid="theme-toggle-light"
      >
        Light
      </button>
      <button 
        // className={`${styles.button} ${theme === 'dark' ? styles.active : ''}`}
        onClick={() => handleThemeChange('dark')}
        aria-pressed={theme === 'dark'}
        data-testid="theme-toggle-dark"
      >
        Dark
      </button>
      <button 
        // className={`${styles.button} ${theme === 'system' ? styles.active : ''}`}
        onClick={() => handleThemeChange('system')}
        aria-pressed={theme === 'system'}
        data-testid="theme-toggle-system"
      >
        System
      </button>
    </div>
  );
}

/**
 * Applies the selected theme to the document element
 * @param {string} selectedTheme - The theme to apply ('light', 'dark', or 'system')
 */
function applyTheme(selectedTheme: string) {
  let currentTheme = selectedTheme;
  if (currentTheme === 'system') {
    currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Remove existing theme classes
  document.documentElement.classList.remove('light-mode', 'dark-mode');
  document.documentElement.removeAttribute('data-theme'); // Remove data-theme attribute

  // Add new theme class and data-theme attribute
  if (currentTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    document.documentElement.setAttribute('data-theme', 'light');
  } else if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // Validate and apply theme colors (if this function is still relevant)
  // Consider if validateThemeColors is still needed or how it interacts with Bootstrap
  validateThemeColors(); 
}
