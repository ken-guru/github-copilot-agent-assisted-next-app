# ProgressBar Component

## Navigation

- [Component Documentation Home](./README.md)
- **Category**: [Visualization Components](./README.md#visualization-components)
- **Related Components**:
  - [Timeline](./Timeline.md) - Often used alongside ProgressBar
  - [ActivityManager](./ActivityManager.md) - Provides activity data
  - [TimeDisplay](./TimeDisplay.md) - Used for formatting time markers

## Overview

The ProgressBar component provides a visual representation of elapsed time against a total duration. It features smooth color transitions to indicate progress status, with colors shifting gradually from green to red as time elapses. The component is designed to be responsive and theme-compatible, offering clear visual feedback about the current progress of a timed session.

## Features

- **Color-Coded Progress Indication**: Visual color transitions as time progresses
- **Responsive Design**: Adapts layout for mobile and desktop viewports
- **Theme Compatibility**: Works seamlessly in both light and dark themes
- **Accessibility Support**: Includes proper ARIA attributes and meets contrast requirements
- **Time Markers**: Displays readable time points for reference
- **Smooth Animations**: Provides animated transitions when progress updates
- **Real-Time Updates**: Updates progress in real-time when timer is active
- **Conditional Visibility**: Can be conditionally displayed based on application state

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `entries` | `TimelineEntry[]` | Yes | - | Array of timeline entries to track |
| `totalDuration` | `number` | Yes | - | Total duration in seconds |
| `elapsedTime` | `number` | Yes | - | Elapsed time in seconds |
| `timerActive` | `boolean` | No | `false` | Whether the timer is currently active |

## State Management

The ProgressBar component manages several states internally:

1. **Progress percentage**: Calculated from elapsed time and total duration
   ```typescript
   const progressPercentage = Math.min(100, (elapsedTime / totalDuration) * 100);
   ```

2. **Current theme**: Tracks theme mode for proper color rendering
   ```typescript
   const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
     typeof window !== 'undefined' && isDarkMode() ? 'dark' : 'light'
   );
   ```

3. **Color transition**: Dynamically calculates colors based on progress
   ```typescript
   const progressColor = useMemo(() => {
     // Color calculation logic based on progress percentage
     return calculateProgressColor(progressPercentage, currentTheme);
   }, [progressPercentage, currentTheme]);
   ```

The component uses these key effects:

1. **Theme change detection**: Updates colors when the theme changes
2. **Timer effect**: For real-time progress updates when timer is active
3. **Entry analysis**: Processes timeline entries to compute activity presence and duration

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

The ProgressBar offers complete theme compatibility:

- **Dynamic color calculation**: Adjusts progress colors based on theme mode
- **Theme-specific gradients**: Different color gradients for light and dark themes
- **Contrast checking**: Ensures text remains readable in all progress states
- **Theme change listener**: Detects and responds to theme changes in real-time
- **System preference detection**: Responds to system dark mode preference changes

## Mobile Responsiveness

The ProgressBar is fully responsive:

- **Flexible width**: Adapts to container width on all screen sizes
- **Proportional sizing**: Maintains proper height-to-width ratio
- **Touch-friendly**: Ensures adequate size for touch interactions
- **Legible typography**: Text remains readable on small screens
- **Simplified mobile view**: Optionally shows simplified time markers on small screens

## Accessibility

- **ARIA attributes**: Uses `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` for screen readers
- **Progress role**: Properly identified as a progress indicator
- **Color independence**: Information conveyed by color is also available through text
- **Contrast ratios**: Maintains WCAG AA compliance for all text
- **Keyboard focus**: Supports standard focus behaviors
- **Screen reader descriptions**: Includes descriptive text for screen readers

## Example Usage

### Basic Usage

```tsx
import ProgressBar from '../components/ProgressBar';

// In your component
return (
  <ProgressBar
    entries={timelineEntries}
    totalDuration={3600}  // 1 hour in seconds
    elapsedTime={1800}    // 30 minutes elapsed
    timerActive={true}
  />
);
```

### With Inactive Timer

```tsx
<ProgressBar
  entries={timelineEntries}
  totalDuration={3600}
  elapsedTime={0}
  timerActive={false}
/>
```

## Known Limitations

1. **Small duration handling**: Very short durations (under 10 seconds) may not show visible progress increments
2. **High contrast mode**: May need additional adjustments for Windows high contrast mode
3. **Multiple activity visualization**: Currently optimized for sessions with a single active activity
4. **Animation performance**: May experience performance issues on low-end devices with frequent updates

## Test Coverage

The ProgressBar component has comprehensive test coverage:

- **ProgressBar.test.tsx**: Core functionality tests
- **ProgressBar.theme.test.tsx**: Theme compatibility tests

Key tested scenarios include:
- Rendering with different progress values
- Theme compatibility and color transitions
- Conditional visibility
- Time marker rendering
- Proper ARIA attribute population
- Element positioning and responsiveness

## Related Components

- **Timeline**: Often used alongside ProgressBar to show detailed activity breakdown
- **ActivityManager**: Provides activity data that ProgressBar visualizes
- **Summary**: Shows completion statistics after a session is finished

## Implementation Details

The progress bar uses CSS variables and gradients for smooth color transitions:

```css
.progressBar {
  background: linear-gradient(90deg, var(--progress-color) var(--progress), transparent var(--progress));
  transition: all 0.3s ease;
}
```

Time markers are calculated based on total duration, with appropriate intervals chosen automatically for readability.

## Change History

- **2025-04-10**: Enhanced theme compatibility (MRTMLY-036)
- **2025-03-25**: Fixed conditional visibility issues (MRTMLY-030) 
- **2025-03-01**: Improved element positioning (MRTMLY-028)
- **2025-02-15**: Added time marker auto-scaling
- **2025-01-20**: Initial implementation with basic progress visualization

## Related Memory Logs

This component has been discussed in the following memory logs:

- [MRTMLY-036: Progress Bar Theme Compatibility Testing](../logged_memories/MRTMLY-036-progress-bar-theme-testing.md) - Theme adaptation testing
- [MRTMLY-030: Progress Bar Conditional Visibility Fix](../logged_memories/MRTMLY-030-progress-bar-visibility.md) - Fixed visibility issues
- [MRTMLY-028: Progress Element Repositioning](../logged_memories/MRTMLY-028-progress-element-repositioning.md) - Layout improvements
- [MRTMLY-001: Progress Bar Mobile Layout Enhancement](../logged_memories/MRTMLY-001-progress-bar-mobile-layout.md) - Mobile responsiveness

---

## Navigation

- [Back to Component Documentation Home](./README.md)
- **Previous Component**: [Timeline](./Timeline.md)
- **Next Component**: [ActivityManager](./ActivityManager.md)