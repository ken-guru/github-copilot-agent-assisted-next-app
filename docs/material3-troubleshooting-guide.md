# Material 3 Troubleshooting Guide

## Overview

This comprehensive troubleshooting guide addresses common issues encountered when implementing the Material 3 Expressive design system in Mr. Timely. It provides solutions, workarounds, and best practices for resolving implementation challenges.

## Table of Contents

1. [Design Token Issues](#design-token-issues)
2. [Color and Theming Problems](#color-and-theming-problems)
3. [Typography Issues](#typography-issues)
4. [Layout and Responsive Problems](#layout-and-responsive-problems)
5. [Animation and Motion Issues](#animation-and-motion-issues)
6. [Component Integration Problems](#component-integration-problems)
7. [Accessibility Issues](#accessibility-issues)
8. [Performance Problems](#performance-problems)
9. [Browser Compatibility Issues](#browser-compatibility-issues)
10. [Build and Development Issues](#build-and-development-issues)

## Design Token Issues

### Issue: CSS Custom Properties Not Working

**Symptoms:**
- Design tokens showing as literal `var()` strings instead of values
- Styles not applying correctly
- Console errors about invalid property values

**Causes:**
- CSS custom properties not defined in root scope
- Incorrect CSS custom property syntax
- Browser compatibility issues

**Solutions:**

```css
/* ❌ Incorrect - missing root scope */
.component {
  --md-sys-color-primary: #6750a4;
}

/* ✅ Correct - define in root scope */
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
}

/* ✅ Correct usage */
.button {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
```

**Debugging Steps:**
1. Check browser DevTools computed styles
2. Verify CSS custom property definitions in `:root`
3. Ensure proper CSS loading order
4. Test in different browsers

### Issue: Design Tokens Not Updating Dynamically

**Symptoms:**
- Theme switching doesn't update colors
- Dynamic token changes not reflected in UI
- Inconsistent token values across components

**Solutions:**

```tsx
// ✅ Correct dynamic token updates
const ThemeProvider = ({ theme, children }) => {
  useEffect(() => {
    const root = document.documentElement;
    
    // Update CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--md-sys-color-${key}`, value);
    });
    
    // Update theme attribute for CSS selectors
    root.setAttribute('data-theme', theme.mode);
  }, [theme]);
  
  return <div className="theme-provider">{children}</div>;
};

// ✅ CSS that responds to theme changes
:root[data-theme="dark"] {
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-on-primary: #381e72;
}
```

### Issue: Token Values Not Cascading Properly

**Symptoms:**
- Child components not inheriting parent token values
- Inconsistent token application across component tree
- Tokens working in some components but not others

**Solutions:**

```css
/* ✅ Ensure proper CSS cascade */
:root {
  /* Global tokens */
  --md-sys-color-primary: #6750a4;
}

.component-container {
  /* Component-specific overrides */
  --md-sys-color-primary: var(--component-primary, var(--md-sys-color-primary));
}

/* ✅ Use inheritance properly */
.child-component {
  color: inherit; /* Inherits from parent */
  background-color: var(--md-sys-color-primary); /* Uses token */
}
```

## Color and Theming Problems

### Issue: Colors Not Switching Between Light and Dark Themes

**Symptoms:**
- Colors remain the same when switching themes
- Some components update while others don't
- Inconsistent theme application

**Solutions:**

```css
/* ✅ Proper theme switching implementation */
:root {
  color-scheme: light dark;
  
  /* Light theme (default) */
  --md-sys-color-primary: #6750a4;
  --md-sys-color-surface: #fef7ff;
  --md-sys-color-on-surface: #1d1b20;
}

/* Dark theme overrides */
:root[data-theme="dark"] {
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-surface: #141218;
  --md-sys-color-on-surface: #e6e0e9;
}

/* System preference support */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --md-sys-color-primary: #d0bcff;
    --md-sys-color-surface: #141218;
    --md-sys-color-on-surface: #e6e0e9;
  }
}
```

```tsx
// ✅ React theme switching
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const surfaceColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--md-sys-color-surface');
      metaThemeColor.setAttribute('content', surfaceColor);
    }
  }, [theme]);
  
  return { theme, setTheme };
};
```

### Issue: Poor Color Contrast in Custom Themes

**Symptoms:**
- Text difficult to read
- Accessibility warnings in browser tools
- Failed WCAG contrast requirements

**Solutions:**

```tsx
// ✅ Automatic contrast validation
const validateContrast = (foreground: string, background: string): boolean => {
  const ratio = calculateContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA standard
};

const generateAccessibleTheme = (primaryColor: string) => {
  const theme = {
    primary: primaryColor,
    onPrimary: '#ffffff',
    surface: '#ffffff',
    onSurface: '#000000',
  };
  
  // Validate and adjust colors
  if (!validateContrast(theme.onPrimary, theme.primary)) {
    theme.onPrimary = adjustColorForContrast(theme.onPrimary, theme.primary);
  }
  
  return theme;
};
```

### Issue: Theme Flashing on Page Load

**Symptoms:**
- Brief flash of wrong theme colors on page load
- Theme switching visible during hydration
- Inconsistent initial theme state

**Solutions:**

```html
<!-- ✅ Prevent theme flash with inline script -->
<script>
  (function() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  })();
</script>
```

```tsx
// ✅ SSR-safe theme initialization
const ThemeScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          try {
            const savedTheme = localStorage.getItem('theme');
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const theme = savedTheme || systemTheme;
            document.documentElement.setAttribute('data-theme', theme);
          } catch (e) {
            console.warn('Theme initialization failed:', e);
          }
        })();
      `,
    }}
  />
);
```

## Typography Issues

### Issue: Typography Not Scaling Responsively

**Symptoms:**
- Text too large or small on different screen sizes
- Inconsistent typography hierarchy across devices
- Poor readability on mobile or desktop

**Solutions:**

```css
/* ✅ Fluid typography with clamp() */
.md-typescale-headline-large {
  font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem);
  line-height: clamp(2rem, 4.5vw + 1.2rem, 4rem);
}

/* ✅ Responsive typography with breakpoints */
.responsive-text {
  font-size: var(--md-sys-typescale-body-large-size);
}

@media (max-width: 599px) {
  .responsive-text {
    font-size: calc(var(--md-sys-typescale-body-large-size) * 0.875);
  }
}

@media (min-width: 1024px) {
  .responsive-text {
    font-size: calc(var(--md-sys-typescale-body-large-size) * 1.05);
  }
}
```

### Issue: Font Loading Issues

**Symptoms:**
- Flash of unstyled text (FOUT)
- Flash of invisible text (FOIT)
- Fonts not loading on slow connections

**Solutions:**

```css
/* ✅ Font loading optimization */
@font-face {
  font-family: 'Roboto';
  src: url('/fonts/roboto-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Prevents FOIT */
}

/* ✅ Font fallback stack */
:root {
  --md-sys-typescale-font-family: 'Roboto', system-ui, -apple-system, sans-serif;
}
```

```tsx
// ✅ Font loading with React
import { useEffect, useState } from 'react';

const useFontLoading = (fontFamily: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if ('fonts' in document) {
      document.fonts.load(`1rem ${fontFamily}`).then(() => {
        setIsLoaded(true);
      });
    } else {
      // Fallback for older browsers
      setIsLoaded(true);
    }
  }, [fontFamily]);
  
  return isLoaded;
};
```

### Issue: Typography Hierarchy Not Clear

**Symptoms:**
- All text looks similar in size
- Poor visual hierarchy
- Difficulty scanning content

**Solutions:**

```css
/* ✅ Clear typography hierarchy */
.typography-hierarchy {
  /* Establish clear size relationships */
  --scale-ratio: 1.25; /* Major third scale */
}

.md-typescale-display-large {
  font-size: calc(var(--base-size) * var(--scale-ratio) * var(--scale-ratio) * var(--scale-ratio));
  font-weight: 400;
  line-height: 1.2;
}

.md-typescale-headline-large {
  font-size: calc(var(--base-size) * var(--scale-ratio) * var(--scale-ratio));
  font-weight: 500;
  line-height: 1.3;
}

.md-typescale-body-large {
  font-size: var(--base-size);
  font-weight: 400;
  line-height: 1.5;
}
```

## Layout and Responsive Problems

### Issue: Components Not Adapting to Container Size

**Symptoms:**
- Components overflow their containers
- Layout breaks on smaller screens
- Components don't resize with parent

**Solutions:**

```css
/* ✅ Container queries for responsive components */
.responsive-component {
  container-type: inline-size;
}

@container (max-width: 400px) {
  .component-content {
    flex-direction: column;
    gap: var(--md-sys-spacing-small);
  }
}

@container (min-width: 600px) {
  .component-content {
    flex-direction: row;
    gap: var(--md-sys-spacing-large);
  }
}

/* ✅ Flexible layouts */
.flexible-layout {
  display: flex;
  flex-wrap: wrap;
  gap: var(--md-sys-spacing-medium);
}

.flexible-layout > * {
  flex: 1 1 280px; /* Minimum width with flexibility */
  max-width: 100%;
}
```

### Issue: Horizontal Scrolling on Mobile

**Symptoms:**
- Unwanted horizontal scroll on mobile devices
- Content extending beyond viewport width
- Layout breaking on small screens

**Solutions:**

```css
/* ✅ Prevent horizontal overflow */
html, body {
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

* {
  box-sizing: border-box;
}

/* ✅ Responsive containers */
.container {
  width: 100%;
  max-width: 100%;
  padding-left: var(--md-sys-spacing-medium);
  padding-right: var(--md-sys-spacing-medium);
  margin: 0 auto;
}

/* ✅ Flexible content */
.content {
  min-width: 0; /* Allows flex items to shrink below content size */
  word-wrap: break-word;
  overflow-wrap: break-word;
}
```

### Issue: Grid Layout Not Working on Older Browsers

**Symptoms:**
- Layout falling back to single column
- Grid properties not recognized
- Inconsistent layout across browsers

**Solutions:**

```css
/* ✅ Progressive enhancement with fallbacks */
.grid-layout {
  /* Flexbox fallback */
  display: flex;
  flex-wrap: wrap;
  gap: var(--md-sys-spacing-medium);
}

.grid-layout > * {
  flex: 1 1 280px;
}

/* CSS Grid enhancement */
@supports (display: grid) {
  .grid-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  .grid-layout > * {
    flex: none; /* Reset flex properties */
  }
}
```

## Animation and Motion Issues

### Issue: Animations Not Respecting Reduced Motion Preferences

**Symptoms:**
- Animations continue when user has reduced motion enabled
- No fallback for users with motion sensitivity
- Accessibility violations

**Solutions:**

```css
/* ✅ Respect reduced motion preferences */
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

/* ✅ Provide alternative feedback */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
  }
  
  .loading-spinner::after {
    content: 'Loading...';
    display: block;
  }
}
```

```tsx
// ✅ React implementation
import { useReducedMotion } from '../hooks/useReducedMotion';

const AnimatedComponent = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div
      style={{
        transition: prefersReducedMotion ? 'none' : 'all 0.3s ease',
        animation: prefersReducedMotion ? 'none' : 'fadeIn 0.5s ease',
      }}
    >
      {children}
    </div>
  );
};
```

### Issue: Janky or Stuttering Animations

**Symptoms:**
- Animations not smooth
- Frame drops during transitions
- High CPU usage during animations

**Solutions:**

```css
/* ✅ GPU acceleration for smooth animations */
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU layer */
}

/* ✅ Optimize animation properties */
.smooth-animation {
  /* Animate transform and opacity only */
  transition: transform 0.3s ease, opacity 0.3s ease;
  /* Avoid animating layout properties like width, height, padding */
}

/* ✅ Remove will-change after animation */
.animated-element.animation-complete {
  will-change: auto;
}
```

```tsx
// ✅ Performance-optimized animations
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
    <div
      style={{
        transform: `translateX(${progress * 100}%)`,
        // Use transform instead of changing left/right
      }}
    >
      Smooth animation
    </div>
  );
};
```

### Issue: Animation Timing Inconsistencies

**Symptoms:**
- Animations feel too fast or slow
- Inconsistent timing across different animations
- Poor animation choreography

**Solutions:**

```css
/* ✅ Consistent timing system */
:root {
  /* Duration tokens */
  --md-sys-motion-duration-short1: 50ms;
  --md-sys-motion-duration-short2: 100ms;
  --md-sys-motion-duration-medium1: 250ms;
  --md-sys-motion-duration-medium2: 300ms;
  
  /* Easing tokens */
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-emphasized: cubic-bezier(0.05, 0.7, 0.1, 1);
}

/* ✅ Use consistent timing */
.button-transition {
  transition: 
    background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard),
    box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.page-transition {
  transition: 
    transform var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized),
    opacity var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);
}
```

## Component Integration Problems

### Issue: Components Not Inheriting Theme Properly

**Symptoms:**
- Some components use default colors instead of theme colors
- Inconsistent theming across component tree
- Theme changes not propagating to all components

**Solutions:**

```tsx
// ✅ Proper theme context implementation
const ThemeContext = createContext(null);

export const ThemeProvider = ({ theme, children }) => {
  useEffect(() => {
    // Apply theme to CSS custom properties
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--md-sys-color-${key}`, value);
    });
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Components that use theme context
const ThemedComponent = () => {
  const theme = useContext(ThemeContext);
  
  return (
    <div
      style={{
        backgroundColor: `var(--md-sys-color-surface)`,
        color: `var(--md-sys-color-on-surface)`,
      }}
    >
      Themed content
    </div>
  );
};
```

### Issue: Component Props Not Working as Expected

**Symptoms:**
- Props not affecting component appearance
- TypeScript errors with component props
- Default props not being applied

**Solutions:**

```tsx
// ✅ Proper prop handling with defaults
interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: React.ReactNode;
}

const Material3Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  disabled = false,
  children,
  ...rest
}) => {
  const buttonClass = `md-button md-button-${variant} md-button-${size}`;
  
  return (
    <button
      className={buttonClass}
      disabled={disabled}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

// ✅ Proper TypeScript prop validation
const validateProps = (props: ButtonProps) => {
  if (props.variant && !['filled', 'outlined', 'text'].includes(props.variant)) {
    console.warn(`Invalid variant: ${props.variant}`);
  }
};
```

### Issue: Component State Not Updating

**Symptoms:**
- Component doesn't re-render when props change
- State updates not reflected in UI
- Event handlers not firing

**Solutions:**

```tsx
// ✅ Proper state management
const StatefulComponent = ({ initialValue, onChange }) => {
  const [value, setValue] = useState(initialValue);
  
  // Update internal state when prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  
  const handleChange = useCallback((newValue) => {
    setValue(newValue);
    onChange?.(newValue);
  }, [onChange]);
  
  return (
    <input
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
};

// ✅ Memoization for performance
const OptimizedComponent = memo(({ data, onAction }) => {
  const memoizedData = useMemo(() => {
    return processData(data);
  }, [data]);
  
  return (
    <div onClick={onAction}>
      {memoizedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});
```

## Accessibility Issues

### Issue: Focus Indicators Not Visible

**Symptoms:**
- No visible focus ring when navigating with keyboard
- Poor accessibility for keyboard users
- Focus indicators too subtle

**Solutions:**

```css
/* ✅ High contrast focus indicators */
.focusable-element:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
  border-radius: var(--md-sys-shape-corner-small);
}

/* ✅ Custom focus ring for complex components */
.custom-focus:focus-visible::after {
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

/* ✅ High contrast mode support */
@media (prefers-contrast: high) {
  .focusable-element:focus-visible {
    outline: 3px solid;
    outline-offset: 3px;
  }
}
```

### Issue: Screen Reader Announcements Not Working

**Symptoms:**
- Dynamic content changes not announced
- Form errors not read by screen readers
- Missing or incorrect ARIA labels

**Solutions:**

```tsx
// ✅ Proper ARIA live regions
const LiveRegion = ({ message, priority = 'polite' }) => (
  <div
    aria-live={priority}
    aria-atomic="true"
    className="sr-only"
  >
    {message}
  </div>
);

// ✅ Form with proper error announcements
const AccessibleForm = () => {
  const [errors, setErrors] = useState({});
  const [announcement, setAnnouncement] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setAnnouncement(`Form has ${Object.keys(newErrors).length} errors`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <LiveRegion message={announcement} priority="assertive" />
      {/* Form fields */}
    </form>
  );
};
```

## Performance Problems

### Issue: Large Bundle Size

**Symptoms:**
- Slow initial page load
- Large JavaScript bundles
- Poor performance on slow connections

**Solutions:**

```tsx
// ✅ Code splitting and lazy loading
const LazyComponent = lazy(() => import('./HeavyComponent'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponent />
  </Suspense>
);

// ✅ Tree shaking optimization
// Import only what you need
import { getMaterial3Typography } from '../utils/material3-utils';
// Instead of importing everything
// import * as Material3Utils from '../utils/material3-utils';
```

```javascript
// ✅ Webpack optimization
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        material3: {
          test: /[\\/]src[\\/]utils[\\/]material3/,
          name: 'material3',
          chunks: 'all',
        },
      },
    },
  },
};
```

### Issue: Memory Leaks in Components

**Symptoms:**
- Increasing memory usage over time
- Browser becoming sluggish
- Components not cleaning up properly

**Solutions:**

```tsx
// ✅ Proper cleanup in useEffect
const ComponentWithCleanup = () => {
  useEffect(() => {
    const handleResize = () => {
      // Handle resize
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // ✅ Cleanup timers and intervals
  useEffect(() => {
    const timer = setInterval(() => {
      // Timer logic
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
};

// ✅ Proper ref cleanup
const ComponentWithRefs = () => {
  const observerRef = useRef<ResizeObserver | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (elementRef.current) {
      observerRef.current = new ResizeObserver(() => {
        // Observer logic
      });
      
      observerRef.current.observe(elementRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);
  
  return <div ref={elementRef}>Content</div>;
};
```

## Browser Compatibility Issues

### Issue: CSS Features Not Supported in Older Browsers

**Symptoms:**
- Layout breaking in older browsers
- CSS properties not recognized
- Inconsistent appearance across browsers

**Solutions:**

```css
/* ✅ Feature detection and fallbacks */
.modern-layout {
  /* Flexbox fallback */
  display: flex;
  flex-wrap: wrap;
}

/* CSS Grid enhancement */
@supports (display: grid) {
  .modern-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

/* ✅ CSS custom property fallbacks */
.component {
  background-color: #6750a4; /* Fallback */
  background-color: var(--md-sys-color-primary, #6750a4);
}

/* ✅ Modern CSS with fallbacks */
.rounded-element {
  border-radius: 8px; /* Fallback */
  border-radius: var(--md-sys-shape-corner-medium, 8px);
}
```

### Issue: JavaScript Features Not Supported

**Symptoms:**
- JavaScript errors in older browsers
- Features not working in Internet Explorer
- Polyfill issues

**Solutions:**

```javascript
// ✅ Feature detection
if ('IntersectionObserver' in window) {
  // Use IntersectionObserver
} else {
  // Fallback implementation
}

// ✅ Polyfill loading
const loadPolyfills = async () => {
  if (!window.ResizeObserver) {
    await import('resize-observer-polyfill');
  }
  
  if (!window.IntersectionObserver) {
    await import('intersection-observer');
  }
};

// ✅ Babel configuration for older browsers
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 11']
      },
      useBuiltIns: 'usage',
      corejs: 3
    }]
  ]
};
```

## Build and Development Issues

### Issue: CSS Not Loading in Development

**Symptoms:**
- Styles not applying in development mode
- CSS modules not working
- Hot reloading issues with styles

**Solutions:**

```javascript
// ✅ Webpack CSS configuration
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production' 
            ? MiniCssExtractPlugin.loader 
            : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          },
          'postcss-loader'
        ]
      }
    ]
  }
};
```

### Issue: TypeScript Errors with Material 3 Components

**Symptoms:**
- Type errors when using components
- Missing type definitions
- Incorrect prop types

**Solutions:**

```typescript
// ✅ Proper type definitions
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// ✅ Component type definitions
interface Material3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

// ✅ Utility type definitions
export interface Material3Theme {
  colors: {
    primary: string;
    onPrimary: string;
    surface: string;
    onSurface: string;
    // ... other colors
  };
  typography: {
    headlineLarge: {
      fontSize: string;
      lineHeight: string;
      fontWeight: string;
    };
    // ... other typography scales
  };
}
```

## Debugging Tools and Techniques

### CSS Debugging

```css
/* ✅ Debug CSS custom properties */
.debug-tokens::before {
  content: 'Primary: ' var(--md-sys-color-primary) 
           ' Surface: ' var(--md-sys-color-surface);
  display: block;
  background: yellow;
  padding: 8px;
  font-family: monospace;
}

/* ✅ Visual debugging borders */
.debug-layout * {
  outline: 1px solid red;
}
```

### JavaScript Debugging

```tsx
// ✅ Component debugging
const DebugComponent = ({ children, ...props }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Component props:', props);
  }
  
  return (
    <div data-debug="component" {...props}>
      {children}
    </div>
  );
};

// ✅ Performance debugging
const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.time(`${componentName} render`);
      return () => {
        console.timeEnd(`${componentName} render`);
      };
    }
  });
};
```

### Browser DevTools Tips

1. **CSS Custom Properties**: Check computed styles to see resolved values
2. **Accessibility**: Use accessibility panel to check ARIA attributes
3. **Performance**: Use Performance tab to identify rendering bottlenecks
4. **Network**: Monitor CSS and font loading times
5. **Console**: Check for CSS and JavaScript errors

## Prevention Strategies

### Code Quality

```javascript
// ✅ ESLint configuration
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  rules: {
    'jsx-a11y/no-autofocus': 'error',
    'jsx-a11y/alt-text': 'error',
    '@typescript-eslint/no-unused-vars': 'error'
  }
};
```

### Testing Strategy

```tsx
// ✅ Component testing
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

describe('Material3Button', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Material3Button>Test</Material3Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should handle all variants', () => {
    const variants = ['filled', 'outlined', 'text'];
    variants.forEach(variant => {
      render(<Material3Button variant={variant}>Test</Material3Button>);
      expect(screen.getByRole('button')).toHaveClass(`md-button-${variant}`);
    });
  });
});
```

This comprehensive troubleshooting guide should help resolve most common issues encountered when implementing the Material 3 Expressive design system. Remember to always test across different browsers and devices, and maintain good development practices to prevent issues from occurring.