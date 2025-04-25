# Summary Component

## Navigation
- [Component Documentation Index](../README.md#components)
- Related: [Timeline](./Timeline.md), [ActivityManager](./ActivityManager.md)

## Overview
The Summary component provides a comprehensive overview of activity statistics and a detailed list of completed activities. It displays active time, idle time, overtime statistics, and status messages based on the current state. The component is fully responsive with dedicated mobile optimizations.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| entries | TimelineEntry[] | No | [] | Array of timeline entries to display |
| totalDuration | number | Yes | - | Total planned duration in seconds |
| elapsedTime | number | Yes | - | Current elapsed time in seconds |
| timerActive | boolean | No | false | Whether the timer is currently active |
| allActivitiesCompleted | boolean | No | false | Whether all activities are completed |
| isTimeUp | boolean | No | false | Whether the planned time is up |

## State Management

The component manages:
- Current theme state (`light` or `dark`) for appropriate styling
- Activity statistics calculations (active time, idle time, overtime)
- Status message selection based on current state

It also receives viewport information from the `useViewport` hook to adapt its layout for mobile devices.

## Theme Compatibility

The component offers comprehensive theme support:
- Automatically detects and responds to theme changes
- Adapts colors and styles for both light and dark modes
- Uses theme variables for consistent appearance
- Properly visualizes activities in current theme with appropriate contrast
- Maintains readability of status messages across themes

## Mobile Responsiveness

The Summary component implements comprehensive mobile optimizations:
- **Stacked Layout**: Vertical organization of statistics for small screens
- **Touch-Friendly Elements**: Larger tap targets for activity items
- **Enhanced Typography**: Optimized text sizes for mobile readability
- **Visual Progress**: Mini progress bars show activity duration proportion
- **Space Efficiency**: Compact layouts preserving all information
- **Responsive Status Messages**: Prominent status display adapted for mobile

## Accessibility Considerations

- Status messages use semantic HTML with appropriate color contrast
- Activity information is presented in a logical, hierarchical structure
- All durations use tabular numerals for better readability
- Interactive elements (when added) will have sufficient touch targets
- Color is not the only means of conveying information
- Proper heading levels maintain document outline

## Test Coverage

The component has thorough test coverage including:
- Basic rendering and information display
- Responsive adaptations for mobile devices
- Calculation of statistics (active time, idle time, overtime)
- Status message selection and display
- Theme compatibility testing
- Empty state handling

## Usage Examples

### Basic Usage
```tsx
<Summary 
  entries={timelineEntries}
  totalDuration={1800}     // 30 minutes in seconds
  elapsedTime={900}        // 15 minutes elapsed
  timerActive={true}
/>
```

### With Completed Activities
```tsx
<Summary 
  entries={completedEntries}
  totalDuration={1800}
  elapsedTime={1650}
  timerActive={false}
  allActivitiesCompleted={true}
/>
```

### Time-Up State
```tsx
<Summary 
  entries={entries}
  totalDuration={1800}
  elapsedTime={2100}       // Overtime
  timerActive={true}
  isTimeUp={true}
/>
```

## Mobile Implementation Details

### Dynamic Class Selection
The component uses conditional class selection based on the current viewport:

```typescript
const getActivityListClass = () => {
  return isMobile ? mobileStyles.mobileActivityList : styles.activitiesList;
};
```

### Mobile-Specific Progress Visualization
On mobile devices, each activity includes a visual progress indicator:

```tsx
{isMobile && (
  <div className={mobileStyles.mobileProgressIndicator}>
    <div 
      className={mobileStyles.mobileProgressFill}
      style={{
        width: `${Math.min(100, (activityDuration / totalDuration) * 100)}%`,
        backgroundColor: themeColors?.border || '#ccc'
      }}
    />
  </div>
)}
```

## Known Limitations/Edge Cases

- Very long activity names may be truncated on small screens
- Extremely small screens (<320px) may have reduced padding and font sizes
- Activities with very short durations will show minimal progress bars
- Very large time durations (multiple hours) might wrap text on small screens
- Performance may decrease with a very large number of activities

## Change History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2023-06-01 | Initial implementation |
| 1.1 | 2023-07-22 | Mobile-optimized version with responsive design |
