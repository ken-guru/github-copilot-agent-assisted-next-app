# ActivityManager Component Documentation

## Navigation
- [← Back to Component Documentation Index](../README.md)
- [Related Components](#related-components)

## Overview
The `ActivityManager` component serves as the primary container for managing user activities within the application. It provides a responsive Bootstrap layout that allows users to add, select, and remove activities with proper state management and visual feedback.

## Color Handling
Activities use a canonical type:
```typescript
interface Activity {
  id: string;
  name: string;
  colorIndex: number;
  createdAt: string;
  isActive: boolean;
}
```
Color sets for display are derived from `colorIndex` using `getNextAvailableColorSet` from `src/utils/colors.ts`. Colors are not stored directly on the Activity object.

## Component Location
- **File**: `src/components/ActivityManager.tsx`
- **Type**: Layout/Container Component
- **Framework**: React with Bootstrap 5.3.7

## Props Interface

```typescript
interface ActivityManagerProps {
  onActivitySelect: (activity: Activity | null, justAdd?: boolean) => void;
  onActivityRemove?: (activityId: string) => void;
  currentActivityId: string | null;
  completedActivityIds: string[];
  timelineEntries: TimelineEntry[];
  isTimeUp?: boolean;
  elapsedTime?: number;
}
```

### Props Documentation

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onActivitySelect` | `(activity: Activity \| null, justAdd?: boolean) => void` | ✅ | - | Callback for activity selection/deselection |
| `onActivityRemove` | `(activityId: string) => void` | ❌ | `undefined` | Callback for activity removal |
| `currentActivityId` | `string \| null` | ✅ | - | ID of currently active activity |
| `completedActivityIds` | `string[]` | ✅ | - | Array of completed activity IDs |
| `timelineEntries` | `TimelineEntry[]` | ✅ | - | Timeline entries for activity history |
| `isTimeUp` | `boolean` | ❌ | `false` | Whether time limit has been reached |
| `elapsedTime` | `number` | ❌ | `0` | Elapsed time for current activity |

## State Management

### Internal State
- **Activities List**: Manages the array of user-defined activities
- **Color Management**: Assigns and tracks color indices for visual differentiation
- **Initialization State**: Ensures default activities are loaded once

### Default Activities
The component automatically initializes with four default activities:
- Homework (Color Index 0)
- Reading (Color Index 1)
- Play Time (Color Index 2)
- Chores (Color Index 3)

## Bootstrap Integration

### Layout Structure
```jsx
<Container fluid className="h-100" data-testid="activity-manager">
  <h4 className="h4 mb-3">Activities</h4>
  
  {/* Empty State */}
  <div className="alert alert-info text-center" role="alert">
    No activities defined
  </div>
  
  {/* Activities Grid */}
  <Row className="gy-3" data-testid="activity-list">
    <Col xs={12} className="mb-3" data-testid="activity-form-column">
      <ActivityForm />
    </Col>
    
    {/* Activity Columns */}
    <Col xs={12} md={6} lg={4} data-testid="activity-column-{id}">
      <ActivityButton />
    </Col>
  </Row>
</Container>
```

### Responsive Grid Classes
- **Mobile (xs)**: `col-12` - Full width
- **Tablet (md)**: `col-6` - Half width  
- **Desktop (lg)**: `col-4` - One-third width

### Bootstrap Components Used
- **Container**: `Container` with `fluid` prop for full-width layout
- **Grid System**: `Row` and `Col` for responsive layout
- **Typography**: `h4` class for consistent heading styling
- **Spacing**: `mb-3`, `gy-3` for consistent spacing
- **Alerts**: `alert alert-info` for empty state messaging

## Theme Compatibility

### Color Management
- Supports dynamic color assignment based on theme
- Automatically updates colors on theme changes
- Watches for both system preference and manual theme switches

### Theme Integration
- Uses Bootstrap's theme-aware color classes
- Responds to `prefers-color-scheme` media queries
- Monitors document class changes for theme switching

## Mobile Responsiveness

### Responsive Breakpoints
- **Mobile (< 768px)**: Single column layout
- **Tablet (768px - 992px)**: Two-column layout
- **Desktop (≥ 992px)**: Three-column layout

### Touch Interaction
- Full touch support for all interactive elements
- Appropriate touch targets for mobile devices
- Responsive spacing for different screen sizes

## Accessibility Features

### ARIA Support
- Proper heading hierarchy with `h4` element
- Alert role for empty state messaging
- Semantic HTML structure

### Keyboard Navigation
- Tab navigation through all interactive elements
- Focus management for activity selection
- Keyboard accessibility for all actions

### Screen Reader Support
- Descriptive text for activity states
- Proper labeling for all interactive elements
- Accessible form controls

## Test Coverage

### Bootstrap Integration Tests (18 tests)
- ✅ Container structure validation
- ✅ Typography and heading styling
- ✅ Grid system implementation
- ✅ Responsive column behavior
- ✅ Empty state alert styling
- ✅ Spacing and layout utilities
- ✅ Child component integration
- ✅ Theme consistency
- ✅ Accessibility features
- ✅ Overflow handling

### Functional Tests (11 tests)
- ✅ Default activity rendering
- ✅ Activity addition/removal
- ✅ State management
- ✅ Timeline integration
- ✅ Time limit handling
- ✅ Activity selection/deselection
- ✅ Elapsed time display

## Usage Examples

### Basic Usage
```jsx
import ActivityManager from './components/ActivityManager';

function App() {
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [timelineEntries, setTimelineEntries] = useState([]);

  const handleActivitySelect = (activity, justAdd = false) => {
    if (justAdd) {
      // Add activity without starting
      return;
    }
    setCurrentActivityId(activity?.id || null);
  };

  const handleActivityRemove = (activityId) => {
    // Remove activity logic
  };

  return (
    <ActivityManager
      onActivitySelect={handleActivitySelect}
      onActivityRemove={handleActivityRemove}
      currentActivityId={currentActivityId}
      completedActivityIds={completedIds}
      timelineEntries={timelineEntries}
    />
  );
}
```

### With Time Limit
```jsx
<ActivityManager
  onActivitySelect={handleActivitySelect}
  onActivityRemove={handleActivityRemove}
  currentActivityId={currentActivityId}
  completedActivityIds={completedIds}
  timelineEntries={timelineEntries}
  isTimeUp={true}
  elapsedTime={1800} // 30 minutes
/>
```

### Empty State Display
When no activities are defined, the component displays a Bootstrap alert:
```jsx
// Automatically shown when activities.length === 0
<div className="alert alert-info text-center" role="alert">
  No activities defined
</div>
```

## Related Components

### Child Components
- [`ActivityForm`](./ActivityForm.md) - Form for adding new activities
- [`ActivityButton`](./ActivityButton.md) - Individual activity display and interaction

### Parent Components
- Used in main application layout for activity management
- Integrates with timer and timeline systems

## Known Limitations

### Color Assignment
- Limited to available color indices in the color system
- Color reuse when exceeding available colors

### Performance Considerations
- Re-renders on theme changes for color updates
- Efficient state management for large activity lists

## Change History

### Bootstrap Migration (Latest)
- **Date**: 2025-06-28
- **Changes**: 
  - Migrated from CSS modules to Bootstrap layout system
  - Implemented responsive Container/Row/Col structure
  - Added comprehensive Bootstrap integration tests (18 tests)
  - Enhanced theme integration with Bootstrap classes
  - Improved accessibility with Bootstrap components
  - Removed ActivityManager.module.css dependency
  - Updated all tests to pass with new Bootstrap structure

### Previous Versions
- CSS Module implementation with custom styling
- Basic responsive design with custom breakpoints
- Manual theme handling

## Implementation Notes

### Color System Integration
The component integrates with the application's color utility system to assign unique colors to each activity, ensuring visual differentiation while maintaining theme consistency.

### State Synchronization
Activity state is synchronized with parent components through callback props, allowing for integration with broader application state management.

### Theme Responsiveness
The component automatically responds to theme changes by re-evaluating colors and updating the display, ensuring consistency across light and dark themes.

### Bootstrap Migration Impact
The migration to Bootstrap improved the component's responsive design, accessibility, and maintainability while preserving all existing functionality.
