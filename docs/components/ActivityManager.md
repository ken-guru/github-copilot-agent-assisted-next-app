# ActivityManager Component

## Overview

The ActivityManager component serves as the central hub for activity management in the application. It provides a user interface for creating, selecting, and tracking activities while managing their states throughout the session. The component handles color assignment, activity state transitions, and visual representation of activity status.

## Features

- **Activity Creation**: Interface for adding new activities
- **Activity Selection**: Mechanism for selecting the current active activity
- **Color Management**: Automatic color assignment for visual distinction between activities
- **State Tracking**: Tracking of pending, active, and completed activities
- **Theme Compatibility**: Dynamic color adaptation for light and dark themes
- **Activity Removal**: Interface for removing activities from the session
- **Timer Display**: Shows activity duration for active and completed activities
- **Real-Time Updates**: Dynamically updates activity status and duration

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onActivitySelect` | `(activity: Activity \| null, justAdd?: boolean) => void` | Yes | - | Callback when an activity is selected or deselected |
| `onActivityRemove` | `(activityId: string) => void` | Yes | - | Callback when an activity is removed |
| `currentActivityId` | `string \| null` | Yes | - | ID of the currently active activity |
| `completedActivityIds` | `string[]` | Yes | - | Array of IDs for completed activities |
| `timelineEntries` | `TimelineEntry[]` | Yes | - | Timeline entries for activity history |
| `isTimeUp` | `boolean` | No | `false` | Flag indicating if allocated time is up |
| `elapsedTime` | `number` | No | `0` | Current elapsed time in seconds |

## Types

```typescript
interface Activity {
  id: string;
  name: string;
  colorIndex: number;
  colors?: {
    background: string;
    text: string;
    border: string;
  };
}

interface TimelineEntry {
  id: string;
  activityId: string | null;
  activityName: string | null;
  startTime: number;
  endTime: number | null;
  colors?: {
    background: string;
    text: string;
    border: string;
  };
}
```

## State Management

The ActivityManager component manages several pieces of state:

1. **Activities list**: A collection of all activities available for selection
   ```typescript
   const [activities, setActivities] = useState<Activity[]>([]);
   ```

2. **Color assignment**: Tracks which color indices have been assigned
   ```typescript
   const [assignedColorIndices, setAssignedColorIndices] = useState<number[]>([]);
   ```

3. **Initialization state**: Tracks whether default activities have been initialized
   ```typescript
   const [hasInitializedActivities, setHasInitializedActivities] = useState(false);
   ```

4. **New activity input**: Manages the form input for adding new activities
   ```typescript
   const [newActivityName, setNewActivityName] = useState('');
   ```

The component uses several key effects:

1. **Default activity initialization**: Sets up initial activities on first render
   ```typescript
   useEffect(() => {
     const defaultActivities = [
       { id: '1', name: 'Homework', colorIndex: 0 },
       { id: '2', name: 'Reading', colorIndex: 1 },
       { id: '3', name: 'Play Time', colorIndex: 2 },
       { id: '4', name: 'Chores', colorIndex: 3 }
     ];
     
     // Initialize default activities
   }, [hasInitializedActivities, onActivitySelect]);
   ```

2. **Theme change detection**: Updates activity colors when theme changes
   ```typescript
   useEffect(() => {
     const updateColors = () => {
       setActivities(currentActivities => 
         currentActivities.map(activity => ({
           ...activity,
           colors: getNextAvailableColorSet(activity.colorIndex)
         }))
       );
     };
     
     // Set up theme change listeners
   }, []);
   ```

3. **Color initialization**: Initializes activity colors on component mount
   ```typescript
   useEffect(() => {
     setActivities(currentActivities => 
       currentActivities.map(activity => ({
         ...activity,
         colors: getNextAvailableColorSet(activity.colorIndex || 0)
       }))
     );
   }, []);
   ```

## Activity Lifecycle Management

The ActivityManager handles the complete lifecycle of activities:

1. **Creation**: New activities are created with a unique ID and assigned a color
2. **Pending State**: Activities start in the pending state before being selected
3. **Active State**: An activity becomes active when selected by the user
4. **Completed State**: Activities are marked as completed when finished

This component works closely with the ActivityState hook to maintain the state machine for activities.

## Theme Compatibility

The ActivityManager fully supports both light and dark themes:

- **Dynamic color generation**: Activities are assigned color sets that work in both light and dark modes
- **Theme detection**: Uses MutationObserver to detect theme changes on the document element
- **Color refreshing**: Regenerates activity colors whenever the theme changes
- **System preference detection**: Responds to system dark mode preference changes
- **Visual consistency**: Ensures visual consistency of activities across theme modes

## Mobile Responsiveness

The ActivityManager component is designed to be fully responsive:

- **Flexible layout**: Uses CSS Grid and Flexbox for adaptive layouts
- **Touch-friendly controls**: Large touch targets for mobile interaction
- **Responsive typography**: Text scales appropriately for different screen sizes
- **Compact mobile view**: Optimized layout for small screens
- **Responsive form elements**: Input fields and buttons adapt to screen width

## Accessibility

- **Semantic HTML**: Uses appropriate semantic elements (buttons, forms, etc.)
- **ARIA labels**: Includes labels for interactive elements
- **Focus management**: Proper keyboard focus handling for form elements
- **Color contrast**: Maintains sufficient color contrast for text elements
- **Form validation**: Provides visual and programmatic form validation feedback
- **Screen reader support**: Important elements have appropriate text content

## Example Usage

### Basic Usage in App Component

```tsx
import ActivityManager from '../components/ActivityManager';

// In your component
return (
  <ActivityManager
    onActivitySelect={handleActivitySelect}
    onActivityRemove={handleActivityRemoval}
    currentActivityId={currentActivity?.id || null}
    completedActivityIds={completedActivityIds}
    timelineEntries={processedEntries}
  />
);
```

### With Time-Up State

```tsx
<ActivityManager
  onActivitySelect={handleActivitySelect}
  onActivityRemove={handleActivityRemoval}
  currentActivityId={currentActivity?.id || null}
  completedActivityIds={completedActivityIds}
  timelineEntries={processedEntries}
  isTimeUp={true}
  elapsedTime={3600}
/>
```

## Known Limitations

1. **Activity count**: Performance may degrade with a very large number of activities (40+)
2. **Long activity names**: Very long activity names may be truncated on small screens
3. **Color differentiation**: Limited number of visually distinct colors for activities
4. **State persistence**: Activity state is not persisted across page refreshes without additional storage

## Test Coverage

The ActivityManager component has comprehensive test coverage:

- **ActivityManager.test.tsx**: Core functionality tests
- **ActivityManager.theme.test.tsx**: Theme adaptation tests
- **ActivityManager.mobile.test.tsx**: Mobile responsiveness tests

Key tested scenarios include:
- Activity creation, selection, and removal
- Color assignment and theme compatibility
- Proper state management for activities
- Form validation and input handling
- Interaction with the activity state machine
- Timer display accuracy

## Related Components and Hooks

- **Timeline**: Visualizes activity history and breaks
- **Summary**: Shows activity statistics after completion
- **useActivityState**: Hook that manages activity state transitions
- **useTimelineEntries**: Hook that tracks activity timeline entries

## Implementation Details

The ActivityManager implements several key algorithms:

1. **Color assignment**: Ensures each activity gets a unique color
   ```typescript
   const getNextColorIndex = (): number => {
     let index = 0;
     while (assignedColorIndices.includes(index)) {
       index++;
     }
     return index;
   };
   ```

2. **Activity duration calculation**: Computes activity duration from timeline entries
   ```typescript
   const getActivityDuration = (activityId: string): number => {
     return timelineEntries
       .filter(entry => entry.activityId === activityId)
       .reduce((total, entry) => {
         const endTime = entry.endTime || Date.now();
         return total + (endTime - entry.startTime);
       }, 0);
   };
   ```

3. **Activity state determination**: Determines if an activity is pending, active, or completed

## Change History

- **2025-03-20**: Improved activity state transitions
- **2025-03-01**: Added activity removal functionality
- **2025-02-15**: Enhanced theme compatibility for activity colors
- **2025-02-01**: Implemented activity duration tracking
- **2025-01-15**: Added form validation for activity creation
- **2025-01-01**: Initial implementation with basic activity management
