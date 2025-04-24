# DisplayToggle Component

## Navigation
- [Back to Component Documentation Index](../README.md#component-documentation)
- [Related Components](#related-components)

## Overview
The DisplayToggle component provides a toggle switch that allows users to keep their device display on while using the application, particularly useful during activities where the user might not be actively interacting with the screen.

## Features
- Toggle UI to enable/disable the "keep display on" feature
- Integration with the Wake Lock API
- Local storage persistence of user preference
- Graceful fallback when the Wake Lock API is not supported
- SSR compatible with no hydration errors

## Props
This component doesn't accept any props as it uses the DisplaySettingsContext internally.

## Technical Implementation

### State Management
- Uses the DisplaySettingsContext to manage and persist the display state
- Utilizes the useWakeLock hook to interact with the browser's Wake Lock API
- Ensures consistent rendering between server and client environments

### SSR Compatibility
- Safely detects browser environment before accessing browser-specific APIs
- Avoids hydration mismatches by ensuring consistent initial render
- Uses useEffect for all browser API interactions
- Conditionally renders browser-specific content only on client

### Theme Compatibility
- Uses Tailwind CSS for styling, adapting to the current theme

### Mobile Responsiveness
- Fully responsive design that works across all device sizes
- Particularly useful on mobile devices where screens tend to time out quickly

### Accessibility Considerations
- Switch component is keyboard accessible
- Includes proper ARIA attributes and screen reader support
- Visual indicators for active/inactive states

## Usage

### Basic Usage
```tsx
import DisplayToggle from '../components/ui/DisplayToggle';

function MyComponent() {
  return (
    <div>
      <h2>Settings</h2>
      <DisplayToggle />
    </div>
  );
}
```

### Integration Requirements
- Must be used within a DisplaySettingsProvider
- Requires a browser that supports the Wake Lock API for full functionality

## Test Coverage
- Unit tests covering the toggle functionality
- Tests for browser support detection
- Tests for persistence in localStorage
- Tests for SSR compatibility and hydration consistency

## Known Limitations
- Wake Lock API is not supported in all browsers
- Some mobile devices may have system settings that override the Wake Lock API
- Battery usage increases when display is kept on

## Related Components
- None

## Change History
- 2023-11-02: Fixed SSR hydration errors and improved cross-environment compatibility
- 2023-11-01: Initial implementation with Wake Lock API support and localStorage persistence
