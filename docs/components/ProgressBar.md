# ProgressBar Component

## Navigation
- [Component Documentation Index](../README.md#components)
- Related: [App](./App.md), [OvertimeIndicator](./OvertimeIndicator.md)

## Overview
The ProgressBar component displays visual feedback about task completion progress. It adapts to different viewport sizes and provides enhanced visibility on mobile devices with touch support.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| elapsedTime | number | Yes | - | Time elapsed in seconds |
| totalDuration | number | Yes | - | Total duration in seconds |
| isActive | boolean | Yes | - | Whether the timer is active |
| className | string | No | '' | Additional CSS classes to apply |
| labelPosition | 'top' \| 'inside' \| 'none' | No | 'none' | Position for text labels |
| showPercentage | boolean | No | false | Whether to display percentage text |

## State Management

The component manages:
- `lastProgress`: Tracks the last significant progress value to detect changes
- `showFadingAnimation`: Controls when to show animation on percentage changes

The component updates the color and width based on the current progress percentage.

## Theme Compatibility

- Uses CSS variables for color management
- Adapts colors based on progress percentage (green → yellow → orange → red)
- Automatically adjusts for dark mode with brighter colors for better visibility
- Supports custom theme colors through CSS variables

## Mobile Responsiveness

- Increased height and border radius on mobile devices
- Larger text size for percentage display on touch devices
- Visual enhancements for better visibility on smaller screens
- Added animations for progress changes to draw attention
- Responsive margins and spacing

## Accessibility Considerations

- Uses proper ARIA attributes: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Includes descriptive `aria-label` for screen readers
- Animations disable with the `prefers-reduced-motion` media query
- Maintains sufficient color contrast at all progress levels
- Text overlaid on progress bar has text shadow for better legibility

## Test Coverage

The component has comprehensive test coverage for:
- Desktop and mobile rendering differences
- Touch device detection and adaptations
- Progress percentage calculation and display
- Color transitions at different progress thresholds
- Animation triggers and behavior
- Accessibility attribute verification

## Usage Examples

### Basic Usage
```tsx
<ProgressBar 
  elapsedTime={1800}
  totalDuration={3600}
  isActive={true}
/>
```

### With Percentage Display
```tsx
<ProgressBar 
  elapsedTime={1800}
  totalDuration={3600}
  isActive={true}
  showPercentage={true}
/>
```

### In a Mobile Layout
```tsx
<div className="progressContainer">
  <ProgressBar 
    elapsedTime={elapsedTime}
    totalDuration={totalDuration}
    isActive={timerActive}
    showPercentage={isMobile}
  />
</div>
```

### With Custom Styling
```tsx
<ProgressBar 
  elapsedTime={1800}
  totalDuration={3600}
  isActive={true}
  className="customProgressBar"
  labelPosition="top"
/>
```

## Known Limitations/Edge Cases

- Text percentage may have reduced visibility on narrow progress bars
- Color transitions might not be perfectly smooth on certain browsers
- Very short durations may cause the progress bar to change too quickly
- Animation performance might vary on low-end mobile devices
- Text shadow may not be sufficient for visibility in all custom theme colors

## Change History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2023-06-15 | Initial implementation with basic progress display |
| 1.1 | 2023-07-18 | Enhanced for mobile with improved visibility and animations |