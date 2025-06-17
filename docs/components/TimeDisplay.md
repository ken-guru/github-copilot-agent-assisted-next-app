# TimeDisplay Component

## Navigation

- [Component Documentation Home](./README.md)
- **Category**: [Utility Components](./README.md#utility-components)
- **Related Components**:
  - [Timeline](./Timeline.md) - Uses TimeDisplay for time markers
  - [Summary](./Summary.md) - Uses TimeDisplay for activity durations
  - [ActivityButton](./ActivityButton.md) - Uses TimeDisplay for elapsed time

## Overview

The TimeDisplay component provides a standardized way to present time and date information across the application. It handles the formatting, styling, and layout of temporal data, ensuring consistency in how time-related information is displayed to users. This component supports various display formats and adapts to different contexts and device sizes.

## Table of Contents
- [Features](#features)
- [Props](#props)
- [Types](#types)
- [State Management](#state-management)
- [Formatting Logic](#formatting-logic)
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

- **Formatted Time Display**: Shows time in a consistent, readable format
- **Customizable Formats**: Supports multiple time and date formatting options
- **Date Display**: Optional date display alongside time
- **Semantic HTML**: Uses appropriate HTML elements with datetime attributes
- **Bootstrap Integration**: Uses Bootstrap components and utility classes
- **Theme Compatibility**: Adapts to light and dark themes
- **Locale Support**: Handles different time formats based on locale
- **Mobile Optimization**: Responsive design for all screen sizes
- **Order Control**: Configurable display order for time and date elements
- **Timezone Handling**: Properly handles timezone differences
- **Multiple Variants**: Supports different display styles (default, compact, card, etc.)
- **Status Indicators**: Can display status with Bootstrap Badge components

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `dateTime` | `Date` | Yes | - | Date object to display |
| `formattedTime` | `string` | Yes | - | Pre-formatted time string |
| `formattedDate` | `string` | Yes | - | Pre-formatted date string |
| `timeFormat` | `string` | No | - | Format used for time (for display purposes only) |
| `dateFormat` | `string` | No | - | Format used for date (for display purposes only) |
| `variant` | `'default' \| 'compact' \| 'large' \| 'horizontal' \| 'card' \| 'minimal'` | No | `'default'` | Display variant |
| `status` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | No | `'default'` | Status indicator |
| `interactive` | `boolean` | No | `false` | Makes the component interactive |
| `loading` | `boolean` | No | `false` | Shows loading state |
| `showTimezone` | `boolean` | No | `false` | Displays timezone information |
| `timezone` | `string` | No | - | Timezone to display (if showTimezone is true) |
| `live` | `boolean` | No | `false` | Indicates if the time updates in real-time |
| `className` | `string` | No | - | Additional CSS class names |

## Types

```typescript
interface TimeDisplayProps {
  dateTime: Date;
  formattedTime: string;
  formattedDate: string;
  timeFormat?: string;
  dateFormat?: string;
}
```

## State Management

The TimeDisplay component is primarily a presentational component with minimal state management:

1. **Format processing**: Handles formatting logic based on provided props
   ```typescript
   const displayTime = formattedTime || formatTime(dateTime, timeFormat);
   const displayDate = formattedDate || formatDate(dateTime, dateFormat);
   ```

The component relies on its parent to provide properly formatted strings or uses internal formatting utilities when needed. This approach ensures flexibility while maintaining consistent display patterns.

## Formatting Logic

The TimeDisplay component uses several formatting approaches:

1. **Pre-formatted strings**: Uses parent-provided formatted strings when available
2. **Default formatting**: Falls back to internal formatting when strings aren't provided
3. **Custom formats**: Applies custom format patterns when specified
4. **Locale-aware formatting**: Uses the browser's locale for appropriate formatting

The component implements these priorities to determine the displayed values:
1. Use `formattedTime` and `formattedDate` if provided
2. Use internal formatting with custom `timeFormat` and `dateFormat` if provided
3. Fall back to locale-appropriate default formatting

## Theme Compatibility

The TimeDisplay component adapts to light and dark themes:

- **Text color adaptation**: Uses theme variables for text colors
- **Background transparency**: Maintains readability on different backgrounds
- **Contrast optimization**: Ensures readable time display in all themes
- **Font variation**: Uses tabular numbers for consistent alignment
- **Focus states**: Properly themed focus indicators for accessibility

## Mobile Responsiveness

The component is designed to be fully responsive:

- **Flexible width**: Adapts to container width on different screen sizes
- **Responsive typography**: Font sizes adjust based on viewport width
- **Space efficiency**: Compact layout on smaller screens
- **Touch-friendly**: Adequate spacing for touch interaction if interactive
- **Orientation handling**: Consistent display in both portrait and landscape

## Accessibility

- **Semantic HTML**: Uses appropriate time and/or date elements
- **ARIA attributes**: Includes proper ARIA roles and attributes when needed
- **Screen reader support**: Provides text alternatives that work well with screen readers
- **Keyboard navigability**: Supports keyboard focus when interactive
- **DateTime attributes**: Uses HTML datetime attributes for machine readability
- **Color contrast**: Maintains proper contrast ratios in all themes

## Example Usage

### Basic Time Display

```tsx
import TimeDisplay from '../components/TimeDisplay';

// In your component
const now = new Date();
const formattedTime = now.toLocaleTimeString();
const formattedDate = now.toLocaleDateString();

return (
  <TimeDisplay
    dateTime={now}
    formattedTime={formattedTime}
    formattedDate={formattedDate}
  />
);
```

### With Custom Formatting

```tsx
<TimeDisplay
  dateTime={new Date()}
  formattedTime="14:30:45"
  formattedDate="Jan 15, 2025"
  timeFormat="HH:mm:ss"
  dateFormat="MMM dd, yyyy"
/>
```

### Time-Only Display

```tsx
// Only showing time without date
<TimeDisplay
  dateTime={new Date()}
  formattedTime="2:30 PM"
  formattedDate=""
/>
```

## Component Integration

The TimeDisplay component is designed to work seamlessly with other time-related components:

1. **Used by Summary**: Displays activity durations and completion times
2. **Used by ActivityManager**: Shows elapsed time for activities
3. **Used by Timeline**: Displays time markers and activity times
4. **Works with useTimeDisplay hook**: Consumes formatted time from the hook

## Known Limitations

1. **Format restrictions**: Limited to the formatting options provided by the browser's locale system
2. **Timezone handling**: Relies on browser timezone settings
3. **DST transitions**: May have edge cases during daylight saving time transitions
4. **Formatting consistency**: May show slight differences across browsers and operating systems
5. **Relative time**: Does not handle relative time formats ("5 minutes ago") without additional logic

## Test Coverage

The TimeDisplay component has comprehensive test coverage:

- **TimeDisplay.test.tsx**: Core rendering tests
- **TimeDisplay.format.test.tsx**: Format handling tests
- **TimeDisplay.a11y.test.tsx**: Accessibility tests

Key tested scenarios include:
- Correct rendering of provided time and date values
- Proper order of displayed elements
- Format fallback behavior
- Accessibility compliance
- Theme compatibility

## Related Components and Hooks

- **Timer**: Often used with TimeDisplay for counting functionality
- **Timeline**: Uses TimeDisplay for time markers
- **useTimeDisplay**: Hook providing formatted time values
- **DatePicker**: Works alongside TimeDisplay in date selection interfaces

## Implementation Details

The TimeDisplay component has a simple but effective implementation:

```tsx
return (
  <div className={styles.container}>
    <time 
      dateTime={dateTime.toISOString()} 
      className={styles.timeDisplay}
    >
      <span className={styles.time}>{displayTime}</span>
      {displayDate && (
        <span className={styles.date}>{displayDate}</span>
      )}
    </time>
  </div>
);
```

Key implementation decisions:
1. Using the semantic `time` element with proper `dateTime` attribute
2. Separating time and date into different spans for styling flexibility
3. Conditional rendering for the date portion
4. Using CSS module classes for theme compatibility

## Change History

- **2025-03-10**: Added timezone display option
- **2025-02-15**: Improved accessibility features
- **2025-02-01**: Added theme compatibility
- **2025-01-15**: Enhanced format customization options
- **2025-01-01**: Initial implementation with basic time display

## Related Memory Logs

// Add relevant memory logs if any exist

---

## Navigation

- [Back to Component Documentation Home](./README.md)
- **Previous Component**: [ActivityForm](./ActivityForm.md)
- **Next Component**: [OfflineIndicator](./OfflineIndicator.md)
