/**
 * Material 3 App Bar Component
 * Top-level application bar with branding and actions
 */

'use client';

import React from 'react';
import Link from 'next/link';
import type { Material3ElevationLevel, Material3ShapeSize } from '../types';

export interface Material3AppBarProps {
  title?: string;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  elevation?: Material3ElevationLevel;
  variant?: 'small' | 'medium' | 'large';
  shape?: Material3ShapeSize;
  scrollBehavior?: 'fixed' | 'scroll' | 'elevate';
  className?: string;
  onLogoClick?: () => void;
}

const Material3AppBar = React.forwardRef<HTMLElement, Material3AppBarProps>(({
  title,
  logo,
  actions,
  elevation = 0,
  variant = 'medium',
  shape = 'none',
  scrollBehavior = 'elevate',
  className = '',
  onLogoClick,
}, ref) => {
  const [scrolled, setScrolled] = React.useState(false);

  // Handle scroll behavior
  React.useEffect(() => {
    if (scrollBehavior === 'elevate') {
      const handleScroll = () => {
        const isScrolled = window.scrollY > 0;
        setScrolled(isScrolled);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [scrollBehavior]);

  // Base classes
  const baseClasses = [
    'relative',
    'w-full',
    'bg-surface',
    'transition-all',
    'm3-duration-medium1',
    'm3-motion-easing-standard',
    `m3-shape-${shape}`,
  ];

  // Variant-specific classes
  const variantClasses = {
    small: [
      'h-16',
    ],
    medium: [
      'h-16',
    ],
    large: [
      'h-20',
      'md:h-24',
    ],
  };

  // Scroll behavior classes
  const scrollClasses = {
    fixed: [
      'sticky',
      'top-0',
      'z-50',
      `m3-elevation-${elevation}`,
    ],
    scroll: [],
    elevate: [
      'sticky',
      'top-0',
      'z-50',
      scrolled ? 'm3-elevation-2' : `m3-elevation-${elevation}`,
    ],
  };

  // Container classes
  const containerClasses = [
    'flex',
    'items-center',
    'justify-between',
    'h-full',
    'px-4',
    'md:px-6',
    'max-w-screen-xl',
    'mx-auto',
  ];

  // Logo/Brand classes
  const logoClasses = [
    'flex',
    'items-center',
    'gap-3',
    'min-w-0',
    'flex-shrink-0',
    'outline-none',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-primary',
    'm3-shape-sm',
    'transition-all',
    'm3-duration-short4',
    'm3-motion-easing-standard',
  ];

  // Title classes
  const titleClasses = [
    'm3-headline-small',
    'md:m3-headline-medium',
    'text-on-surface',
    'font-normal',
    'truncate',
    'min-w-0',
    'flex-grow',
  ];

  // Actions container classes
  const actionsClasses = [
    'flex',
    'items-center',
    'gap-2',
    'flex-shrink-0',
  ];

  // Combine all classes
  const appBarClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    ...scrollClasses[scrollBehavior],
    className,
  ].filter(Boolean).join(' ');

  const logoContent = (
    <div className={logoClasses.join(' ')}>
      {logo && (
        <div className="flex items-center justify-center w-8 h-8 text-primary">
          {logo}
        </div>
      )}
      {title && (
        <h1 className={titleClasses.join(' ')}>
          {title}
        </h1>
      )}
    </div>
  );

  return (
    <header ref={ref} className={appBarClasses} role="banner">
      <div className={containerClasses.join(' ')}>
        {/* Logo/Brand Section */}
        {onLogoClick ? (
          <button
            type="button"
            onClick={onLogoClick}
            className="text-left hover:bg-on-surface/8 active:bg-on-surface/12 rounded-sm p-2 -m-2"
            aria-label="Go to home"
          >
            {logoContent}
          </button>
        ) : title || logo ? (
          <Link href="/" className="hover:bg-on-surface/8 active:bg-on-surface/12 rounded-sm p-2 -m-2">
            {logoContent}
          </Link>
        ) : null}

        {/* Actions Section */}
        {actions && (
          <div className={actionsClasses.join(' ')}>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
});

Material3AppBar.displayName = 'Material3AppBar';

export default Material3AppBar;