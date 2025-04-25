# SwipeActions Component

## Navigation
- [Component Documentation Index](./README.md#components)
- **Category**: [Mobile Interactions](./README.md#mobile-interactions)
- **Related Components**:
  - [PullToRefresh](./PullToRefresh.md) - Complementary mobile gesture component
  - [ActivityManager](./ActivityManager.md) - Uses similar swipe pattern

## Overview
The SwipeActions component adds horizontal swipe gestures to reveal actions for list items. It enables intuitive touch interactions similar to native mobile apps, with customizable left and right actions.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| children | React.ReactNode | Yes | - | Content to wrap with swipe actions |
| leftAction | SwipeAction | No | - | Action to reveal when swiping right |
| rightAction | SwipeAction | No | - | Action to reveal when swiping left |
| actionThreshold | number | No | 80 | Distance in pixels to trigger action |
| showActionButtons | boolean | No | false | Whether to show button alternatives |
| useHapticFeedback | boolean | No | true | Whether to use vibration API for feedback |

## Types

```typescript
type SwipeAction = {
  label: string;
  icon?: React.ReactNode;
  handler: () => void;
  color: string;
};
```

## State Management

The component manages several pieces of state:
- Swipe offset during touch interactions
- Threshold crossing detection for feedback
- Touch position tracking
- Reduced motion preference detection

## Theme Compatibility

- Adapts to light and dark themes automatically
- Uses CSS variables for consistent theming
- Background content respects theme colors
- Action buttons maintain accessibility contrast

## Mobile Responsiveness

This component is specifically designed for mobile devices:
- Only enables swipe actions on touch-capable devices
- On desktop, renders a simplified version without swipe functionality
- Gesture distances are optimized for mobile use
- Natural feeling resistance and momentum

## Accessibility Considerations

- Optional button alternatives for non-touch users
- Respects reduced motion preferences
- All interactive elements have appropriate ARIA labels
- Maintains standard tapping behavior for primary actions
- Visual feedback does not rely solely on color

## Test Coverage

The component has comprehensive test coverage:
- Swipe distance tracking
- Action triggering logic
- Threshold detection
- Haptic feedback integration
- Button alternative functionality
- Reduced motion preference handling
- Desktop vs. mobile rendering differences

## Usage Examples

### Basic Usage
```tsx
import SwipeActions from '../components/SwipeActions';

const MyListItem = ({ item, onDelete, onArchive }) => {
  return (
    <SwipeActions
      leftAction={{
        label: 'Delete',
        icon: <TrashIcon />,
        handler: () => onDelete(item.id),
        color: '#f44336'
      }}
      rightAction={{
        label: 'Archive',
        icon: <ArchiveIcon />,
        handler: () => onArchive(item.id),
        color: '#4caf50'
      }}
    >
      <div className="list-item">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </SwipeActions>
  );
};
```

### With Button Alternatives
```tsx
<SwipeActions
  leftAction={{
    label: 'Delete',
    handler: handleDelete,
    color: '#f44336'
  }}
  showActionButtons={true}
>
  {/* Your content */}
</SwipeActions>
```

### With Single Action
```tsx
<SwipeActions
  rightAction={{
    label: 'Mark Complete',
    handler: handleComplete,
    color: '#4caf50'
  }}
>
  {/* Your content */}
</SwipeActions>
```

## Swipe Animation Implementation

The component implements natural swipe animations:
1. User swipes horizontally to reveal action
2. Visual and haptic feedback when crossing threshold
3. If released after threshold, action is triggered
4. If released before threshold, content animates back to original position

## Known Limitations/Edge Cases

- May conflict with horizontal scrolling containers
- Performance may vary on lower-end devices
- Very fast swipes might not register properly
- Limited to one action per side
- Not optimized for RTL languages (would need direction-aware logic)

## Change History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2023-07-24 | Initial implementation with left/right swipe actions and button alternatives |
