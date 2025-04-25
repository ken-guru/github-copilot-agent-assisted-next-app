# PullToRefresh Component

## Navigation
- [Component Documentation Index](./README.md#components)
- **Category**: [Mobile Interactions](./README.md#mobile-interactions)
- **Related Components**:
  - [SwipeActions](./SwipeActions.md) - Complementary mobile gesture component

## Overview
The PullToRefresh component adds pull-to-refresh functionality to content on mobile devices. It provides natural touch interactions with visual feedback for refreshing data, similar to native mobile apps.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| children | React.ReactNode | Yes | - | Content to wrap with pull-to-refresh functionality |
| onRefresh | () => Promise<void> \| void | Yes | - | Function called when refresh is triggered |
| pullThreshold | number | No | 100 | Distance in pixels required to trigger refresh |
| showRefreshButton | boolean | No | false | Whether to show a button alternative |
| refreshButtonText | string | No | "Refresh" | Text for the refresh button |
| disablePullToRefresh | boolean | No | false | Disables pull gesture (keeping button if shown) |
| useHapticFeedback | boolean | No | true | Whether to use vibration API for feedback |

## State Management

The component manages several pieces of state:
- Pull distance tracking during touch interactions
- Ready-to-refresh state when threshold is reached
- Loading state during refresh operation
- Reduced motion preference detection

## Theme Compatibility

- Adapts to light and dark themes automatically
- Uses CSS variables for consistent theming
- Provides appropriate contrast in both themes
- Spinner and indicators respect theme colors

## Mobile Responsiveness

This component is specifically designed for mobile devices:
- Only activates pull-to-refresh functionality on touch devices
- Maintains standard scrolling behavior on desktop
- Visual indicators sized appropriately for mobile viewports
- Uses standard mobile interaction patterns
- Visual and haptic feedback for a natural feel

## Accessibility Considerations

- Optional button alternative for non-touch users
- Respects reduced motion preferences
- All interactive elements have appropriate ARIA labels
- Maintains standard scrolling behavior when needed
- Visual feedback does not rely solely on color

## Test Coverage

The component has comprehensive test coverage:
- Pull distance tracking and threshold detection
- Refresh triggering behavior
- Touch event handling
- Loading state management
- Haptic feedback integration
- Reduced motion preference handling
- Desktop vs. mobile rendering differences

## Usage Examples

### Basic Usage
```tsx
import PullToRefresh from '../components/PullToRefresh';

const MyComponent = () => {
  const handleRefresh = async () => {
    // Fetch new data
    await fetchData();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="content">
        {/* Your scrollable content here */}
        <ul>
          {items.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </PullToRefresh>
  );
};
```

### With Button Alternative
```tsx
<PullToRefresh 
  onRefresh={handleRefresh}
  showRefreshButton={true}
  refreshButtonText="Update Data"
>
  {/* Your content */}
</PullToRefresh>
```

### Disabled Pull Gesture (Button Only)
```tsx
<PullToRefresh 
  onRefresh={handleRefresh}
  showRefreshButton={true}
  disablePullToRefresh={true}
>
  {/* Your content */}
</PullToRefresh>
```

## Pull-to-Refresh Animation

The component implements a natural pull-to-refresh animation:
1. Initial pull shows a downward arrow
2. As user pulls past threshold, arrow rotates 180°
3. Upon release, a loading spinner appears
4. After refresh completes, content slides back into place

## Known Limitations/Edge Cases

- May conflict with other scroll-based interactions
- Can interfere with browser's native pull-to-refresh on some mobile browsers
- Not optimized for horizontal scrolling containers
- Very fast pulls may not register correctly
- Performance may vary on lower-end devices

## Change History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2023-07-24 | Initial implementation with pull gesture and button alternative |
