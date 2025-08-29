/**
 * Material 3 Tab Bar Component
 * Horizontal tab navigation component with scrollable behavior
 * Implements Material 3 tab patterns with design tokens
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Material3ElevationLevel } from '../types';

export interface Material3TabItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

export interface Material3TabBarProps {
  tabs: Material3TabItem[];
  variant?: 'primary' | 'secondary';
  elevation?: Material3ElevationLevel;
  className?: string;
  scrollable?: boolean;
  showIcons?: boolean;
  onTabClick?: (href: string) => void;
}

const Material3TabBar = React.forwardRef<HTMLElement, Material3TabBarProps>(({
  tabs,
  variant = 'primary',
  elevation = 0,
  className = '',
  scrollable = false,
  showIcons = true,
  onTabClick,
}, ref) => {
  const pathname = usePathname();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Base classes for tab bar container
  const baseClasses = [
    'relative',
    'w-full',
    'bg-surface',
    'border-b',
    'border-outline-variant',
    `m3-elevation-${elevation}`,
    'm3-motion-navigation',
    'm3-duration-medium1',
    'm3-motion-easing-standard',
  ];

  // Variant-specific classes
  const variantClasses = {
    primary: [
      'bg-surface',
    ],
    secondary: [
      'bg-surface-container-low',
    ],
  };

  // Container classes
  const containerClasses = scrollable 
    ? [
        'overflow-x-auto',
        'scrollbar-hide',
        'px-4',
      ]
    : [
        'flex',
        'px-4',
      ];

  // Items container classes
  const itemsClasses = scrollable
    ? [
        'flex',
        'gap-2',
        'min-w-max',
      ]
    : [
        'flex',
        'w-full',
        'gap-2',
      ];

  // Combine all classes
  const tabBarClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <nav ref={ref} className={tabBarClasses} role="tablist" aria-label="Tab navigation">
      <div ref={scrollContainerRef} className={containerClasses.join(' ')}>
        <div className={itemsClasses.join(' ')}>
          {tabs.map((tab) => (
            <Material3Tab
              key={tab.href}
              tab={tab}
              isActive={pathname === tab.href}
              variant={variant}
              showIcon={showIcons}
              scrollable={scrollable}
              onClick={onTabClick}
            />
          ))}
        </div>
      </div>
    </nav>
  );
});

Material3TabBar.displayName = 'Material3TabBar';

interface Material3TabProps {
  tab: Material3TabItem;
  isActive: boolean;
  variant: 'primary' | 'secondary';
  showIcon: boolean;
  scrollable: boolean;
  onClick?: (href: string) => void;
}

const Material3Tab: React.FC<Material3TabProps> = ({
  tab,
  isActive,
  variant,
  showIcon,
  scrollable,
  onClick,
}) => {
  const { href, label, icon, badge, disabled = false } = tab;

  // Base classes for tab item
  const baseClasses = [
    'relative',
    'flex',
    'items-center',
    'justify-center',
    'gap-2',
    'h-12', // 48px height
    'px-4',
    'text-center',
    'transition-all',
    'm3-duration-short4',
    'm3-motion-easing-standard',
    'outline-none',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-primary',
    'whitespace-nowrap',
  ];

  // Scrollable vs fixed width
  const widthClasses = scrollable
    ? ['min-w-fit']
    : ['flex-1', 'min-w-0'];

  // State-specific classes
  const stateClasses = disabled
    ? [
        'opacity-38',
        'cursor-not-allowed',
        'pointer-events-none',
      ]
    : isActive
    ? [
        'text-primary',
        'cursor-default',
      ]
    : [
        'text-on-surface-variant',
        'hover:text-on-surface',
        'active:text-primary',
        'cursor-pointer',
      ];

  // Interactive background classes
  const backgroundClasses = disabled
    ? []
    : isActive
    ? []
    : [
        'hover:bg-on-surface/8',
        'active:bg-primary/12',
      ];

  // Active indicator classes
  const indicatorClasses = isActive && !disabled
    ? [
        'after:absolute',
        'after:bottom-0',
        'after:left-0',
        'after:right-0',
        'after:h-1',
        'after:bg-primary',
        'after:rounded-t-full',
      ]
    : [];

  // Combine all classes
  const tabClasses = [
    ...baseClasses,
    ...widthClasses,
    ...stateClasses,
    ...backgroundClasses,
    ...indicatorClasses,
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
      className={tabClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="tab"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-selected={isActive}
      aria-disabled={disabled}
    >
      {/* Icon */}
      {showIcon && icon && (
        <div className="relative flex items-center justify-center w-5 h-5">
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
      )}

      {/* Label */}
      <span className="m3-title-small truncate">
        {label}
      </span>

      {/* Badge without icon */}
      {(!showIcon || !icon) && badge && (
        <div
          className="min-w-4 h-4 px-1 bg-error text-on-error text-xs font-medium rounded-full flex items-center justify-center"
          aria-label={`${badge} notifications`}
        >
          {typeof badge === 'number' && badge > 99 ? '99+' : badge}
        </div>
      )}
    </div>
  );

  return disabled ? (
    content
  ) : (
    <Link href={href} className="block">
      {content}
    </Link>
  );
};

export default Material3TabBar;