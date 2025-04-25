# MRTMLY-005: Mobile UI Implementation Plan

**Date:** 2023-07-10
**Tags:** #planning #mobile #UI #responsiveness
**Status:** In Progress

## Initial State
We now have completed the test framework and basic components for the mobile UI improvements. All tests are passing, including:
- OvertimeIndicator tests
- MobileUI tests with viewport detection

However, the actual implementation for the improved mobile UI experience still needs to be built out beyond the testing infrastructure.

## Implementation Plan

### 1. Core Responsive Components

#### Mobile-First CSS Variables
Create a centralized set of CSS variables for mobile-friendly dimensions:

```css
:root {
  /* Base spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Touch targets */
  --touch-target-min: 44px;
  --touch-target-ideal: 48px;
  
  /* Typography */
  --font-size-mobile-xs: 0.75rem;
  --font-size-mobile-sm: 0.875rem;
  --font-size-mobile-md: 1rem;
  --font-size-mobile-lg: 1.25rem;
  --font-size-mobile-xl: 1.5rem;
  
  /* Layout dimensions */
  --header-height-mobile: 56px;
  --footer-height-mobile: 64px;
  
  /* Transitions */
  --transition-speed-fast: 150ms;
  --transition-speed-normal: 300ms;
  --transition-speed-slow: 500ms;
}
```

#### Component Priority Order
Implement mobile improvements in this priority order:

1. TouchableButton component
2. Navigation/Header components
3. ActivityManager mobile view
4. Timeline mobile view
5. Summary mobile view
6. Footer controls

### 2. TouchableButton Component

Create a new base button component that is touch-friendly:

```tsx
// TouchableButton.tsx
interface TouchableButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const TouchableButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  icon,
  className = '',
}: TouchableButtonProps) => {
  const { hasTouch } = useViewport();
  
  // Apply different classes based on presence of touch
  const touchClass = hasTouch ? styles.touchFriendly : '';
  
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${touchClass} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};
```

### 3. Mobile App Layout Structure

Implement the structured layout pattern in App.tsx:

```tsx
// App.tsx
const App = () => {
  const { isMobile } = useViewport();
  
  return (
    <div className={`${styles.container} ${isMobile ? styles.mobileContainer : ''}`}>
      <header className={isMobile ? styles.mobileHeader : styles.header}>
        <Logo />
        <ThemeSwitcher />
      </header>
      
      <main className={isMobile ? styles.mobileMain : styles.main}>
        <DurationSetup />
        <Progress />
        <TimeAndOvertimeDisplay />
        <ActivityManager />
        <Timeline />
        <Summary />
      </main>
      
      <footer className={isMobile ? styles.mobileFooter : styles.footer}>
        <TouchableButton 
          variant="secondary" 
          onClick={handleReset}
          data-testid="reset-button"
        >
          Reset
        </TouchableButton>
        
        <TouchableButton 
          variant="primary" 
          onClick={handleCompleteAll}
          data-testid="complete-all-button"
        >
          Complete All
        </TouchableButton>
      </footer>
    </div>
  );
};
```

### 4. Overtime Display UI

Enhance the OvertimeIndicator with additional mobile-friendly features:

- Add haptic feedback for capable devices when entering overtime
- Implement a subtle animation when entering/exiting overtime
- Ensure text is large enough to be read at a distance

### 5. Activity Manager Mobile Improvements

- Convert to card-based UI for better touch interaction
- Add swipe gestures for common actions
- Implement larger touch targets for activity controls
- Use full width on mobile
- Add pull-to-refresh gesture

### 6. Responsive Typography System

Create a responsive typography system:

```css
/* Typography scale */
body {
  font-size: 16px;
}

h1 {
  font-size: var(--font-size-mobile-xl);
  line-height: 1.2;
}

h2 {
  font-size: var(--font-size-mobile-lg);
  line-height: 1.3;
}

/* Base text */
p, li, a, button, input {
  font-size: var(--font-size-mobile-md);
}

@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  p, li, a, button, input {
    font-size: 1rem;
  }
}
```

### 7. Testing Strategy

For each component:
1. Update or add tests for mobile-specific behavior
2. Test with touch events when applicable
3. Verify correct rendering at different viewport sizes

### 8. Accessibility Considerations

- Add focus styles that work well for both mouse and touch
- Ensure all touch targets meet WCAG standards (minimum 44px)
- Add reduced motion preferences for animations
- Test with screen readers on mobile devices
- Verify color contrast on different mobile screens

### 9. Performance Optimization

- Optimize for mobile networks by minimizing unnecessary re-renders
- Use appropriate image sizes based on viewport
- Implement code splitting to reduce initial bundle size
- Add lazy loading for non-critical components

## Implementation Tasks Breakdown

| Task | Priority | Estimated Effort | Prerequisites |
|------|----------|------------------|---------------|
| CSS variables for mobile design | HIGH | 2 hours | None |
| TouchableButton component | HIGH | 3 hours | CSS variables |
| Mobile App layout structure | HIGH | 4 hours | CSS variables |
| OvertimeIndicator enhancements | MEDIUM | 2 hours | CSS variables |
| Activity Manager mobile view | MEDIUM | 5 hours | TouchableButton |
| Timeline mobile optimizations | MEDIUM | 4 hours | CSS variables |
| Summary mobile view | LOW | 3 hours | CSS variables |
| Responsive typography | HIGH | 2 hours | None |
| Accessibility improvements | HIGH | 3 hours | All components |
| Performance optimizations | MEDIUM | 4 hours | All components |

## Next Steps

1. Start with CSS variables and TouchableButton component
2. Update App component to use mobile layout structure
3. Implement OvertimeIndicator enhancements
4. Continue with remaining components in priority order
5. Run comprehensive tests on actual mobile devices
6. Gather feedback and iterate on design
