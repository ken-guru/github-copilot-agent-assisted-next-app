# Material 3 Expressive Design Tokens

This document describes the Material 3 Expressive design token system implemented for the Mr. Timely application.

## Overview

The Material 3 Expressive design token system provides a comprehensive foundation for creating consistent, accessible, and expressive user interfaces. It includes tokens for typography, colors, shapes, elevation, motion, and component-specific styling.

## Files Structure

```
src/
├── styles/
│   └── material3-tokens.css          # CSS custom properties and utility classes
├── types/
│   └── material3-tokens.ts           # TypeScript interfaces and type definitions
├── utils/
│   └── material3-utils.ts            # Helper functions for using tokens in React
└── tests/
    └── material3-tokens.test.ts      # Tests for the design token system
```

## Design Token Categories

### 1. Typography Tokens

Material 3 Expressive typography scale with dynamic sizing and expressive font weights:

- **Display**: Large, Medium, Small (for hero content)
- **Headline**: Large, Medium, Small (for section headers)
- **Title**: Large, Medium, Small (for component titles)
- **Body**: Large, Medium, Small (for body text)
- **Label**: Large, Medium, Small (for UI labels)

#### Usage in CSS:
```css
.my-headline {
  font-family: var(--md-sys-typescale-headline-large-font-family);
  font-weight: var(--md-sys-typescale-headline-large-font-weight);
  font-size: var(--md-sys-typescale-headline-large-font-size);
  line-height: var(--md-sys-typescale-headline-large-line-height);
  letter-spacing: var(--md-sys-typescale-headline-large-letter-spacing);
}

/* Or use utility class */
.my-headline {
  @apply md-typescale-headline-large;
}
```

#### Usage in React:
```tsx
import { getMaterial3Typography } from '../utils/material3-utils';

const MyComponent = () => (
  <h1 style={getMaterial3Typography('headlineLarge')}>
    My Headline
  </h1>
);
```

### 2. Color Tokens

Dynamic color system with tonal palettes and semantic color roles:

- **Primary**: Main brand colors
- **Secondary**: Supporting colors
- **Tertiary**: Accent colors
- **Error**: Error state colors
- **Surface**: Background and container colors
- **Outline**: Border and divider colors

#### Usage in CSS:
```css
.my-button {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

/* Or use utility classes */
.my-button {
  @apply md-bg-primary md-color-on-primary;
}
```

#### Usage in React:
```tsx
import { getMaterial3Color } from '../utils/material3-utils';

const MyButton = () => (
  <button style={{
    ...getMaterial3Color('primary', 'backgroundColor'),
    ...getMaterial3Color('onPrimary', 'color'),
  }}>
    Click me
  </button>
);
```

### 3. Shape Tokens

Organic corner radius system with varied shapes:

- **Standard**: None, Extra Small, Small, Medium, Large, Extra Large, Full
- **Expressive**: Top variations, Asymmetric variations

#### Usage in CSS:
```css
.my-card {
  border-radius: var(--md-sys-shape-corner-medium);
}

/* Expressive asymmetric shape */
.my-expressive-card {
  border-radius: var(--md-sys-shape-corner-asymmetric-medium);
}
```

#### Usage in React:
```tsx
import { getMaterial3Shape } from '../utils/material3-utils';

const MyCard = () => (
  <div style={getMaterial3Shape('cornerAsymmetricMedium')}>
    Card content
  </div>
);
```

### 4. Elevation Tokens

Material 3 elevation system with appropriate shadow styles:

- **Levels**: 0 (none) through 5 (highest)

#### Usage in CSS:
```css
.my-elevated-card {
  box-shadow: var(--md-sys-elevation-level2);
}
```

#### Usage in React:
```tsx
import { getMaterial3Elevation } from '../utils/material3-utils';

const MyCard = () => (
  <div style={getMaterial3Elevation('level2')}>
    Elevated card
  </div>
);
```

### 5. Motion Tokens

Easing curves and duration scales for animations:

- **Easing**: Standard, Emphasized, Legacy, Linear
- **Duration**: Short (50-200ms), Medium (250-400ms), Long (450-600ms), Extra Long (700-1000ms)

#### Usage in CSS:
```css
.my-animated-element {
  transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}
```

#### Usage in React:
```tsx
import { getMaterial3Transition } from '../utils/material3-utils';

const MyComponent = () => (
  <div style={getMaterial3Transition(['opacity', 'transform'], 'medium1', 'emphasized')}>
    Animated content
  </div>
);
```

## Utility Functions

### getMaterial3ComponentStyle()

Combine multiple token types into a single style object:

```tsx
import { getMaterial3ComponentStyle } from '../utils/material3-utils';

const buttonStyle = getMaterial3ComponentStyle({
  typography: 'labelLarge',
  color: 'onPrimary',
  backgroundColor: 'primary',
  shape: 'cornerFull',
  elevation: 'level1',
  transition: {
    properties: ['background-color', 'box-shadow'],
    duration: 'short2',
    easing: 'standard',
  },
});
```

### getMaterial3Classes()

Generate CSS utility class names:

```tsx
import { getMaterial3Classes } from '../utils/material3-utils';

const className = getMaterial3Classes({
  typography: 'headlineMedium',
  color: 'onSurface',
  backgroundColor: 'surface',
  shape: 'cornerMedium',
  elevation: 'level1',
  stateLayer: true,
});

// Returns: "md-typescale-headline-medium md-color-on-surface md-bg-surface md-shape-corner-medium md-elevation-level1 md-state-layer"
```

### Pre-built Component Styles

#### Buttons
```tsx
import { getMaterial3ButtonStyle } from '../utils/material3-utils';

// Filled button (default)
const filledButtonStyle = getMaterial3ButtonStyle();

// Outlined button
const outlinedButtonStyle = getMaterial3ButtonStyle('outlined');

// Text button
const textButtonStyle = getMaterial3ButtonStyle('text');

// Small size
const smallButtonStyle = getMaterial3ButtonStyle('filled', 'small');
```

#### Cards
```tsx
import { getMaterial3CardStyle } from '../utils/material3-utils';

// Elevated card (default)
const elevatedCardStyle = getMaterial3CardStyle();

// Filled card
const filledCardStyle = getMaterial3CardStyle('filled');

// Outlined card
const outlinedCardStyle = getMaterial3CardStyle('outlined');
```

#### Text Fields
```tsx
import { getMaterial3TextFieldStyle } from '../utils/material3-utils';

// Outlined text field (default)
const outlinedFieldStyle = getMaterial3TextFieldStyle();

// Filled text field
const filledFieldStyle = getMaterial3TextFieldStyle('filled');
```

## Theme Support

The design token system automatically adapts to light and dark themes:

```css
/* Light theme colors are default */
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
}

/* Dark theme colors are applied automatically */
:root.dark,
:root[data-theme="dark"],
.dark {
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-on-primary: #381e72;
}

/* System preference support */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not(.light-mode) {
    --md-sys-color-primary: #d0bcff;
    --md-sys-color-on-primary: #381e72;
  }
}
```

## State Layers

Interactive elements can use state layers for hover, focus, and pressed states:

```css
.interactive-element {
  @apply md-state-layer;
}

/* State layer styles are automatically applied:
   - Hover: 8% opacity overlay
   - Focus: 12% opacity overlay  
   - Pressed: 12% opacity overlay
*/
```

## Accessibility

All color combinations in the token system meet WCAG AA contrast requirements. The system includes:

- Proper color contrast ratios
- Focus indicators with sufficient contrast
- Reduced motion support through CSS media queries
- Semantic color roles for consistent meaning

## Migration from Bootstrap

When migrating from Bootstrap components:

1. Replace Bootstrap color classes with Material 3 color tokens
2. Update border-radius values to use Material 3 shape tokens
3. Replace Bootstrap shadows with Material 3 elevation tokens
4. Update typography to use Material 3 type scale
5. Add Material 3 motion tokens for transitions

### Example Migration:

```css
/* Before (Bootstrap) */
.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
  border-radius: 0.375rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* After (Material 3) */
.md-button-filled {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-radius: var(--md-sys-shape-corner-full);
  box-shadow: var(--md-sys-elevation-level0);
  transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}
```

## Best Practices

1. **Use semantic color roles** instead of specific color values
2. **Combine tokens consistently** using the utility functions
3. **Test in both light and dark themes** to ensure proper contrast
4. **Use appropriate motion tokens** for different types of animations
5. **Leverage expressive shape variations** for visual interest
6. **Follow the type scale hierarchy** for consistent typography
7. **Use state layers** for interactive feedback

## Performance Considerations

- CSS custom properties are efficiently handled by modern browsers
- Utility classes reduce CSS bundle size through reuse
- Motion tokens include performance-optimized easing curves
- Elevation tokens use optimized shadow values

## Browser Support

The Material 3 design token system supports:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 16+

Fallbacks are provided for older browsers where needed.