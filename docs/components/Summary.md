# Summary Component

## Navigation

- [Component Documentation Home](./README.md)
- **Category**: [State Management Components](./README.md#state-management-components)
- **Related Components**:
  - [Timeline](./Timeline.md) - Provides timeline entries used by Summary
  - [ActivityManager](./ActivityManager.md) - Manages activities shown in Summary
  - [TimeDisplay](./TimeDisplay.md) - Used for formatting time values

## Overview

The Summary component provides a comprehensive overview of a completed activity session. It displays statistics about time usage, visualizes activity durations, and presents relevant status messages. The component processes timeline entries to calculate metrics such as planned time, spent time, idle time, and overtime, offering users insight into their time management.

## Table of Contents
- [Features](#features)
- [Props](#props)
- [Types](#types)
- [State Management](#state-management)
- [Calculation Logic](#calculation-logic)
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

- **Session Statistics**: Displays key time metrics for the session
- **Activity Breakdown**: Shows time spent on each activity
- **Status Messages**: Provides contextual feedback based on session outcome
- **Chronological Ordering**: Activities displayed in order of first appearance
- **Theme Compatibility**: Adapts to light and dark themes
- **Automatic Calculations**: Computes idle time, overtime, and other metrics
- **Conditional Display**: Only shows when session is completed or time is up
- **Visual Color Coding**: Activities maintain their assigned colors for consistency

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `entries` | `TimelineEntry[]` | No | `[]` | Array of timeline entries to analyze |
| `totalDuration` | `number` | Yes | - | Planned total duration in seconds |
| `elapsedTime` | `number` | Yes | - | Actual elapsed time in seconds |
| `timerActive` | `boolean` | No | `false` | Whether timer is still active |
| `allActivitiesCompleted` | `boolean` | No | `false` | Whether all activities are completed |
| `isTimeUp` | `boolean` | No | `false` | Whether allocated time is up |

## State Management

The Summary component manages theme state internally:

```typescript
const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
  typeof window !== 'undefined' && isDarkMode() ? 'dark' : 'light'
);
```

The component primarily performs calculations based on props rather than managing complex internal state. Key calculations include:

1. **Status message determination**: 
   ```typescript
   const getStatusMessage = () => {
     if (isTimeUp) {
       return {
         message: "Time's up! Review your completed activities below.",
         className: styles.statusMessageLate
       };
     }
     
     // Additional status logic based on time remaining and completion state
   };
   ```

2. **Activity statistics calculation**:
   ```typescript
   const calculateActivityStats = () => {
     // Calculate idle time, active time, and other metrics
   };
   ```

3. **Overtime calculation**:
   ```typescript
   const calculateOvertime = () => {
     return Math.max(0, elapsedTime - totalDuration);
   };
   ```

4. **Activity time calculation and ordering**:
   ```typescript
   const calculateActivityTimes = () => {
     // Calculate duration for each activity and maintain chronological order
   };
   ```

## Theme Compatibility

The Summary component fully supports both light and dark themes:

- **Theme detection**: Uses isDarkMode utility to detect current theme
- **Dynamic color adaptation**: Adjusts activity colors based on theme
- **MutationObserver**: Watches for theme class changes on document element
- **System preference detection**: Listens for system dark mode preference changes
- **Theme-appropriate colors**: Uses a specialized getThemeAppropriateColor function to find the best matching color set for each activity based on the current theme

## Activity Ordering Logic

The Summary component implements specific ordering logic for activities:

1. **Chronological ordering**: Activities are displayed in the order they first appeared in the timeline
2. **Order preservation**: The order is maintained even when activities occur multiple times
3. **Processing steps**:
   - Sort timeline entries chronologically by startTime
   - Track first appearance of each activity ID
   - Maintain an ordered list while calculating total durations
   - Generate final activity times list in chronological order

This ensures that the summary view maintains a natural flow that matches the user's experience during the session.

## Mobile Responsiveness

The Summary component is designed to be fully responsive:

- **Grid layout**: Uses CSS Grid for adaptive layouts on different screen sizes
- **Responsive typography**: Text sizes adjust appropriately for small screens
- **Flexible card sizing**: Stat cards and activity items adapt to available space
- **Vertical stacking**: Elements stack vertically on narrow screens
- **Touch-friendly targets**: Sufficient size for interactive elements on mobile

## Accessibility

- **Semantic HTML**: Uses appropriate heading levels and semantic elements
- **Color contrast**: Ensures sufficient contrast for status messages and text
- **Screen reader support**: Important statistics have descriptive text
- **ARIA attributes**: Uses appropriate attributes for interactive elements
- **Keyboard navigation**: Supports standard focus behaviors
- **Focus indicators**: Visible focus indicators for interactive elements

## Example Usage

### Basic Usage

```tsx
import Summary from '../components/Summary';

// In your component
return (
  <Summary
    entries={timelineEntries}
    totalDuration={3600}  // 1 hour in seconds
    elapsedTime={3540}    // 59 minutes in seconds
    allActivitiesCompleted={true}
  />
);
```

### With Time-Up State

```tsx
<Summary
  entries={timelineEntries}
  totalDuration={3600}
  elapsedTime={3720}    // 1 hour and 2 minutes (overtime)
  isTimeUp={true}
  allActivitiesCompleted={false}
/>
```

## Calculation Methods

### Idle Time Calculation

The Summary component calculates idle time using the following approach:

1. Sort timeline entries by start time
2. Identify gaps between activities (break periods)
3. Sum up all break durations
4. For the last entry, if it's completed, calculate time from completion to now
5. Add all identified idle periods to get total idle time

### Activity Duration Calculation

For each activity, the component:

1. Identifies all timeline entries for the activity
2. Calculates the duration of each entry (endTime - startTime)
3. Sums up all durations for the activity
4. Handles ongoing activities by using the current time as endTime

## Known Limitations

1. **Complex sessions**: Performance may degrade with extremely large numbers of entries (100+)
2. **Long activity names**: Very long activity names may be truncated in the display
3. **Time precision**: Durations are rounded to whole seconds, sub-second precision is lost
4. **Multiple devices**: Session data isn't synchronized across devices without additional storage

## Test Coverage

The Summary component has extensive test coverage:

- **Summary.test.tsx**: Core functionality tests
- **SummaryActivityOrder.test.tsx**: Activity ordering tests
- **SummaryTheme.test.tsx**: Theme compatibility tests

Key tested scenarios include:
- Time metrics calculation accuracy
- Activity order consistency
- Status message generation
- Conditional rendering behavior
- Theme compatibility
- Edge cases (zero duration, overtime, early completion)

## Related Components

- **Timeline**: Provides the visualization that complements the Summary
- **ActivityManager**: Manages the activities shown in the Summary
- **TimeDisplay**: Used to format time values consistently

## Implementation Details

The Summary component implements several helper functions:

1. **Status message determination**: Chooses appropriate message based on session outcome
2. **Activity time calculation**: Processes the raw timeline entries to compute durations
3. **Theme-specific color mapping**: Maps activity colors to theme-appropriate versions
4. **Time formatting**: Formats durations into human-readable strings

## Change History

- **2025-04-05**: Added theme-specific activity color mapping
- **2025-03-15**: Improved chronological activity ordering
- **2025-03-01**: Enhanced idle time calculation accuracy
- **2025-02-15**: Added overtime visualization
- **2025-01-20**: Implemented conditional status messages
- **2025-01-05**: Initial implementation with basic time metrics

## Related Memory Logs

This component has been discussed in the following memory logs:

- [MRTMLY-185: Summary Component Test Suite Refactor](../logged_memories/MRTMLY-080-summary-test-refactor.md) - Test improvements
- [MRTMLY-002: Summary Component Status Message Bug Fix](../logged_memories/MRTMLY-144-summary-status-message-fix.md) - Fixed status message issues
- [MRTMLY-019: Summary Activity Order Fix](../logged_memories/MRTMLY-148-summary-activity-order.md) - Activity ordering logic
- [MRTMLY-041: Unused Variable in Summary Component](../logged_memories/MRTMLY-153-unused-variable-summary-component.md) - Code cleanup

---

## Navigation

- [Back to Component Documentation Home](./README.md)
- **Previous Component**: [ActivityManager](./ActivityManager.md)
- **Next Component**: [TimeSetup](./TimeSetup.md)
