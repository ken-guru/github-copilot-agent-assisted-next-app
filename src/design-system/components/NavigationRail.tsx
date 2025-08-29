/**
 * Material 3 Navigation Rail Component
 * Vertical navigation component for desktop and tablet viewports
 * Implements Material 3 navigation rail patterns with design tokens
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Material3ElevationLevel } from '../types';
import { getTouchTargetSize, isTouchDevice, createRippleEffect } from '../utils/mobile-touch';

export interface Material3NavigationRailItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

export interface Material3NavigationRailProps {
  items: Material3NavigationRailItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  elevation?: Material3ElevationLevel;
  className?: string;
  compact?: boolean;
  onItemClick?: (href: string) => void;
}

const Material3NavigationRail = React.forwardRef<HTMLElement, Material3NavigationRailProps>(({
  items,
  header,
  footer,
  elevation = 1,
  className = '',
  compact = false,
  onItemClick,
}, ref) => {
  const pathname = usePathname();

  // Base classes for navigation rail container
  const baseClasses = [
    'fixed',
    'left-0',
    'top-0',
    'bottom-0',
    'z-30',
    'flex',
    'flex-col',
    'bg-surface',
    'border-r',
    'border-outline-variant',
    `m3-elevation-${elevation}`,
    'm3-motion-navigation',
    'm3-duration-medium1',
    'm3-motion-easing-standard',
  ];

  // Size classes based on compact mode
  const sizeClasses = compact 
    ? ['w-14'] // 56px compact width
    : ['w-20']; // 80px standard width

  // Header container classes
  const headerClasses = [
    'flex',
    'items-center',
    'justify-center',
    'h-16',
    'px-3',
    'border-b',
    'border-outline-variant/12',
  ];

  // Items container classes
  const itemsContainerClasses = [
    'flex',
    'flex-col',
    'flex-1',
    'gap-3',
    'px-3',
    'py-6',
    'overflow-y-auto',
  ];

  // Footer container classes
  const footerClasses = [
    'flex',
    'items-center',
    'justify-center',
    'h-16',
    'px-3',
    'border-t',
    'border-outline-variant/12',
  ];

  // Combine all classes
  const railClasses = [
    ...baseClasses,
    ...sizeClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <nav ref={ref} className={railClasses} role="navigation" aria-label="Main navigation">
      {/* Header */}
      {header && (
        <div className={headerClasses.join(' ')}>
          {header}
        </div>
      )}

      {/* Navigation Items */}
      <div className={itemsContainerClasses.join(' ')}>
        {items.map((item) => (
          <Material3NavigationRailItem
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            compact={compact}
            onClick={onItemClick}
          />
        ))}
      </div>

      {/* Footer */}
      {footer && (
        <div className={footerClasses.join(' ')}>
          {footer}
        </div>
      )}
    </nav>
  );
});

Material3NavigationRail.displayName = 'Material3NavigationRail';

interface Material3NavigationRailItemProps {
  item: Material3NavigationRailItem;
  isActive: boolean;
  compact: boolean;
  onClick?: (href: string) => void;
}

const Material3NavigationRailItem: React.FC<Material3NavigationRailItemProps> = ({
  item,
  isActive,
  compact,
  onClick,
}) => {
  const { href, label, icon, badge, disabled = false } = item;
  const isTouch = isTouchDevice();
  const touchTarget = getTouchTargetSize('medium');

  // Base classes for navigation rail item with touch target compliance
  const baseClasses = [
    'relative',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'w-full',
    isTouch ? 'min-h-[48px]' : 'h-14', // Ensure 48px minimum on touch devices
    'p-2',
    'text-center',
    'transition-all',
    'm3-duration-short4',
    'm3-motion-easing-standard',
    'outline-none',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-primary',
    'm3-shape-medium',
  ];

  // State-specific classes
  const stateClasses = disabled
    ? [
        'opacity-38',
        'cursor-not-allowed',
        'pointer-events-none',
      ]
    : isActive
    ? [
        'text-on-secondary-container',
        'cursor-default',
      ]
    : [
        'text-on-surface-variant',
        'hover:text-on-surface',
        'active:text-on-surface',
        'cursor-pointer',
      ];

  // Interactive background classes
  const backgroundClasses = disabled
    ? []
    : isActive
    ? [
        'bg-secondary-container',
      ]
    : [
        'hover:bg-on-surface/8',
        'active:bg-on-surface/12',
      ];

  // Active indicator classes
  const indicatorClasses = isActive && !disabled
    ? [
        'after:absolute',
        'after:left-0',
        'after:top-1/2',
        'after:-translate-y-1/2',
        'after:w-1',
        'after:h-8',
        'after:bg-primary',
        'after:rounded-r-full',
      ]
    : [];

  // Combine all classes
  const itemClasses = [
    ...baseClasses,
    ...stateClasses,
    ...backgroundClasses,
    ...indicatorClasses,
  ].filter(Boolean).join(' ');

  // Handle click with ripple effect
  const handleClick = React.useCallback((event: React.MouseEvent) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    // Create ripple effect
    createRippleEffect(event.currentTarget as HTMLElement, event.nativeEvent, {
      color: isActive ? 'rgba(var(--md-sys-color-on-secondary-container), 0.12)' : 'rgba(var(--md-sys-color-on-surface), 0.12)',
      bounded: true,
      duration: 600
    });

    onClick?.(href);
  }, [disabled, href, onClick, isActive]);

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(href);
    }
  }, [disabled, href, onClick]);

  const content = (
    <div
      className={itemClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled}
    >
      {/* Icon container */}
      <div className="relative flex items-center justify-center w-6 h-6 mb-1">
        {icon}
        
        {/* Badge */}
        {badge && (
          <div
            className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-error text-on-error text-xs font-medium rounded-full flex items-center justify-center"
            aria-label={`${badge} notifications`}
          >
            {typeof badge === 'number' && badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>

      {/* Label - Only show if not compact or always show with tooltip */}
      {!compact && (
        <span className="m3-label-small truncate max-w-full leading-tight">
          {label}
        </span>
      )}
      
      {/* Tooltip for compact mode */}
      {compact && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-inverse-surface text-inverse-on-surface text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity m3-duration-short4 z-50 whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );

  return disabled ? (
    content
  ) : (
    <Link href={href} className="block w-full group">
      {content}
    </Link>
  );
};

export default Material3NavigationRail;