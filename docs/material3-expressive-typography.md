# Material 3 Expressive Typography System

## Overview

The Material 3 Expressive Typography System provides a comprehensive set of tools for implementing dynamic, responsive, and expressive typography that adapts to different screen sizes, contexts, and user preferences while maintaining excellent accessibility and performance.

## Features

### 1. Dynamic Font Sizing
- **Context-aware scaling**: Adapts typography based on content density (compact, comfortable, spacious)
- **Responsive scaling**: Automatically adjusts font sizes across different screen sizes
- **Performance optimized**: Uses CSS `calc()` functions for browser-optimized calculations

### 2. Expressive Font Weight Variations
- **Nine weight variations**: From thin (100) to black (900)
- **Enhanced visual hierarchy**: Multiple emphasis levels (high, medium, low)
- **Semantic weight mapping**: Contextual font weights for different UI elements

### 3. Responsive Typography
- **Mobile-first approach**: Optimized scaling for mobile devices (87.5%)
- **Tablet optimization**: Balanced proportions for tablet screens (95%)
- **Desktop enhancement**: Enhanced hierarchy for desktop displays (105%)
- **Proportional scaling**: Maintains line height and spacing relationships

### 4. Accessibility Compliance
- **WCAG AA contrast ratios**: Proper color combinations for all emphasis levels
- **Semantic markup support**: Works with proper heading hierarchy
- **Screen reader optimization**: Preserves semantic meaning across all variations

## API Reference

### Core Functions

#### `getMaterial3ExpressiveTypography(baseScale, weight?, emphasis?)`

Creates typography styles with expressive font weight variations and emphasis levels.

```typescript
// Basic usage
const headlineStyle = getMaterial3ExpressiveTypography('headlineLarge');

// With custom font weight
const boldTitle = getMaterial3ExpressiveTypography('titleMedium', 'bold');

// With emphasis level
const primaryHeading = getMaterial3ExpressiveTypography('headlineSmall', 'semi-bold', 'high');
```

**Parameters:**
- `baseScale`: Typography scale from Material 3 type system
- `weight`: Optional font weight variation ('thin' | 'extra-light' | 'light' | 'regular' | 'medium' | 'semi-bold' | 'bold' | 'extra-bold' | 'black')
- `emphasis`: Optional emphasis level ('high' | 'medium' | 'low')

#### `getMaterial3ContextualTypography(baseScale, context?)`

Creates contextual typography scaling based on content density.

```typescript
// Compact context for dense layouts
const compactText = getMaterial3ContextualTypography('bodyLarge', 'compact');

// Spacious context for generous layouts
const spaciousHeading = getMaterial3ContextualTypography('headlineMedium', 'spacious');
```

**Parameters:**
- `baseScale`: Typography scale from Material 3 type system
- `context`: Density context ('compact' | 'comfortable' | 'spacious')

#### `getMaterial3AdaptiveTypography(baseScale, breakpoints?)`

Creates adaptive typography that responds to screen size with customizable breakpoints.

```typescript
// Default responsive behavior
const adaptiveTitle = getMaterial3AdaptiveTypography('titleLarge');

// Custom breakpoints
const customAdaptive = getMaterial3AdaptiveTypography('headlineLarge', {
  mobile: { scale: 0.8, maxWidth: '480px' },
  tablet: { scale: 0.9, minWidth: '481px', maxWidth: '1024px' },
  desktop: { scale: 1.2, minWidth: '1025px' }
});
```

**Returns:**
```typescript
{
  base: React.CSSProperties;
  mobile: React.CSSProperties;
  tablet: React.CSSProperties;
  desktop: React.CSSProperties;
}
```

#### `getResponsiveMaterial3Typography(baseScale, options?)`

Enhanced responsive typography with dynamic scaling and context awareness.

```typescript
// Enable dynamic scaling
const dynamicText = getResponsiveMaterial3Typography('bodyMedium', {
  enableDynamicScaling: true,
  context: 'comfortable'
});
```

**Options:**
- `mobileScale`: Optional mobile typography scale
- `tabletScale`: Optional tablet typography scale
- `context`: Typography context for density scaling
- `enableDynamicScaling`: Enable CSS custom property scaling

### CSS Utility Classes

#### Typography Scale Classes
```css
.md-typescale-display-large
.md-typescale-display-medium
.md-typescale-display-small
.md-typescale-headline-large
.md-typescale-headline-medium
.md-typescale-headline-small
.md-typescale-title-large
.md-typescale-title-medium
.md-typescale-title-small
.md-typescale-body-large
.md-typescale-body-medium
.md-typescale-body-small
.md-typescale-label-large
.md-typescale-label-medium
.md-typescale-label-small
```

#### Responsive Typography Classes
```css
.md-typescale-display-large-responsive
.md-typescale-headline-medium-responsive
/* ... responsive variants for all scales */
```

#### Font Weight Classes
```css
.md-font-weight-thin          /* 100 */
.md-font-weight-extra-light   /* 200 */
.md-font-weight-light         /* 300 */
.md-font-weight-regular       /* 400 */
.md-font-weight-medium        /* 500 */
.md-font-weight-semi-bold     /* 600 */
.md-font-weight-bold          /* 700 */
.md-font-weight-extra-bold    /* 800 */
.md-font-weight-black         /* 900 */
```

#### Emphasis Classes
```css
.md-typography-emphasis-high    /* Primary color, bold weight */
.md-typography-emphasis-medium  /* On-surface color, medium weight */
.md-typography-emphasis-low     /* On-surface-variant color, regular weight */
```

#### Hierarchy Classes
```css
.md-typography-hierarchy-primary    /* Bold, on-surface */
.md-typography-hierarchy-secondary  /* Medium, on-surface-variant */
.md-typography-hierarchy-tertiary   /* Regular, on-surface-variant with opacity */
```

#### Context Classes
```css
.md-typography-context-compact      /* 87.5% scaling */
.md-typography-context-comfortable  /* 100% scaling */
.md-typography-context-spacious     /* 112.5% scaling */
```

## Usage Examples

### React Component with Expressive Typography

```tsx
import React from 'react';
import {
  getMaterial3ExpressiveTypography,
  getMaterial3ContextualTypography,
  getMaterial3Classes
} from '../utils/material3-utils';

const ArticleComponent: React.FC = () => {
  const headlineStyle = getMaterial3ExpressiveTypography('headlineLarge', 'bold', 'high');
  const subtitleStyle = getMaterial3ExpressiveTypography('titleMedium', 'medium', 'medium');
  const bodyStyle = getMaterial3ContextualTypography('bodyLarge', 'comfortable');
  
  return (
    <article>
      <h1 style={headlineStyle}>
        Article Title
      </h1>
      <h2 style={subtitleStyle}>
        Subtitle with medium emphasis
      </h2>
      <p style={bodyStyle}>
        Body text with contextual scaling for optimal readability.
      </p>
      <p className="md-typescale-body-medium md-typography-emphasis-low">
        Secondary information with utility classes.
      </p>
    </article>
  );
};
```

### CSS-Only Implementation

```html
<div class="article">
  <h1 class="md-typescale-headline-large md-font-weight-bold md-typography-emphasis-high">
    Article Title
  </h1>
  <h2 class="md-typescale-title-medium md-font-weight-medium md-typography-emphasis-medium">
    Subtitle with medium emphasis
  </h2>
  <p class="md-typescale-body-large md-typography-context-comfortable">
    Body text with contextual scaling.
  </p>
  <p class="md-typescale-body-medium md-typography-emphasis-low">
    Secondary information.
  </p>
</div>
```

### Responsive Layout with Adaptive Typography

```tsx
const ResponsiveCard: React.FC = () => {
  const adaptiveTitle = getMaterial3AdaptiveTypography('titleLarge');
  
  return (
    <div className="card">
      <h3 
        style={adaptiveTitle.base}
        className="md-typescale-responsive"
      >
        Responsive Card Title
      </h3>
      <style jsx>{`
        @media (max-width: 599px) {
          .card h3 {
            font-size: ${adaptiveTitle.mobile.fontSize};
            line-height: ${adaptiveTitle.mobile.lineHeight};
          }
        }
        @media (min-width: 600px) and (max-width: 1023px) {
          .card h3 {
            font-size: ${adaptiveTitle.tablet.fontSize};
            line-height: ${adaptiveTitle.tablet.lineHeight};
          }
        }
        @media (min-width: 1024px) {
          .card h3 {
            font-size: ${adaptiveTitle.desktop.fontSize};
            line-height: ${adaptiveTitle.desktop.lineHeight};
          }
        }
      `}</style>
    </div>
  );
};
```

## CSS Custom Properties

The typography system uses CSS custom properties for dynamic scaling:

```css
:root {
  /* Base scaling factor */
  --md-sys-typescale-scale-factor: 1;
  
  /* Context-aware scaling */
  --md-sys-typescale-scale-factor-compact: 0.875;
  --md-sys-typescale-scale-factor-comfortable: 1;
  --md-sys-typescale-scale-factor-spacious: 1.125;
  
  /* Font weight variations */
  --md-sys-typescale-font-weight-thin: 100;
  --md-sys-typescale-font-weight-regular: 400;
  --md-sys-typescale-font-weight-medium: 500;
  --md-sys-typescale-font-weight-bold: 700;
  --md-sys-typescale-font-weight-black: 900;
}
```

## Performance Considerations

1. **CSS Calc() Optimization**: Uses browser-native calculations for optimal performance
2. **Custom Property Inheritance**: Leverages CSS custom property cascade for efficient updates
3. **Minimal JavaScript**: Most scaling handled by CSS for better performance
4. **Progressive Enhancement**: Graceful fallbacks for unsupported features

## Accessibility Features

1. **Contrast Compliance**: All emphasis levels meet WCAG AA contrast requirements
2. **Semantic Preservation**: Maintains semantic meaning across all variations
3. **Screen Reader Support**: Proper font weight and emphasis communication
4. **Reduced Motion Support**: Respects user motion preferences

## Browser Support

- **Modern Browsers**: Full support in Chrome 49+, Firefox 31+, Safari 9.1+
- **CSS Custom Properties**: Required for dynamic scaling features
- **CSS Calc()**: Required for responsive scaling calculations
- **Graceful Degradation**: Fallbacks provided for older browsers

## Migration Guide

### From Bootstrap Typography

```css
/* Before (Bootstrap) */
.h1 { font-size: 2.5rem; }
.lead { font-size: 1.25rem; }

/* After (Material 3 Expressive) */
.md-typescale-headline-large { /* Material 3 styles */ }
.md-typescale-body-large { /* Material 3 styles */ }
```

### From Custom Typography

1. **Identify current typography scales** and map to Material 3 equivalents
2. **Replace fixed font sizes** with responsive scaling functions
3. **Update font weights** to use expressive variations
4. **Add emphasis levels** for improved hierarchy
5. **Test responsive behavior** across different screen sizes

## Testing

The typography system includes comprehensive unit tests covering:

- ✅ Basic typography generation
- ✅ Expressive font weight variations
- ✅ Emphasis level application
- ✅ Contextual scaling
- ✅ Adaptive responsive behavior
- ✅ CSS utility class generation
- ✅ Accessibility compliance
- ✅ Performance optimization

Run tests with:
```bash
npm test -- --testPathPatterns=material3-tokens.test.ts
```

## Contributing

When contributing to the typography system:

1. **Maintain accessibility**: Ensure all changes meet WCAG AA standards
2. **Test responsiveness**: Verify behavior across different screen sizes
3. **Update documentation**: Keep examples and API reference current
4. **Add unit tests**: Cover new functionality with comprehensive tests
5. **Performance check**: Ensure changes don't impact rendering performance