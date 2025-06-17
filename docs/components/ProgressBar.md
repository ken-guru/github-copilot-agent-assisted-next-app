# ProgressBar Component

## Navigation

- [Component Documentation Home](./README.md)
- **Category**: [Visualization Components](./README.md#visualization-components)
- **Related Components**:
  - [Timeline](./Timeline.md) - Often used alongside ProgressBar
  - [ActivityManager](./ActivityManager.md) - Provides activity data
  - [TimeDisplay](./TimeDisplay.md) - Used for formatting time markers

## Overview

The ProgressBar component provides a visual representation of elapsed time against a total duration. It leverages Bootstrap's ProgressBar component to display progress with color-coded feedback. The component uses Bootstrap variants (success, warning, danger) to indicate progress status, making it intuitive for users to understand the current progress of a timed session.

## Table of Contents
- [Features](#features)
- [Props](#props)
- [Theme Compatibility](#theme-compatibility)
- [Mobile Responsiveness](#mobile-responsiveness)
- [Accessibility](#accessibility)
- [Example Usage](#example-usage)
- [Known Limitations](#known-limitations)
- [Test Coverage](#test-coverage)
- [Related Components](#related-components)
- [Implementation Details](#implementation-details)
- [Change History](#change-history)
- [Related Memory Logs](#related-memory-logs)

## Features

- **Color-Coded Progress Indication**: Visual color transitions using Bootstrap variants
- **Responsive Design**: Inherits Bootstrap's responsive behavior
- **Theme Compatibility**: Works seamlessly with Bootstrap's theme system
- **Accessibility Support**: Includes proper ARIA attributes via Bootstrap
- **Real-Time Updates**: Updates progress in real-time when timer is active
- **Semantic Color Feedback**: Uses success (green), warning (yellow), and danger (red) to convey progress state

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `totalDuration` | `number` | Yes | - | Total duration in seconds |
| `elapsedTime` | `number` | Yes | - | Elapsed time in seconds |

## Theme Compatibility

The ProgressBar component inherits Bootstrap's theme compatibility. It works seamlessly with both light and dark themes, adapting its appearance based on the theme context provided by Bootstrap.

## Mobile Responsiveness

The component is fully responsive, adapting its size appropriately across different screen sizes. This is achieved through Bootstrap's responsive design system.

## Accessibility

The ProgressBar component implements proper ARIA attributes to ensure accessibility:
- `role="progressbar"`: Identifies the element as a progress bar
- `aria-valuenow`: Indicates the current progress value
- `aria-valuemin="0"`: Sets the minimum value
- `aria-valuemax="100"`: Sets the maximum value
- Semantic color variants provide additional visual cues

## Example Usage

```tsx
import ProgressBar from '@/components/ProgressBar';

// In your component
<ProgressBar 
  totalDuration={3600} // 1 hour in seconds
  elapsedTime={1800}   // 30 minutes elapsed (50%)
/>
```

## Known Limitations

- Does not display time markers (unlike the previous version)
- Progress color transitions are step-based (using Bootstrap variants) rather than continuous gradient
- Bootstrap's default styles may need customization for specific design requirements

## Test Coverage

The ProgressBar component has comprehensive test coverage focusing on:
- Correct progress percentage calculation
- Proper variant selection based on progress thresholds
- Appropriate ARIA attributes for accessibility
- Handling edge cases (0% progress, >100% progress)

## Related Components

- **Timeline**: Often used alongside ProgressBar to show detailed activity breakdown
- **TimeDisplay**: Complements ProgressBar by showing precise time values
- **ActivityManager**: Parent component that often contains and controls ProgressBar

## Implementation Details

The ProgressBar component uses react-bootstrap's ProgressBar component for rendering. It calculates progress percentage and determines the appropriate Bootstrap variant based on thresholds:

- Less than 50%: `success` variant (green)
- Between 50% and 75%: `warning` variant (yellow/orange)
- 75% or more: `danger` variant (red)

## Change History

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-06-17 | 1.0.0 | Migration to Bootstrap | GitHub Copilot |
| 2024-10-15 | 0.2.0 | Added color transitions | Original Dev |
| 2024-09-01 | 0.1.0 | Initial implementation | Original Dev |

## Related Memory Logs

- [MRTMLY-218: ProgressBar Component to Bootstrap](../logged_memories/MRTMLY-218-ProgressBar-bootstrap-migration.md)
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