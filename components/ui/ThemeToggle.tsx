'use client';

import { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.css';
import { validateThemeColors } from '@lib/utils/colors';  // Updated import path

export default function ThemeToggle() {
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

  /**
   * Apply theme to document and save preference
   */
  function applyTheme(newTheme: string) {
    const root = document.documentElement;
    const isValid = validateThemeColors();
    
    if (!isValid) {
      console.warn(`Theme "${newTheme}" is not valid, fallback to light theme`);
      newTheme = 'light';
    }
    
    // Remove existing theme classes
    root.classList.remove('light-mode', 'dark-mode', 'system-mode');
    
    if (newTheme === 'system') {
      // For system theme, apply based on user preference
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isDarkMode ? 'dark-mode' : 'light-mode');
      root.classList.add('system-mode');
    } else {
      // Apply specific theme class
      root.classList.add(`${newTheme}-mode`);
    }
    
    // Update document attributes for accessibility
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  /**
   * Toggle theme and save to localStorage
   */
  function toggleTheme(newTheme: string) {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className={styles.placeholder} aria-hidden="true" />;
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'Auto', icon: '⚙️' }
  ];

  return (
    <div className={styles.container} role="group" aria-label="Theme selection">
      <div className={styles.toggleGroup}>
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleTheme(option.value)}
            className={`${styles.toggleButton} ${theme === option.value ? styles.active : ''}`}
            aria-pressed={theme === option.value}
            aria-label={`${option.label} theme`}
            title={`${option.label} theme`}
          >
            <span aria-hidden="true">{option.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
