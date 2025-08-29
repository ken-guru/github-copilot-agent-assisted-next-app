/**
 * Material 3 Theme Toggle Component
 * Allows users to switch between light, dark, and system themes
 */

'use client';

import React from 'react';

export interface Material3ThemeToggleProps {
  theme?: 'light' | 'dark' | 'system';
  size?: 'small' | 'medium' | 'large';
  variant?: 'standard' | 'icon-only';
  disabled?: boolean;
  className?: string;
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
}

// Icons for theme states
const LightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
  </svg>
);

const DarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
  </svg>
);

const SystemIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v1h12v-1l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/>
  </svg>
);

const Material3ThemeToggle = React.forwardRef<HTMLButtonElement, Material3ThemeToggleProps>(
  (
    {
      theme: initialTheme = 'system',
      size = 'medium',
      variant = 'standard',
      disabled = false,
      className = '',
      onThemeChange,
    },
    ref
  ) => {
    const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark' | 'system'>(initialTheme);

    // Update internal state when theme prop changes
    React.useEffect(() => {
      setCurrentTheme(initialTheme);
    }, [initialTheme]);

    // Size classes
    const sizeClasses = {
      small: {
        container: 'h-8',
        button: 'h-8 w-8 text-sm',
      },
      medium: {
        container: 'h-10',
        button: 'h-10 w-10',
      },
      large: {
        container: 'h-12',
        button: 'h-12 w-12 text-lg',
      },
    };

    // Base button classes
    const baseButtonClasses = [
      'relative',
      'flex',
      'items-center',
      'justify-center',
      'border-none',
      'outline-none',
      'cursor-pointer',
      'transition-all',
      'm3-duration-short4',
      'm3-motion-easing-standard',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-primary',
      'm3-shape-full',
    ];

    // Theme options
    const themes: Array<{
      value: 'light' | 'dark' | 'system';
      label: string;
      icon: React.ReactNode;
    }> = [
      { value: 'light', label: 'Light', icon: <LightIcon /> },
      { value: 'dark', label: 'Dark', icon: <DarkIcon /> },
      { value: 'system', label: 'System', icon: <SystemIcon /> },
    ];

    const handleThemeChange = React.useCallback((theme: 'light' | 'dark' | 'system') => {
      setCurrentTheme(theme);
      onThemeChange?.(theme);
    }, [onThemeChange]);

    if (variant === 'icon-only') {
      // Single button that cycles through themes
      const currentThemeIndex = Math.max(0, themes.findIndex(t => t.value === currentTheme));
      const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
      const currentThemeData = themes[currentThemeIndex];
      const nextThemeData = themes[nextThemeIndex];
      
      if (!currentThemeData || !nextThemeData) {
        return null;
      }
      
      const buttonClasses = [
        ...baseButtonClasses,
        sizeClasses[size].button,
        'bg-surface-container-highest',
        'text-on-surface',
        'hover:bg-surface-container-high',
        'active:bg-surface-container',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ].join(' ');

      return (
        <button
          ref={ref}
          type="button"
          className={buttonClasses}
          onClick={() => !disabled && handleThemeChange(nextThemeData.value)}
          disabled={disabled}
          aria-label="Toggle theme"
          title={`Current: ${currentThemeData.label}, click for ${nextThemeData.label}`}
        >
          {currentThemeData.icon}
        </button>
      );
    }

    // Standard toggle group
    const containerClasses = [
      'flex',
      'items-center',
      'bg-surface-container-highest',
      'm3-shape-full',
      'p-1',
      'gap-1',
      sizeClasses[size].container,
      className,
    ].join(' ');

    return (
      <div className={containerClasses} role="group" aria-label="Theme selection">
        {themes.map((theme) => {
          const isActive = currentTheme === theme.value;
          
          const buttonClasses = [
            ...baseButtonClasses,
            sizeClasses[size].button,
            isActive
              ? [
                  'bg-secondary-container',
                  'text-on-secondary-container',
                  'shadow-sm',
                ]
              : [
                  'bg-transparent',
                  'text-on-surface-variant',
                  'hover:bg-on-surface/8',
                  'active:bg-on-surface/12',
                ],
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ].flat().join(' ');

          return (
            <button
              key={theme.value}
              ref={isActive ? ref : undefined}
              type="button"
              className={buttonClasses}
              onClick={() => !disabled && handleThemeChange(theme.value)}
              disabled={disabled}
              aria-label={`Switch to ${theme.label} theme`}
              aria-pressed={isActive}
              title={theme.label}
            >
              {theme.icon}
              {variant === 'standard' && <span className="ml-2">{theme.label}</span>}
            </button>
          );
        })}
      </div>
    );
  }
);

Material3ThemeToggle.displayName = 'Material3ThemeToggle';

export default Material3ThemeToggle;