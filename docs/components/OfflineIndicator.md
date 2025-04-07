# OfflineIndicator Component

## Navigation

- [Component Documentation Home](./README.md)
- **Category**: [Utility Components](./README.md#utility-components)
- **Related Components**:
  - [ServiceWorkerUpdater](./ServiceWorkerUpdater.md) - Works alongside OfflineIndicator for network status
  - [ErrorBoundary](./ErrorBoundary.md) - Often handles errors during offline operation

## Overview

The OfflineIndicator component provides visual feedback to users about the application's current network status. It displays a non-intrusive indicator when the application is operating in offline mode, helping users understand why certain features might be unavailable and providing confidence that the application is still functioning despite lack of connectivity.

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
| `position` | `'top' \| 'bottom' \| 'inline'` | No | `'top'` | Position of the indicator |
| `message` | `string` | No | `'You are offline'` | Custom message to display |
| `showOnlineStatus` | `boolean` | No | `false` | Whether to show online status message |
| `onlineMessage` | `string` | No | `'Online'` | Message to show when online |
| `forceOffline` | `boolean` | No | `false` | Force offline state (for testing) |

## Types

```typescript
interface OfflineIndicatorProps {
  position?: 'top' | 'bottom' | 'inline';
  message?: string;
  showOnlineStatus?: boolean;
  onlineMessage?: string;
  forceOffline?: boolean;
}
```

## State Management

The OfflineIndicator component manages these state elements:

1. **Network status**: Tracks online/offline state
   ```typescript
   const [isOffline, setIsOffline] = useState<boolean>(
     forceOffline || (typeof navigator !== 'undefined' && !navigator.onLine)
   );
   ```

2. **Visibility state**: Controls the appearance/disappearance animation
   ```typescript
   const [isVisible, setIsVisible] = useState<boolean>(false);
   ```

3. **Animation state**: Manages transition animations
   ```typescript
   const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>(
     isOffline ? 'entering' : 'exited'
   );
   ```

The component uses these key effects:

1. **Network status monitoring**: Listens for browser online/offline events
   ```typescript
   useEffect(() => {
     const handleOnline = () => setIsOffline(false);
     const handleOffline = () => setIsOffline(true);
     
     window.addEventListener('online', handleOnline);
     window.addEventListener('offline', handleOffline);
     
     return () => {
       window.removeEventListener('online', handleOnline);
       window.removeEventListener('offline', handleOffline);
     };
   }, []);
   ```

2. **Animation management**: Controls animation timing
   ```typescript
   useEffect(() => {
     let timeout: NodeJS.Timeout;
     
     if (isOffline) {
       setIsVisible(true);
       timeout = setTimeout(() => setAnimationState('entered'), 10);
     } else if (isVisible) {
       setAnimationState('exiting');
       timeout = setTimeout(() => {
         setAnimationState('exited');
         setIsVisible(false);
       }, 300);
     }
     
     return () => {
       if (timeout) clearTimeout(timeout);
     };
   }, [isOffline, isVisible]);
   ```

## Theme Compatibility

The OfflineIndicator adapts to different themes:

- **Automatic color adaptation**: Uses CSS variables to adapt colors based on theme
- **Icon theming**: Icons adjust color based on the current theme
- **Contrast optimization**: Maintains readability in both light and dark themes
- **Background opacity**: Adjusts background opacity for different themes
- **Border styling**: Adapts border styles based on theme variables

## Mobile Responsiveness

The component is optimized for all screen sizes:

- **Responsive positioning**: Adapts position based on viewport size
- **Touch-friendly**: Suitable target size if interactive elements are included
- **Viewport awareness**: Adjusted size and positioning on small screens
- **Orientation handling**: Works in both portrait and landscape
- **Space efficiency**: Minimizes screen space usage, especially important on mobile

## Accessibility

- **ARIA live region**: Uses aria-live for announcing status changes
- **Status role**: Includes appropriate ARIA role for status messages
- **Focus management**: Manages focus appropriately if interactive
- **Color independence**: Conveys information through more than just color
- **Screen reader announcements**: Announces status changes to screen readers
- **Contrast ratios**: Ensures text is readable against background

## Example Usage

### Basic Usage

```tsx
import OfflineIndicator from '../components/OfflineIndicator';

function App() {
  return (
    <div className="app">
      <OfflineIndicator />
      {/* Rest of the application */}
    </div>
  );
}
```

### Custom Position and Message

```tsx
<OfflineIndicator
  position="bottom"
  message="No internet connection available. Some features may be limited."
/>
```

### Showing Online Status

```tsx
<OfflineIndicator
  showOnlineStatus={true}
  onlineMessage="Connection restored!"
/>
```

### For Testing

```tsx
// Force offline status for testing offline mode
<OfflineIndicator forceOffline={true} />
```

## Status Display Variations

The OfflineIndicator supports different display modes:

1. **Top banner**: Full-width notification at the top of the screen (default)
2. **Bottom banner**: Full-width notification at the bottom of the screen
3. **Inline**: In-place indicator that can be positioned anywhere in the layout

Each mode has appropriate styling and behavior based on the positioning context.

## Known Limitations

1. **Detection accuracy**: Relies on browser's online/offline events which may not always reflect true connectivity
2. **Connection quality**: Cannot detect slow or poor-quality connections
3. **Offline features**: Does not indicate which features remain available offline
4. **Multiple instances**: Not designed for multiple simultaneous instances
5. **Initial state**: May have brief flicker on initial load if offline

## Test Coverage

The OfflineIndicator component has comprehensive test coverage:

- **OfflineIndicator.test.tsx**: Basic rendering and functionality tests
- **OfflineIndicator.events.test.tsx**: Online/offline event handling tests
- **OfflineIndicator.animation.test.tsx**: Animation tests

Key tested scenarios include:
- Initial offline state detection
- Transition between online and offline states
- Event handler registration and cleanup
- Animation sequences
- Prop variations (position, messages)

## Related Components

- **ServiceWorkerUpdater**: Works alongside OfflineIndicator for offline capabilities
- **ErrorBoundary**: Often handles errors that might occur during offline operation
- **NetworkStatus**: More advanced network monitoring component (if implemented)

## Implementation Details

The OfflineIndicator uses CSS transitions for smooth state changes:

```css
.offlineIndicator {
  transition: transform 300ms ease-in-out, opacity 300ms ease-in-out;
  transform: translateY(-100%);
  opacity: 0;
}

.offlineIndicator.visible {
  transform: translateY(0);
  opacity: 1;
}
```

The component implements network event listeners with proper cleanup:

```typescript
useEffect(() => {
  const handleNetworkChange = () => {
    setIsOffline(!navigator.onLine);
  };
  
  window.addEventListener('online', handleNetworkChange);
  window.addEventListener('offline', handleNetworkChange);
  
  return () => {
    window.removeEventListener('online', handleNetworkChange);
    window.removeEventListener('offline', handleNetworkChange);
  };
}, []);
```

## Change History

- **2025-03-20**: Added animation improvements
- **2025-03-01**: Enhanced accessibility for status announcements
- **2025-02-15**: Added inline positioning option
- **2025-02-01**: Improved theme compatibility
- **2025-01-15**: Added configurable messaging
- **2025-01-01**: Initial implementation with basic offline detection

## Related Memory Logs

This component has been discussed in the following memory logs:

- [MRTMLY-015: Offline Indicator Layout and Test Optimization](../logged_memories/MRTMLY-015-offline-indicator-layout.md) - Layout improvements and testing

---

## Navigation

- [Back to Component Documentation Home](./README.md)
- **Previous Component**: [TimeDisplay](./TimeDisplay.md)
- **Next Component**: [ThemeToggle](./ThemeToggle.md)
