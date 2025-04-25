# Overtime Indicator Component

## Navigation
- [Component Documentation Index](../README.md#components)
- Related: [TimeCounter](./TimeCounter.md), [Progress](./Progress.md)

## Overview
The OvertimeIndicator component provides visual feedback to users when they've exceeded their allocated time for activities. It displays how much overtime has been used with a pulsing animation to draw attention. On mobile devices, it features enhanced visibility and haptic feedback.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| isOvertime | boolean | Yes | - | Flag indicating if the user is in overtime state |
| overtimeDuration | number | Yes | - | Duration of overtime in seconds |

## State Management

The component has minimal internal state:
- `visible`: Controls the visibility with a fade-out effect when overtime ends
- `wasOvertimeBefore`: Ref to track state transitions for haptic feedback

## Theme Compatibility

- Uses theme variables for colors via CSS variables
- Adapts to both light and dark modes using `--color-error` and `--color-text-inverse`
- Falls back to default colors if theme variables are not defined
- Enhanced visibility on mobile with stronger shadow effects

## Mobile Responsiveness

- Adapts layout between vertical (mobile) and horizontal (desktop) arrangements
- Uses increased font size and padding on mobile devices
- Provides banner-style layout on mobile for maximum visibility
- Includes haptic feedback when entering overtime on supported devices
- Features more intense animation on mobile for better visibility
- Uses sticky positioning to stay visible while scrolling

## Accessibility Considerations

- Uses `aria-live="polite"` to announce overtime status changes to screen readers
- Includes `role="alert"` for important time notifications
- High contrast colors for better visibility
- Animation is disabled for users with reduced motion preference
- Meaningful text labels for screen readers
- Does not rely solely on haptic feedback or animation to convey information

## Test Coverage

The component has 100% test coverage including:
- Visibility based on overtime state
- Correct formatting of time duration
- Presence of animation classes
- Mobile-specific styling and behavior
- Haptic feedback triggering
- Fallback behavior when vibration API is not available
- Various duration formats (minutes, hours)

## Usage Examples

### Basic Usage
```tsx
<OvertimeIndicator 
  isOvertime={true} 
  overtimeDuration={120} // 2 minutes in seconds
/>
```

### Integration with TimeCounter
```tsx
<div className="timeDisplay">
  <TimeCounter 
    timeRemaining={timeRemaining} 
    isRunning={isRunning} 
  />
  {timeRemaining < 0 && (
    <OvertimeIndicator 
      isOvertime={true} 
      overtimeDuration={Math.abs(timeRemaining)} 
    />
  )}
</div>
```

### Banner Style Integration
```tsx
{isOvertime && (
  <OvertimeIndicator 
    isOvertime={true} 
    overtimeDuration={overtimeDuration} 
  />
)}
<div className="mainContent">
  {/* Main app content */}
</div>
```

## Known Limitations/Edge Cases

- Animation might be too subtle on some low-contrast displays
- Very large overtime values (>24 hours) are still displayed but might become less readable
- Transition effects are disabled in reduced motion preference mode
- Requires CSS variables for theming; falls back to default colors if not available
- Haptic feedback requires browser and device support (not available in all browsers)
- Banner style may overlap with other fixed-position elements in certain layouts

## Change History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2023-07-10 | Initial implementation with basic overtime display |
| 1.1 | 2023-07-15 | Enhanced for mobile with haptic feedback and improved visibility |
