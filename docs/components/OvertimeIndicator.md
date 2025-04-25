# Overtime Indicator Component

## Navigation
- [Component Documentation Index](../README.md#components)
- Related: [TimeCounter](./TimeCounter.md), [Progress](./Progress.md)

## Overview
The OvertimeIndicator component provides visual feedback to users when they've exceeded their allocated time for activities. It displays how much overtime has been used with a pulsing animation to draw attention.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| isOvertime | boolean | Yes | - | Flag indicating if the user is in overtime state |
| overtimeDuration | number | Yes | - | Duration of overtime in seconds |

## State Management

The component has minimal internal state:
- `visible`: Controls the visibility with a fade-out effect when overtime ends

## Theme Compatibility

- Uses theme variables for colors via CSS variables
- Adapts to both light and dark modes using `--color-error` and `--color-text-inverse`
- Falls back to default colors if theme variables are not defined

## Mobile Responsiveness

- Adapts layout between vertical (mobile) and horizontal (desktop) arrangements
- Uses appropriate font sizes for different viewport sizes
- Touch-friendly size and spacing

## Accessibility Considerations

- Uses `aria-live="polite"` to announce overtime status changes to screen readers
- High contrast colors for better visibility
- Animation is disabled for users with reduced motion preference
- Meaningful text labels for screen readers

## Test Coverage

The component has 100% test coverage including:
- Visibility based on overtime state
- Correct formatting of time duration
- Presence of animation classes
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

## Known Limitations/Edge Cases

- Animation might be too subtle on some low-contrast displays
- Very large overtime values (>24 hours) are still displayed but might become less readable
- Transition effects are disabled in reduced motion preference mode
- Requires CSS variables for theming; falls back to default colors if not available

## Change History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2023-07-10 | Initial implementation with basic overtime display |
