# SplashScreen Component

## Navigation
- [Back to Component Documentation Index](#)
- [Related Components](#related-components)

## Overview
The SplashScreen component provides a visually appealing loading screen that appears during application initialization. It ensures users have immediate visual feedback while the app is loading.

## Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| minimumDisplayTime | number | 1500 | Minimum time in milliseconds the splash screen should be displayed |

## State Management
- Uses the `LoadingContext` to track application loading state
- Maintains internal state to handle minimum display time requirements
- Automatically dismisses when both loading is complete and minimum display time has elapsed

## Theme Compatibility
- Automatically adjusts to light/dark theme
- Uses CSS variables for theming
- Customizable through SplashScreen.module.css

## Mobile Responsiveness
- Fully responsive design
- Automatically resizes logo for smaller screens
- Adjusts loading indicator size on mobile devices
- Maintains proper centering across all viewports

## Accessibility Considerations
- Implements proper ARIA attributes (`role="status"`, `aria-live="polite"`)
- Provides descriptive `aria-label` for screen readers
- Maintains proper contrast ratios for visibility
- Non-essential animations that don't interfere with screen readers

## Test Coverage
- Tests for initial display and hiding behavior
- Tests for minimum display time functionality
- Tests for theme compatibility
- Tests for accessibility compliance
- Tests for loading state synchronization

## Usage Examples

### Basic Usage

```tsx
import SplashScreen from '@/app/_components/splash/SplashScreen';
import { LoadingProvider } from '@/contexts/loading';

export default function App({ Component, pageProps }) {
  return (
    <LoadingProvider>
      <SplashScreen />
      <Component {...pageProps} />
    </LoadingProvider>
  );
}
```

### With Custom Display Duration

```tsx
<SplashScreen minimumDisplayTime={3000} />
```

## Known Limitations
- The splash screen requires the LoadingProvider to be present in the component tree
- CSS animations may vary slightly across different browsers
- For very large applications, consider using a native splash screen solution for initial load

## Change History
- Initial implementation (YYYY-MM-DD)
