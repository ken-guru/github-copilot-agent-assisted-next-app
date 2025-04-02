# ProgressBar Component

## Overview

The ProgressBar component provides a visual representation of elapsed time against a total duration. It features smooth color transitions to indicate progress status, with colors shifting gradually from green to red as time elapses.

## Features

- **Color-Coded Progress Indication**: Visual color transitions as time progresses
- **Responsive Design**: Adapts layout for mobile and desktop viewports
- **Theme Compatibility**: Works seamlessly in both light and dark themes
- **Accessibility Support**: Includes proper ARIA attributes and meets contrast requirements
- **Time Markers**: Displays readable time points for reference

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `entries` | `TimelineEntry[]` | Yes | - | Array of timeline entries to track |
| `totalDuration` | `number` | Yes | - | Total duration in seconds |
| `elapsedTime` | `number` | Yes | - | Elapsed time in seconds |
| `timerActive` | `boolean` | No | `false` | Whether the timer is currently active |

## Color Transition System

The ProgressBar uses a smooth HSL color interpolation system that transitions between key threshold points:

1. **Green Range (0% - 50%)**: 
   - Starts with a vibrant green (hue: 142)
   - Gradually shifts toward yellow as progress approaches 50%
   - Signifies "plenty of time remaining"

2. **Yellow Range (50% - 75%)**: 
   - Transitions from yellow (hue: 48) to orange
   - Signifies "moderate time remaining"

3. **Orange Range (75% - 90%)**:
   - Transitions from orange (hue: 25) toward red
   - Signifies "time is running short"
   
4. **Red Range (90% - 100%+)**:
   - Reaches full red (hue: 0) at 100%
   - Signifies "time limit reached or exceeded"

The color interpolation is based on the exact percentage of elapsed time, providing a smooth visual indication of progress.

## Theme Compatibility

The ProgressBar component is fully compatible with both light and dark themes:

- **Light Theme**: Colors appear bright against a light background
- **Dark Theme**: Colors are adjusted for appropriate contrast against dark backgrounds

All color contrasts meet WCAG AA accessibility standards (minimum 3:1 for non-text UI elements).

## Mobile Responsiveness

On mobile devices (viewport width <= 768px), the ProgressBar adjusts its layout:

- Time markers appear above the progress bar
- Compact layout for better mobile viewing
- Touch-friendly sizing

## Usage Example

```tsx
import ProgressBar from '../components/ProgressBar';

// In your component:
<ProgressBar
  entries={timelineEntries}
  totalDuration={3600} // 1 hour in seconds
  elapsedTime={1800}   // 30 minutes elapsed
  timerActive={true}   // Timer is running
/>
```

## Accessibility Considerations

- Progress bar includes appropriate `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes
- Color is not the only indicator of progress (width is the primary indicator)
- All color combinations meet minimum contrast requirements
- Time markers provide textual information about progress