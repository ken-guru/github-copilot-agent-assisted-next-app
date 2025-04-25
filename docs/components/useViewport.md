# useViewport Hook

## Navigation
- [Component Documentation Index](../README.md#components)
- Related: [App](./App.md), [OvertimeIndicator](./OvertimeIndicator.md)

## Overview
The `useViewport` hook provides responsive viewport information to components. It detects screen dimensions, categorizes the viewport into mobile, tablet, or desktop sizes, and checks for touch capability. This enables responsive UI adjustments across the application.

## Hook Interface

| Return Property | Type | Description |
|----------------|------|-------------|
| width | number | Current viewport width in pixels |
| height | number | Current viewport height in pixels |
| isMobile | boolean | True when viewport width is below mobile breakpoint |
| isTablet | boolean | True when viewport is between tablet breakpoints |
| isDesktop | boolean | True when viewport is above desktop breakpoint |
| viewportCategory | 'mobile' \| 'tablet' \| 'desktop' | String categorization of current viewport |
| hasTouch | boolean | True when device has touch capability |

## State Management

The hook manages:
- Viewport dimensions (width and height)
- Viewport categorization based on breakpoints
- Touch capability detection

State updates automatically when:
- Window is resized
- Device orientation changes

## Theme Compatibility

The hook itself is theme-agnostic but enables components to adapt their appearance based on viewport size.

## Mobile Responsiveness

This hook is the core enabler for mobile responsiveness across the application:
- Provides accurate viewport size detection
- Handles orientation changes
- Detects touch capability for touch-optimized UI

## Accessibility Considerations

- Enables components to adapt their UI for better accessibility on different devices
- Detects touch capability to optimize for motor control considerations
- Can be extended to detect reduced motion preferences

## Test Coverage

The hook has comprehensive test coverage for:
- Viewport size detection
- Breakpoint categorization logic
- Touch capability detection
- Resize event handling
- Proper cleanup of event listeners

## Usage Examples

### Basic Usage
```tsx
import { useViewport } from '../hooks/useViewport';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop } = useViewport();
  
  return (
    <div>
      {isMobile && <MobileNav />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
};
```

### Using with Touch Detection
```tsx
import { useViewport } from '../hooks/useViewport';

const Button = (props) => {
  const { hasTouch } = useViewport();
  
  return (
    <button 
      className={hasTouch ? styles.touchFriendly : styles.standard}
      {...props}
    >
      {props.children}
    </button>
  );
};
```

### Dynamic Styling
```tsx
import { useViewport } from '../hooks/useViewport';

const DynamicComponent = () => {
  const { width, height, viewportCategory } = useViewport();
  
  const dynamicStyle = {
    padding: viewportCategory === 'mobile' ? '8px' : '16px',
    fontSize: viewportCategory === 'desktop' ? '1rem' : '0.875rem',
  };
  
  return (
    <div style={dynamicStyle}>
      Current viewport: {width}x{height}
    </div>
  );
};
```

## Known Limitations/Edge Cases

- Breakpoints are fixed values and may need adjustment for specific design requirements
- SSR environments will default to desktop view until client-side hydration
- Media query for touch detection (`pointer: coarse`) is not supported in all browsers
- Rapid window resizing can cause performance issues if used excessively

## Change History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2023-07-10 | Initial implementation with size detection and categories |
| 1.1 | 2023-07-10 | Added touch capability detection |
