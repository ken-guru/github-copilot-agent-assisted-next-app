/**
 * Material 3 Navigation Bar Component
 * Implements Material 3 navigation patterns with responsive behavior
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Material3ElevationLevel } from '../types';

export interface Material3NavigationItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

export interface Material3NavigationProps {
  items: Material3NavigationItem[];
  variant?: 'top' | 'bottom';
  elevation?: Material3ElevationLevel;
  className?: string;
  showLabels?: boolean;
  onItemClick?: (href: string) => void;
}

const Material3Navigation = React.forwardRef<HTMLElement, Material3NavigationProps>(({
  items,
  variant = 'top',
  elevation = 2,
  className = '',
  showLabels = true,
  onItemClick,
}, ref) => {
  const pathname = usePathname();

  // Base classes for navigation container
  const baseClasses = [
    'relative',
    'w-full',
    'bg-surface-container',
    'border-b',
    'border-outline-variant',
    `m3-elevation-${elevation}`,
    'm3-motion-navigation',
    'm3-duration-medium1',
    'm3-motion-easing-standard',
  ];

  // Variant-specific classes
  const variantClasses = {
    top: [
      'sticky',
      'top-0',
      'z-40',
    ],
    bottom: [
      'fixed',
      'bottom-0',
      'left-0',
      'right-0',
      'z-40',
      'border-t',
      'border-b-0',
    ],
  };

  // Navigation container classes
  const containerClasses = [
    'flex',
    'items-center',
    'justify-center',
    'h-16',
    'px-4',
    'max-w-screen-lg',
    'mx-auto',
  ];

  // Items container classes
  const itemsClasses = [
    'flex',
    'items-center',
    'justify-center',
    'gap-2',
    'w-full',
  ];

  // Combine all classes
  const navClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  const containerCombinedClasses = containerClasses.join(' ');
  const itemsCombinedClasses = itemsClasses.join(' ');

  return (
    <nav ref={ref} className={navClasses} role="navigation" aria-label="Main navigation">
      <div className={containerCombinedClasses}>
        <div className={itemsCombinedClasses}>
          {items.map((item) => (
            <Material3NavigationItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              showLabel={showLabels}
              onClick={onItemClick}
            />
          ))}
        </div>
      </div>
    </nav>
  );
});

Material3Navigation.displayName = 'Material3Navigation';

interface Material3NavigationItemProps {
  item: Material3NavigationItem;
  isActive: boolean;
  showLabel: boolean;
  onClick?: (href: string) => void;
}

const Material3NavigationItem: React.FC<Material3NavigationItemProps> = ({
  item,
  isActive,
  showLabel,
  onClick,
}) => {
  const { href, label, icon, badge, disabled = false } = item;

  // Base classes for navigation item
  const baseClasses = [
    'relative',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'min-w-0',
    'flex-1',
    'max-w-24',
    'px-3',
    'py-2',
    'text-center',
    'transition-all',
    'm3-duration-short4',
    'm3-motion-easing-standard',
    'outline-none',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-primary',
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
        'm3-shape-full',
      ]
    : [
        'hover:bg-on-surface/8',
        'active:bg-on-surface/12',
        'm3-shape-full',
      ];

  // Combine all classes
  const itemClasses = [
    ...baseClasses,
    ...stateClasses,
    ...backgroundClasses,
  ].filter(Boolean).join(' ');

  // Handle click
  const handleClick = React.useCallback((event: React.MouseEvent) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(href);
  }, [disabled, href, onClick]);

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
      {/* Active indicator */}
      {isActive && (
        <div
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary m3-shape-full"
          aria-hidden="true"
        />
      )}

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

      {/* Label */}
      {showLabel && (
        <span className="m3-label-small truncate max-w-full">
          {label}
        </span>
      )}
    </div>
  );

  return disabled ? (
    content
  ) : (
    <Link href={href} className="block w-full">
      {content}
    </Link>
  );
};

export default Material3Navigation;