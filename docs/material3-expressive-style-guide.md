# Material 3 Expressive Style Guide

## Table of Contents

1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Component Library](#component-library)
4. [Accessibility Guidelines](#accessibility-guidelines)
5. [Animation Patterns](#animation-patterns)
6. [Responsive Design](#responsive-design)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Migration Guide](#migration-guide)

## Overview

This comprehensive style guide documents the Material 3 Expressive design system implementation for Mr. Timely. The system provides a complete set of design tokens, components, and utilities that create a modern, expressive, and accessible user interface while maintaining all existing functionality.

### Key Principles

- **Expressive**: Dynamic visual elements that create personality and delight
- **Accessible**: WCAG AA compliant with comprehensive accessibility features
- **Responsive**: Fluid adaptation across all device sizes and orientations
- **Performant**: Optimized for smooth animations and fast rendering
- **Consistent**: Systematic approach using design tokens and utility functions

### System Architecture

```
Material 3 Expressive Design System
├── Design Tokens (CSS Custom Properties)
├── Component Library (React Components)
├── Utility Functions (JavaScript/TypeScript)
├── Animation System (CSS + JavaScript)
├── Accessibility Layer (ARIA + Focus Management)
└── Responsive Framework (Breakpoints + Scaling)
```

## Design Tokens

### Typography System

The Material 3 Expressive typography system provides dynamic, responsive typography with expressive font weight variations.

#### Typography Scale

| Scale | Usage | Font Size | Line Height | Letter Spacing |
|-------|-------|-----------|-------------|----------------|
| Display Large | Hero content, splash screens | 57px | 64px | -0.25px |
| Display Medium | Large headings, feature titles | 45px | 52px | 0px |
| Display Small | Section headings | 36px | 44px | 0px |
| Headline Large | Page titles | 32px | 40px | 0px |
| Headline Medium | Component titles | 28px | 36px | 0px |
| Headline Small | Card titles | 24px | 32px | 0px |
| Title Large | Dialog titles | 22px | 28px | 0px |
| Title Medium | List headers | 16px | 24px | 0.15px |
| Title Small | Captions | 14px | 20px | 0.1px |
| Body Large | Primary body text | 16px | 24px | 0.5px |
| Body Medium | Secondary body text | 14px | 20px | 0.25px |
| Body Small | Supporting text | 12px | 16px | 0.4px |
| Label Large | Button text | 14px | 20px | 0.1px |
| Label Medium | Form labels | 12px | 16px | 0.5px |
| Label Small | Captions, metadata | 11px | 16px | 0.5px |

#### Usage Examples

```tsx
// React component usage
import { getMaterial3Typography } from '../utils/material3-utils';

const MyComponent = () => (
  <div>
    <h1 style={getMaterial3Typography('headlineLarge')}>
      Page Title
    </h1>
    <p style={getMaterial3Typography('bodyLarge')}>
      Body content with optimal readability.
    </p>
  </div>
);
```

```css
/* CSS utility classes */
.page-title {
  @apply md-typescale-headline-large;
}

.body-text {
  @apply md-typescale-body-large;
}
```

#### Expressive Typography Variations

```tsx
// Font weight variations
const boldHeading = getMaterial3ExpressiveTypography('headlineMedium', 'bold', 'high');
const subtleText = getMaterial3ExpressiveTypography('bodyMedium', 'regular', 'low');

// Contextual scaling
const compactText = getMaterial3ContextualTypography('bodyLarge', 'compact');
const spaciousHeading = getMaterial3ContextualTypography('headlineLarge', 'spacious');
```

### Color System

The Material 3 Expressive color system uses dynamic color generation with tonal palettes and semantic color roles.

#### Core Color Roles

| Role | Usage | Light Theme | Dark Theme |
|------|-------|-------------|------------|
| Primary | Main brand color, primary actions | #6750A4 | #D0BCFF |
| On Primary | Text/icons on primary | #FFFFFF | #381E72 |
| Primary Container | Primary containers | #EADDFF | #4F378B |
| On Primary Container | Text/icons on primary container | #21005D | #EADDFF |
| Secondary | Supporting brand color | #625B71 | #CCC2DC |
| On Secondary | Text/icons on secondary | #FFFFFF | #332D41 |
| Tertiary | Accent color | #7D5260 | #EFB8C8 |
| Error | Error states | #BA1A1A | #FFB4AB |
| Surface | Background surfaces | #FEF7FF | #141218 |
| On Surface | Text/icons on surface | #1D1B20 | #E6E0E9 |

#### Usage Examples

```tsx
// React component usage
import { getMaterial3Color } from '../utils/material3-utils';

const PrimaryButton = () => (
  <button style={{
    ...getMaterial3Color('onPrimary', 'color'),
    ...getMaterial3Color('primary', 'backgroundColor'),
  }}>
    Primary Action
  </button>
);
```

```css
/* CSS utility classes */
.primary-button {
  @apply md-bg-primary md-color-on-primary;
}

.surface-card {
  @apply md-bg-surface md-color-on-surface;
}
```

#### Dynamic Color States

```tsx
// Interactive color states
const buttonStates = getMaterial3DynamicColorStates('primary', true);

const InteractiveButton = () => (
  <button 
    style={buttonStates.default}
    onMouseEnter={(e) => Object.assign(e.target.style, buttonStates.hover)}
    onMouseLeave={(e) => Object.assign(e.target.style, buttonStates.default)}
  >
    Interactive Button
  </button>
);
```

### Shape System

Material 3 Expressive shapes use organic corner radius variations for visual interest.

#### Shape Tokens

| Token | Radius | Usage |
|-------|--------|-------|
| Corner None | 0px | Sharp edges, dividers |
| Corner Extra Small | 4px | Small components, chips |
| Corner Small | 8px | Buttons, form fields |
| Corner Medium | 12px | Cards, containers |
| Corner Large | 16px | Large containers |
| Corner Extra Large | 28px | Prominent containers |
| Corner Full | 50% | Pills, FABs |

#### Organic Shape Variations

```tsx
// Component-specific organic shapes
const cardShape = getMaterial3OrganicShape('card', 'organic');
const buttonShape = getMaterial3OrganicShape('button', 'asymmetric');
const fieldShape = getMaterial3OrganicShape('field', 'primary');
```

### Elevation System

Material 3 elevation creates depth through shadows and layering.

#### Elevation Levels

| Level | Shadow | Usage |
|-------|--------|-------|
| Level 0 | None | Flat surfaces |
| Level 1 | 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15) | Cards, buttons |
| Level 2 | 0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15) | Hover states |
| Level 3 | 0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3) | Dialogs, menus |
| Level 4 | 0 6px 10px 4px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.3) | Navigation |
| Level 5 | 0 8px 12px 6px rgba(0,0,0,0.15), 0 4px 4px rgba(0,0,0,0.3) | Highest priority |

#### Contextual Elevation

```tsx
// Component-specific elevation states
const cardElevation = getMaterial3ContextualElevation('card', 'hover');
const buttonElevation = getMaterial3ContextualElevation('button', 'pressed');
const fabElevation = getMaterial3ContextualElevation('fab', 'resting');
```

### Motion System

Material 3 Expressive motion uses purposeful animations with organic easing curves.

#### Easing Curves

| Curve | Bezier | Usage |
|-------|--------|-------|
| Standard | cubic-bezier(0.2, 0.0, 0, 1.0) | Default transitions |
| Emphasized | cubic-bezier(0.05, 0.7, 0.1, 1.0) | Prominent elements |
| Decelerated | cubic-bezier(0.3, 0, 0.8, 0.15) | Incoming elements |
| Accelerated | cubic-bezier(0.4, 0, 1, 1) | Outgoing elements |

#### Duration Scale

| Duration | Time | Usage |
|----------|------|-------|
| Short 1 | 50ms | Simple state changes |
| Short 2 | 100ms | Simple transitions |
| Short 3 | 150ms | Small component changes |
| Short 4 | 200ms | Standard transitions |
| Medium 1 | 250ms | Complex state changes |
| Medium 2 | 300ms | Layout changes |
| Medium 3 | 350ms | Page transitions |
| Medium 4 | 400ms | Complex animations |
| Long 1 | 450ms | Large layout changes |
| Long 2 | 500ms | Page navigation |
| Long 3 | 550ms | Complex page transitions |
| Long 4 | 600ms | Elaborate animations |

## Component Library

### Buttons

Material 3 Expressive buttons provide clear affordances with expressive styling.

#### Button Variants

**Filled Button (Primary)**
```tsx
import { Material3Button } from '../components/ui/Material3Button';

<Material3Button variant="filled" size="medium">
  Primary Action
</Material3Button>
```

**Outlined Button (Secondary)**
```tsx
<Material3Button variant="outlined" size="medium">
  Secondary Action
</Material3Button>
```

**Text Button (Tertiary)**
```tsx
<Material3Button variant="text" size="medium">
  Tertiary Action
</Material3Button>
```

#### Button States

- **Default**: Base appearance with subtle elevation
- **Hover**: Slight elevation increase and color shift
- **Focus**: Prominent focus ring with high contrast
- **Pressed**: Reduced elevation with color darkening
- **Disabled**: Reduced opacity with no interaction

#### Button Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| Small | 32px | 0 16px | 12px |
| Medium | 40px | 0 24px | 14px |
| Large | 48px | 0 32px | 16px |

#### Accessibility Features

- Minimum 44px touch target on mobile
- High contrast focus indicators
- Screen reader accessible labels
- Keyboard navigation support
- Reduced motion alternatives

### Text Fields

Material 3 Expressive text fields provide clear input affordances with floating labels.

#### Text Field Variants

**Outlined Text Field (Default)**
```tsx
import { Material3TextField } from '../components/ui/Material3TextField';

<Material3TextField
  variant="outlined"
  label="Activity Name"
  placeholder="Enter activity name"
  required
/>
```

**Filled Text Field**
```tsx
<Material3TextField
  variant="filled"
  label="Duration"
  type="number"
  helperText="Enter duration in minutes"
/>
```

#### Text Field States

- **Default**: Subtle outline with floating label
- **Focus**: Prominent outline with label animation
- **Error**: Red outline with error message
- **Disabled**: Reduced opacity with no interaction
- **Success**: Green outline with success indicator

#### Accessibility Features

- Floating labels for clear context
- Error announcements for screen readers
- High contrast focus indicators
- Proper ARIA labeling
- Keyboard navigation support

### Cards

Material 3 Expressive cards provide elevated containers with organic shapes.

#### Card Variants

**Elevated Card (Default)**
```tsx
import { Material3Card } from '../components/ui/Material3Card';

<Material3Card variant="elevated">
  <h3>Card Title</h3>
  <p>Card content with elevated appearance.</p>
</Material3Card>
```

**Filled Card**
```tsx
<Material3Card variant="filled">
  <h3>Filled Card</h3>
  <p>Card with filled background appearance.</p>
</Material3Card>
```

**Outlined Card**
```tsx
<Material3Card variant="outlined">
  <h3>Outlined Card</h3>
  <p>Card with outlined border appearance.</p>
</Material3Card>
```

#### Card States

- **Default**: Base elevation with subtle shadow
- **Hover**: Increased elevation with smooth transition
- **Focus**: Focus ring around entire card
- **Pressed**: Reduced elevation with color shift

### Navigation

Material 3 Expressive navigation uses pill-shaped indicators with smooth transitions.

#### Navigation Features

- Organic pill-shaped active indicators
- Smooth state transitions
- Dynamic color adaptation
- Enhanced focus indicators
- Mobile-optimized touch targets

```tsx
import { Navigation } from '../components/Navigation';

<Navigation
  items={[
    { label: 'Timer', href: '/', active: true },
    { label: 'Activities', href: '/activities' },
    { label: 'Summary', href: '/summary' },
  ]}
/>
```

### Activity Components

#### Activity Manager

The Activity Manager provides a comprehensive interface for managing timer activities.

```tsx
import { ActivityManagerMaterial3 } from '../components/ActivityManagerMaterial3';

<ActivityManagerMaterial3
  activities={activities}
  onActivityAdd={handleActivityAdd}
  onActivityUpdate={handleActivityUpdate}
  onActivityDelete={handleActivityDelete}
/>
```

**Features:**
- Dynamic container elevation
- Floating action button for adding activities
- Expressive progress indicators
- Enhanced state communication
- Smooth transitions between states

#### Activity Button

Individual activity cards with expressive styling and interactions.

```tsx
import { ActivityButtonMaterial3 } from '../components/ActivityButtonMaterial3';

<ActivityButtonMaterial3
  activity={activity}
  isActive={isActive}
  onStart={handleStart}
  onStop={handleStop}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**Features:**
- Organic card shapes with varied corner radius
- Dynamic color application based on state
- Expressive hover and focus states
- Contextual action buttons
- Enhanced visual feedback

### Form Components

#### Time Setup

Material 3 Expressive time setup with floating labels and segmented controls.

```tsx
import { TimeSetupMaterial3 } from '../components/TimeSetupMaterial3';

<TimeSetupMaterial3
  onTimeSetup={handleTimeSetup}
  initialDuration={25}
  initialMode="duration"
/>
```

**Features:**
- Floating label text fields
- Expressive segmented button groups
- Enhanced visual hierarchy
- Contextual color application
- Smooth mode transitions

#### Activity Form

Comprehensive form for creating and editing activities.

```tsx
import { ActivityFormMaterial3 } from '../components/ActivityFormMaterial3';

<ActivityFormMaterial3
  activity={activity}
  onSave={handleSave}
  onCancel={handleCancel}
/>
```

### Summary Components

#### Summary Dashboard

Expressive summary dashboard with elevated containers and data visualization.

```tsx
import { SummaryMaterial3 } from '../components/SummaryMaterial3';

<SummaryMaterial3
  activities={completedActivities}
  totalTime={totalTime}
  productivity={productivityScore}
/>
```

**Features:**
- Elevated containers with organic shapes
- Expressive data visualization
- Enhanced typography hierarchy
- Contextual color coding
- Smooth state transitions

## Accessibility Guidelines

### Color and Contrast

#### WCAG AA Compliance

All color combinations in the Material 3 Expressive system meet WCAG AA contrast requirements:

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio
- **Focus indicators**: Minimum 3:1 contrast ratio

#### Color Usage Guidelines

1. **Never rely on color alone** to convey information
2. **Use semantic color roles** consistently across the interface
3. **Test in both light and dark themes** to ensure accessibility
4. **Provide alternative indicators** for color-blind users
5. **Use sufficient contrast** for all interactive elements

### Focus Management

#### Focus Indicators

All interactive elements include prominent focus indicators:

```css
.interactive-element:focus {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
  border-radius: var(--md-sys-shape-corner-small);
}
```

#### Focus Order

- Logical tab order following visual layout
- Skip links for keyboard navigation
- Focus trapping in modal dialogs
- Proper focus restoration after interactions

### Screen Reader Support

#### Semantic Markup

```tsx
// Proper heading hierarchy
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

// Descriptive labels
<button aria-label="Start 25-minute focus session">
  Start Timer
</button>

// Status announcements
<div aria-live="polite" aria-atomic="true">
  Timer started: 25 minutes remaining
</div>
```

#### ARIA Labels and Descriptions

- `aria-label` for concise element descriptions
- `aria-describedby` for additional context
- `aria-expanded` for collapsible content
- `aria-selected` for selection states
- `aria-current` for current page/step

### Keyboard Navigation

#### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Navigate to next focusable element |
| Shift + Tab | Navigate to previous focusable element |
| Enter | Activate button or link |
| Space | Activate button or toggle checkbox |
| Escape | Close modal or cancel action |
| Arrow Keys | Navigate within component groups |

#### Implementation

```tsx
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      handleActivate();
      break;
    case 'Escape':
      event.preventDefault();
      handleCancel();
      break;
  }
};
```

### Motion and Animation

#### Reduced Motion Support

Respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}
```

#### Implementation

```tsx
import { useReducedMotion } from '../hooks/useReducedMotion';

const MyComponent = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div 
      className={prefersReducedMotion ? 'static' : 'animated'}
      style={{
        transition: prefersReducedMotion ? 'none' : 'all 0.3s ease',
      }}
    >
      Content
    </div>
  );
};
```

## Animation Patterns

### Shared Element Transitions

Create smooth transitions between related elements across different views.

#### Implementation

```tsx
import { Material3PageTransition } from '../components/ui/Material3PageTransition';

<Material3PageTransition
  from="/timer"
  to="/activities"
  sharedElements={[
    { id: 'activity-card-1', element: activityCardRef.current },
  ]}
>
  <ActivityList />
</Material3PageTransition>
```

### Micro-interactions

Small animations that provide feedback and enhance user experience.

#### Button Ripple Effect

```css
.md-button {
  position: relative;
  overflow: hidden;
}

.md-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.3;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.md-button:active::before {
  width: 300px;
  height: 300px;
}
```

#### Loading States

```tsx
import { Material3LoadingSpinner } from '../components/ui/Material3LoadingSpinner';

<Material3LoadingSpinner
  size="medium"
  color="primary"
  label="Loading activities..."
/>
```

### Page Transitions

Smooth transitions between different application views.

#### Fade Transition

```css
.page-transition-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms ease, transform 300ms ease;
}

.page-transition-exit {
  opacity: 1;
  transform: translateY(0);
}

.page-transition-exit-active {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 300ms ease, transform 300ms ease;
}
```

### Performance Optimization

#### GPU Acceleration

Use CSS transforms for smooth animations:

```css
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU acceleration */
}
```

#### Animation Frame Management

```tsx
import { useAnimationFrame } from '../hooks/useAnimationFrame';

const AnimatedComponent = () => {
  const [progress, setProgress] = useState(0);
  
  useAnimationFrame((deltaTime) => {
    setProgress(prev => Math.min(prev + deltaTime / 1000, 1));
  });
  
  return (
    <div style={{ transform: `translateX(${progress * 100}%)` }}>
      Animated content
    </div>
  );
};
```

## Responsive Design

### Breakpoint System

Material 3 Expressive uses a mobile-first responsive approach with fluid breakpoints.

#### Breakpoint Values

| Breakpoint | Min Width | Max Width | Usage |
|------------|-----------|-----------|-------|
| Mobile | 0px | 599px | Phones, small tablets |
| Tablet | 600px | 1023px | Tablets, small laptops |
| Desktop | 1024px | 1439px | Laptops, desktops |
| Large | 1440px | ∞ | Large desktops, displays |

#### Implementation

```tsx
import { useBreakpoint } from '../hooks/useBreakpoint';

const ResponsiveComponent = () => {
  const breakpoint = useBreakpoint();
  
  return (
    <div className={`layout-${breakpoint}`}>
      {breakpoint === 'mobile' ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
};
```

### Responsive Typography

Typography scales fluidly across different screen sizes while maintaining readability.

#### Scaling Factors

| Breakpoint | Scale Factor | Usage |
|------------|--------------|-------|
| Mobile | 87.5% | Optimized for small screens |
| Tablet | 95% | Balanced for medium screens |
| Desktop | 105% | Enhanced for large screens |

#### Implementation

```css
/* Base typography */
.md-typescale-headline-large {
  font-size: clamp(1.75rem, 4vw, 3.5rem);
  line-height: clamp(2rem, 4.5vw, 4rem);
}

/* Responsive scaling */
@media (max-width: 599px) {
  .md-typescale-headline-large {
    font-size: calc(var(--md-sys-typescale-headline-large-size) * 0.875);
  }
}
```

### Responsive Layout

#### Grid System

```css
.responsive-grid {
  display: grid;
  gap: var(--md-sys-spacing-medium);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

@media (max-width: 599px) {
  .responsive-grid {
    grid-template-columns: 1fr;
    gap: var(--md-sys-spacing-small);
  }
}
```

#### Container Queries

```css
.activity-card {
  container-type: inline-size;
}

@container (max-width: 300px) {
  .activity-card .card-content {
    flex-direction: column;
  }
}
```

### Mobile Optimizations

#### Touch Targets

All interactive elements meet minimum touch target requirements:

```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}
```

#### Mobile-Specific Components

```tsx
import { Material3MobileButton } from '../components/ui/Material3MobileButton';
import { Material3MobileTextField } from '../components/ui/Material3MobileTextField';

<Material3MobileButton
  variant="filled"
  size="large"
  fullWidth
>
  Mobile Optimized Button
</Material3MobileButton>
```

#### Gesture Support

```tsx
import { useSwipeGesture } from '../hooks/useSwipeGesture';

const SwipeableCard = () => {
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeGesture({
    onSwipeLeft: handleDelete,
    onSwipeRight: handleEdit,
    threshold: 100,
  });
  
  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      Swipeable content
    </div>
  );
};
```

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue: Colors not updating in dark theme

**Symptoms:**
- Colors remain light theme values when switching to dark mode
- Inconsistent color application across components

**Solution:**
```css
/* Ensure proper CSS custom property cascade */
:root {
  color-scheme: light dark;
}

:root[data-theme="dark"] {
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-on-primary: #381e72;
}

/* Use light-dark() function for automatic switching */
.auto-theme-color {
  color: light-dark(var(--md-sys-color-primary-light), var(--md-sys-color-primary-dark));
}
```

#### Issue: Typography not scaling responsively

**Symptoms:**
- Text appears too large or small on different screen sizes
- Inconsistent typography hierarchy across devices

**Solution:**
```tsx
// Use responsive typography utilities
const responsiveHeading = getResponsiveMaterial3Typography('headlineLarge', {
  enableDynamicScaling: true,
  context: 'comfortable'
});

// Or use CSS clamp() for fluid scaling
const fluidTypography = {
  fontSize: 'clamp(1.5rem, 4vw, 3rem)',
  lineHeight: 'clamp(1.8rem, 4.5vw, 3.5rem)',
};
```

#### Issue: Animations not respecting reduced motion preferences

**Symptoms:**
- Animations continue to play when user has reduced motion enabled
- No fallback for users with motion sensitivity

**Solution:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
// React implementation
import { useReducedMotion } from '../hooks/useReducedMotion';

const AnimatedComponent = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div
      style={{
        transition: prefersReducedMotion ? 'none' : 'all 0.3s ease',
        transform: prefersReducedMotion ? 'none' : 'translateY(10px)',
      }}
    >
      Content
    </div>
  );
};
```

#### Issue: Focus indicators not visible

**Symptoms:**
- No visible focus ring when navigating with keyboard
- Poor accessibility for keyboard users

**Solution:**
```css
/* Ensure high contrast focus indicators */
.focusable-element:focus {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
  border-radius: var(--md-sys-shape-corner-small);
}

/* Use :focus-visible for better UX */
.focusable-element:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.focusable-element:focus:not(:focus-visible) {
  outline: none;
}
```

#### Issue: Components not adapting to container size

**Symptoms:**
- Components overflow their containers
- Layout breaks on smaller screens

**Solution:**
```css
/* Use container queries for responsive components */
.responsive-component {
  container-type: inline-size;
}

@container (max-width: 400px) {
  .responsive-component .content {
    flex-direction: column;
    gap: var(--md-sys-spacing-small);
  }
}

/* Ensure proper box-sizing */
* {
  box-sizing: border-box;
}
```

#### Issue: Performance issues with animations

**Symptoms:**
- Janky or stuttering animations
- High CPU usage during transitions

**Solution:**
```css
/* Use GPU acceleration for smooth animations */
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0);
}

/* Optimize animation properties */
.smooth-animation {
  transition: transform 0.3s ease, opacity 0.3s ease;
  /* Avoid animating layout properties like width, height, padding */
}
```

```tsx
// Use requestAnimationFrame for complex animations
import { useAnimationFrame } from '../hooks/useAnimationFrame';

const PerformantAnimation = () => {
  const [progress, setProgress] = useState(0);
  
  useAnimationFrame((deltaTime) => {
    setProgress(prev => {
      const newProgress = prev + deltaTime / 1000;
      return newProgress > 1 ? 1 : newProgress;
    });
  });
  
  return (
    <div style={{ transform: `translateX(${progress * 100}%)` }}>
      Smooth animation
    </div>
  );
};
```

### Debugging Tools

#### Design Token Inspector

```tsx
// Debug component to inspect current design tokens
const DesignTokenInspector = () => {
  const [selectedToken, setSelectedToken] = useState('');
  
  return (
    <div className="debug-panel">
      <select onChange={(e) => setSelectedToken(e.target.value)}>
        <option value="">Select a token</option>
        <option value="--md-sys-color-primary">Primary Color</option>
        <option value="--md-sys-typescale-headline-large-size">Headline Large Size</option>
      </select>
      {selectedToken && (
        <div>
          <strong>{selectedToken}:</strong>
          <span>{getComputedStyle(document.documentElement).getPropertyValue(selectedToken)}</span>
        </div>
      )}
    </div>
  );
};
```

#### Accessibility Checker

```tsx
// Component to check accessibility compliance
const AccessibilityChecker = () => {
  const checkContrast = (foreground: string, background: string) => {
    // Implementation to calculate contrast ratio
    const ratio = calculateContrastRatio(foreground, background);
    return {
      ratio,
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
    };
  };
  
  return (
    <div className="a11y-checker">
      {/* Contrast checking interface */}
    </div>
  );
};
```

## Migration Guide

### From Bootstrap to Material 3 Expressive

#### Component Mapping

| Bootstrap Component | Material 3 Equivalent | Migration Notes |
|-------------------|----------------------|-----------------|
| `.btn` | `Material3Button` | Update variant props and styling |
| `.card` | `Material3Card` | Replace with elevation-based design |
| `.form-control` | `Material3TextField` | Add floating labels and new states |
| `.navbar` | `Navigation` | Implement pill-shaped indicators |
| `.badge` | `Material3Chip` | Update to organic shapes |
| `.alert` | `Material3Banner` | Enhance with expressive styling |

#### Step-by-Step Migration

1. **Install Material 3 Dependencies**
```bash
npm install @material/web
```

2. **Update CSS Imports**
```tsx
// Remove Bootstrap imports
// import 'bootstrap/dist/css/bootstrap.min.css';

// Add Material 3 imports
import '../styles/material3-tokens.css';
import '../styles/material3-components.css';
```

3. **Replace Components Gradually**
```tsx
// Before (Bootstrap)
<button className="btn btn-primary">
  Click me
</button>

// After (Material 3)
<Material3Button variant="filled">
  Click me
</Material3Button>
```

4. **Update Color Usage**
```css
/* Before (Bootstrap) */
.text-primary { color: #0d6efd; }
.bg-primary { background-color: #0d6efd; }

/* After (Material 3) */
.text-primary { color: var(--md-sys-color-primary); }
.bg-primary { background-color: var(--md-sys-color-primary); }
```

5. **Migrate Layout System**
```tsx
// Before (Bootstrap Grid)
<div className="container">
  <div className="row">
    <div className="col-md-6">Content</div>
  </div>
</div>

// After (CSS Grid)
<div className="responsive-grid">
  <div className="grid-item">Content</div>
</div>
```

#### Testing Migration

1. **Visual Regression Testing**
   - Take screenshots before migration
   - Compare with Material 3 implementation
   - Verify responsive behavior

2. **Accessibility Testing**
   - Run automated accessibility tests
   - Test keyboard navigation
   - Verify screen reader compatibility

3. **Performance Testing**
   - Measure bundle size changes
   - Test animation performance
   - Verify loading times

### Best Practices for Migration

1. **Gradual Migration**: Migrate components one at a time
2. **Maintain Functionality**: Ensure all existing features work
3. **Test Thoroughly**: Test each migrated component extensively
4. **Document Changes**: Keep track of migration decisions
5. **User Testing**: Validate changes with real users

## Conclusion

This comprehensive style guide provides everything needed to implement and maintain the Material 3 Expressive design system in Mr. Timely. The system creates a modern, accessible, and delightful user experience while preserving all existing functionality.

For additional support or questions, refer to the component documentation in the `src/components/` directory or the utility function documentation in `src/utils/material3-utils.ts`.