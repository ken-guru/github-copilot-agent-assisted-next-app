# Timeline Component

## Navigation
- [Component Documentation Index](../README.md#components)
- Related: [App](./App.md), [ActivityManager](./ActivityManager.md)

## Overview
The Timeline component visualizes activity entries along a time axis, showing the progression of tasks and breaks. It adapts to different viewport sizes with enhanced mobile features for touch interactions.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| entries | TimelineEntry[] | Yes | - | Array of timeline entries to display |
| totalDuration | number | Yes | - | Total planned duration in seconds |
| elapsedTime | number | Yes | - | Current elapsed time in seconds |
| timerActive | boolean | No | false | Whether the timer is currently active |
| isTimeUp | boolean | No | false | Whether the planned time is up |
| allActivitiesCompleted | boolean | No | false | Whether all activities are completed |

## State Management

The component manages several pieces of state:
- Current elapsed time for animation purposes
- Overtime detection based on elapsed time vs. total duration
- Pinch zoom state for mobile view manipulation
- Selected entry for detailed mobile view
- Zoom scale for mobile visibility adjustments
- Zoom controls visibility state

## Theme Compatibility

- Adapts to light and dark themes automatically
- Uses theme-specific colors for better visibility 
- Break visualizations adapt to contrast needs in both themes
- Uses CSS variables for consistent theming

## Mobile Responsiveness

The component implements comprehensive mobile optimizations:
- **Pinch-to-zoom**: Allows users to zoom in/out of the timeline with touch gestures
- **Touch Controls**: Dedicated zoom buttons for precise control
- **Detailed View**: Touch any entry to see full details in an overlay
- **Optimized Layout**: Larger touch targets and mobile-specific styling
- **Compact Text**: Simplified time markers and labels for small screens
- **Centered Indicator**: Current time indicator positioned for better visibility

## Accessibility Considerations

- Time markers are clearly labeled for screen readers
- Interactive elements have proper ARIA attributes
- Touch targets exceed WCAG minimum size requirements
- Animation respects reduced motion preferences
- Color contrast meets WCAG AA standards
- Mobile detail view preserves all information in an accessible format

## Test Coverage

The component has comprehensive test coverage including:
- Basic timeline rendering with entries
- Overtime state handling
- Time marker calculation and placement
- Current time indicator positioning
- Mobile-specific features and adaptations
- Touch gesture simulation
- Zoom control functionality
- Detail view overlay interaction

## Usage Examples

### Basic Usage
```tsx
<Timeline 
  entries={timelineEntries}
  totalDuration={1800}     // 30 minutes in seconds
  elapsedTime={900}        // 15 minutes elapsed
  timerActive={true}
/>
```

### With Overtime Handling
```tsx
<Timeline 
  entries={entries}
  totalDuration={1800}     // 30 minutes in seconds
  elapsedTime={2400}       // 40 minutes in seconds (10 minutes overtime)
  timerActive={true}
  isTimeUp={true}
/>
```

### Mobile Touch-Optimized
The mobile features are automatically enabled on touch devices with small screens:
- Pinch gestures for zooming
- Tap entries to see detailed information
- Zoom control buttons for precise adjustments

## Mobile Implementation Details

### Pinch Zoom Gesture Handling
```typescript
// Calculate new distance between touch points during pinch
const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
  if (!pinchState.isPinching || e.touches.length !== 2) return;
  
  // Calculate new distance between touch points
  const touch1 = e.touches[0];
  const touch2 = e.touches[1];
  const currentDistance = Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  );
  
  // Calculate new scale based on distance change
  const newScale = Math.min(
    Math.max(
      pinchState.scale * (currentDistance / pinchState.initialDistance),
      0.5
    ), 
    3
  );
  
  setZoomScale(newScale);
};
```

## Known Limitations/Edge Cases

- Very dense timelines (many short activities) may be difficult to interact with on small screens
- Pinch zoom may interfere with native browser zoom on some mobile browsers
- Maximum zoom level is limited to prevent excessive scaling
- Long activity names will be truncated on small screens
- Performance may vary on lower-end mobile devices with many timeline entries

## Change History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2023-06-01 | Initial implementation |
| 1.1 | 2023-07-21 | Added mobile optimizations and touch interactions |
