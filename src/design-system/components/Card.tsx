/**
 * Material 3 Card Component
 * Comprehensive card implementation following Material 3 design principles
 */

'use client';

import React from 'react';
import type { Material3ElevationLevel, Material3ShapeSize } from '../types';

export interface Material3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'filled' | 'outlined';
  shape?: Material3ShapeSize;
  elevation?: Material3ElevationLevel;
  interactive?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  header?: React.ReactNode;
  actions?: React.ReactNode;
  media?: React.ReactNode;
  children?: React.ReactNode;
}

const Material3Card = React.forwardRef<HTMLDivElement, Material3CardProps>(({
  variant = 'elevated',
  shape = 'lg',
  elevation,
  interactive = false,
  padding = 'medium',
  header,
  actions,
  media,
  children,
  className = '',
  onClick,
  ...props
}, ref) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  // Forward ref handling
  React.useImperativeHandle(ref, () => cardRef.current as HTMLDivElement);

  // Base classes
  const baseClasses = [
    'relative',
    'overflow-hidden',
    'transition-all',
    'duration-300',
    'ease-in-out',
  ];

  // Variant-specific classes
  const variantClasses = {
    elevated: [
      'bg-surface-container-low',
      'text-on-surface',
      'm3-elevation-1',
      ...(interactive ? [
        'hover:m3-elevation-2',
        'active:m3-elevation-1',
      ] : []),
    ],
    filled: [
      'bg-surface-container-highest',
      'text-on-surface',
      ...(interactive ? [
        'hover:bg-surface-container-high',
        'active:bg-surface-container-highest',
      ] : []),
    ],
    outlined: [
      'bg-surface',
      'text-on-surface',
      'border',
      'border-outline-variant',
      ...(interactive ? [
        'hover:bg-surface-variant/20',
        'active:bg-surface-variant/40',
      ] : []),
    ],
  };

  // Shape classes
  const shapeClasses = {
    none: 'rounded-none',
    xs: 'm3-shape-xs',
    sm: 'm3-shape-sm',
    md: 'm3-shape-md',
    lg: 'm3-shape-lg',
    xl: 'm3-shape-xl',
    full: 'm3-shape-full',
  };

  // Padding classes for content area
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6',
  };

  // Interactive classes
  const interactiveClasses = interactive ? [
    'cursor-pointer',
    'select-none',
    'm3-motion-card',
    'hover:shadow-lg',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-primary',
  ] : [];

  // Elevation classes (when explicitly set)
  const elevationClasses = elevation !== undefined ? [
    `m3-elevation-${elevation}`,
  ] : [];

  // Combine all classes
  const allClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    ...shapeClasses[shape],
    ...interactiveClasses,
    ...elevationClasses,
    className,
  ].filter(Boolean).join(' ');

  // Handle click with ripple effect
  const handleClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;

    // Add ripple effect
    if (cardRef.current) {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      // Create ripple element
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: currentColor;
        border-radius: 50%;
        opacity: 0.05;
        transform: scale(0);
        animation: ripple 0.8s ease-out;
        pointer-events: none;
        z-index: 1;
      `;

      // Add ripple styles if not already added
      if (!document.getElementById('m3-card-ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'm3-card-ripple-styles';
        style.textContent = `
          @keyframes ripple {
            to {
              transform: scale(2);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }

      card.appendChild(ripple);

      // Remove ripple after animation
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 800);
    }

    onClick?.(event);
  }, [interactive, onClick]);

  // Header component
  const HeaderSection = header ? (
    <div className="px-4 pt-4 pb-2">
      {typeof header === 'string' ? (
        <h3 className="m3-title-medium text-on-surface">{header}</h3>
      ) : (
        header
      )}
    </div>
  ) : null;

  // Media component
  const MediaSection = media ? (
    <div className="relative overflow-hidden">
      {media}
    </div>
  ) : null;

  // Content section
  const ContentSection = children ? (
    <div className={paddingClasses[padding]}>
      {children}
    </div>
  ) : null;

  // Actions component
  const ActionsSection = actions ? (
    <div className="px-4 pb-4 pt-2 flex items-center justify-end gap-2">
      {actions}
    </div>
  ) : null;

  return (
    <div
      ref={cardRef}
      className={allClasses}
      onClick={handleClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      } : undefined}
      {...props}
    >
      {HeaderSection}
      {MediaSection}
      {ContentSection}
      {ActionsSection}
    </div>
  );
});

Material3Card.displayName = 'Material3Card';

export default Material3Card;