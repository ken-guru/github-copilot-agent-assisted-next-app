# OfflineIndicator Component

## Navigation

- [Component Documentation Home](./README.md)
- **Category**: [Utility Components](./README.md#utility-components)
- **Related Components**:
  - [ServiceWorkerUpdater](./ServiceWorkerUpdater.md) - Works alongside OfflineIndicator for network status
  - [ErrorBoundary](./ErrorBoundary.md) - Often handles errors during offline operation

## Overview

The OfflineIndicator component provides visual feedback to users about the application's current network status using Bootstrap's Alert component. It displays a non-intrusive warning alert when the application is operating in offline mode, helping users understand why certain features might be unavailable and providing confidence that the application is still functioning despite lack of connectivity.

## Migration Status

**Status:** ✅ **Migrated to Bootstrap**
- **From:** Custom CSS module implementation with custom warning styling
- **To:** react-bootstrap/Alert with warning variant
- **Migration Date:** 2024-12-19
- **Commit:** "Migrate OfflineIndicator to Bootstrap Alert component"

## Table of Contents
- [Features](#features)
- [Props](#props)
- [Types](#types)
- [State Management](#state-management)
- [Theme Compatibility](#theme-compatibility)
- [Mobile Responsiveness](#mobile-responsiveness)
- [Accessibility](#accessibility)
- [Example Usage](#example-usage)
- [Status Display Variations](#status-display-variations)
- [Known Limitations](#known-limitations)
- [Test Coverage](#test-coverage)
- [Related Components](#related-components)
- [Implementation Details](#implementation-details)
- [Change History](#change-history)
- [Related Memory Logs](#related-memory-logs)

## Features

- **Network Status Detection**: Automatically detects online/offline status
- **Visual Indicator**: Provides clear visual feedback about offline state
- **Non-intrusive Design**: Displays without disrupting the user experience
- **Theme Compatibility**: Adapts to light and dark themes
- **Mobile Responsiveness**: Works across various device sizes
- **Animation Support**: Smooth transitions between states
- **Accessibility**: Properly announces status changes to screen readers
- **Status Events**: Listens to browser online/offline events
- **Custom Messaging**: Configurable status messages

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| None | - | - | - | Component takes no props; uses Bootstrap Alert with fixed styling |

**Note:** The current Bootstrap implementation uses a simplified prop interface. The component automatically detects online/offline status and displays a warning alert when offline.

## Types

```typescript
// Current simplified interface after Bootstrap migration
export function OfflineIndicator(): React.ReactElement | null;

// Previous interface (for reference):
// interface OfflineIndicatorProps {
//   position?: 'top' | 'bottom' | 'inline';
//   message?: string;
//   showOnlineStatus?: boolean;
//   onlineMessage?: string;
//   forceOffline?: boolean;
// }
```

## State Management

The OfflineIndicator component manages these state elements:

1. **Network status**: Tracks online/offline state using the `useOnlineStatus` hook
   ```typescript
   const isOnline = useOnlineStatus();
   ```

2. **Mounting state**: Prevents SSR hydration mismatches
   ```typescript
   const [mounted, setMounted] = useState(false);
   
   useEffect(() => {
     setMounted(true);
   }, []);
   ```

The component uses Bootstrap Alert styling and automatically shows/hides based on network status:

```typescript
// Component structure with Bootstrap Alert
<Alert 
  variant="warning" 
  className="text-center mb-3"
  data-testid="offline-indicator"
>
  You are offline
</Alert>
```

## Theme Compatibility

The OfflineIndicator adapts to different themes through Bootstrap's default theming system:

- **Bootstrap theming**: Uses Bootstrap's warning variant which automatically adapts to the current theme
- **Color consistency**: Warning colors remain consistent with Bootstrap's design system
- **Dark mode support**: Bootstrap's alert variants include built-in dark mode support
- **Automatic adaptation**: No custom CSS required for theme switching

## Mobile Responsiveness

The component is optimized for all screen sizes using Bootstrap utilities:

- **Responsive design**: Bootstrap Alert is inherently responsive and mobile-friendly
- **Text centering**: Uses Bootstrap's `text-center` utility for consistent alignment
- **Spacing**: Uses Bootstrap's `mb-3` margin utility for consistent spacing
- **Touch-friendly**: Bootstrap Alert provides adequate touch target size
- **Viewport adaptation**: Automatically adapts to different screen sizes

## Accessibility

- **Alert role**: Bootstrap Alert provides proper `role="alert"` for screen readers
- **Status announcements**: Screen readers automatically announce alert content
- **Color independence**: Information conveyed through more than just color
- **Contrast ratios**: Bootstrap ensures WCAG AA compliance for alert text
- **Semantic markup**: Uses proper semantic HTML structure

## Example Usage

### Basic Usage

```tsx
import { OfflineIndicator } from '../components/OfflineIndicator';

function App() {
  return (
    <div className="app">
      <OfflineIndicator />
      {/* Rest of the application */}
    </div>
  );
}
```

### Integration with Layout

```tsx
function Layout({ children }) {
  return (
    <div className="layout">
      <OfflineIndicator />
      <main>{children}</main>
    </div>
  );
}
```

## Status Display Variations

The Bootstrap OfflineIndicator provides a consistent display mode:

1. **Warning Alert**: Full-width Bootstrap warning alert with centered text
2. **Automatic visibility**: Shows only when offline, hides when online
3. **Consistent styling**: Uses Bootstrap's default warning variant colors

**Note:** Previous custom positioning and messaging options have been simplified in favor of Bootstrap's consistent design system.

## Known Limitations

1. **Detection accuracy**: Relies on browser's online/offline events which may not always reflect true connectivity
2. **Connection quality**: Cannot detect slow or poor-quality connections
3. **Fixed styling**: Uses Bootstrap's default warning variant (no custom positioning or messages)
4. **Bootstrap dependency**: Requires react-bootstrap to be installed and configured
5. **Simplified interface**: Previous customization options removed in favor of consistency

## Test Coverage

The OfflineIndicator component has comprehensive test coverage:

- **OfflineIndicator.test.tsx**: Basic rendering and functionality tests
- **OfflineIndicator.bootstrap.test.tsx**: Bootstrap-specific integration tests

Key tested scenarios include:
- Initial offline state detection
- Bootstrap Alert rendering and styling
- Transition between online and offline states
- Accessibility attributes (role="alert")
- Bootstrap utility classes
- SSR compatibility

## Related Components

- **ServiceWorkerUpdater**: Works alongside OfflineIndicator for offline capabilities
- **ErrorBoundary**: Often handles errors that might occur during offline operation
- **NetworkStatus**: More advanced network monitoring component (if implemented)

## Implementation Details

The OfflineIndicator uses Bootstrap Alert for consistent styling:

```typescript
import { Alert } from 'react-bootstrap';

return (
  <Alert 
    variant="warning" 
    className="text-center mb-3"
    data-testid="offline-indicator"
  >
    You are offline
  </Alert>
);
```

The component integrates with the `useOnlineStatus` hook for network detection:

```typescript
const isOnline = useOnlineStatus();

// Component only renders when offline
if (isOnline) {
  return null;
}
```

## Change History

| Date | Version | Changes |
|------|---------|---------|
| 2024-12-19 | 2.0.0 | ✅ Migrated to Bootstrap Alert component |
|           |       | ✅ Simplified prop interface |
|           |       | ✅ Added comprehensive test suite |
|           |       | ✅ Updated to use Bootstrap warning variant |
|           |       | ✅ Removed custom CSS module dependency |

Previous versions:
- **2025-03-20**: Added animation improvements
- **2025-03-01**: Enhanced accessibility for status announcements
- **2025-02-15**: Added inline positioning option
- **2025-02-01**: Improved theme compatibility
- **2025-01-15**: Added configurable messaging
- **2025-01-01**: Initial implementation with basic offline detection

## Related Memory Logs

This component has been discussed in the following memory logs:

- [MRTMLY-108: Offline Indicator Layout and Test Optimization](../logged_memories/MRTMLY-108-offline-indicator-layout.md) - Layout improvements and testing

---

## Navigation

- [Back to Component Documentation Home](./README.md)
- **Previous Component**: [TimeDisplay](./TimeDisplay.md)
- **Next Component**: [ThemeToggle](./ThemeToggle.md)
