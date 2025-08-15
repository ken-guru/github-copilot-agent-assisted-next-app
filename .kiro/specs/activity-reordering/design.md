# Design Document

## Overview

The activity reordering feature will add drag-and-drop functionality to allow users to customize the order of their activities across all views in Mr. Timely. The design leverages the existing activity storage system and extends it with order persistence, while maintaining compatibility with the current activity state management and timeline visualization systems.

## Architecture

### Data Layer Extensions

The current activity storage system (`src/utils/activity-storage.ts`) will be extended to include order management:

1. **Order Storage**: A separate localStorage key `activity_order_v1` will store the custom order as an array of activity IDs
2. **Order Synchronization**: The order will be synchronized with activity CRUD operations (add, delete, restore)
3. **Fallback Strategy**: When no custom order exists, activities will be displayed in creation order (existing behavior)

### Component Integration Points

The reordering functionality will integrate with existing components:

1. **ActivityManager**: Primary reordering interface with drag-and-drop handles
2. **Summary**: Respects custom order for completed and skipped activity lists
3. **Timeline**: Maintains visual consistency with the custom order
4. **ActivityButton**: Enhanced with drag handles and accessibility features

## Components and Interfaces

### New Utility Functions

```typescript
// src/utils/activity-order.ts
export interface ActivityOrder {
  getActivityOrder(): string[];
  setActivityOrder(order: string[]): void;
  addActivityToOrder(activityId: string): void;
  removeActivityFromOrder(activityId: string): void;
  sortActivitiesByOrder<T extends { id: string }>(activities: T[]): T[];
}
```

### Enhanced Activity Storage

```typescript
// Extensions to src/utils/activity-storage.ts
export function getActivitiesInOrder(): Activity[];
export function reorderActivities(orderedIds: string[]): void;
```

### Drag and Drop Hook

```typescript
// src/hooks/useDragAndDrop.ts
export interface DragAndDropState {
  draggedItem: string | null;
  dragOverItem: string | null;
  isDragging: boolean;
}

export interface DragAndDropHandlers {
  handleDragStart: (activityId: string) => void;
  handleDragOver: (activityId: string) => void;
  handleDragEnd: () => void;
  handleDrop: (targetId: string) => void;
}
```

### Accessibility Hook

```typescript
// src/hooks/useKeyboardReordering.ts
export interface KeyboardReorderingHandlers {
  handleKeyDown: (event: KeyboardEvent, activityId: string) => void;
  focusedItem: string | null;
  announcePosition: (activityId: string, newPosition: number) => void;
}
```

## Data Models

### Order Storage Schema

```typescript
interface ActivityOrderStorage {
  version: string; // "1.0"
  order: string[]; // Array of activity IDs in custom order
  lastUpdated: string; // ISO timestamp
}
```

### Enhanced Activity Interface

The existing `Activity` interface remains unchanged, but components will receive activities pre-sorted by custom order:

```typescript
// No changes to src/types/activity.ts
// Order is handled at the utility layer
```

### Timeline Entry Ordering

Timeline entries will maintain their chronological order for time calculations, but the visual representation will respect activity order for consistency:

```typescript
interface OrderedTimelineEntry extends TimelineEntry {
  displayOrder?: number; // Optional field for visual ordering
}
```

## Error Handling

### Storage Failures

1. **localStorage Quota**: Graceful degradation to default creation order
2. **Corrupted Order Data**: Validation and fallback to creation order
3. **Missing Activities**: Automatic cleanup of orphaned IDs in order array

### Drag and Drop Failures

1. **Touch Device Issues**: Fallback to keyboard navigation
2. **Browser Compatibility**: Progressive enhancement with feature detection
3. **Performance Issues**: Debounced order persistence during rapid changes

### Accessibility Failures

1. **Screen Reader Issues**: ARIA live regions for position announcements
2. **Keyboard Navigation**: Focus management and visual indicators
3. **Motor Impairment**: Large touch targets and forgiving drop zones

## Testing Strategy

### Unit Tests

1. **Order Utilities**: Test order persistence, synchronization, and edge cases
2. **Drag and Drop Logic**: Test reordering algorithms and state management
3. **Storage Integration**: Test localStorage operations and fallback scenarios

### Integration Tests

1. **Component Integration**: Test ActivityManager with reordering enabled
2. **Cross-View Consistency**: Test order persistence across Activities, Timer, and Summary views
3. **State Management**: Test integration with existing activity state hooks

### End-to-End Tests

1. **User Workflows**: Test complete drag-and-drop scenarios
2. **Persistence**: Test order survival across page reloads
3. **Accessibility**: Test keyboard navigation and screen reader compatibility
4. **Mobile Experience**: Test touch interactions on various devices

### Performance Tests

1. **Large Activity Lists**: Test performance with 50+ activities
2. **Rapid Reordering**: Test system stability during quick successive changes
3. **Memory Usage**: Monitor for memory leaks during drag operations

## Implementation Phases

### Phase 1: Core Infrastructure
- Activity order utilities and storage
- Basic drag-and-drop hook
- Order synchronization with existing CRUD operations

### Phase 2: UI Integration
- ActivityManager drag-and-drop interface
- Visual feedback during drag operations
- Order persistence integration

### Phase 3: Cross-View Consistency
- Summary view order integration
- Timeline visual order consistency
- State management integration

### Phase 4: Accessibility and Polish
- Keyboard navigation support
- Screen reader compatibility
- Mobile touch optimization
- Error handling and edge cases

## Security Considerations

1. **Input Validation**: Validate activity IDs in order arrays
2. **Storage Limits**: Implement reasonable limits on order array size
3. **XSS Prevention**: Sanitize any user-generated content in drag feedback
4. **Data Integrity**: Ensure order changes don't corrupt existing activity data

## Performance Considerations

1. **Lazy Loading**: Only load order data when needed
2. **Debounced Persistence**: Batch order changes to reduce localStorage writes
3. **Virtual Scrolling**: Consider for large activity lists (future enhancement)
4. **Memoization**: Cache sorted activity arrays to prevent unnecessary re-renders

## Browser Compatibility

1. **Drag and Drop API**: Modern browsers with HTML5 drag-and-drop support
2. **Touch Events**: iOS Safari, Android Chrome for mobile drag operations
3. **localStorage**: All supported browsers (IE8+)
4. **CSS Grid/Flexbox**: Modern layout features for drag feedback

## Migration Strategy

1. **Backward Compatibility**: Existing installations continue working without custom order
2. **Progressive Enhancement**: Reordering features are additive, not breaking
3. **Data Migration**: No migration needed - order is opt-in functionality
4. **Rollback Plan**: Order data can be cleared without affecting core functionality