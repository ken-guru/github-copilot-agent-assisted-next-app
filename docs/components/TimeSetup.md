# TimeSetup Component

## Navigation

- [Component Documentation Home](./README.md)
- **Category**: [User Input Components](./README.md#user-input-components)
- **Related Components**:
  - [Timeline](./Timeline.md) - Uses configured time values
  - [ProgressBar](./ProgressBar.md) - Uses configured time values
  - [TimeDisplay](./TimeDisplay.md) - Used for formatting time values

## Overview

The TimeSetup component provides a user interface for configuring time settings in the application. It allows users to define a time boundary for activities either by setting a specific duration or by specifying a deadline. The component manages input validation, time format conversion, and handles the dual mode functionality (duration vs. deadline).

## Features

- **Dual Time Setup Modes**: Supports both duration-based and deadline-based time configuration
- **Input Validation**: Ensures valid time inputs in both modes
- **Time Conversion**: Converts human-readable time inputs to seconds for internal processing
- **Mode Switching**: Allows dynamic switching between duration and deadline modes
- **Theme Compatibility**: Adapts to light and dark theme modes
- **Responsive Design**: Optimized for both desktop and mobile interfaces
- **Smart Deadline Handling**: Intelligently handles "tomorrow" for deadlines set earlier than current time

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onTimeSet` | `(durationInSeconds: number) => void` | Yes | - | Callback function invoked when time is confirmed |
| `initialMode` | `'duration' \| 'deadline'` | No | `'duration'` | Initial mode for the time setup |
| `initialDuration` | `number` | No | `0` | Initial duration in seconds (used in duration mode) |

## Types

```typescript
interface TimeSetupProps {
  onTimeSet: (durationInSeconds: number) => void;
  initialMode?: 'duration' | 'deadline';
  initialDuration?: number;
}
```

## State Management

The TimeSetup component manages several pieces of state:

1. **Setup mode**: Controls whether the component operates in duration or deadline mode
   ```typescript
   const [setupMode, setSetupMode] = useState<'duration' | 'deadline'>(initialMode || 'duration');
   ```

2. **Duration inputs**: Tracks hours, minutes, and seconds for duration mode
   ```typescript
   const [hours, setHours] = useState(initialHours);
   const [minutes, setMinutes] = useState(initialMinutes);
   const [seconds, setSeconds] = useState(initialSeconds);
   ```

3. **Deadline input**: Tracks time input for deadline mode
   ```typescript
   const [deadlineTime, setDeadlineTime] = useState(
     new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
   );
   ```

The component uses these states to calculate the final duration in seconds, which is passed to the parent component via the `onTimeSet` callback.

## Time Calculation Logic

### Duration Mode Calculation

In duration mode, the component:
1. Validates that at least one time unit (hours, minutes, or seconds) has a non-zero value
2. Calculates total seconds using the formula: `(hours * 3600) + (minutes * 60) + seconds`
3. Passes this duration to the parent component via the `onTimeSet` callback

### Deadline Mode Calculation

In deadline mode, the component:
1. Parses the input time string into hours and minutes
2. Creates a deadline Date object using the current date and specified time
3. Compares the deadline to the current time
4. If the deadline is earlier than the current time, assumes it's for tomorrow and adds one day
5. Calculates the duration in seconds between now and the deadline
6. Passes this duration to the parent component via the `onTimeSet` callback

## Theme Compatibility

The TimeSetup component adapts to light and dark themes:

- **Consistent styling**: Uses CSS variables to adapt colors based on theme
- **Input elements**: Maintains readability and visual consistency across themes
- **Button styling**: Button colors and states adapt to the active theme
- **Focus states**: Visible focus indicators work in both light and dark modes
- **Error states**: Error messages and validation indicators respect the active theme colors

## Mobile Responsiveness

The TimeSetup component is built with mobile usage in mind:

- **Adaptive layout**: Flexbox-based layout adjusts to screen size
- **Touch-friendly controls**: Buttons and inputs have adequate size for touch interaction
- **Input optimization**: Numeric inputs trigger appropriate mobile keyboard types
- **Responsive spacing**: Margin and padding adjust based on viewport size
- **Adaptive typography**: Font sizes adjust for readability on smaller screens

## Accessibility

- **Semantic HTML**: Uses appropriate semantic elements for forms and inputs
- **Labeled controls**: All inputs have properly associated labels
- **Form validation**: Provides clear validation feedback
- **Keyboard navigation**: Supports navigation via keyboard
- **Focus management**: Maintains visible focus indicators
- **Screen reader support**: All interactive elements have appropriate text content

## Example Usage

### Basic Usage

```tsx
import TimeSetup from '../components/TimeSetup';

function MyComponent() {
  const handleTimeSet = (durationInSeconds) => {
    console.log(`Time set for ${durationInSeconds} seconds`);
    // Start timer or update application state
  };

  return (
    <TimeSetup onTimeSet={handleTimeSet} />
  );
}
```

### With Initial Duration and Mode

```tsx
// Start with deadline mode and an initial duration
<TimeSetup 
  onTimeSet={handleTimeSet}
  initialMode="deadline"
  initialDuration={3600} // 1 hour in seconds
/>
```

## Input Validation

The TimeSetup component implements several validation rules:

1. **Duration mode**:
   - At least one time unit must have a non-zero value
   - Hours must be a non-negative integer
   - Minutes must be between 0 and 59
   - Seconds must be between 0 and 59

2. **Deadline mode**:
   - Time must be in a valid format (HH:MM)
   - Handles edge cases like times after midnight

## Known Limitations

1. **Time precision**: Limited to second-level precision, no milliseconds
2. **Time zone handling**: Works in the user's local time zone only
3. **24-hour format**: Time input in deadline mode uses 24-hour format only
4. **Date selection**: Currently no option to select a specific date (only time)
5. **Timer synchronization**: Small discrepancies may occur between set time and actual timer due to processing delays

## Test Coverage

The TimeSetup component has comprehensive test coverage:

- **TimeSetup.test.tsx**: Core functionality tests
- **TimeSetup.format.test.tsx**: Time format and conversion tests

Key tested scenarios include:
- Mode switching between duration and deadline
- Input validation in both modes
- Time calculation accuracy
- Deadline handling (today vs. tomorrow)
- Form submission behavior
- Edge cases (zero input, invalid inputs)

## Related Components and Hooks

- **ActivityManager**: Often used together to set up a timed activity session
- **Timeline**: Visualizes the time set by this component
- **useTimerState**: Hook that consumes the duration set by this component

## Implementation Details

The component implements two key algorithms:

1. **Duration calculation from time parts**:
   ```typescript
   const calculateDurationInSeconds = () => {
     return (hours * 3600) + (minutes * 60) + seconds;
   };
   ```

2. **Duration calculation from deadline**:
   ```typescript
   const calculateDurationFromDeadline = () => {
     // Parse time, create Date object, calculate difference
     // Handle "tomorrow" case when deadlineDate <= now
     return Math.max(0, Math.floor((deadlineDate.getTime() - now.getTime()) / 1000));
   };
   ```

## Change History

- **2025-02-28**: Added input validation feedback
- **2025-02-15**: Enhanced deadline time handling logic
- **2025-02-01**: Improved mobile responsiveness
- **2025-01-15**: Added support for initial values via props
- **2025-01-01**: Initial implementation with basic duration and deadline modes
