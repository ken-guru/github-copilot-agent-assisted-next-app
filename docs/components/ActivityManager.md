# ActivityManager Component

## Navigation
- [Component Documentation Index](../README.md#components)
- Related: 
  - [ActivityButton](./ActivityButton.md) - Controls activity states 
  - [ActivityForm](./ActivityForm.md) - Creates new activities

## Overview
The ActivityManager component manages the creation, selection, and removal of activities. It provides a touch-optimized interface on mobile devices with swipe actions, visual feedback, and properly sized touch targets.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| onActivitySelect | (activity: Activity \| null, justAdd?: boolean) => void | Yes | - | Callback for activity selection/start |
| onActivityRemove | (activityId: string) => void | No | - | Callback for activity removal |
| currentActivityId | string \| null | Yes | - | ID of current active activity |
| completedActivityIds | string[] | Yes | - | Array of completed activity IDs |
| timelineEntries | TimelineEntry[] | Yes | - | Activity timeline entries |
| isTimeUp | boolean | No | false | Whether allocated time is up |
| elapsedTime | number | No | 0 | Current elapsed time in seconds |

## State Management

The component manages several pieces of state:
- `activities`: List of activities with their properties
- `assignedColorIndices`: Tracks color assignments for visual distinction
- `hasInitializedActivities`: Flag to prevent duplicate initialization
- `swipeState`: Tracks touch gesture states for mobile swipe actions

## Theme Compatibility

- Uses theme variables for colors via CSS variables
- Adapts to both light and dark themes
- Maintains consistent look and feel across themes
- Detects theme changes and updates colors automatically

## Mobile Responsiveness

The component implements several mobile-specific enhancements:
- **Swipe Gestures**: Left-swipe reveals action buttons for complete/delete
- **Touch Feedback**: Visual ripple effect provides tactile feedback
- **Optimized Layout**: Larger touch targets and improved spacing
- **Smooth Scrolling**: iOS-friendly scrolling with momentum
- **Visual Hierarchy**: Enhanced typography and spacing for small screens

## Accessibility Considerations

- All interactive elements have appropriate ARIA labels
- Respects user motion preferences with `prefers-reduced-motion`
- Maintains keyboard navigation for non-touch devices
- Clear visual indication of activity states
- Sufficient color contrast for text and interactive elements
- Focus management for swipe actions

## Test Coverage

The component has comprehensive test coverage:
- Standard functionality tests
- Mobile-specific enhancements tests
- Touch gesture simulation
- Swipe action tests
- Visual feedback verification
- Responsive behavior across different viewports

## Usage Examples

### Basic Usage
```tsx
<ActivityManager
  onActivitySelect={handleActivitySelect}
  onActivityRemove={handleActivityRemove}
  currentActivityId={currentActivity?.id || null}
  completedActivityIds={completedActivities.map(a => a.id)}
  timelineEntries={timelineEntries}
  elapsedTime={elapsedTime}
/>
```

### With Time-Up State
```tsx
<ActivityManager
  onActivitySelect={handleActivitySelect}
  onActivityRemove={handleActivityRemove}
  currentActivityId={currentActivity?.id || null}
  completedActivityIds={completedActivities.map(a => a.id)}
  timelineEntries={timelineEntries}
  isTimeUp={timeRemaining <= 0}
  elapsedTime={elapsedTime}
/>
```

### Mobile-Optimized Interface
The mobile interface automatically activates on touch-capable devices with small screens:
- Activities can be swiped left to reveal action buttons
- Touch feedback provides visual confirmation of interaction
- Larger touch targets improve usability on small screens

## Known Limitations/Edge Cases

- Swipe gestures may conflict with certain browser navigation gestures
- Performance may vary on lower-end mobile devices with many activities
- Custom scrolling behavior might feel different from native scrolling on some devices
- Very long activity names may need truncation on small screens
- Touch event handling does not currently support multi-touch interactions

## Implementation Details

### Swipe Gesture Implementation
```typescript
// Track touch positions and calculate swipe distance
const handleTouchMove = (e: React.TouchEvent) => {
  if (!swipeState.isSwiping) return;
  
  setSwipeState({
    ...swipeState,
    currentX: e.touches[0].clientX,
  });
};

// Apply transformation based on swipe distance
const getSwipeTransform = (activityId: string) => {
  if (swipeState.activityId !== activityId || !swipeState.isSwiping) return {};
  
  const delta = swipeState.startX - swipeState.currentX;
  const maxSwipe = 150; // Maximum swipe distance
  
  // Limit swipe distance
  const swipeX = Math.max(0, Math.min(delta, maxSwipe));
  
  return {
    transform: `translateX(-${swipeX}px)`,
  };
};
```

## Change History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2023-06-01 | Initial implementation |
| 1.1 | 2023-07-20 | Mobile optimization with touch gestures and feedback |
