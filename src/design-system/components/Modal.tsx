/**
 * Material 3 Modal Component
 * Comprehensive modal implementation following Material 3 design principles
 */

'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import type { Material3ElevationLevel, Material3ShapeSize } from '../types';

export interface Material3ModalProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  variant?: 'basic' | 'fullscreen';
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  shape?: Material3ShapeSize;
  elevation?: Material3ElevationLevel;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Material3Modal = React.forwardRef<HTMLDivElement, Material3ModalProps>(({
  open,
  onClose,
  onOpenChange,
  variant = 'basic',
  size = 'medium',
  shape = 'xl',
  elevation = 3,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  title,
  actions,
  children,
  className = '',
}, ref) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  // Forward ref handling
  React.useImperativeHandle(ref, () => modalRef.current as HTMLDivElement);

  // Mount on client side
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key
  React.useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        onOpenChange?.(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEscape, onClose, onOpenChange]);

  // Focus management
  React.useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement;
    
    // Focus the modal when it opens
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Return focus when modal closes
    return () => {
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [open]);

  // Body scroll lock
  React.useEffect(() => {
    if (!open) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [open]);

  // Size-specific classes
  const sizeClasses = {
    small: [
      'max-w-sm',
      'w-full',
      'mx-4',
    ],
    medium: [
      'max-w-md',
      'w-full',
      'mx-4',
    ],
    large: [
      'max-w-2xl',
      'w-full',
      'mx-4',
    ],
    fullscreen: [
      'w-full',
      'h-full',
      'max-w-none',
      'max-h-none',
      'm-0',
    ],
  };

  // Variant-specific classes
  const variantClasses = {
    basic: [
      'max-h-[90vh]',
      'overflow-hidden',
      'flex',
      'flex-col',
    ],
    fullscreen: [
      'w-screen',
      'h-screen',
      'max-w-none',
      'max-h-none',
      'm-0',
      'rounded-none',
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

  // Modal classes
  const modalClasses = [
    'relative',
    'bg-surface-container-high',
    'text-on-surface',
    'outline-none',
    'transform',
    'transition-all',
    'duration-300',
    'ease-in-out',
    `m3-elevation-${elevation}`,
    variant === 'fullscreen' ? '' : shapeClasses[shape],
    ...sizeClasses[variant === 'fullscreen' ? 'fullscreen' : size],
    ...variantClasses[variant],
    open ? [
      'scale-100',
      'opacity-100',
    ] : [
      'scale-95',
      'opacity-0',
      'pointer-events-none',
    ],
    className,
  ].filter(Boolean).join(' ');

  // Backdrop classes
  const backdropClasses = [
    'fixed',
    'inset-0',
    'bg-scrim/50',
    'backdrop-blur-sm',
    'transition-opacity',
    'duration-300',
    'ease-in-out',
    'z-50',
    open ? 'opacity-100' : 'opacity-0 pointer-events-none',
  ].join(' ');

  // Container classes
  const containerClasses = [
    'fixed',
    'inset-0',
    'flex',
    'items-center',
    'justify-center',
    'z-50',
    'p-4',
    variant === 'fullscreen' ? 'p-0' : '',
  ].filter(Boolean).join(' ');

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
      onOpenChange?.(false);
    }
  };

  // Handle modal click (prevent event bubbling)
  const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  // Focus trap - get focusable elements
  const getFocusableElements = () => {
    if (!modalRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ];
    
    return Array.from(
      modalRef.current.querySelectorAll(focusableSelectors.join(', '))
    ) as HTMLElement[];
  };

  // Handle tab key for focus trap
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement) return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className={backdropClasses}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className={containerClasses} onClick={handleBackdropClick}>
        <div
          ref={modalRef}
          className={modalClasses}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          tabIndex={-1}
          onClick={handleModalClick}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          {title && (
            <div className="flex-shrink-0 px-6 py-4 border-b border-outline-variant">
              {typeof title === 'string' ? (
                <h2 id="modal-title" className="m3-title-large text-on-surface">
                  {title}
                </h2>
              ) : (
                <div id="modal-title">{title}</div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex-shrink-0 flex items-center justify-end gap-2 px-6 py-4 border-t border-outline-variant">
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
});

Material3Modal.displayName = 'Material3Modal';

export default Material3Modal;