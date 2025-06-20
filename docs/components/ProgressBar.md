# ProgressBar Component Documentation

## Navigation
- [Back to Component Documentation Index](../README.md#component-documentation)
- [Bootstrap Migration Guide](../bootstrap-component-mapping.md)

## Overview

The ProgressBar component displays activity progress visualization using Bootstrap's ProgressBar component. It shows a visual progress indicator with different color variants based on progress percentage, along with time markers and mobile-responsive layout.

## Migration Status

**Status:** ✅ **Migrated to Bootstrap**
- **From:** Custom CSS module implementation with HSL color interpolation
- **To:** react-bootstrap/ProgressBar with Bootstrap variants
- **Migration Date:** 2024-12-19
- **Commit:** `821dcc9` - "Migrate ProgressBar component to Bootstrap"

## API Reference

### Props

```typescript
interface ProgressBarProps {
  entries: TimelineEntry[];          // Timeline entries for context
  totalDuration: number;             // Total duration in seconds
  elapsedTime: number;               // Elapsed time in seconds
  timerActive?: boolean;             // Whether timer is currently active (default: false)
}
```

### Component Structure

```typescript
<div className="w-100">              // Bootstrap utility classes
  <ProgressBar 
    now={progressPercentage}         // 0-100 percentage
    variant={getVariant()}           // success|info|warning|danger
    style={{ height: '16px' }}       // Fixed height
    data-testid="bootstrap-progress-bar"
    aria-label="Progress towards total duration"
  />
  <div className="d-flex justify-content-between mt-2 px-1">
    <span>0:00</span>                // Time markers
    <span>{midpointTime}</span>
    <span>{totalTime}</span>
  </div>
</div>
```

## State Management

### Progress Calculation
- Progress percentage calculated as `(elapsedTime / totalDuration) * 100`
- Capped at 100% maximum
- Shows 0% when timer is inactive

### Variant Selection
The component uses Bootstrap variants based on progress:
- **success** (green): < 50% progress
- **info** (blue): 50% ≤ progress < 75%
- **warning** (yellow): 75% ≤ progress < 100%
- **danger** (red): ≥ 100% progress

### Mobile Responsiveness
- **Desktop:** Progress bar above, time markers below
- **Mobile (≤768px):** Time markers above, progress bar below
- Responsive layout using Bootstrap flexbox utilities

## Theme Compatibility

### Bootstrap Theme Integration
- Uses Bootstrap's default color system
- Automatically inherits theme colors from Bootstrap variables
- No custom CSS variables required
- Fully compatible with Bootstrap theme customization

### Accessibility
- Proper ARIA attributes: `aria-label`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Role attribute: `role="progressbar"`
- Semantic HTML structure
- Screen reader compatible

## Testing

### Test Coverage
- ✅ Basic rendering and DOM structure
- ✅ Progress percentage calculation and display
- ✅ Bootstrap variant selection for all ranges
- ✅ Mobile responsiveness
- ✅ Inactive state handling
- ✅ Accessibility attributes
- ✅ Edge cases (empty entries, zero duration)
- ✅ Progress capping at 100%

### Test Location
- **New Tests:** `src/components/__tests__/ProgressBar.bootstrap.test.tsx`
- **Backed Up:** Original tests moved to `.backup` files
- **Test Framework:** Jest + React Testing Library

## Usage Examples

### Basic Usage
```tsx
import ProgressBar from '@/components/ProgressBar';

function MyComponent() {
  const entries = [/* timeline entries */];
  const totalDuration = 3600; // 1 hour in seconds
  const elapsedTime = 1800;   // 30 minutes elapsed
  
  return (
    <ProgressBar
      entries={entries}
      totalDuration={totalDuration}
      elapsedTime={elapsedTime}
      timerActive={true}
    />
  );
}
```

### With Timer State
```tsx
function TimerDisplay() {
  const { elapsedTime, totalDuration, isActive, entries } = useTimerState();
  
  return (
    <ProgressBar
      entries={entries}
      totalDuration={totalDuration}
      elapsedTime={elapsedTime}
      timerActive={isActive}
    />
  );
}
```

## Performance Considerations

### Optimizations
- Memoized variant calculation prevents unnecessary re-renders
- Efficient time formatting using existing utility functions
- Minimal DOM updates through React's reconciliation

### Render Frequency
- Component re-renders on timer tick (typically every second)
- Progress calculation is lightweight (simple math operations)
- No expensive operations in render path

## Dependencies

### Internal Dependencies
- `@/types` - TimelineEntry interface
- `@/utils/time` - formatTimeHuman utility

### External Dependencies
- `react-bootstrap` - ProgressBar component
- `react` - useState, useEffect hooks

## Known Limitations

1. **Fixed Height:** Progress bar height is fixed at 16px (matches original design)
2. **Time Markers:** Always shows 3 time markers (start, middle, end)
3. **Variant System:** Limited to 4 Bootstrap variants (vs infinite custom colors)
4. **Mobile Breakpoint:** Fixed at 768px using window.matchMedia

## Migration Notes

### Breaking Changes from Original
- **Color System:** Switched from custom HSL interpolation to Bootstrap variants
- **CSS Classes:** All custom CSS classes replaced with Bootstrap utilities
- **Theme Variables:** No longer uses custom CSS properties

### Maintained Functionality
- ✅ Mobile responsive layout
- ✅ Time markers display
- ✅ Progress capping at 100%
- ✅ Inactive state styling
- ✅ Accessibility attributes
- ✅ Same component interface

## Future Enhancements

### Potential Improvements
1. **Custom Variant Colors:** Support for custom color schemes while maintaining Bootstrap structure
2. **Animation Options:** Optional progress animation/transitions
3. **Time Marker Customization:** Configurable time marker intervals
4. **Size Variants:** Support for different progress bar sizes (sm, lg)

### Bootstrap 6 Compatibility
- Component structure compatible with future Bootstrap versions
- Uses stable Bootstrap APIs
- Minimal changes expected for future Bootstrap updates

## Change History

| Date | Version | Changes |
|------|---------|---------|
| 2024-12-19 | 1.0.0 | ✅ Migrated to Bootstrap ProgressBar component |
|           |       | ✅ Added comprehensive test suite |
|           |       | ✅ Updated to use Bootstrap variants |
|           |       | ✅ Removed custom CSS module dependency |

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

- **2025-04-10**: Enhanced theme compatibility (MRTMLY-086)
- **2025-03-25**: Fixed conditional visibility issues (MRTMLY-024) 
- **2025-03-01**: Improved element positioning (MRTMLY-022)
- **2025-02-15**: Added time marker auto-scaling
- **2025-01-20**: Initial implementation with basic progress visualization

## Related Memory Logs

This component has been discussed in the following memory logs:

- [MRTMLY-086: Progress Bar Theme Compatibility Testing](../logged_memories/MRTMLY-086-progress-bar-theme-testing.md) - Theme adaptation testing
- [MRTMLY-024: Progress Bar Conditional Visibility Fix](../logged_memories/MRTMLY-110-progress-bar-visibility.md) - Fixed visibility issues
- [MRTMLY-022: Progress Element Repositioning](../logged_memories/MRTMLY-150-progress-element-repositioning.md) - Layout improvements
- [MRTMLY-001: Progress Bar Mobile Layout Enhancement](../logged_memories/MRTMLY-106-progress-bar-mobile-layout.md) - Mobile responsiveness

---

## Navigation

- [Back to Component Documentation Home](./README.md)
- **Previous Component**: [Timeline](./Timeline.md)
- **Next Component**: [ActivityManager](./ActivityManager.md)