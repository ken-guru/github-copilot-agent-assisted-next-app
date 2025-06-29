# Timeline Component

## Navigation

- [Component Documentation Home](./README.md)
- **Category**: [Visualization Components](./README.md#visualization-components)
- **Related Components**:
  - [ProgressBar](./ProgressBar.md) - Often used alongside Timeline
  - [Summary](./Summary.md) - Uses same timeline entries data
  - [ActivityManager](./ActivityManager.md) - Provides activity data for visualization
  - [TimeDisplay](./TimeDisplay.md) - Used for time formatting

## Overview

The Timeline component provides a visual representation of activities and the time between them (breaks). It features a time ruler with appropriate time intervals, activity blocks with duration information, and specialized handling for breaks and overtime scenarios. The component is designed to update in real-time and adapt to different theme modes.

**Bootstrap Integration**: This component has been migrated to use Bootstrap's layout system, typography utilities, and components while preserving the specialized timeline visualization. It uses a hybrid approach combining Bootstrap's layout components (Container, Card, Row, Col) with custom CSS for timeline-specific functionality.

## Table of Contents
- [Props](#props)
- [Types](#types)
- [Features](#features)
- [Theme Compatibility](#theme-compatibility)
- [Mobile Responsiveness](#mobile-responsiveness)
- [Accessibility](#accessibility)
- [Example Usage](#example-usage)
- [Known Limitations](#known-limitations)
- [Test Coverage](#test-coverage)
- [Related Components and Hooks](#related-components-and-hooks)
- [Implementation Details](#implementation-details)
- [Change History](#change-history)
- [Related Memory Logs](#related-memory-logs)

## Features

- **Bootstrap layout integration** with Container, Card, Row, and Col components
- **Hybrid design approach** combining Bootstrap utilities with custom timeline visualization
- **Time-based visualization** of activities and breaks
- **Real-time updates** for ongoing activities and breaks
- **Automatic time interval calculation** based on total duration
- **Theme compatibility** with automatic light/dark mode detection
- **Overtime visualization** with specialized UI indicators and Bootstrap Alert components
- **Dynamic break visualization** that updates in real-time
- **Responsive design** using Bootstrap grid system for mobile and desktop viewports
- **Bootstrap Badge integration** for time display with variant support
- **Enhanced accessibility** with proper ARIA attributes and semantic structure

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `entries` | `TimelineEntry[]` | Yes | - | Array of timeline entries to visualize |
| `totalDuration` | `number` | Yes | - | Total duration in seconds for the timeline |
| `elapsedTime` | `number` | Yes | - | Current elapsed time in seconds |
| `isTimeUp` | `boolean` | No | `false` | Flag indicating if time is up |
| `timerActive` | `boolean` | No | `false` | Flag indicating if timer is active |
| `allActivitiesCompleted` | `boolean` | No | `false` | Flag indicating if all activities are completed |

## Types

```typescript
interface TimelineEntry {
  id: string;
  activityId: string | null;
  activityName: string | null;
  startTime: number;
  endTime?: number | null;
  colors?: {
    background: string;
    text: string;
    border: string;
  };
}
```

## State Management

The Timeline component manages several pieces of state:

1. **Current elapsed time**: Updates in real-time when the timer is active
   ```typescript
   const [currentElapsedTime, setCurrentElapsedTime] = useState(initialElapsedTime);
   ```

2. **Current theme**: Tracks the current theme mode for proper color rendering
   ```typescript
   const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
     typeof window !== 'undefined' && isDarkMode() ? 'dark' : 'light'
   );
   ```

3. **Time intervals**: Calculated based on the total duration using the `calculateTimeIntervals` helper function
   ```typescript
   const { interval, count } = calculateTimeIntervals(effectiveDuration);
   ```

4. **Time markers**: Generated for the time ruler based on the calculated time intervals
   ```typescript
   const timeMarkers = useMemo(() => {
     // Calculation logic for time markers
   }, [effectiveDuration, totalDuration]);
   ```

The component uses these key effects:

1. **Theme change detection**: Updates colors when the theme changes
2. **Timer effect**: Updates elapsed time in real-time for active timers
3. **Initial prop sync**: Synchronizes internal state with external props

## Theme Compatibility

The Timeline component fully supports both light and dark themes:

- **Automatic theme detection**: Uses `isDarkMode()` utility to detect system or user preference
- **Theme change detection**: Listens for system preference changes and manual theme switches
- **Theme-specific colors**: Adapts activity colors based on the current theme
- **MutationObserver**: Watches for class changes on the document element to detect theme changes
- **Color transformation**: Adjusts activity colors' hue and saturation for better contrast in different themes

## Mobile Responsiveness

The Timeline component is designed to be fully responsive:

- **Flexible layout**: Uses flex layout to adapt to various screen sizes
- **Reduced spacing**: Applies smaller padding and gaps on mobile viewports
- **Minimum heights**: Ensures visibility of very small time spans on small screens
- **Text wrapping**: Activity names wrap properly on narrow screens
- **Touch-friendly**: Larger touch targets for mobile interaction

## Accessibility

- **Semantic HTML**: Uses appropriate heading levels and semantic markup
- **Color contrast**: Ensures readable text with proper contrast ratios
- **Meaningful labels**: Provides descriptive text for time markers and breaks
- **Screen reader support**: Activities and breaks include appropriate text content
- **Keyboard focus**: Supports standard focus behaviors for interactive elements
- **ARIA attributes**: Includes data-testid attributes for testing but should be enhanced with aria-* attributes

## Example Usage

### Bootstrap Usage Example

```tsx
import Timeline from '../components/Timeline';
import { Container } from 'react-bootstrap';

// Timeline now uses Bootstrap components internally
const timelineEntries = [
  {
    id: '1',
    activityId: 'activity-1',
    activityName: 'Complete project outline',
    startTime: Date.now() - 1800000,
    endTime: Date.now() - 900000,
    colors: {
      background: '#E8F5E9',
      text: '#1B5E20',
      border: '#2E7D32'
    }
  }
];

return (
  <Timeline 
    entries={timelineEntries}
    totalDuration={3600}  // 1 hour in seconds
    elapsedTime={1800}    // 30 minutes in seconds
    timerActive={true}
  />
);
```

### With Bootstrap Alert for Overtime

```tsx
<Timeline 
  entries={entries}
  totalDuration={1800}     // 30 minutes in seconds
  elapsedTime={2400}       // 40 minutes in seconds (10 minutes overtime)
  timerActive={true}
  isTimeUp={true}          // Triggers Bootstrap Alert for overtime warning
/>
```

## Known Limitations

1. **Performance with many entries**: May experience performance issues with a very large number of timeline entries (50+)
2. **Long-running timers**: Can experience slight timer drift in sessions exceeding 8 hours
3. **Time marker density**: Very short total durations may result in overlapping time markers
4. **Dynamic height calculation**: Very small activities may not render proportionally to their actual duration due to minimum height constraints

## Bootstrap Integration

### Layout Components Used
- **Container**: `Container` with fluid layout and responsive padding (`container-fluid`, `p-3`)
- **Card**: Primary wrapper with header and body sections (`card`, `card-header`, `card-body`, `border`)
- **Row/Col**: Grid system for header layout and responsive design (`row`, `g-3`, `col`, `col-auto`)
- **Badge**: Time display with variant support (`badge-primary`, `badge-danger`, `text-nowrap`)
- **Alert**: Overtime warning with proper accessibility (`alert-danger`, `role="alert"`)

### Bootstrap Classes Applied
- **Layout**: `container-fluid`, `p-3`, `row`, `g-3`, `col`, `col-auto`
- **Typography**: `h2`, `mb-0`, `fw-medium`, `small`, `text-muted`, `text-nowrap`, `fst-italic`, `text-center`
- **Flex**: `d-flex`, `justify-content-between`, `align-items-center`, `flex-column`
- **Position**: `position-relative`, `position-absolute`
- **Border**: `border`, `rounded`
- **Accessibility**: `role`, `aria-label`, `aria-level`

### Hybrid Design Approach
The Timeline component uses Bootstrap for layout, typography, and standard UI elements while preserving custom CSS for timeline-specific visualization including:
- Timeline ruler with time markers
- Activity entry positioning and sizing
- Overtime section background highlighting
- Custom time guides and dividers
- Theme-aware color management

## Test Coverage

The Timeline component has extensive test coverage across multiple test files:

### Bootstrap Integration Tests (35 tests)
- **Layout Structure**: Container, Row, Col grid system validation
- **Card Integration**: Card, Card.Header, Card.Body component usage
- **Typography**: Bootstrap heading classes, text utilities, font utilities
- **Badge Integration**: Time display with proper variants (primary/danger)
- **Alert Integration**: Overtime warnings with accessibility
- **Responsive Design**: Mobile layout, spacing utilities, gap utilities
- **Flex Utilities**: Header layout, timeline entries, responsive behavior
- **Position Utilities**: Timeline elements, marker positioning
- **Border Utilities**: Container and entry styling
- **Accessibility**: ARIA attributes, semantic structure, alert roles
- **Custom Preservation**: Timeline visualization, overtime features, marker functionality

### Existing Functionality Tests (31 tests)
- **Timeline.render.test.tsx**: Basic rendering tests
- **Timeline.test.tsx**: Core functionality tests
- **Timeline.breaks.test.tsx**: Tests for break visualization

Key tested scenarios include:
- Rendering timeline with entries
- Empty state handling
- Break visualization and real-time updates
- Overtime visualization
- Theme compatibility
- Time marker generation
- Time span calculations

## Related Components and Hooks

- **ProgressBar**: Often used alongside Timeline to show overall progress
- **Summary**: Uses the same timeline entries for generating summary statistics
- **ActivityManager**: Provides activity data that Timeline visualizes
- **useTimelineEntries**: Hook that provides timeline entries used by this component
- **calculateTimeSpans**: Utility function that calculates the visual representation of timeline spans

## Implementation Details

The Timeline uses several helper functions:

1. `calculateTimeIntervals`: Determines appropriate time intervals based on total duration
2. `getThemeAppropriateColor`: Adjusts colors based on the current theme
3. `calculateEntryStyle`: Generates the CSS styles for timeline entries

The component architecture:
- Time header with countdown/timer display
- Timeline ruler with appropriate time markers
- Entries container with activities and breaks
- Visual indicators for overtime scenarios

## Change History

- **2025-03-15**: **Bootstrap Migration (v2.0.0)** - Migrated to Bootstrap layout system while preserving custom timeline visualization
  - Added Container, Card, Row, Col components for layout
  - Integrated Badge component for time display with variants
  - Added Alert component for overtime warnings
  - Applied Bootstrap typography and utility classes
  - Created 35 comprehensive Bootstrap integration tests
  - Maintained all existing functionality (66 total tests passing)
  - Updated documentation for hybrid Bootstrap approach
- **2025-03-15**: Fixed memory leak issues and timer cleanup (MRTMLY-147)
- **2025-03-15**: Implemented countdown timer fix (MRTMLY-020)
- **2025-02-20**: Added real-time break visualization (MRTMLY-013)
- **2025-02-15**: Added overtime visualization
- **2025-02-01**: Implemented theme compatibility
- **2025-01-15**: Initial implementation with basic timeline functionality

## Related Memory Logs

This component has been discussed in the following memory logs:

- [MRTMLY-013: Timeline Break Visualization Fix](../logged_memories/MRTMLY-146-timeline-break-visualization.md) - Fixed issues with break visualization
- [MRTMLY-014: Timeline Component Memory Leak](../logged_memories/MRTMLY-147-timeline-memory-leak.md) - Resolved memory leak issues
- [MRTMLY-015: Timeline Test Suite Memory Leak](../logged_memories/MRTMLY-083-timeline-test-suite-memory-leak.md) - Fixed test suite-specific issues
- [MRTMLY-017: Timeline Calculation Test Update](../logged_memories/MRTMLY-085-timeline-calculation-test.md) - Updated calculation logic tests

---

## Navigation

- [Back to Component Documentation Home](./README.md)
- **Previous Component**: [ErrorBoundary](./ErrorBoundary.md)
- **Next Component**: [ProgressBar](./ProgressBar.md)
