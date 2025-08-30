# Material 3 Design System Documentation

## Overview

This documentation provides comprehensive guidance for implementing and using the Material 3 Expressive design system in the Mr. Timely application. The design system includes design tokens, components, patterns, accessibility guidelines, and best practices.

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Components](#components)
3. [Layout System](#layout-system)
4. [Theme System](#theme-system)
5. [Animation System](#animation-system)
6. [Accessibility Guidelines](#accessibility-guidelines)
7. [Development Guidelines](#development-guidelines)
8. [Migration Guide](#migration-guide)
9. [Troubleshooting](#troubleshooting)

## Design Tokens

### Colors

The Material 3 color system uses semantic color roles that adapt to light and dark themes.

#### Primary Colors
```css
/* Primary semantic roles */
--m3-color-primary: #6750A4;           /* Main brand color */
--m3-color-on-primary: #FFFFFF;        /* Text/icons on primary */
--m3-color-primary-container: #EADDFF; /* Primary container background */
--m3-color-on-primary-container: #21005D; /* Text on primary container */
```

#### Surface Colors
```css
/* Surface semantic roles */
--m3-color-surface: #FFFBFE;           /* Default surface */
--m3-color-on-surface: #1C1B1F;        /* Text on surface */
--m3-color-surface-variant: #E7E0EC;   /* Variant surface */
--m3-color-on-surface-variant: #49454F; /* Text on variant surface */
```

#### Usage Examples
```tsx
// Using semantic color tokens
const Button = styled.button`
  background-color: var(--m3-color-primary);
  color: var(--m3-color-on-primary);
`;

// Using theme context
const { colors } = useTheme();
<div style={{ backgroundColor: colors.primary }}>Content</div>
```

### Typography

The Material 3 typography system provides five semantic categories.

#### Scale Definition
```css
/* Display typography */
--m3-typescale-display-large-font: 'Roboto', sans-serif;
--m3-typescale-display-large-weight: 400;
--m3-typescale-display-large-size: 57px;
--m3-typescale-display-large-line-height: 64px;
--m3-typescale-display-large-letter-spacing: -0.25px;

/* Headline typography */
--m3-typescale-headline-large-font: 'Roboto', sans-serif;
--m3-typescale-headline-large-weight: 400;
--m3-typescale-headline-large-size: 32px;
--m3-typescale-headline-large-line-height: 40px;
--m3-typescale-headline-large-letter-spacing: 0px;

/* Body typography */
--m3-typescale-body-large-font: 'Roboto', sans-serif;
--m3-typescale-body-large-weight: 400;
--m3-typescale-body-large-size: 16px;
--m3-typescale-body-large-line-height: 24px;
--m3-typescale-body-large-letter-spacing: 0.5px;
```

#### Typography Components
```tsx
import { Typography } from '@/design-system/components/Typography';

// Usage examples
<Typography variant="displayLarge">Main Headline</Typography>
<Typography variant="headlineMedium">Section Title</Typography>
<Typography variant="bodyLarge">Body text content</Typography>
<Typography variant="labelMedium">Button label</Typography>
```

### Spacing

Material 3 uses a 4px base unit with incremental spacing tokens.

#### Spacing Scale
```css
--m3-spacing-xs: 4px;    /* 1 unit */
--m3-spacing-sm: 8px;    /* 2 units */
--m3-spacing-md: 16px;   /* 4 units */
--m3-spacing-lg: 24px;   /* 6 units */
--m3-spacing-xl: 32px;   /* 8 units */
--m3-spacing-2xl: 48px;  /* 12 units */
--m3-spacing-3xl: 64px;  /* 16 units */
```

#### Usage
```tsx
// Using spacing utilities
<div className="p-md mb-lg">Content with Material 3 spacing</div>

// Using CSS custom properties
const Container = styled.div`
  padding: var(--m3-spacing-md);
  margin-bottom: var(--m3-spacing-lg);
`;
```

### Elevation

Material 3 elevation system uses shadows to create depth hierarchy.

#### Elevation Levels
```css
--m3-elevation-level0: none;
--m3-elevation-level1: 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
--m3-elevation-level2: 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
--m3-elevation-level3: 0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15);
--m3-elevation-level4: 0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15);
--m3-elevation-level5: 0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15);
```

#### Elevation Usage
```tsx
import { ElevatedSurface } from '@/design-system/components/Surface';

<ElevatedSurface level={2}>
  <p>Content with level 2 elevation</p>
</ElevatedSurface>
```

### Shape

Material 3 shape system provides rounded corner tokens for different component types.

#### Shape Tokens
```css
--m3-shape-corner-none: 0px;
--m3-shape-corner-extra-small: 4px;
--m3-shape-corner-small: 8px;
--m3-shape-corner-medium: 12px;
--m3-shape-corner-large: 16px;
--m3-shape-corner-extra-large: 28px;
--m3-shape-corner-full: 9999px;
```

## Components

### Button

Material 3 provides five button types with different visual hierarchy and use cases.

#### Button Variants

1. **Filled Button** - Highest emphasis
2. **Filled Tonal Button** - Medium-high emphasis  
3. **Outlined Button** - Medium emphasis
4. **Text Button** - Low emphasis
5. **Icon Button** - Minimal emphasis

#### Usage Examples
```tsx
import { Material3Button } from '@/design-system/components/Button';

// Filled button (primary action)
<Material3Button variant="filled">
  Save Changes
</Material3Button>

// Filled tonal button (secondary action)
<Material3Button variant="filledTonal">
  Preview
</Material3Button>

// Outlined button (tertiary action)
<Material3Button variant="outlined">
  Cancel
</Material3Button>

// Text button (low priority action)
<Material3Button variant="text">
  Learn More
</Material3Button>

// Icon button
<Material3Button variant="icon" icon="favorite" />
```

#### Button States
- **Enabled** - Default interactive state
- **Hovered** - Mouse hover with elevation/color change
- **Focused** - Keyboard focus with visible outline
- **Pressed** - Active press state with color change
- **Disabled** - Non-interactive state with reduced opacity

#### Accessibility
- All buttons include proper ARIA labels
- Keyboard navigation support (Enter/Space activation)
- Focus indicators meet WCAG 2.1 contrast requirements
- Screen reader compatible

### Card

Material 3 cards are versatile containers that group related content and actions.

#### Card Types
1. **Elevated Card** - Uses elevation for separation
2. **Filled Card** - Uses background color for separation
3. **Outlined Card** - Uses border for separation

#### Usage Examples
```tsx
import { Material3Card } from '@/design-system/components/Card';

// Elevated card
<Material3Card variant="elevated">
  <Material3Card.Header>
    <Typography variant="headlineSmall">Card Title</Typography>
  </Material3Card.Header>
  <Material3Card.Content>
    <Typography variant="bodyMedium">Card content goes here</Typography>
  </Material3Card.Content>
  <Material3Card.Actions>
    <Material3Button variant="text">Action 1</Material3Button>
    <Material3Button variant="text">Action 2</Material3Button>
  </Material3Card.Actions>
</Material3Card>

// Interactive card
<Material3Card 
  variant="outlined"
  interactive
  onClick={handleCardClick}
  aria-label="Activity card for Morning Routine"
>
  <Material3Card.Content>
    <Typography variant="titleLarge">Morning Routine</Typography>
    <Typography variant="bodyMedium">25 minutes remaining</Typography>
  </Material3Card.Content>
</Material3Card>
```

### Text Fields

Material 3 text fields provide clear, accessible input components.

#### Text Field Types
1. **Filled** - More prominent, suitable for dense UIs
2. **Outlined** - Less prominent, suitable for simple UIs

#### Usage Examples
```tsx
import { Material3TextField } from '@/design-system/components/TextField';

// Basic text field
<Material3TextField
  label="Email address"
  type="email"
  value={email}
  onChange={setEmail}
  placeholder="Enter your email"
/>

// Text field with helper text
<Material3TextField
  label="Password"
  type="password"
  value={password}
  onChange={setPassword}
  helperText="Must be at least 8 characters"
  required
/>

// Text field with error state
<Material3TextField
  label="Username"
  value={username}
  onChange={setUsername}
  error={usernameError}
  helperText={usernameError || "Choose a unique username"}
/>

// Multiline text field
<Material3TextField
  label="Description"
  multiline
  rows={4}
  value={description}
  onChange={setDescription}
/>
```

### Navigation Components

#### Navigation Rail
Vertical navigation for desktop and tablet layouts.

```tsx
import { NavigationRail } from '@/design-system/components/Navigation';

<NavigationRail>
  <NavigationRail.Item 
    icon="home" 
    label="Home" 
    active={currentPage === 'home'}
    onClick={() => navigate('home')}
  />
  <NavigationRail.Item 
    icon="settings" 
    label="Settings"
    active={currentPage === 'settings'}
    onClick={() => navigate('settings')}
  />
</NavigationRail>
```

#### Bottom Navigation
Horizontal navigation for mobile layouts.

```tsx
import { BottomNavigation } from '@/design-system/components/Navigation';

<BottomNavigation>
  <BottomNavigation.Tab
    icon="home"
    label="Home"
    active={currentTab === 'home'}
    onClick={() => setCurrentTab('home')}
  />
  <BottomNavigation.Tab
    icon="favorite"
    label="Favorites"
    active={currentTab === 'favorites'}
    onClick={() => setCurrentTab('favorites')}
  />
</BottomNavigation>
```

## Layout System

### Responsive Breakpoints

Material 3 follows a mobile-first responsive approach with five breakpoints.

```css
/* Breakpoint definitions */
--m3-breakpoint-xs: 0px;      /* Extra small devices */
--m3-breakpoint-sm: 600px;    /* Small devices */
--m3-breakpoint-md: 840px;    /* Medium devices */
--m3-breakpoint-lg: 1200px;   /* Large devices */
--m3-breakpoint-xl: 1600px;   /* Extra large devices */
```

### Grid System

Uses CSS Grid for flexible, responsive layouts.

```tsx
import { Grid } from '@/design-system/components/Layout';

<Grid container spacing="md">
  <Grid item xs={12} sm={6} md={4}>
    <Material3Card>Content 1</Material3Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Material3Card>Content 2</Material3Card>
  </Grid>
  <Grid item xs={12} sm={12} md={4}>
    <Material3Card>Content 3</Material3Card>
  </Grid>
</Grid>
```

### Container Component

Provides consistent max-width and padding across breakpoints.

```tsx
import { Container } from '@/design-system/components/Layout';

<Container maxWidth="lg">
  <Typography variant="displayLarge">Page Title</Typography>
  <Typography variant="bodyLarge">Page content...</Typography>
</Container>
```

## Theme System

### Theme Structure

```tsx
interface Material3Theme {
  colors: {
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    // ... other color roles
  };
  typography: {
    displayLarge: TypographyStyle;
    displayMedium: TypographyStyle;
    // ... other typography scales
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    // ... other spacing values
  };
  elevation: {
    level0: string;
    level1: string;
    // ... other elevation levels
  };
  shape: {
    cornerNone: string;
    cornerExtraSmall: string;
    // ... other corner radius values
  };
  animation: {
    duration: {
      short: number;
      medium: number;
      long: number;
    };
    easing: {
      standard: string;
      decelerate: string;
      accelerate: string;
    };
  };
}
```

### Using Themes

```tsx
import { ThemeProvider, useTheme } from '@/design-system/theme';
import { lightTheme, darkTheme } from '@/design-system/tokens';

// Provider setup
function App() {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <YourAppContent />
    </ThemeProvider>
  );
}

// Using theme in components
function MyComponent() {
  const { colors, spacing } = useTheme();
  
  return (
    <div style={{
      backgroundColor: colors.surface,
      padding: spacing.md,
      color: colors.onSurface
    }}>
      Content that adapts to theme
    </div>
  );
}
```

### Theme Switching

```tsx
import { useThemeContext } from '@/design-system/theme';

function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeContext();
  
  return (
    <Material3Button
      variant="icon"
      icon={isDark ? 'light_mode' : 'dark_mode'}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    />
  );
}
```

## Animation System

### Motion Principles

Material 3 motion follows four key principles:
1. **Informative** - Motion clarifies spatial and hierarchical relationships
2. **Focused** - Motion directs attention to what's important
3. **Expressive** - Motion reflects your brand and style
4. **Intentional** - Motion serves a functional purpose

### Animation Utilities

```tsx
import { 
  AnimatedContainer,
  FadeIn,
  SlideIn,
  ScaleIn,
  SharedElementTransition 
} from '@/design-system/animation';

// Fade in animation
<FadeIn duration={300} delay={100}>
  <Material3Card>Content that fades in</Material3Card>
</FadeIn>

// Slide in animation
<SlideIn direction="up" duration={400}>
  <Material3Button>Button that slides up</Material3Button>
</SlideIn>

// Shared element transition
<SharedElementTransition layoutId="card-1">
  <Material3Card>Card with shared element animation</Material3Card>
</SharedElementTransition>
```

### Reduced Motion Support

All animations respect the user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Accessibility Guidelines

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:
- Normal text: minimum 4.5:1 contrast ratio
- Large text: minimum 3:1 contrast ratio
- Non-text elements: minimum 3:1 contrast ratio

### Keyboard Navigation

All interactive elements support keyboard navigation:
- **Tab**: Move to next focusable element
- **Shift+Tab**: Move to previous focusable element
- **Enter/Space**: Activate buttons and links
- **Arrow keys**: Navigate within component groups
- **Escape**: Close dialogs and menus

### Screen Reader Support

Components include comprehensive ARIA support:
- Semantic HTML elements when possible
- ARIA labels for icon buttons and complex controls
- ARIA live regions for dynamic content updates
- Proper heading hierarchy for page structure

### Focus Management

Visible focus indicators for all interactive elements:
- High contrast focus rings
- Logical focus order
- Focus trapping in modals
- Skip links for main content

## Development Guidelines

### Component Structure

Follow consistent patterns for all components:

```tsx
// Component interface
interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}

// Component implementation
export const Material3Component = forwardRef<HTMLElement, ComponentProps>(
  ({ variant = 'primary', size = 'medium', disabled = false, children, className, ...props }, ref) => {
    const theme = useTheme();
    const classes = clsx(
      'material3-component',
      `material3-component--${variant}`,
      `material3-component--${size}`,
      { 'material3-component--disabled': disabled },
      className
    );

    return (
      <element
        ref={ref}
        className={classes}
        disabled={disabled}
        {...props}
      >
        {children}
      </element>
    );
  }
);

Material3Component.displayName = 'Material3Component';
```

### Styling Guidelines

1. **Use semantic color tokens** instead of hardcoded colors
2. **Follow spacing scale** for consistent rhythm
3. **Apply elevation appropriately** for visual hierarchy
4. **Use typography scale** for consistent text styling
5. **Include hover/focus/active states** for all interactive elements

### Testing Requirements

Every component should include:
- Unit tests for component behavior
- Accessibility tests (keyboard navigation, ARIA attributes)
- Visual regression tests
- Integration tests for complex interactions

## Migration Guide

### From Bootstrap to Material 3

#### Button Migration
```tsx
// Before (Bootstrap)
<Button variant="primary" size="lg">
  Click me
</Button>

// After (Material 3)
<Material3Button variant="filled" size="large">
  Click me
</Material3Button>
```

#### Card Migration
```tsx
// Before (Bootstrap)
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>

// After (Material 3)
<Material3Card variant="elevated">
  <Material3Card.Header>
    <Typography variant="titleLarge">Title</Typography>
  </Material3Card.Header>
  <Material3Card.Content>
    <Typography variant="bodyMedium">Content</Typography>
  </Material3Card.Content>
</Material3Card>
```

#### Form Migration
```tsx
// Before (Bootstrap)
<Form.Group>
  <Form.Label>Email</Form.Label>
  <Form.Control type="email" placeholder="Enter email" />
</Form.Group>

// After (Material 3)
<Material3TextField
  label="Email"
  type="email"
  placeholder="Enter email"
/>
```

### Breaking Changes

1. **Color system**: Custom colors must be migrated to semantic tokens
2. **Spacing system**: Bootstrap spacing classes replaced with Material 3 scale
3. **Typography**: Font sizes and weights updated to Material 3 scale
4. **Component APIs**: Some prop names changed for consistency

### Migration Checklist

- [ ] Update color usage to semantic tokens
- [ ] Replace spacing classes with Material 3 scale
- [ ] Update typography to use Material 3 components
- [ ] Replace Bootstrap components with Material 3 equivalents
- [ ] Test accessibility with new components
- [ ] Update tests for new component APIs
- [ ] Verify responsive behavior at all breakpoints

## Troubleshooting

### Common Issues

#### Theme Not Applied
**Problem**: Components not using theme colors
**Solution**: Ensure ThemeProvider wraps your app and components use theme tokens

```tsx
// Correct setup
<ThemeProvider theme={lightTheme}>
  <App />
</ThemeProvider>
```

#### Accessibility Warnings
**Problem**: Missing ARIA labels or keyboard support
**Solution**: Use built-in accessibility features and test with keyboard navigation

```tsx
// Add proper labels
<Material3Button aria-label="Close dialog">
  <CloseIcon />
</Material3Button>
```

#### Animation Performance
**Problem**: Animations causing jank or poor performance
**Solution**: Use transform/opacity properties and enable GPU acceleration

```css
/* Performant animations */
.animate {
  transform: translateX(0);
  transition: transform 300ms ease-out;
  will-change: transform;
}
```

#### Bundle Size Issues
**Problem**: Large bundle size from design system
**Solution**: Use tree shaking and import only needed components

```tsx
// Tree-shakable imports
import { Material3Button } from '@/design-system/components/Button';
import { Typography } from '@/design-system/components/Typography';
```

### Debug Tools

#### Theme Inspector
Use browser dev tools to inspect CSS custom properties:
```css
:root {
  --m3-color-primary: #6750A4;
  --m3-spacing-md: 16px;
  /* ... other tokens */
}
```

#### Accessibility Testing
- Use axe browser extension for automated a11y testing
- Test keyboard navigation manually
- Use screen reader testing tools
- Run Lighthouse accessibility audit

#### Performance Monitoring
- Monitor animation frame rates during development
- Use Chrome DevTools Performance tab
- Test on lower-end devices
- Measure bundle size impact

## Resources

### External Documentation
- [Material 3 Design Guidelines](https://m3.material.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility Documentation](https://reactjs.org/docs/accessibility.html)

### Internal Resources
- [Component Demos](/components)
- [Design Token Reference](/tokens)
- [Accessibility Testing Guide](/docs/accessibility-testing.md)
- [Performance Best Practices](/docs/performance.md)

### Support
For questions or issues with the design system:
1. Check this documentation first
2. Review component demos and examples
3. Test with accessibility tools
4. Create an issue in the project repository

---

*Last updated: August 30, 2025*