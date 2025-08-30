# Material 3 Best Practices Guide

This guide provides best practices for implementing and maintaining Material 3 design system components in the Mr. Timely application.

## Design Principles

### Material 3 Core Principles

1. **Expressive** - Design that's personal and delightful
2. **Adaptive** - Components that work across platforms and contexts
3. **Intentional** - Every element serves a purpose

### Implementation Principles

1. **Consistency** - Use design tokens and semantic naming
2. **Accessibility** - WCAG 2.1 AA compliance as minimum standard
3. **Performance** - Optimize for speed and efficiency
4. **Maintainability** - Write clean, documented, testable code

## Component Development

### Component Structure

Follow this consistent structure for all components:

```tsx
// 1. Imports
import React, { forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { useTheme } from '@/design-system/theme';

// 2. Types and interfaces
interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  [key: string]: unknown;
}

// 3. Component implementation
export const Material3Component = forwardRef<HTMLElement, ComponentProps>(
  ({ 
    variant = 'primary', 
    size = 'medium', 
    disabled = false, 
    children, 
    className,
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    // 4. Hooks and state
    const theme = useTheme();
    const id = useId();
    
    // 5. Computed values
    const classes = clsx(
      'material3-component',
      `material3-component--${variant}`,
      `material3-component--${size}`,
      {
        'material3-component--disabled': disabled,
      },
      className
    );
    
    // 6. Event handlers
    const handleClick = (event: MouseEvent) => {
      if (disabled) return;
      props.onClick?.(event);
    };
    
    // 7. Render
    return (
      <element
        ref={ref}
        id={id}
        className={classes}
        disabled={disabled}
        aria-label={ariaLabel}
        onClick={handleClick}
        {...props}
      >
        {children}
      </element>
    );
  }
);

// 8. Display name and exports
Material3Component.displayName = 'Material3Component';
```

### Naming Conventions

#### Component Names
- Use `Material3` prefix for all components
- Use PascalCase: `Material3Button`, `Material3Card`
- Be descriptive: `Material3TextField` not `Material3Input`

#### Props and Variables
- Use camelCase: `variant`, `isDisabled`, `onClick`
- Use boolean prefixes: `is*`, `has*`, `should*`
- Use semantic names: `variant="filled"` not `variant="primary"`

#### CSS Classes
- Use BEM naming: `.material3-button__text`
- Use kebab-case: `.material3-text-field`
- Include variants: `.material3-button--filled`

### Prop Design

#### Required Props
Keep required props minimal:

```tsx
// Good: Only essential props required
interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  onClick?: (event: MouseEvent) => void;
}

// Bad: Too many required props
interface ButtonProps {
  children: ReactNode;
  variant: ButtonVariant;
  size: ButtonSize;
  onClick: (event: MouseEvent) => void;
  className: string;
}
```

#### Prop Validation
Use TypeScript for compile-time validation:

```tsx
// Good: Clear, typed props
interface ButtonProps {
  variant?: 'filled' | 'filledTonal' | 'outlined' | 'text' | 'icon';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

// Bad: Unclear prop types
interface ButtonProps {
  variant?: string;
  size?: any;
  disabled?: boolean | string;
}
```

#### Default Props
Use default parameters instead of defaultProps:

```tsx
// Good: Default parameters
const Material3Button = ({ 
  variant = 'filled',
  size = 'medium',
  disabled = false,
  ...props 
}) => {
  // Component implementation
};

// Bad: defaultProps (deprecated)
Material3Button.defaultProps = {
  variant: 'filled',
  size: 'medium',
  disabled: false,
};
```

## Styling Guidelines

### CSS Custom Properties

Use semantic color tokens consistently:

```css
/* Good: Semantic tokens */
.material3-button {
  background-color: var(--m3-color-primary);
  color: var(--m3-color-on-primary);
  border-radius: var(--m3-shape-corner-full);
  padding: var(--m3-spacing-sm) var(--m3-spacing-lg);
}

/* Bad: Hardcoded values */
.material3-button {
  background-color: #6750A4;
  color: #FFFFFF;
  border-radius: 20px;
  padding: 8px 24px;
}
```

### State Management

Implement all interactive states:

```css
.material3-button {
  /* Base state */
  background-color: var(--m3-color-primary);
  transition: all 200ms var(--m3-motion-easing-standard);
}

.material3-button:hover {
  /* Hover state */
  background-color: var(--m3-color-primary-hover);
  box-shadow: var(--m3-elevation-level1);
}

.material3-button:focus-visible {
  /* Focus state */
  outline: 2px solid var(--m3-color-primary);
  outline-offset: 2px;
}

.material3-button:active {
  /* Pressed state */
  background-color: var(--m3-color-primary-pressed);
  box-shadow: var(--m3-elevation-level0);
}

.material3-button:disabled {
  /* Disabled state */
  background-color: var(--m3-color-on-surface);
  color: var(--m3-color-on-surface);
  opacity: 0.38;
  cursor: not-allowed;
}
```

### Responsive Design

Use mobile-first approach:

```css
/* Good: Mobile-first responsive design */
.material3-card {
  padding: var(--m3-spacing-md);
  margin: var(--m3-spacing-sm);
}

@media (min-width: 600px) {
  .material3-card {
    padding: var(--m3-spacing-lg);
    margin: var(--m3-spacing-md);
  }
}

@media (min-width: 1200px) {
  .material3-card {
    padding: var(--m3-spacing-xl);
    margin: var(--m3-spacing-lg);
  }
}

/* Bad: Desktop-first approach */
.material3-card {
  padding: var(--m3-spacing-xl);
  margin: var(--m3-spacing-lg);
}

@media (max-width: 1199px) {
  .material3-card {
    padding: var(--m3-spacing-lg);
    margin: var(--m3-spacing-md);
  }
}
```

## Accessibility Best Practices

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

```tsx
const Material3Button = ({ onClick, disabled, children, ...props }) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Allow Enter and Space to activate button
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event);
    }
  };

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </button>
  );
};
```

### ARIA Attributes

Include appropriate ARIA attributes:

```tsx
// Good: Comprehensive ARIA support
<Material3Button
  variant="icon"
  aria-label="Save document"
  aria-describedby="save-help"
  disabled={isLoading}
  aria-pressed={isSaved}
>
  <SaveIcon />
</Material3Button>

// Supporting help text
<div id="save-help" className="sr-only">
  Saves the current document to your account
</div>

// Bad: Missing ARIA attributes
<Material3Button variant="icon">
  <SaveIcon />
</Material3Button>
```

### Screen Reader Support

Provide meaningful content for screen readers:

```tsx
// Good: Screen reader friendly
const Material3Card = ({ title, description, onClick }) => (
  <button
    className="material3-card"
    onClick={onClick}
    aria-label={`${title}: ${description}`}
  >
    <div aria-hidden="true">
      <Typography variant="titleMedium">{title}</Typography>
      <Typography variant="bodyMedium">{description}</Typography>
    </div>
  </button>
);

// Bad: Not screen reader friendly
const Material3Card = ({ title, description, onClick }) => (
  <div className="material3-card" onClick={onClick}>
    <div>{title}</div>
    <div>{description}</div>
  </div>
);
```

### Color Contrast

Ensure sufficient color contrast:

```css
/* All color combinations meet WCAG 2.1 AA standards */
:root {
  /* 4.5:1 contrast ratio for normal text */
  --m3-color-primary: #6750A4;
  --m3-color-on-primary: #FFFFFF; /* 4.51:1 contrast */
  
  /* 3:1 contrast ratio for large text and UI elements */
  --m3-color-outline: #79747E; /* 3.04:1 contrast on surface */
}

/* Verify contrast in development */
.material3-button {
  background-color: var(--m3-color-primary);
  color: var(--m3-color-on-primary);
  
  /* Add visual indicator in dev mode */
  &[data-contrast-check="fail"] {
    outline: 2px solid red;
  }
}
```

## Performance Optimization

### Component Optimization

Use React optimization techniques:

```tsx
// Good: Optimized component
import { memo, useCallback, useMemo } from 'react';

const Material3Button = memo(({ onClick, children, ...props }) => {
  // Memoize expensive calculations
  const buttonStyles = useMemo(() => ({
    backgroundColor: getColorToken(props.variant),
    padding: getSpacingToken(props.size),
  }), [props.variant, props.size]);
  
  // Memoize event handlers
  const handleClick = useCallback((event) => {
    onClick?.(event);
  }, [onClick]);
  
  return (
    <button
      style={buttonStyles}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

// Bad: Unoptimized component
const Material3Button = ({ onClick, children, ...props }) => {
  // Recreates styles on every render
  const buttonStyles = {
    backgroundColor: getColorToken(props.variant),
    padding: getSpacingToken(props.size),
  };
  
  return (
    <button
      style={buttonStyles}
      onClick={(event) => onClick?.(event)} // New function every render
      {...props}
    >
      {children}
    </button>
  );
};
```

### CSS Performance

Optimize CSS for performance:

```css
/* Good: Efficient CSS */
.material3-button {
  /* Use transform and opacity for animations */
  transform: translateY(0);
  opacity: 1;
  transition: transform 200ms ease-out, opacity 200ms ease-out;
  
  /* Enable GPU acceleration */
  will-change: transform, opacity;
}

.material3-button:hover {
  transform: translateY(-1px);
}

.material3-button:active {
  transform: translateY(0);
}

/* Bad: Inefficient CSS */
.material3-button {
  /* Triggers layout/paint on animation */
  top: 0;
  left: 0;
  transition: top 200ms ease-out, left 200ms ease-out;
}

.material3-button:hover {
  top: -1px;
}
```

### Bundle Size Optimization

Structure imports for tree shaking:

```tsx
// Good: Tree-shakable structure
// components/Button/index.ts
export { Material3Button } from './Material3Button';
export type { ButtonProps } from './types';

// components/index.ts
export { Material3Button } from './Button';
export { Material3Card } from './Card';

// Usage
import { Material3Button } from '@/design-system/components';

// Bad: Large bundle imports
export * from './Button';
export * from './Card';
// ... exports everything
```

## Testing Strategies

### Unit Testing

Test component behavior thoroughly:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Material3Button } from './Material3Button';

describe('Material3Button', () => {
  test('renders with correct variant class', () => {
    render(<Material3Button variant="filled">Click me</Material3Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('material3-button--filled');
  });
  
  test('handles click events when enabled', () => {
    const handleClick = jest.fn();
    render(
      <Material3Button onClick={handleClick}>Click me</Material3Button>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('does not handle click when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Material3Button disabled onClick={handleClick}>
        Click me
      </Material3Button>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  test('supports keyboard activation', () => {
    const handleClick = jest.fn();
    render(
      <Material3Button onClick={handleClick}>Click me</Material3Button>
    );
    
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    fireEvent.keyDown(button, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
```

### Integration Testing

Test component interactions:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Material3Card } from './Material3Card';
import { Material3Button } from './Material3Button';

describe('Material3Card Integration', () => {
  test('card actions work correctly', () => {
    const handlePrimary = jest.fn();
    const handleSecondary = jest.fn();
    
    render(
      <Material3Card>
        <Material3Card.Content>Card content</Material3Card.Content>
        <Material3Card.Actions>
          <Material3Button variant="text" onClick={handleSecondary}>
            Cancel
          </Material3Button>
          <Material3Button variant="filled" onClick={handlePrimary}>
            Save
          </Material3Button>
        </Material3Card.Actions>
      </Material3Card>
    );
    
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(handlePrimary).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleSecondary).toHaveBeenCalledTimes(1);
  });
});
```

### Accessibility Testing

Automated accessibility testing:

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

describe('Material3Button Accessibility', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(
      <Material3Button variant="filled">Save Changes</Material3Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  test('icon button has proper label', async () => {
    const { container } = render(
      <Material3Button 
        variant="icon" 
        aria-label="Save document"
      >
        <SaveIcon />
      </Material3Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Documentation Standards

### Component Documentation

Document all components thoroughly:

```tsx
/**
 * Material3Button provides five button variants following Material Design 3 guidelines.
 * 
 * @example
 * // Filled button (highest emphasis)
 * <Material3Button variant="filled" onClick={handleSave}>
 *   Save Changes
 * </Material3Button>
 * 
 * @example
 * // Icon button with accessibility
 * <Material3Button 
 *   variant="icon" 
 *   icon={<SaveIcon />}
 *   aria-label="Save document"
 *   onClick={handleSave}
 * />
 */
export interface Material3ButtonProps {
  /**
   * Visual style variant
   * - filled: Highest emphasis, primary actions
   * - filledTonal: Medium-high emphasis, secondary actions
   * - outlined: Medium emphasis, tertiary actions
   * - text: Low emphasis, least important actions
   * - icon: Minimal emphasis, icon-only actions
   * 
   * @default 'filled'
   */
  variant?: 'filled' | 'filledTonal' | 'outlined' | 'text' | 'icon';
  
  /**
   * Button size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Button content - required for all variants except icon
   */
  children?: ReactNode;
  
  /**
   * Click event handler
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}
```

### Code Comments

Add meaningful comments:

```tsx
const Material3Button = ({ variant = 'filled', ...props }) => {
  // Use theme colors for consistent theming across light/dark modes
  const theme = useTheme();
  
  // Generate stable IDs for accessibility
  const buttonId = useId();
  
  // Combine base classes with variant and state modifiers
  const buttonClasses = clsx(
    'material3-button', // Base component class
    `material3-button--${variant}`, // Variant modifier
    {
      'material3-button--disabled': props.disabled, // State modifier
    },
    props.className // User-provided classes
  );
  
  return (
    <button
      id={buttonId}
      className={buttonClasses}
      {...props}
    >
      {props.children}
    </button>
  );
};
```

## Error Handling

### Graceful Degradation

Handle errors gracefully:

```tsx
const Material3Card = ({ children, ...props }) => {
  try {
    return (
      <div className="material3-card" {...props}>
        <ErrorBoundary fallback={<CardErrorFallback />}>
          {children}
        </ErrorBoundary>
      </div>
    );
  } catch (error) {
    console.error('Material3Card render error:', error);
    return <div className="material3-card--error">Content unavailable</div>;
  }
};

const CardErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="material3-card__error">
    <Typography variant="titleMedium">Something went wrong</Typography>
    <Material3Button variant="text" onClick={resetErrorBoundary}>
      Try again
    </Material3Button>
  </div>
);
```

### Prop Validation

Add runtime prop validation in development:

```tsx
const Material3Button = ({ variant, size, ...props }) => {
  // Development-only prop validation
  if (process.env.NODE_ENV === 'development') {
    const validVariants = ['filled', 'filledTonal', 'outlined', 'text', 'icon'];
    if (variant && !validVariants.includes(variant)) {
      console.warn(`Invalid variant "${variant}". Expected one of: ${validVariants.join(', ')}`);
    }
    
    if (variant === 'icon' && !props['aria-label']) {
      console.warn('Icon buttons require an aria-label for accessibility');
    }
  }
  
  return (
    <button {...props}>
      {props.children}
    </button>
  );
};
```

## Team Guidelines

### Code Review Checklist

- [ ] Component follows naming conventions
- [ ] Props are properly typed and documented
- [ ] Accessibility attributes are included
- [ ] All interactive states are implemented
- [ ] Component is responsive and works on mobile
- [ ] Tests cover main functionality and accessibility
- [ ] Documentation includes usage examples
- [ ] Performance considerations are addressed

### Design System Governance

1. **Component Proposals**: Use RFC process for new components
2. **Breaking Changes**: Require team approval and migration guide
3. **Version Management**: Follow semantic versioning
4. **Design Tokens**: Changes require design team approval

### Development Workflow

1. **Feature Branch**: Create branch for component work
2. **Development**: Build component with tests and documentation
3. **Review**: Design and code review before merge
4. **Integration**: Test in consuming applications
5. **Release**: Update version and changelog

---

*Last updated: August 30, 2025*