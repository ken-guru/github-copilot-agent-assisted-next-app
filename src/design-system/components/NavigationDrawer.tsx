/**
 * Material 3 Navigation Drawer Component
 * Slide-out navigation menu for mobile and desktop
 * Implements Material 3 drawer patterns with design tokens
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Material3ElevationLevel } from '../types';
import { getTouchTargetSize, isTouchDevice, createRippleEffect } from '../utils/mobile-touch';
import { addDrawerSwipeGestures } from '../utils/gesture-handlers';

export interface Material3DrawerItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
  divider?: boolean; // Add divider after this item
}

export interface Material3DrawerSection {
  title?: string;
  items: Material3DrawerItem[];
}

export interface Material3NavigationDrawerProps {
  sections: Material3DrawerSection[];
  isOpen: boolean;
  onClose: () => void;
  variant?: 'modal' | 'permanent' | 'dismissible';
  elevation?: Material3ElevationLevel;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onItemClick?: (href: string) => void;
}

const Material3NavigationDrawer = React.forwardRef<HTMLElement, Material3NavigationDrawerProps>(({
  sections,
  isOpen,
  onClose,
  variant = 'modal',
  elevation = 1,
  className = '',
  header,
  footer,
  onItemClick,
}, ref) => {
  const pathname = usePathname();

  // Enable swipe gestures for modal drawer
  React.useEffect(() => {
    if (variant !== 'modal' || !isTouchDevice()) return;

    const cleanup = addDrawerSwipeGestures({
      onOpen: () => {
        // Only open if not already open
        if (!isOpen) {
          // Note: In a real implementation, you'd need to detect edge swipes
          // This is simplified for demo purposes
        }
      },
      onClose,
      isOpen: () => isOpen,
      edgeThreshold: 20
    });

    return cleanup;
  }, [variant, isOpen, onClose]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && variant === 'modal') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = variant === 'modal' ? 'hidden' : 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, variant]);

  // Base classes for navigation drawer
  const baseClasses = [
    'fixed',
    'top-0',
    'left-0',
    'bottom-0',
    'z-50',
    'flex',
    'flex-col',
    'w-80', // 320px standard width
    'bg-surface-container-low',
    `m3-elevation-${elevation}`,
    'm3-motion-navigation',
    'm3-duration-medium1',
    'm3-motion-easing-standard',
    'overflow-hidden',
  ];

  // Variant-specific classes
  const variantClasses = {
    modal: [
      'transition-transform',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    ],
    permanent: [
      'translate-x-0',
      'relative',
      'z-auto',
    ],
    dismissible: [
      'transition-transform',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'relative',
      'z-auto',
    ],
  };

  // Header classes
  const headerClasses = [
    'flex',
    'items-center',
    'h-16',
    'px-6',
    'border-b',
    'border-outline-variant/12',
  ];

  // Content classes
  const contentClasses = [
    'flex-1',
    'overflow-y-auto',
    'py-2',
  ];

  // Footer classes
  const footerClasses = [
    'flex',
    'items-center',
    'h-16',
    'px-6',
    'border-t',
    'border-outline-variant/12',
  ];

  // Combine all classes
  const drawerClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  // Handle backdrop click for modal variant
  const handleBackdropClick = React.useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget && variant === 'modal') {
      onClose();
    }
  }, [onClose, variant]);

  // Handle item click
  const handleItemClick = React.useCallback((href: string) => {
    onItemClick?.(href);
    if (variant === 'modal') {
      onClose();
    }
  }, [onItemClick, onClose, variant]);

  const drawerContent = (
    <nav ref={ref} className={drawerClasses} role="navigation" aria-label="Navigation drawer">
      {/* Header */}
      {header && (
        <div className={headerClasses.join(' ')}>
          {header}
        </div>
      )}

      {/* Content */}
      <div className={contentClasses.join(' ')}>
        {sections.map((section, sectionIndex) => (
          <Material3DrawerSection
            key={sectionIndex}
            section={section}
            pathname={pathname}
            onItemClick={handleItemClick}
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

  // Render with backdrop for modal variant
  if (variant === 'modal') {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-scrim/32 transition-opacity m3-duration-medium1"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
        )}
        {drawerContent}
      </>
    );
  }

  // Render directly for permanent/dismissible variants
  return drawerContent;
});

Material3NavigationDrawer.displayName = 'Material3NavigationDrawer';

interface Material3DrawerSectionProps {
  section: Material3DrawerSection;
  pathname: string;
  onItemClick: (href: string) => void;
}

const Material3DrawerSection: React.FC<Material3DrawerSectionProps> = ({
  section,
  pathname,
  onItemClick,
}) => {
  return (
    <div className="px-3 py-2">
      {/* Section title */}
      {section.title && (
        <div className="px-3 py-2 text-on-surface-variant m3-title-small">
          {section.title}
        </div>
      )}

      {/* Section items */}
      <div className="space-y-1">
        {section.items.map((item) => (
          <React.Fragment key={item.href}>
            <Material3DrawerItem
              item={item}
              isActive={pathname === item.href}
              onClick={onItemClick}
            />
            {item.divider && (
              <div className="my-2 border-t border-outline-variant/12" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

interface Material3DrawerItemProps {
  item: Material3DrawerItem;
  isActive: boolean;
  onClick: (href: string) => void;
}

const Material3DrawerItem: React.FC<Material3DrawerItemProps> = ({
  item,
  isActive,
  onClick,
}) => {
  const { href, label, icon, badge, disabled = false } = item;
  const isTouch = isTouchDevice();
  const touchTarget = getTouchTargetSize('medium');

  // Base classes for drawer item with touch target compliance
  const baseClasses = [
    'relative',
    'flex',
    'items-center',
    'gap-3',
    'w-full',
    isTouch ? 'min-h-[48px]' : 'h-14', // Ensure 48px minimum on touch devices
    'px-3',
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
        'text-on-surface',
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

  // Combine all classes
  const itemClasses = [
    ...baseClasses,
    ...stateClasses,
    ...backgroundClasses,
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

    onClick(href);
  }, [disabled, href, onClick, isActive]);

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(href);
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
      {/* Icon */}
      <div className="relative flex items-center justify-center w-6 h-6 flex-shrink-0">
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
      <span className="flex-1 m3-label-large truncate">
        {label}
      </span>

      {/* Badge without icon overlap */}
      {badge && (
        <div
          className="ml-auto min-w-4 h-4 px-1 bg-error text-on-error text-xs font-medium rounded-full flex items-center justify-center"
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

export default Material3NavigationDrawer;