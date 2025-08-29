/**
 * Mobile touch utilities for Material 3 Expressive design
 * Implements Material 3 touch feedback patterns including ripples and state changes
 */

/**
 * Creates a ripple effect on touch/click for Material 3 components
 */
export function createRippleEffect(
  element: HTMLElement,
  event: MouseEvent | TouchEvent,
  options: {
    color?: string;
    duration?: number;
    bounded?: boolean;
  } = {}
): void {
  const {
    color = 'rgba(var(--md-sys-color-on-surface), 0.12)',
    duration = 600,
    bounded = true
  } = options;

  // Don't create ripple if element already has one in progress
  if (element.dataset.rippleActive === 'true') {
    return;
  }

  const rect = element.getBoundingClientRect();
  let x: number, y: number;

  // Get touch/click position
  if ('touches' in event && event.touches.length > 0) {
    const touch = event.touches[0];
    if (touch) {
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      x = rect.width / 2;
      y = rect.height / 2;
    }
  } else if ('clientX' in event) {
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
  } else {
    // Center fallback
    x = rect.width / 2;
    y = rect.height / 2;
  }

  // Calculate ripple size
  const size = Math.max(
    Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
    Math.sqrt(Math.pow(rect.width - x, 2) + Math.pow(y, 2)),
    Math.sqrt(Math.pow(x, 2) + Math.pow(rect.height - y, 2)),
    Math.sqrt(Math.pow(rect.width - x, 2) + Math.pow(rect.height - y, 2))
  ) * 2;

  // Create ripple element
  const ripple = document.createElement('span');
  ripple.className = 'material3-ripple';
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background-color: ${color};
    pointer-events: none;
    transform: scale(0);
    opacity: 1;
    width: ${size}px;
    height: ${size}px;
    left: ${x - size / 2}px;
    top: ${y - size / 2}px;
    transition: transform ${duration * 0.6}ms cubic-bezier(0.4, 0, 0.2, 1),
                opacity ${duration * 0.4}ms cubic-bezier(0.4, 0, 0.2, 1);
  `;

  // Ensure element has relative positioning for ripple
  const originalPosition = element.style.position;
  if (!originalPosition || originalPosition === 'static') {
    element.style.position = 'relative';
  }

  // Add overflow hidden if bounded
  if (bounded) {
    element.style.overflow = 'hidden';
  }

  element.appendChild(ripple);
  element.dataset.rippleActive = 'true';

  // Trigger animation
  requestAnimationFrame(() => {
    ripple.style.transform = 'scale(1)';
  });

  // Remove ripple after animation
  setTimeout(() => {
    ripple.style.opacity = '0';
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
      element.dataset.rippleActive = 'false';
    }, duration * 0.4);
  }, duration * 0.6);
}

/**
 * Detects if the current device is touch-enabled
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - for older browsers
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Gets the optimal touch target size based on Material 3 guidelines
 */
export function getTouchTargetSize(baseSize: 'small' | 'medium' | 'large' = 'medium'): {
  minHeight: string;
  minWidth: string;
  padding: string;
} {
  const sizes = {
    small: { minHeight: '40px', minWidth: '40px', padding: '8px 12px' },
    medium: { minHeight: '48px', minWidth: '48px', padding: '12px 16px' },
    large: { minHeight: '56px', minWidth: '56px', padding: '16px 24px' }
  };

  return sizes[baseSize];
}

/**
 * Adds touch-optimized event listeners with proper touch handling
 */
export function addTouchHandlers(
  element: HTMLElement,
  handlers: {
    onTouchStart?: (event: TouchEvent) => void;
    onTouchEnd?: (event: TouchEvent) => void;
    onTouchMove?: (event: TouchEvent) => void;
    onTouchCancel?: (event: TouchEvent) => void;
  }
): () => void {
  const { onTouchStart, onTouchEnd, onTouchMove, onTouchCancel } = handlers;

  // Passive listeners for better scroll performance
  const options = { passive: true };

  if (onTouchStart) {
    element.addEventListener('touchstart', onTouchStart, options);
  }
  if (onTouchEnd) {
    element.addEventListener('touchend', onTouchEnd, options);
  }
  if (onTouchMove) {
    element.addEventListener('touchmove', onTouchMove, options);
  }
  if (onTouchCancel) {
    element.addEventListener('touchcancel', onTouchCancel, options);
  }

  // Return cleanup function
  return () => {
    if (onTouchStart) {
      element.removeEventListener('touchstart', onTouchStart);
    }
    if (onTouchEnd) {
      element.removeEventListener('touchend', onTouchEnd);
    }
    if (onTouchMove) {
      element.removeEventListener('touchmove', onTouchMove);
    }
    if (onTouchCancel) {
      element.removeEventListener('touchcancel', onTouchCancel);
    }
  };
}

/**
 * Handles responsive typography scaling for mobile devices
 */
export function getResponsiveTextSize(
  baseSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
): string {
  const sizes = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl'
  };

  return sizes[baseSize];
}

/**
 * Gets responsive spacing classes for mobile optimization
 */
export function getResponsiveSpacing(
  spacing: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
): {
  padding: string;
  margin: string;
  gap: string;
} {
  const spacingMap = {
    xs: { padding: 'p-2 sm:p-3', margin: 'm-2 sm:m-3', gap: 'gap-2 sm:gap-3' },
    sm: { padding: 'p-3 sm:p-4', margin: 'm-3 sm:m-4', gap: 'gap-3 sm:gap-4' },
    md: { padding: 'p-4 sm:p-6', margin: 'm-4 sm:m-6', gap: 'gap-4 sm:gap-6' },
    lg: { padding: 'p-6 sm:p-8', margin: 'm-6 sm:m-8', gap: 'gap-6 sm:gap-8' },
    xl: { padding: 'p-8 sm:p-12', margin: 'm-8 sm:m-12', gap: 'gap-8 sm:gap-12' }
  };

  return spacingMap[spacing];
}