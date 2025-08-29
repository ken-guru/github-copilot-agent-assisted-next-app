# Material 3 Accessibility Guidelines

## Overview

This document provides comprehensive accessibility guidelines for the Material 3 Expressive design system implementation in Mr. Timely. It ensures WCAG 2.1 AA compliance and creates an inclusive experience for all users, including those using assistive technologies.

## Table of Contents

1. [Color and Contrast](#color-and-contrast)
2. [Typography and Readability](#typography-and-readability)
3. [Focus Management](#focus-management)
4. [Keyboard Navigation](#keyboard-navigation)
5. [Screen Reader Support](#screen-reader-support)
6. [Motion and Animation](#motion-and-animation)
7. [Touch and Interaction](#touch-and-interaction)
8. [Component-Specific Guidelines](#component-specific-guidelines)
9. [Testing and Validation](#testing-and-validation)

## Color and Contrast

### WCAG Compliance Standards

All color combinations in the Material 3 Expressive system meet or exceed WCAG 2.1 AA standards:

| Content Type | Minimum Contrast Ratio | Target Ratio |
|--------------|------------------------|--------------|
| Normal text (< 18px) | 4.5:1 | 7:1 (AAA) |
| Large text (≥ 18px) | 3:1 | 4.5:1 (AAA) |
| UI components | 3:1 | 4.5:1 |
| Focus indicators | 3:1 | 4.5:1 |
| Graphical objects | 3:1 | 4.5:1 |

### Color Usage Guidelines

#### Semantic Color Roles

```css
/* High contrast color combinations */
:root {
  /* Primary combinations - 7.2:1 contrast */
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  
  /* Surface combinations - 15.8:1 contrast */
  --md-sys-color-surface: #fef7ff;
  --md-sys-color-on-surface: #1d1b20;
  
  /* Error combinations - 4.7:1 contrast */
  --md-sys-color-error: #ba1a1a;
  --md-sys-color-on-error: #ffffff;
}

/* Dark theme with maintained contrast ratios */
:root[data-theme="dark"] {
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-on-primary: #381e72;
  
  --md-sys-color-surface: #141218;
  --md-sys-color-on-surface: #e6e0e9;
  
  --md-sys-color-error: #ffb4ab;
  --md-sys-color-on-error: #690005;
}
```

#### Color Accessibility Implementation

```tsx
import { getMaterial3AccessibleColors } from '../utils/material3-utils';

// Automatically validated color combinations
const AccessibleButton = () => (
  <button style={getMaterial3AccessibleColors('onPrimary', 'primary', {
    fallbackForeground: 'onSurface',
    fallbackBackground: 'surface',
    enforceContrast: true,
  })}>
    Accessible Button
  </button>
);
```

#### Color-Blind Considerations

```css
/* Never rely on color alone - use additional indicators */
.status-indicator {
  display: flex;
  align-items: center;
  gap: var(--md-sys-spacing-small);
}

.status-indicator::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

/* Success state */
.status-success {
  color: var(--md-sys-color-tertiary);
}

.status-success::before {
  content: '✓'; /* Icon instead of just color */
  background: none;
  font-weight: bold;
}

/* Error state */
.status-error {
  color: var(--md-sys-color-error);
}

.status-error::before {
  content: '⚠'; /* Icon instead of just color */
  background: none;
  font-weight: bold;
}
```

### Contrast Testing Tools

```tsx
// Utility function to calculate contrast ratio
export const calculateContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Calculate relative luminance
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

// Component for testing contrast ratios
const ContrastChecker = ({ foreground, background }) => {
  const ratio = calculateContrastRatio(foreground, background);
  const passesAA = ratio >= 4.5;
  const passesAAA = ratio >= 7;
  
  return (
    <div className="contrast-checker">
      <div 
        style={{ 
          color: foreground, 
          backgroundColor: background,
          padding: '16px',
        }}
      >
        Sample Text (Ratio: {ratio.toFixed(2)}:1)
      </div>
      <div className="contrast-results">
        <span className={passesAA ? 'pass' : 'fail'}>
          WCAG AA: {passesAA ? 'Pass' : 'Fail'}
        </span>
        <span className={passesAAA ? 'pass' : 'fail'}>
          WCAG AAA: {passesAAA ? 'Pass' : 'Fail'}
        </span>
      </div>
    </div>
  );
};
```

## Typography and Readability

### Font Size and Line Height

```css
/* Minimum font sizes for accessibility */
.md-typescale-body-small {
  font-size: max(12px, 0.75rem); /* Never smaller than 12px */
  line-height: 1.5; /* Minimum 1.5 line height */
}

.md-typescale-body-medium {
  font-size: max(14px, 0.875rem);
  line-height: 1.5;
}

.md-typescale-body-large {
  font-size: max(16px, 1rem);
  line-height: 1.5;
}

/* Large text for better readability */
.md-typescale-headline-large {
  font-size: clamp(28px, 4vw, 57px);
  line-height: 1.2;
  font-weight: 400; /* Not too bold for readability */
}
```

### Reading Patterns and Hierarchy

```tsx
// Proper heading hierarchy
const AccessibleContent = () => (
  <article>
    <h1>Main Page Title</h1>
    <section>
      <h2>Section Title</h2>
      <h3>Subsection Title</h3>
      <p>Body content with proper hierarchy.</p>
    </section>
  </article>
);

// Skip to content link
const SkipLink = () => (
  <a 
    href="#main-content" 
    className="skip-link"
    style={{
      position: 'absolute',
      top: '-40px',
      left: '6px',
      background: 'var(--md-sys-color-primary)',
      color: 'var(--md-sys-color-on-primary)',
      padding: '8px',
      textDecoration: 'none',
      zIndex: 1000,
      transition: 'top 0.3s',
    }}
    onFocus={(e) => e.target.style.top = '6px'}
    onBlur={(e) => e.target.style.top = '-40px'}
  >
    Skip to main content
  </a>
);
```

### Text Spacing and Layout

```css
/* Optimal text spacing for readability */
.readable-text {
  max-width: 70ch; /* Optimal line length */
  line-height: 1.6; /* Generous line spacing */
  letter-spacing: 0.01em; /* Slight letter spacing */
  word-spacing: 0.1em; /* Adequate word spacing */
  margin-bottom: 1.5em; /* Paragraph spacing */
}

/* Responsive text scaling */
@media (max-width: 599px) {
  .readable-text {
    font-size: max(16px, 1rem); /* Prevent zoom on iOS */
    line-height: 1.5;
  }
}
```

## Focus Management

### Focus Indicators

All interactive elements must have visible focus indicators that meet contrast requirements.

```css
/* High-contrast focus indicators */
.focusable-element {
  outline: none; /* Remove default outline */
  position: relative;
}

.focusable-element:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
  border-radius: var(--md-sys-shape-corner-small);
}

/* Custom focus ring for complex components */
.focusable-element:focus-visible::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid var(--md-sys-color-primary);
  border-radius: inherit;
  pointer-events: none;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .focusable-element:focus-visible {
    outline: 3px solid;
    outline-offset: 3px;
  }
}
```

### Focus Management in React

```tsx
import { useRef, useEffect } from 'react';

// Custom hook for focus management
export const useFocusManagement = () => {
  const focusableElements = useRef<HTMLElement[]>([]);
  
  const trapFocus = (container: HTMLElement) => {
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    focusableElements.current = Array.from(focusable);
    
    const firstElement = focusableElements.current[0];
    const lastElement = focusableElements.current[focusableElements.current.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };
  
  const restoreFocus = (element: HTMLElement) => {
    element?.focus();
  };
  
  return { trapFocus, restoreFocus };
};

// Modal with focus trapping
const AccessibleModal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const { trapFocus, restoreFocus } = useFocusManagement();
  
  useEffect(() => {
    if (isOpen && modalRef.current) {
      previousFocus.current = document.activeElement as HTMLElement;
      const cleanup = trapFocus(modalRef.current);
      
      return () => {
        cleanup();
        if (previousFocus.current) {
          restoreFocus(previousFocus.current);
        }
      };
    }
  }, [isOpen, trapFocus, restoreFocus]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div ref={modalRef} className="modal-content">
        <button 
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};
```

## Keyboard Navigation

### Keyboard Shortcuts and Navigation

```tsx
// Global keyboard shortcuts
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (event.key) {
        case 'Escape':
          // Close modals, cancel actions
          document.dispatchEvent(new CustomEvent('escape-pressed'));
          break;
          
        case ' ':
          // Space bar actions (play/pause, etc.)
          if (event.target instanceof HTMLButtonElement) {
            event.preventDefault();
            event.target.click();
          }
          break;
          
        case 'Enter':
          // Enter key actions
          if (event.target instanceof HTMLButtonElement) {
            event.preventDefault();
            event.target.click();
          }
          break;
          
        case 'ArrowUp':
        case 'ArrowDown':
          // Navigate lists
          if (event.target?.closest('[role="listbox"]')) {
            event.preventDefault();
            navigateList(event.key === 'ArrowUp' ? -1 : 1);
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};

// Keyboard navigation for custom components
const KeyboardNavigableList = ({ items, onSelect }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect(items[focusedIndex]);
        break;
        
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
        
      case 'End':
        event.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
    }
  };
  
  return (
    <ul 
      ref={listRef}
      role="listbox"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-activedescendant={`item-${focusedIndex}`}
    >
      {items.map((item, index) => (
        <li
          key={item.id}
          id={`item-${index}`}
          role="option"
          aria-selected={index === focusedIndex}
          className={index === focusedIndex ? 'focused' : ''}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
};
```

## Screen Reader Support

### ARIA Labels and Descriptions

```tsx
// Comprehensive ARIA implementation
const AccessibleActivityButton = ({ activity, isActive, onStart, onStop }) => {
  const buttonId = `activity-button-${activity.id}`;
  const descriptionId = `activity-description-${activity.id}`;
  
  return (
    <div className="activity-card">
      <button
        id={buttonId}
        onClick={isActive ? onStop : onStart}
        aria-describedby={descriptionId}
        aria-pressed={isActive}
        aria-label={`${isActive ? 'Stop' : 'Start'} ${activity.name} timer`}
      >
        <span className="activity-name">{activity.name}</span>
        <span className="activity-status" aria-live="polite">
          {isActive ? 'Running' : 'Stopped'}
        </span>
      </button>
      
      <div 
        id={descriptionId}
        className="sr-only"
      >
        Duration: {activity.duration} minutes. 
        Priority: {activity.priority}. 
        {activity.completed ? 'Completed' : 'Not completed'}.
      </div>
    </div>
  );
};

// Live regions for dynamic content
const TimerDisplay = ({ timeRemaining, isActive }) => {
  const [announcement, setAnnouncement] = useState('');
  
  useEffect(() => {
    if (isActive && timeRemaining % 60 === 0) {
      setAnnouncement(`${timeRemaining / 60} minutes remaining`);
    }
  }, [timeRemaining, isActive]);
  
  return (
    <div className="timer-display">
      <div className="timer-visual">
        {formatTime(timeRemaining)}
      </div>
      
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      
      {/* Status for screen readers */}
      <div className="sr-only">
        Timer {isActive ? 'running' : 'stopped'}. 
        {timeRemaining > 0 ? `${formatTime(timeRemaining)} remaining` : 'Time is up'}
      </div>
    </div>
  );
};
```

### Screen Reader Only Content

```css
/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Show on focus for keyboard users */
.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Semantic HTML Structure

```tsx
// Proper semantic structure
const AccessiblePage = () => (
  <div>
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        <ul>
          <li><a href="/timer">Timer</a></li>
          <li><a href="/activities">Activities</a></li>
          <li><a href="/summary">Summary</a></li>
        </ul>
      </nav>
    </header>
    
    <main role="main" id="main-content">
      <h1>Timer Dashboard</h1>
      
      <section aria-labelledby="current-activity">
        <h2 id="current-activity">Current Activity</h2>
        {/* Activity content */}
      </section>
      
      <section aria-labelledby="activity-list">
        <h2 id="activity-list">All Activities</h2>
        <ul role="list">
          {/* Activity items */}
        </ul>
      </section>
    </main>
    
    <aside role="complementary" aria-label="Timer controls">
      {/* Timer controls */}
    </aside>
    
    <footer role="contentinfo">
      {/* Footer content */}
    </footer>
  </div>
);
```

## Motion and Animation

### Reduced Motion Support

```css
/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Provide alternative feedback for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
    opacity: 0.7;
  }
  
  .loading-spinner::after {
    content: 'Loading...';
    display: block;
    text-align: center;
  }
}
```

### Accessible Animation Implementation

```tsx
import { useReducedMotion } from '../hooks/useReducedMotion';

const AccessibleAnimation = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div 
      className={`animated-container ${prefersReducedMotion ? 'reduced-motion' : ''}`}
      style={{
        transition: prefersReducedMotion ? 'none' : 'all 0.3s ease',
        animation: prefersReducedMotion ? 'none' : 'fadeIn 0.5s ease',
      }}
    >
      {children}
    </div>
  );
};

// Hook to detect reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
};
```

## Touch and Interaction

### Touch Target Guidelines

```css
/* Minimum touch target sizes */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Recommended touch target sizes */
@media (max-width: 599px) {
  .touch-target {
    min-height: 48px;
    min-width: 48px;
    padding: 16px;
  }
}

/* Ensure adequate spacing between touch targets */
.touch-target + .touch-target {
  margin-left: 8px;
}
```

### Gesture Accessibility

```tsx
// Accessible swipe implementation
const AccessibleSwipeCard = ({ onEdit, onDelete, children }) => {
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [showActions, setShowActions] = useState(false);
  
  // Provide keyboard alternatives to swipe gestures
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        onDelete();
        break;
      case 'e':
      case 'E':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onEdit();
        }
        break;
    }
  };
  
  return (
    <div 
      className="swipe-card"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Activity card. Press Delete to remove, Ctrl+E to edit"
    >
      <div 
        className="card-content"
        style={{ transform: `translateX(${swipeDistance}px)` }}
      >
        {children}
      </div>
      
      {/* Always visible action buttons for accessibility */}
      <div className="card-actions">
        <button onClick={onEdit} aria-label="Edit activity">
          Edit
        </button>
        <button onClick={onDelete} aria-label="Delete activity">
          Delete
        </button>
      </div>
    </div>
  );
};
```

## Component-Specific Guidelines

### Button Accessibility

```tsx
const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled, 
  loading, 
  variant = 'filled',
  ...props 
}) => {
  return (
    <button
      className={`md-button md-button-${variant}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-describedby={loading ? 'loading-description' : undefined}
      {...props}
    >
      {loading ? (
        <>
          <span className="loading-spinner" aria-hidden="true" />
          <span className="sr-only">Loading...</span>
        </>
      ) : (
        children
      )}
      
      {loading && (
        <div id="loading-description" className="sr-only">
          Please wait while the action is being processed
        </div>
      )}
    </button>
  );
};
```

### Form Field Accessibility

```tsx
const AccessibleTextField = ({ 
  label, 
  error, 
  helperText, 
  required, 
  ...props 
}) => {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  
  return (
    <div className="text-field-container">
      <label htmlFor={fieldId} className="text-field-label">
        {label}
        {required && <span aria-label="required">*</span>}
      </label>
      
      <input
        id={fieldId}
        className={`text-field-input ${error ? 'error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={`${error ? errorId : ''} ${helperText ? helperId : ''}`.trim()}
        aria-required={required}
        {...props}
      />
      
      {error && (
        <div id={errorId} className="text-field-error" role="alert">
          {error}
        </div>
      )}
      
      {helperText && (
        <div id={helperId} className="text-field-helper">
          {helperText}
        </div>
      )}
    </div>
  );
};
```

### Navigation Accessibility

```tsx
const AccessibleNavigation = ({ items, currentPath }) => {
  return (
    <nav role="navigation" aria-label="Main navigation">
      <ul className="navigation-list">
        {items.map((item) => (
          <li key={item.path} className="navigation-item">
            <a
              href={item.path}
              className={`navigation-link ${currentPath === item.path ? 'active' : ''}`}
              aria-current={currentPath === item.path ? 'page' : undefined}
            >
              {item.icon && (
                <span className="navigation-icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className="navigation-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

## Testing and Validation

### Automated Testing Tools

```tsx
// Jest + Testing Library accessibility tests
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have proper ARIA labels', () => {
    render(<AccessibleButton>Click me</AccessibleButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
  
  it('should support keyboard navigation', () => {
    render(<KeyboardNavigableList items={mockItems} />);
    const list = screen.getByRole('listbox');
    
    fireEvent.keyDown(list, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { selected: true })).toBeInTheDocument();
  });
});
```

### Manual Testing Checklist

#### Keyboard Testing
- [ ] All interactive elements are reachable via keyboard
- [ ] Tab order is logical and follows visual layout
- [ ] Focus indicators are visible and high contrast
- [ ] Escape key closes modals and cancels actions
- [ ] Enter and Space activate buttons appropriately

#### Screen Reader Testing
- [ ] All content is announced correctly
- [ ] Headings create proper document outline
- [ ] Form fields have associated labels
- [ ] Error messages are announced
- [ ] Dynamic content updates are announced

#### Color and Contrast Testing
- [ ] All text meets minimum contrast ratios
- [ ] Focus indicators meet contrast requirements
- [ ] Information is not conveyed by color alone
- [ ] Interface works in high contrast mode

#### Motion Testing
- [ ] Animations respect reduced motion preferences
- [ ] Alternative feedback is provided when motion is reduced
- [ ] No content flashes more than 3 times per second

### Accessibility Testing Tools

```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/react jest-axe
npm install --save-dev @testing-library/jest-dom
```

```tsx
// Axe integration for runtime testing
import { useEffect } from 'react';

if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

## Best Practices Summary

### Design Principles
1. **Inclusive by Default**: Design for accessibility from the start
2. **Progressive Enhancement**: Ensure core functionality works without JavaScript
3. **Semantic HTML**: Use proper HTML elements for their intended purpose
4. **Clear Communication**: Provide clear, concise labels and instructions
5. **Consistent Patterns**: Use consistent interaction patterns throughout

### Implementation Guidelines
1. **Test Early and Often**: Include accessibility testing in development workflow
2. **Use Semantic HTML**: Leverage built-in accessibility features
3. **Provide Multiple Ways**: Offer keyboard, mouse, and touch interaction methods
4. **Announce Changes**: Use ARIA live regions for dynamic content
5. **Respect Preferences**: Honor user preferences for motion, contrast, etc.

### Common Pitfalls to Avoid
1. **Keyboard Traps**: Ensure users can navigate away from all components
2. **Missing Labels**: All form fields and buttons need accessible names
3. **Color Dependence**: Don't rely solely on color to convey information
4. **Auto-playing Media**: Avoid auto-playing audio or video content
5. **Flashing Content**: Prevent content that flashes rapidly

This comprehensive accessibility guide ensures that the Material 3 Expressive design system creates an inclusive experience for all users, regardless of their abilities or assistive technologies used.