# ActivityButton Component

## Navigation

- [Component Documentation Home](./README.md)
- **Category**: [User Input Components](./README.md#user-input-components)
- **Related Components**:
  - [ActivityManager](./ActivityManager.md) - Parent component that manages activity state
  - [TimeDisplay](./TimeDisplay.md) - Used for formatting elapsed time

## Overview

The ActivityButton component provides an interactive button for controlling activity states in the application. It enables users to start, pause, and complete activities while displaying real-time status information. The component adapts its appearance based on the current activity state and supports both visual and functional changes according to the application context.

## Table of Contents
- [Features](#features)
- [Props](#props)
- [Types](#types)
- [State Management](#state-management)
- [Visual State Representations](#visual-state-representations)
- [Theme Compatibility](#theme-compatibility)
- [Mobile Responsiveness](#mobile-responsiveness)
- [Accessibility](#accessibility)
- [Example Usage](#example-usage)
- [Interaction Patterns](#interaction-patterns)
- [Known Limitations](#known-limitations)
- [Test Coverage](#test-coverage)
- [Related Components and Hooks](#related-components-and-hooks)
- [Implementation Details](#implementation-details)
- [Change History](#change-history)
- [Related Memory Logs](#related-memory-logs)

## Features

- **State-Based Rendering**: Adapts appearance based on activity state (pending, active, completed)
- **Real-Time Timer Display**: Shows elapsed time for active activities
- **Visual Status Indicators**: Color coding and icons for different states
- **Interaction Handling**: Manages clicks based on current state
- **Theme Compatibility**: Adapts to light and dark themes
- **Status Transitions**: Supports smooth visual transitions between activity states
- **Focus and Hover States**: Enhanced visual feedback for interactive elements
- **Accessibility Support**: Proper ARIA attributes and keyboard interactions

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `activity` | `Activity` | Yes | - | The activity this button controls |
| `isActive` | `boolean` | Yes | - | Whether this activity is currently active |
| `isCompleted` | `boolean` | Yes | - | Whether this activity has been completed |
| `elapsedTime` | `number` | No | `0` | Elapsed time in seconds (for active activities) |
| `onClick` | `() => void` | Yes | - | Callback function invoked when button is clicked |
| `disabled` | `boolean` | No | `false` | Whether the button is disabled |

## Types

```typescript
interface Activity {
  id: string;
  name: string;
  colorIndex: number;
  createdAt: string;
  isActive: boolean;
}

// Color sets are derived from colorIndex using getNextAvailableColorSet
// Colors are not stored directly on the Activity type

interface ActivityButtonProps {
  activity: Activity;
  isActive: boolean;
  isCompleted: boolean;
  elapsedTime?: number;
  onClick: () => void;
  disabled?: boolean;
}
```

## State Management

The ActivityButton is primarily controlled by its props, with minimal internal state:

1. **Button hover state**: Tracks mouse hover for enhanced visual feedback
   ```typescript
   const [isHovered, setIsHovered] = useState(false);
   ```

2. **Animation state**: Manages transition animations between states
   ```typescript
   const [isAnimating, setIsAnimating] = useState(false);
   ```

The component primarily responds to props changed from parent components and relies on the application's state management system for activity state tracking.

## Visual State Representations

The ActivityButton represents different activity states with distinct visual styles:

1. **Pending State**:
   - Neutral background color
   - Standard border
   - "Start" action text
   - Play icon
   - No timer display

2. **Active State**:
   - Vibrant background color based on activity's color
   - Animated border or pulse effect
   - "Active" status text
   - Timer display showing elapsed time
   - Pause icon

3. **Completed State**:
   - Muted background color
   - "Completed" status indicator
   - Checkmark icon
   - Final duration display
   - Disabled interaction or reset option

## Theme Compatibility

The ActivityButton adapts to light and dark themes:

- **Dynamic color palette**: Colors adjust based on theme mode
- **State-specific theming**: Each button state has theme-specific color variations
- **Contrast maintenance**: Text remains readable in all states across themes
- **Focus indicators**: Theme-appropriate focus styles
- **Icon adaptation**: Icons adjust color and opacity based on theme

## Mobile Responsiveness

The ActivityButton is designed for cross-device usability:

- **Touch-optimized**: Large touch target for mobile interaction
- **Responsive sizing**: Adapts size based on viewport
- **Simplified mobile view**: Prioritizes essential information on small screens
- **Touch feedback**: Enhanced visual feedback for touch interactions
- **Orientation handling**: Works in both portrait and landscape orientations

## Accessibility

- **ARIA attributes**: Uses aria-pressed for toggle behavior
- **State announcements**: Screen reader announcements for state changes
- **Keyboard operation**: Full keyboard support for interactions
- **Focus management**: Clear focus indicators that work with both mouse and keyboard
- **Color independence**: Critical information conveyed by more than just color
- **Reduced motion**: Respects user preference for reduced motion

## Example Usage

### Basic Usage

```tsx
import ActivityButton from '../components/ActivityButton';

// In your component
return (
  <ActivityButton
    activity={activity}
    isActive={currentActivityId === activity.id}
    isCompleted={completedActivityIds.includes(activity.id)}
    onClick={() => handleActivitySelect(activity)}
  />
);
```

### With Timer Display

```tsx
<ActivityButton
  activity={activity}
  isActive={currentActivityId === activity.id}
  isCompleted={completedActivityIds.includes(activity.id)}
  elapsedTime={1800} // 30 minutes
  onClick={() => handleActivitySelect(activity)}
/>
```

### Disabled State

```tsx
<ActivityButton
  activity={activity}
  isActive={currentActivityId === activity.id}
  isCompleted={completedActivityIds.includes(activity.id)}
  onClick={() => handleActivitySelect(activity)}
  disabled={isTimeUp}
/>
```

## Interaction Patterns

The ActivityButton implements these key interaction patterns:

1. **Click to start**: When in pending state, clicking starts the activity
2. **Click to pause/complete**: When active, clicking completes the activity
3. **Click to restart**: Optional pattern to restart a completed activity
4. **Hover feedback**: Visual enhancement when hovering over the button
5. **Focus handling**: Support for keyboard focus and navigation

## Known Limitations

1. **Multiple simultaneous activities**: Designed for single-activity-at-a-time workflow
2. **Animation performance**: Complex animations may affect performance on low-end devices
3. **Long activity names**: Very long activity names may be truncated
4. **State persistence**: Button state is not persisted across page refreshes without application state management
5. **Customization limits**: Limited ability to customize button appearance beyond provided props

## Test Coverage

The ActivityButton component has thorough test coverage:

- **ActivityButton.test.tsx**: Core functionality tests
- **ActivityButton.interactions.test.tsx**: User interaction tests
- **ActivityButton.states.test.tsx**: Visual state tests

Key tested scenarios include:
- Rendering in different states (pending, active, completed)
- Click handling and callback invocation
- Timer display formatting
- State transitions
- Disabled state behavior
- Keyboard accessibility

## Related Components and Hooks

- **ActivityManager**: Parent component that manages activity state
- **Timer**: Often used alongside ActivityButton for time tracking
- **useActivityState**: Hook that provides activity state management
- **useTimeDisplay**: Hook used for formatting elapsed time

## Implementation Details

The ActivityButton implements several key patterns:

1. **State-based rendering logic**:
   ```typescript
   const renderButtonContent = () => {
     if (isCompleted) {
       return <CompletedStateContent />;
     } else if (isActive) {
       return <ActiveStateContent elapsedTime={elapsedTime} />;
     } else {
       return <PendingStateContent />;
     }
   };
   ```

2. **Dynamic style computation**:
   ```typescript
   const buttonStyle = useMemo(() => {
     // Compute styles based on activity state, theme, and colors
     return {
       backgroundColor: isActive ? activity.colors.background : 'var(--background-muted)',
       color: isActive ? activity.colors.text : 'var(--foreground)',
       borderColor: isActive ? activity.colors.border : 'var(--border)'
     };
   }, [isActive, activity.colors]);
   ```

## Change History

- **2025-03-15**: Added animated state transitions
- **2025-03-01**: Enhanced accessibility support
- **2025-02-15**: Improved theme compatibility
- **2025-02-01**: Added real-time timer display
- **2025-01-15**: Added completed state visualization
- **2025-01-01**: Initial implementation with basic state toggling

## Related Memory Logs

// Add relevant memory logs if any exist

---

## Navigation

- [Back to Component Documentation Home](./README.md)
- **Previous Component**: [TimeSetup](./TimeSetup.md)
- **Next Component**: [ServiceWorkerUpdater](./ServiceWorkerUpdater.md)
