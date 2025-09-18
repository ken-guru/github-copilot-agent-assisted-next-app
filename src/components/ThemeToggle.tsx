'use client';

import { useState, useEffect } from 'react';
import { ButtonGroup, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { validateThemeColors } from '../utils/colors';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'navbar' | 'standalone';
}

export default function ThemeToggle({ size = 'md', variant = 'standalone' }: ThemeToggleProps) {
  const [theme, setTheme] = useState('system');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    
    // Get the theme that was set by the inline script during page load
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
      setTheme(savedTheme);
      // Only apply if it differs from what's already set
      if (savedTheme !== 'system') {
        const expectedTheme = savedTheme;
        if (currentTheme !== expectedTheme) {
          applyTheme(savedTheme);
        }
      } else {
        // For system theme, apply based on current system preference
        const darkModePreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = darkModePreferred ? 'dark' : 'light';
        if (currentTheme !== systemTheme) {
          applyTheme('system');
        }
      }
    } else {
      // No saved theme, use system preference
      const darkModePreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = darkModePreferred ? 'dark' : 'light';
      setTheme('system');
      if (currentTheme !== systemTheme) {
        applyTheme('system');
      }
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

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement;
    const isDark = newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const currentDataTheme = root.getAttribute('data-theme');
    const targetTheme = isDark ? 'dark' : 'light';
    
    // Only apply changes if the target theme is different from current
    if (currentDataTheme !== targetTheme) {
      // Apply appropriate classes for different styling mechanisms
      if (isDark) {
        root.classList.add('dark-mode');
        root.classList.add('dark'); // For styles/globals.css
        root.classList.remove('light-mode');
        root.setAttribute('data-theme', 'dark'); // For ThemeContext
        root.setAttribute('data-bs-theme', 'dark'); // For Bootstrap dark mode
        // Also set on body for Bootstrap Modal portals (check if body exists)
        if (document.body) {
          document.body.setAttribute('data-bs-theme', 'dark');
        }
      } else {
        root.classList.add('light-mode');
        root.classList.remove('dark-mode');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light'); // For ThemeContext
        root.setAttribute('data-bs-theme', 'light'); // For Bootstrap light mode
        // Also set on body for Bootstrap Modal portals (check if body exists)
        if (document.body) {
          document.body.setAttribute('data-bs-theme', 'light');
        }
      }
    }

    // Save preference to localStorage unless it's system default
    if (newTheme !== 'system') {
      localStorage.setItem('theme', newTheme);
    } else {
      localStorage.removeItem('theme');
    }

    // Validate contrast ratios after theme change
    setTimeout(() => {
      validateThemeColors();
    }, 100); // Small delay to ensure CSS variables are updated
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Configure sizing based on props
  const buttonSize = size === 'sm' ? '32px' : size === 'lg' ? '48px' : '44px';
  const iconSize = size === 'sm' ? '16px' : size === 'lg' ? '24px' : '20px';
  const totalWidth = variant === 'navbar' 
    ? `calc(3 * ${buttonSize} + 0.5rem)` // Smaller gaps for navbar
    : `calc(3 * ${buttonSize} + 1rem)`; // Standard gaps for standalone

  // Only render the toggle once mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div style={{ width: totalWidth, height: buttonSize, display: 'flex', alignItems: 'center' }}>
        <ButtonGroup size="sm" role="group" aria-label="Theme selection">
          <Button variant="outline-secondary" disabled style={{ width: buttonSize, height: buttonSize }}>
            <div style={{ width: iconSize, height: iconSize }} />
          </Button>
          <Button variant="outline-secondary" disabled style={{ width: buttonSize, height: buttonSize }}>
            <div style={{ width: iconSize, height: iconSize }} />
          </Button>
          <Button variant="outline-secondary" disabled style={{ width: buttonSize, height: buttonSize }}>
            <div style={{ width: iconSize, height: iconSize }} />
          </Button>
        </ButtonGroup>
      </div>
    );
  }

  return (
    <ButtonGroup size="sm" role="group" aria-label="Theme selection">
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={<Tooltip id="light-theme-tooltip">Switch to light theme</Tooltip>}
      >
        <Button
          variant={theme === 'light' ? 'secondary' : 'outline-secondary'}
          active={theme === 'light'}
          onClick={() => handleThemeChange('light')}
          aria-label="Light theme"
          title="Light theme"
          type="button"
          style={{ width: buttonSize, height: buttonSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={<Tooltip id="system-theme-tooltip">Use system theme preference</Tooltip>}
      >
        <Button
          variant={theme === 'system' ? 'secondary' : 'outline-secondary'}
          active={theme === 'system'}
          onClick={() => handleThemeChange('system')}
          aria-label="System theme"
          title="System theme"
          type="button"
          style={{ width: buttonSize, height: buttonSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={<Tooltip id="dark-theme-tooltip">Switch to dark theme</Tooltip>}
      >
        <Button
          variant={theme === 'dark' ? 'secondary' : 'outline-secondary'}
          active={theme === 'dark'}
          onClick={() => handleThemeChange('dark')}
          aria-label="Dark theme"
          title="Dark theme"
          type="button"
          style={{ width: buttonSize, height: buttonSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </Button>
      </OverlayTrigger>
    </ButtonGroup>
  );
}