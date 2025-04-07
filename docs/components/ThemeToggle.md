# ThemeToggle Component

## Navigation

- [Component Documentation Home](./README.md)
- **Category**: [Utility Components](./README.md#utility-components)
- **Related Components**:
  - All components - ThemeToggle affects the appearance of the entire application

## Overview

The ThemeToggle component provides a user interface for switching between light and dark themes. It offers a consistent interaction pattern for theme selection, manages theme state persistence, and ensures smooth visual transitions when changing themes. The component is essential for accessibility, allowing users to select their preferred visual mode.

## Features

- **Theme Switching**: Toggle between light and dark themes
- **System Preference Detection**: Automatically detects system theme preference
- **Theme Persistence**: Remembers user preference across sessions
- **Smooth Transitions**: Provides visual transitions between theme states
- **Accessible Design**: Fully accessible controls with proper labeling
- **Mobile Support**: Touch-friendly interaction on mobile devices
- **Visual Indicators**: Clear visual feedback of current theme state
- **CSS Variables**: Manages CSS variable switching for theme changes
- **Multiple Display Modes**: Supports icon-only, text-only, or combined display

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `mode` | `'icon' \| 'text' \| 'combined'` | No | `'combined'` | Display mode for the toggle |
| `lightLabel` | `string` | No | `'Light'` | Text label for light theme option |
| `darkLabel` | `string` | No | `'Dark'` | Text label for dark theme option |
| `systemLabel` | `string` | No | `'System'` | Text label for system preference option |
| `includeSystemOption` | `boolean` | No | `true` | Whether to include system preference option |
| `onChange` | `(theme: 'light' \| 'dark' \| 'system') => void` | No | - | Callback when theme changes |
| `className` | `string` | No | - | Additional CSS class name |

## Types

```typescript
type ThemeOption = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  mode?: 'icon' | 'text' | 'combined';
  lightLabel?: string;
  darkLabel?: string;
  systemLabel?: string;
  includeSystemOption?: boolean;
  onChange?: (theme: ThemeOption) => void;
  className?: string;
}
```

## State Management

The ThemeToggle component manages several pieces of state:

1. **Current theme**: Tracks the active theme setting
   ```typescript
   const [currentTheme, setCurrentTheme] = useState<ThemeOption>(() => {
     // Initialize from localStorage or system preference
     if (typeof window === 'undefined') return 'system';
     
     const savedTheme = localStorage.getItem('theme');
     if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
       return savedTheme as ThemeOption;
     }
     
     return 'system';
   });
   ```

2. **System theme detection**: Tracks the system's theme preference
   ```typescript
   const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
     if (typeof window === 'undefined') return 'light';
     return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
   });
   ```

3. **Animation state**: Manages transition animations between themes
   ```typescript
   const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
   ```

The component uses these key effects:

1. **System preference monitoring**: Listens for system preference changes
   ```typescript
   useEffect(() => {
     if (typeof window === 'undefined') return;
     
     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
     
     const handleChange = (e: MediaQueryListEvent) => {
       setSystemTheme(e.matches ? 'dark' : 'light');
     };
     
     mediaQuery.addEventListener('change', handleChange);
     return () => mediaQuery.removeEventListener('change', handleChange);
   }, []);
   ```

2. **Theme application**: Applies the selected theme to the document
   ```typescript
   useEffect(() => {
     if (typeof document === 'undefined') return;
     
     const effectiveTheme = currentTheme === 'system' ? systemTheme : currentTheme;
     
     // Transition handling
     setIsTransitioning(true);
     
     // Apply theme by updating document classes
     if (effectiveTheme === 'dark') {
       document.documentElement.classList.add('dark-theme');
       document.documentElement.classList.remove('light-theme');
     } else {
       document.documentElement.classList.add('light-theme');
       document.documentElement.classList.remove('dark-theme');
     }
     
     // Save preference
     if (currentTheme !== 'system') {
       localStorage.setItem('theme', currentTheme);
     }
     
     // Complete transition after a brief delay
     const timer = setTimeout(() => setIsTransitioning(false), 300);
     return () => clearTimeout(timer);
   }, [currentTheme, systemTheme]);
   ```

## Theme Persistence Mechanism

The ThemeToggle implements a comprehensive theme persistence strategy:

1. **Initial theme detection**:
   - Check for user preference in localStorage
   - Fall back to system preference if no stored preference exists
   - Default to light theme if detection fails

2. **Theme storage**:
   - Uses localStorage to persist theme preference across sessions
   - Only stores explicit user selections (light/dark), not 'system'
   - Uses a consistent storage key ('theme') for preference

3. **Theme restoration**:
   - Restores theme on page load/component mount
   - Applies appropriate CSS classes to document root
   - Handles SSR scenarios where localStorage isn't available

## Theme Application Logic

The component follows a specific process for theme application:

1. Determine effective theme:
   - If user selected a specific theme (light/dark) → use that
   - If set to system → use detected system preference
   - Apply fallbacks if needed

2. Apply theme to document:
   - Add/remove appropriate CSS classes on document.documentElement
   - This triggers CSS variable changes across the application
   - Handle transitions to avoid jarring visual changes

3. Notify parent components:
   - Call onChange callback if provided
   - This allows parent components to respond to theme changes

## Mobile Responsiveness

The ThemeToggle component is designed to be fully responsive:

- **Touch-friendly controls**: Adequate touch target sizes
- **Responsive layout**: Adapts to different screen sizes
- **Mobile-specific presentation**: Icon-only mode option for small screens
- **No hover dependency**: All functionality works on touch devices
- **Adaptive spacing**: Proper spacing for both desktop and mobile

## Accessibility

- **Semantic HTML**: Uses appropriate button elements
- **ARIA attributes**: Includes aria-label, aria-pressed, and role attributes
- **Keyboard navigation**: Full keyboard support with visible focus indicators
- **Color independence**: Information conveyed through more than just color
- **Screen reader support**: Proper text alternatives for icons
- **Reduced motion**: Respects user preference for reduced motion

## Example Usage

### Basic Usage

```tsx
import ThemeToggle from '../components/ThemeToggle';

function Header() {
  return (
    <header className="app-header">
      <h1>My Application</h1>
      <ThemeToggle />
    </header>
  );
}
```

### Icon-Only Mode

```tsx
<ThemeToggle 
  mode="icon" 
  onChange={(theme) => console.log(`Theme changed to: ${theme}`)} 
/>
```

### Custom Labels

```tsx
<ThemeToggle
  lightLabel="Day Mode"
  darkLabel="Night Mode"
  systemLabel="Auto"
/>
```

### Without System Option

```tsx
<ThemeToggle includeSystemOption={false} />
```

## Display Variations

The ThemeToggle component supports three display modes:

1. **Icon Mode**: Displays only icons for theme options
   - Most compact presentation
   - Good for mobile or space-constrained layouts
   - Uses sun/moon icons for light/dark themes

2. **Text Mode**: Displays only text labels
   - Most explicit presentation
   - Good for maximum clarity
   - Uses customizable text labels

3. **Combined Mode** (default): Shows both icons and text
   - Most comprehensive presentation
   - Provides both visual cues and explicit labels
   - Best for learnability and users of all experience levels

## Known Limitations

1. **Initial flash**: May have brief flash of incorrect theme before hydration
2. **Storage limitations**: Local storage might be unavailable in some contexts
3. **SSR challenges**: Server rendering doesn't have access to user preferences
4. **Multiple instances**: Multiple instances may cause race conditions in theme application
5. **OS setting changes**: May need page refresh to detect OS setting changes in some browsers

## Test Coverage

The ThemeToggle component has comprehensive test coverage:

- **ThemeToggle.test.tsx**: Core functionality tests
- **ThemeToggle.a11y.test.tsx**: Accessibility tests
- **ThemeToggle.ssr.test.tsx**: Server-side rendering tests

Key tested scenarios include:
- Theme switching between light, dark, and system preference
- Persistence of theme preferences
- System preference detection and application
- Various display mode rendering
- Keyboard navigation and accessibility
- SSR compatibility

## Related Components and Utilities

- **ThemeProvider**: Context provider for theme information (if implemented)
- **useTheme**: Hook for accessing current theme in other components (if implemented)
- **themeUtils.ts**: Utilities for theme detection and application
- **CSS variables**: Theme-specific CSS variables defined in global styles

## Implementation Details

The ThemeToggle implements several key algorithms:

1. **Theme detection**:
   ```typescript
   const getInitialTheme = (): ThemeOption => {
     if (typeof window === 'undefined') return 'system';
     
     const savedTheme = localStorage.getItem('theme');
     if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
       return savedTheme as ThemeOption;
     }
     
     return 'system';
   };
   ```

2. **System preference detection**:
   ```typescript
   const getSystemTheme = (): 'light' | 'dark' => {
     if (typeof window === 'undefined') return 'light';
     return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
   };
   ```

3. **Theme toggling logic**:
   ```typescript
   const cycleTheme = () => {
     setCurrentTheme(current => {
       if (current === 'light') return 'dark';
       if (current === 'dark') return includeSystemOption ? 'system' : 'light';
       return 'light';
     });
   };
   ```

## Change History

- **2025-04-01**: Added reduced motion support
- **2025-03-15**: Enhanced system preference detection
- **2025-03-01**: Improved theme transition animations
- **2025-02-15**: Added support for SSR environments
- **2025-02-01**: Implemented theme persistence
- **2025-01-15**: Added system preference option
- **2025-01-01**: Initial implementation with basic light/dark toggle
