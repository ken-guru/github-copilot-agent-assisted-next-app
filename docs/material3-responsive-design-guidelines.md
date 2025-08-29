# Material 3 Responsive Design Guidelines

## Overview

This document provides comprehensive guidelines for implementing responsive design with the Material 3 Expressive system in Mr. Timely. It covers breakpoint usage, fluid typography, responsive components, and mobile optimization strategies.

## Breakpoint System

### Breakpoint Values

The Material 3 Expressive system uses a mobile-first approach with fluid breakpoints that adapt to content rather than device categories.

| Breakpoint | Min Width | Max Width | Typical Devices | Usage |
|------------|-----------|-----------|-----------------|-------|
| **Mobile** | 0px | 599px | Phones, small tablets | Single column, stacked layout |
| **Tablet** | 600px | 1023px | Tablets, small laptops | Two-column, adaptive layout |
| **Desktop** | 1024px | 1439px | Laptops, desktops | Multi-column, expanded layout |
| **Large** | 1440px | ∞ | Large displays | Wide layouts, additional content |

### Breakpoint Implementation

#### CSS Media Queries

```css
/* Mobile First Approach */
.responsive-component {
  /* Mobile styles (default) */
  display: flex;
  flex-direction: column;
  gap: var(--md-sys-spacing-small);
  padding: var(--md-sys-spacing-medium);
}

/* Tablet and up */
@media (min-width: 600px) {
  .responsive-component {
    flex-direction: row;
    gap: var(--md-sys-spacing-medium);
    padding: var(--md-sys-spacing-large);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .responsive-component {
    gap: var(--md-sys-spacing-large);
    padding: var(--md-sys-spacing-extra-large);
  }
}

/* Large screens */
@media (min-width: 1440px) {
  .responsive-component {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

#### React Hook Implementation

```tsx
import { useState, useEffect } from 'react';

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop' | 'large'>('mobile');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1440) {
        setBreakpoint('large');
      } else if (width >= 1024) {
        setBreakpoint('desktop');
      } else if (width >= 600) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('mobile');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

// Usage in components
const ResponsiveComponent = () => {
  const breakpoint = useBreakpoint();
  
  return (
    <div className={`layout-${breakpoint}`}>
      {breakpoint === 'mobile' ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
};
```

#### Utility Classes

```css
/* Responsive visibility utilities */
.show-mobile { display: block; }
.show-tablet { display: none; }
.show-desktop { display: none; }
.show-large { display: none; }

@media (min-width: 600px) {
  .show-mobile { display: none; }
  .show-tablet { display: block; }
  .hide-tablet { display: none; }
}

@media (min-width: 1024px) {
  .show-tablet { display: none; }
  .show-desktop { display: block; }
  .hide-desktop { display: none; }
}

@media (min-width: 1440px) {
  .show-desktop { display: none; }
  .show-large { display: block; }
  .hide-large { display: none; }
}

/* Responsive spacing utilities */
.spacing-responsive {
  padding: var(--md-sys-spacing-small);
}

@media (min-width: 600px) {
  .spacing-responsive {
    padding: var(--md-sys-spacing-medium);
  }
}

@media (min-width: 1024px) {
  .spacing-responsive {
    padding: var(--md-sys-spacing-large);
  }
}
```

## Responsive Typography

### Fluid Typography Scale

Material 3 Expressive typography scales fluidly across screen sizes using CSS `clamp()` functions.

#### Typography Scaling Factors

| Breakpoint | Scale Factor | Reasoning |
|------------|--------------|-----------|
| Mobile | 87.5% | Optimized for small screens, improved readability |
| Tablet | 95% | Balanced scaling for medium screens |
| Desktop | 105% | Enhanced hierarchy for large screens |
| Large | 110% | Maximum readability for wide displays |

#### Implementation

```css
/* Fluid typography using clamp() */
.md-typescale-headline-large {
  font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem);
  line-height: clamp(2rem, 4.5vw + 1.2rem, 4rem);
  letter-spacing: clamp(-0.02em, -0.01vw, -0.01em);
}

.md-typescale-body-large {
  font-size: clamp(0.875rem, 2vw + 0.5rem, 1.125rem);
  line-height: clamp(1.25rem, 2.5vw + 0.75rem, 1.75rem);
}

/* Responsive typography with breakpoints */
.responsive-typography {
  font-size: var(--md-sys-typescale-body-large-size);
  line-height: var(--md-sys-typescale-body-large-line-height);
}

@media (max-width: 599px) {
  .responsive-typography {
    font-size: calc(var(--md-sys-typescale-body-large-size) * 0.875);
    line-height: calc(var(--md-sys-typescale-body-large-line-height) * 0.875);
  }
}

@media (min-width: 1024px) {
  .responsive-typography {
    font-size: calc(var(--md-sys-typescale-body-large-size) * 1.05);
    line-height: calc(var(--md-sys-typescale-body-large-line-height) * 1.05);
  }
}
```

#### React Implementation

```tsx
import { getMaterial3AdaptiveTypography } from '../utils/material3-utils';

const ResponsiveTypography = ({ children, scale = 'bodyLarge' }) => {
  const adaptiveStyles = getMaterial3AdaptiveTypography(scale, {
    mobile: { scale: 0.875, maxWidth: '599px' },
    tablet: { scale: 0.95, minWidth: '600px', maxWidth: '1023px' },
    desktop: { scale: 1.05, minWidth: '1024px' },
  });

  return (
    <>
      <div style={adaptiveStyles.base} className="responsive-text">
        {children}
      </div>
      <style jsx>{`
        @media (max-width: 599px) {
          .responsive-text {
            font-size: ${adaptiveStyles.mobile.fontSize};
            line-height: ${adaptiveStyles.mobile.lineHeight};
          }
        }
        @media (min-width: 600px) and (max-width: 1023px) {
          .responsive-text {
            font-size: ${adaptiveStyles.tablet.fontSize};
            line-height: ${adaptiveStyles.tablet.lineHeight};
          }
        }
        @media (min-width: 1024px) {
          .responsive-text {
            font-size: ${adaptiveStyles.desktop.fontSize};
            line-height: ${adaptiveStyles.desktop.lineHeight};
          }
        }
      `}</style>
    </>
  );
};
```

### Contextual Typography

Typography adapts based on content density and available space.

```css
/* Context-aware typography scaling */
:root {
  --md-sys-typescale-context-compact: 0.875;
  --md-sys-typescale-context-comfortable: 1;
  --md-sys-typescale-context-spacious: 1.125;
}

.typography-context-compact {
  font-size: calc(var(--base-font-size) * var(--md-sys-typescale-context-compact));
}

.typography-context-comfortable {
  font-size: calc(var(--base-font-size) * var(--md-sys-typescale-context-comfortable));
}

.typography-context-spacious {
  font-size: calc(var(--base-font-size) * var(--md-sys-typescale-context-spacious));
}
```

## Responsive Layout Patterns

### Grid Systems

#### CSS Grid Implementation

```css
/* Responsive grid with auto-fit */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--md-sys-spacing-medium);
  padding: var(--md-sys-spacing-medium);
}

/* Responsive grid with explicit breakpoints */
.activity-grid {
  display: grid;
  gap: var(--md-sys-spacing-medium);
  grid-template-columns: 1fr; /* Mobile: single column */
}

@media (min-width: 600px) {
  .activity-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: two columns */
  }
}

@media (min-width: 1024px) {
  .activity-grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: three columns */
  }
}

@media (min-width: 1440px) {
  .activity-grid {
    grid-template-columns: repeat(4, 1fr); /* Large: four columns */
  }
}
```

#### Flexbox Patterns

```css
/* Responsive flex layout */
.flex-responsive {
  display: flex;
  flex-direction: column;
  gap: var(--md-sys-spacing-medium);
}

@media (min-width: 600px) {
  .flex-responsive {
    flex-direction: row;
    align-items: center;
  }
}

/* Responsive flex wrapping */
.flex-wrap-responsive {
  display: flex;
  flex-wrap: wrap;
  gap: var(--md-sys-spacing-medium);
}

.flex-wrap-responsive > * {
  flex: 1 1 280px; /* Minimum width of 280px */
}
```

### Container Queries

Modern responsive design using container queries for component-level responsiveness.

```css
/* Container query setup */
.responsive-container {
  container-type: inline-size;
  container-name: main-container;
}

/* Component adapts to container size, not viewport */
@container main-container (max-width: 400px) {
  .activity-card {
    flex-direction: column;
  }
  
  .activity-card .card-actions {
    justify-content: center;
    margin-top: var(--md-sys-spacing-small);
  }
}

@container main-container (min-width: 600px) {
  .activity-card {
    flex-direction: row;
    align-items: center;
  }
  
  .activity-card .card-actions {
    margin-left: auto;
  }
}
```

#### React Container Query Hook

```tsx
import { useState, useEffect, useRef } from 'react';

export const useContainerQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !window.matchMedia) return;

    const container = containerRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry.contentRect.width;
      
      // Parse simple width queries like "(max-width: 400px)"
      const match = query.match(/\(max-width:\s*(\d+)px\)/);
      if (match) {
        const maxWidth = parseInt(match[1]);
        setMatches(width <= maxWidth);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [query]);

  return { matches, containerRef };
};

// Usage
const ResponsiveCard = () => {
  const { matches: isNarrow, containerRef } = useContainerQuery('(max-width: 400px)');
  
  return (
    <div ref={containerRef} className="card-container">
      <div className={`card ${isNarrow ? 'card-narrow' : 'card-wide'}`}>
        Card content adapts to container width
      </div>
    </div>
  );
};
```

## Component Responsiveness

### Responsive Button Sizing

```css
/* Responsive button sizes */
.md-button {
  height: 40px;
  padding: 0 16px;
  font-size: var(--md-sys-typescale-label-large-size);
}

@media (max-width: 599px) {
  .md-button {
    height: 48px; /* Larger touch target on mobile */
    padding: 0 20px;
    font-size: calc(var(--md-sys-typescale-label-large-size) * 1.1);
  }
}

@media (min-width: 1024px) {
  .md-button {
    height: 36px; /* Smaller on desktop where precision is higher */
    padding: 0 24px;
  }
}
```

### Responsive Form Fields

```css
/* Responsive text field sizing */
.md-text-field {
  min-height: 56px;
  padding: 16px;
}

@media (max-width: 599px) {
  .md-text-field {
    min-height: 64px; /* Larger touch target */
    padding: 20px 16px;
    font-size: 16px; /* Prevent zoom on iOS */
  }
}

/* Responsive form layout */
.form-responsive {
  display: grid;
  gap: var(--md-sys-spacing-medium);
  grid-template-columns: 1fr;
}

@media (min-width: 600px) {
  .form-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-responsive .full-width {
    grid-column: 1 / -1;
  }
}
```

### Responsive Navigation

```css
/* Mobile navigation */
.navigation-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: var(--md-sys-color-surface-container);
  padding: var(--md-sys-spacing-small);
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.navigation-mobile .nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--md-sys-spacing-small);
  min-height: 64px;
}

/* Desktop navigation */
@media (min-width: 1024px) {
  .navigation-mobile {
    position: static;
    flex-direction: row;
    justify-content: center;
    border-top: none;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }
  
  .navigation-mobile .nav-item {
    flex: none;
    flex-direction: row;
    min-height: 48px;
    padding: var(--md-sys-spacing-small) var(--md-sys-spacing-large);
  }
}
```

## Mobile Optimization

### Touch Target Guidelines

All interactive elements must meet minimum touch target requirements for accessibility and usability.

#### Touch Target Sizes

| Element Type | Minimum Size | Recommended Size | Spacing |
|--------------|--------------|------------------|---------|
| Buttons | 44px × 44px | 48px × 48px | 8px minimum |
| Form Fields | 44px height | 56px height | 8px minimum |
| Navigation Items | 44px × 44px | 48px × 48px | 4px minimum |
| Icons (clickable) | 44px × 44px | 48px × 48px | 8px minimum |

#### Implementation

```css
/* Ensure minimum touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
  position: relative;
}

/* Expand touch area without affecting visual size */
.touch-target::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  z-index: -1;
}

@media (max-width: 599px) {
  .touch-target {
    min-height: 48px;
    min-width: 48px;
    padding: 16px;
  }
}
```

### Mobile-Specific Interactions

#### Swipe Gestures

```tsx
import { useSwipeGesture } from '../hooks/useSwipeGesture';

const SwipeableActivityCard = ({ activity, onEdit, onDelete }) => {
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: onDelete,
    onSwipeRight: onEdit,
    threshold: 100,
    preventScroll: true,
  });

  return (
    <div 
      className="swipeable-card"
      {...swipeHandlers}
    >
      <div className="card-content">
        {activity.name}
      </div>
      <div className="swipe-actions">
        <button className="edit-action">Edit</button>
        <button className="delete-action">Delete</button>
      </div>
    </div>
  );
};
```

#### Pull-to-Refresh

```tsx
import { usePullToRefresh } from '../hooks/usePullToRefresh';

const RefreshableActivityList = ({ activities, onRefresh }) => {
  const { pullDistance, isRefreshing, pullHandlers } = usePullToRefresh({
    onRefresh,
    threshold: 80,
  });

  return (
    <div className="refreshable-container" {...pullHandlers}>
      <div 
        className="pull-indicator"
        style={{ 
          transform: `translateY(${Math.min(pullDistance, 80)}px)`,
          opacity: pullDistance / 80,
        }}
      >
        {isRefreshing ? <LoadingSpinner /> : <RefreshIcon />}
      </div>
      <div className="activity-list">
        {activities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};
```

### Viewport Configuration

```html
<!-- Optimal viewport configuration for mobile -->
<meta 
  name="viewport" 
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
>
```

```css
/* Safe area handling for devices with notches */
.safe-area-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Prevent horizontal scrolling */
html, body {
  overflow-x: hidden;
  width: 100%;
}
```

## Performance Considerations

### Responsive Images

```css
/* Responsive image sizing */
.responsive-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  object-fit: cover;
}

/* Art direction with picture element */
```

```html
<picture>
  <source media="(min-width: 1024px)" srcset="image-large.jpg">
  <source media="(min-width: 600px)" srcset="image-medium.jpg">
  <img src="image-small.jpg" alt="Description" class="responsive-image">
</picture>
```

### Lazy Loading

```tsx
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const LazyComponent = ({ children }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
  });

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="placeholder">Loading...</div>}
    </div>
  );
};
```

### Resource Optimization

```css
/* Optimize animations for mobile */
@media (max-width: 599px) {
  .animated-element {
    animation-duration: 0.2s; /* Shorter animations on mobile */
  }
}

/* Reduce motion for performance */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing Responsive Design

### Device Testing Matrix

| Device Category | Screen Sizes | Test Scenarios |
|-----------------|--------------|----------------|
| Mobile Phones | 320px - 599px | Portrait/landscape, touch interactions |
| Tablets | 600px - 1023px | Portrait/landscape, mixed input |
| Laptops | 1024px - 1439px | Mouse/keyboard, multi-window |
| Desktops | 1440px+ | Large displays, high DPI |

### Testing Tools

#### Browser DevTools

```javascript
// Test responsive breakpoints
const testBreakpoints = [320, 375, 414, 600, 768, 1024, 1440, 1920];

testBreakpoints.forEach(width => {
  console.log(`Testing at ${width}px`);
  // Resize viewport and test functionality
});
```

#### Automated Testing

```tsx
// Jest test for responsive behavior
import { render, screen } from '@testing-library/react';
import { ResizeObserver } from '@juggle/resize-observer';

// Mock ResizeObserver
global.ResizeObserver = ResizeObserver;

describe('Responsive Component', () => {
  it('adapts layout for mobile screens', () => {
    // Mock viewport width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<ResponsiveComponent />);
    
    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-layout')).not.toBeInTheDocument();
  });
});
```

## Best Practices Summary

### Design Principles

1. **Mobile First**: Start with mobile design and enhance for larger screens
2. **Content First**: Let content determine breakpoints, not devices
3. **Progressive Enhancement**: Add features as screen size increases
4. **Touch Friendly**: Ensure all interactions work well on touch devices
5. **Performance Aware**: Optimize for mobile network and processing constraints

### Implementation Guidelines

1. **Use Relative Units**: Prefer `rem`, `em`, `%`, and `vw/vh` over fixed pixels
2. **Flexible Layouts**: Use CSS Grid and Flexbox for adaptive layouts
3. **Container Queries**: Use container queries for component-level responsiveness
4. **Fluid Typography**: Implement fluid scaling with `clamp()` functions
5. **Accessible Touch Targets**: Ensure minimum 44px touch targets
6. **Test Across Devices**: Validate on real devices, not just browser tools

### Common Pitfalls to Avoid

1. **Fixed Breakpoints**: Don't rely solely on device-specific breakpoints
2. **Viewport Units Issues**: Be careful with `vh` on mobile browsers
3. **Touch Target Size**: Don't make interactive elements too small
4. **Horizontal Scrolling**: Prevent unintended horizontal scroll
5. **Performance Impact**: Monitor the performance impact of responsive features

This comprehensive guide ensures that the Material 3 Expressive design system provides an optimal experience across all device sizes and interaction methods.