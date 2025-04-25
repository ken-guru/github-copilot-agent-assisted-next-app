# Gesture Components Integration Guide

This document provides guidelines for integrating the PullToRefresh and SwipeActions components into existing application features.

## Table of Contents

1. [Overview](#overview)
2. [PullToRefresh Integration](#pulltorefresh-integration)
3. [SwipeActions Integration](#swipeactions-integration)
4. [Combining Gesture Components](#combining-gesture-components)
5. [Accessibility Considerations](#accessibility-considerations)
6. [Performance Optimization](#performance-optimization)

## Overview

The gesture components provide mobile-friendly touch interactions:
- **PullToRefresh**: Adds native-feeling pull-to-refresh functionality to scrollable content
- **SwipeActions**: Enables list items to have swipe gestures revealing actions

These components conditionally render based on device capabilities, providing fallback interfaces on non-touch devices.

## PullToRefresh Integration

### Recommended Use Cases

PullToRefresh is ideal for:
- Lists that display dynamic data (activities, timelines, etc.)
- Content areas that benefit from regular updates
- Scrollable containers where user might want to refresh content

### Basic Integration Example

```tsx
import PullToRefresh from '../components/PullToRefresh';

// Inside your component
const MyListComponent = () => {
  const [items, setItems] = useState([]);
  
  const handleRefresh = async () => {
    // Show loading indicator automatically
    const newData = await fetchLatestData();
    setItems(newData);
    // Loading indicator automatically hides after completion
  };
  
  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="scrollable-container">
        {items.map(item => (
          <ListItem key={item.id} item={item} />
        ))}
      </div>
    </PullToRefresh>
  );
};
```

### Advanced Configuration

For more control:

```tsx
<PullToRefresh 
  onRefresh={handleRefresh}
  pullThreshold={120} // Adjust sensitivity (default: 100px)
  showRefreshButton={true} // Show button alternative
  refreshButtonText="Update Now" // Custom button text
  useHapticFeedback={false} // Disable vibration
>
  {/* Your content */}
</PullToRefresh>
```

### Integration with State Management

When using with global state:

```tsx
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchItems } from '../store/itemsSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector(state => state.items);
  
  const handleRefresh = async () => {
    await dispatch(fetchItems());
  };
  
  return (
    <PullToRefresh onRefresh={handleRefresh}>
      {/* Your content */}
    </PullToRefresh>
  );
};
```

## SwipeActions Integration

### Recommended Use Cases

SwipeActions is ideal for:
- List items with common actions (delete, archive, etc.)
- Task items that can be marked complete
- Any repeating element where quick actions are beneficial

### Basic Integration Example

```tsx
import SwipeActions from '../components/SwipeActions';

// Inside your component
const TaskItem = ({ task, onDelete, onComplete }) => {
  return (
    <SwipeActions
      leftAction={{
        label: 'Delete',
        icon: <TrashIcon />,
        handler: () => onDelete(task.id),
        color: '#f44336'
      }}
      rightAction={{
        label: 'Complete',
        icon: <CheckIcon />,
        handler: () => onComplete(task.id),
        color: '#4caf50'
      }}
    >
      <div className="task-item">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>
    </SwipeActions>
  );
};
```

### Advanced Configuration

For more control:

```tsx
<SwipeActions
  leftAction={/* action object */}
  rightAction={/* action object */}
  actionThreshold={100} // Adjust sensitivity (default: 80px)
  showActionButtons={true} // Show button alternatives
  useHapticFeedback={false} // Disable vibration
>
  {/* Your content */}
</SwipeActions>
```

### Integration with List Components

With a list of items:

```tsx
const ItemList = ({ items }) => {
  return (
    <div className="list-container">
      {items.map(item => (
        <SwipeActions
          key={item.id}
          leftAction={{
            label: 'Delete',
            handler: () => deleteItem(item.id),
            color: '#f44336'
          }}
        >
          <div className="list-item">
            {item.name}
          </div>
        </SwipeActions>
      ))}
    </div>
  );
};
```

## Combining Gesture Components

The gesture components can be combined for a rich mobile experience:

```tsx
const TaskList = () => {
  const handleRefresh = async () => {
    await fetchLatestTasks();
  };
  
  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="task-list">
        {tasks.map(task => (
          <SwipeActions
            key={task.id}
            leftAction={{
              label: 'Delete',
              handler: () => deleteTask(task.id),
              color: '#f44336'
            }}
            rightAction={{
              label: 'Complete',
              handler: () => completeTask(task.id),
              color: '#4caf50'
            }}
          >
            <TaskItem task={task} />
          </SwipeActions>
        ))}
      </div>
    </PullToRefresh>
  );
};
```

## Accessibility Considerations

When integrating gesture components:

1. **Always provide button alternatives** for key actions
2. **Consider keyboard users** by ensuring proper focus management
3. **Add appropriate ARIA labels** to describe actions
4. **Test with screen readers** to ensure proper narration
5. **Respect reduced motion preferences** for animations

Example of accessible integration:

```tsx
<SwipeActions
  leftAction={{
    label: 'Delete Task', // More descriptive label for screen readers
    handler: handleDelete,
    color: '#f44336'
  }}
  showActionButtons={true} // Critical for keyboard users
>
  <div 
    className="list-item" 
    aria-label={`Task: ${task.title}`}
  >
    {task.title}
  </div>
</SwipeActions>
```

## Performance Optimization

To ensure smooth gesture interactions:

1. **Avoid heavy processing during gestures** - defer until completion
2. **Optimize list rendering** with virtualization for long lists
3. **Lazy load images and heavy content** in list items
4. **Use proper memoization** to prevent re-renders during gestures
5. **Monitor interaction performance** with React DevTools

Example with optimization:

```tsx
// Memoize list items to prevent unnecessary re-renders during gestures
const MemoizedTaskItem = React.memo(({ task, onDelete, onComplete }) => (
  <SwipeActions
    leftAction={{
      label: 'Delete',
      handler: () => onDelete(task.id),
      color: '#f44336'
    }}
    rightAction={{
      label: 'Complete',
      handler: () => onComplete(task.id),
      color: '#4caf50'
    }}
  >
    <div className="task-item">
      <h3>{task.title}</h3>
    </div>
  </SwipeActions>
));

// Use in parent component
return (
  <PullToRefresh onRefresh={handleRefresh}>
    <div className="task-list">
      {tasks.map(task => (
        <MemoizedTaskItem 
          key={task.id}
          task={task}
          onDelete={handleDelete}
          onComplete={handleComplete}
        />
      ))}
    </div>
  </PullToRefresh>
);
```

This guide provides basic and advanced integration strategies for our new gesture components. For more specific use cases, consult the component documentation or reach out to the development team.
