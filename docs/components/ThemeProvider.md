# ThemeProvider Component

## Navigation
- [Back to Component Documentation Index](../README.md#component-documentation)
- [Related Components](#related-components)

## Overview
The ThemeProvider component manages theme state across the application, providing a consistent way to toggle between light and dark modes while ensuring SSR compatibility.

## Features
- Manages theme state (light/dark mode)
- Persists theme preference in localStorage
- Applies theme classes to HTML element
- SSR compatible with no hydration errors
- Provides theme context to child components

## Technical Implementation

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | Required | Child components that will have access to the theme context |

### State Management
- Uses React's Context API for global theme state access
- Initializes with light theme for SSR compatibility
- Loads user preference from localStorage on client-side
- Updates HTML classes to apply theme styles

### SSR Compatibility
- Always renders with light theme during server-side rendering
- Applies stored theme preference only after client-side hydration
- Avoids hydration mismatches by ensuring consistent initial render

### Hooks
The component exports a `useTheme` hook that provides:
- `isDarkMode`: Boolean indicating if dark mode is active
- `toggleTheme`: Function to switch between light and dark mode

### Theme Application
- Applies a `dark-mode` class to the HTML document element for dark mode
- CSS variables in global styles change based on this class

## Usage

### Basic Usage
```tsx
import ThemeProvider, { useTheme } from '../components/contexts/ThemeProvider';

// In your app root
function App() {
  return (
    <ThemeProvider>
      <YourComponents />
    </ThemeProvider>
  );
}

// In any component
function ThemeToggleButton() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
}
```

### Accessing Theme in Components
```tsx
import { useTheme } from '../components/contexts/ThemeProvider';

function ThemedComponent() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={isDarkMode ? 'dark-component' : 'light-component'}>
      <p>This component adapts to the current theme</p>
    </div>
  );
}
```

## Test Coverage
- Tests for SSR compatibility and hydration consistency
- Tests for theme persistence in localStorage
- Tests for theme toggle functionality

## Known Limitations
- Initial flash of light theme may occur before client-side hydration applies stored preference
- Requires JavaScript to be enabled for theme preference to be applied

## Related Components
- SplashScreen - Styled using theme variables

## Change History
- 2023-11-03: Initial implementation with SSR compatibility and localStorage persistence
