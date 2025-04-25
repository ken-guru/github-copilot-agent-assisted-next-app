# Performance Optimization Guide

This guide provides best practices for optimizing performance in our mobile React application, with a focus on rendering efficiency and user experience.

## Table of Contents

1. [Performance Optimization Principles](#performance-optimization-principles)
2. [Rendering Optimization Utilities](#rendering-optimization-utilities)
3. [Lazy Loading Strategies](#lazy-loading-strategies)
4. [State Management Optimization](#state-management-optimization)
5. [Event Handling Optimization](#event-handling-optimization)
6. [Measuring Performance](#measuring-performance)
7. [Mobile-Specific Optimizations](#mobile-specific-optimizations)

## Performance Optimization Principles

### Measure First, Optimize Second
Always establish a baseline and measure performance before and after optimization attempts:
- Use the built-in performance utilities to collect metrics
- Focus on user-centric metrics (Time to Interactive, First Input Delay)
- Prioritize optimizations that provide the most significant improvements

### Focus on Mobile Constraints
Mobile devices have specific constraints to consider:
- Limited CPU and memory
- Battery consumption concerns
- Variable network conditions
- Touch interaction requirements

### Perceived Performance Matters
Sometimes improving perceived performance is as important as actual performance:
- Provide immediate feedback for user actions
- Use skeleton screens instead of spinners where possible
- Prioritize rendering the visible content first
- Add subtle animations to mask loading times

## Rendering Optimization Utilities

Our application includes several utilities to optimize rendering performance:

### useMemoizedValue
Use for expensive calculations or to prevent unnecessary recreation of objects:

```jsx
const filteredItems = useMemoizedValue(
  items.filter(item => item.name.includes(searchTerm)),
  [items, searchTerm]
);
```

### useStableCallback
Use when passing callbacks to child components to prevent unnecessary re-renders:

```jsx
const handleItemSelect = useStableCallback((item) => {
  setSelectedItem(item);
  logSelection(item);
});

// Child component won't re-render when logSelection changes
return <ItemList onSelectItem={handleItemSelect} />;
```

### useDebouncedValue
Use to prevent rapid re-renders when a value changes frequently:

```jsx
// Updates at most once every 300ms
const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

// Use the debounced value for filtering
useEffect(() => {
  setFilteredItems(items.filter(item => 
    item.name.includes(debouncedSearchTerm)
  ));
}, [items, debouncedSearchTerm]);
```

### useThrottledCallback
Use for high-frequency events like scrolling, resizing, or dragging:

```jsx
const handleScroll = useThrottledCallback(() => {
  const scrollPosition = scrollRef.current.scrollTop;
  setScrollProgress(scrollPosition / maxScroll);
}, 100);
```

### usePreventUnnecessaryRenders
Use to memoize components based on specific props:

```jsx
const MemoizedItem = usePreventUnnecessaryRenders(
  ({ item, onSelect }) => (
    <div onClick={() => onSelect(item)}>
      {item.name} - {item.value}
    </div>
  ),
  ['item.id', 'item.name'] // Only re-render if these props change
);
```

### measureRenderTime
Use to identify slow-rendering components:

```jsx
useEffect(() => {
  const stopMeasuring = measureRenderTime('ComplexComponent');
  return stopMeasuring;
}, [data]);
```

## Lazy Loading Strategies

Use lazy loading to reduce initial bundle size and improve loading performance:

### Component Lazy Loading
Use the `lazyWithPreload` utility to lazy load components:

```jsx
import { lazyWithPreload } from '../utils/lazyLoading';

const LazyVisualization = lazyWithPreload(
  () => import('./Visualization'),
  (metric) => console.log(`Load time: ${metric.loadTimeMs}ms`)
);

// Later, preload when likely to be needed
LazyVisualization.preload();
```

### Route-Based Splitting
Split code by routes to load only what's needed for the current view:

```jsx
const DashboardPage = lazyWithPreload(() => import('./pages/Dashboard'));
const SettingsPage = lazyWithPreload(() => import('./pages/Settings'));

// Preload when hovering navigation links
const handleNavHover = (route) => {
  if (route === 'dashboard') DashboardPage.preload();
  if (route === 'settings') SettingsPage.preload();
};
```

### Preloading Strategies
- **Hover Preloading**: Load when user hovers UI elements
- **Route Preloading**: Load next likely routes
- **Idle Time Preloading**: Load during browser idle time
- **Visibility-Based**: Load when elements are close to viewport

## State Management Optimization

Optimize how state is structured and updated to improve performance:

### State Normalization
Structure state to avoid deep nesting and enable targeted updates:

```jsx
// Instead of nested arrays
const normalizedState = {
  items: {
    'id-1': { id: 'id-1', name: 'Item 1' },
    'id-2': { id: 'id-2', name: 'Item 2' }
  },
  itemIds: ['id-1', 'id-2']
};
```

### Batch State Updates
Group related state updates to reduce renders:

```jsx
const handleFormSubmit = () => {
  // Bad: Three separate renders
  setSubmitting(true);
  setFormErrors({});
  setSubmitCount(count => count + 1);
  
  // Better: React 18 automatic batching
  setSubmitting(true);
  setFormErrors({});
  setSubmitCount(count => count + 1);
  
  // Best for complex state: useReducer
  dispatch({
    type: 'SUBMIT_FORM',
    payload: { formData }
  });
};
```

### Use Functional Updates
Always use functional updates when new state depends on previous state:

```jsx
// Wrong: May use stale state
setCounter(counter + 1);

// Right: Always uses latest state
setCounter(prevCounter => prevCounter + 1);
```

## Event Handling Optimization

Optimize event handlers for better performance:

### Debounce and Throttle
Use debouncing or throttling for frequent events:

```jsx
// Debounce for search inputs
const debouncedHandleSearch = useCallback(
  useDebouncedValue(handleSearch, 300),
  [handleSearch]
);

// Throttle for scroll events
const throttledHandleScroll = useCallback(
  useThrottledCallback(handleScroll, 100),
  [handleScroll]
);
```

### Passive Event Listeners
Use passive event listeners for scroll, touchstart, and touchmove:

```jsx
useEffect(() => {
  const options = { passive: true };
  element.addEventListener('touchmove', handleTouchMove, options);
  
  return () => {
    element.removeEventListener('touchmove', handleTouchMove, options);
  };
}, [handleTouchMove]);
```

## Measuring Performance

Use built-in utilities to measure and monitor performance:

### Component Render Time
```jsx
useEffect(() => {
  const stopMeasure = measureRenderTime('MyComponent');
  return stopMeasure;
}, [deps]);
```

### User Interaction Response Time
```jsx
const handleClick = () => {
  const start = performance.now();
  // Perform action
  const duration = performance.now() - start;
  console.log(`Action took ${duration}ms`);
};
```

### Performance Profiling
Use React DevTools Profiler for in-depth analysis:
1. Record a session of user interactions
2. Identify components with frequent renders
3. Look for render cascades
4. Analyze commit times for slow renders

## Mobile-Specific Optimizations

Additional optimizations specific to mobile devices:

### Touch Interaction Optimization
- Use larger touch targets (minimum 44px × 44px)
- Implement touch feedback with fast response time
- Minimize layout shifts during interactions
- Use hardware-accelerated animations

### Network Optimization
- Implement retry logic for network requests
- Cache responses for offline usage
- Use progressive loading for images
- Adapt content quality based on network speed

### Battery Conservation
- Reduce JavaScript parsing and execution
- Limit background processing
- Use efficient animation techniques
- Optimize sensor usage (GPS, accelerometer)

## Performance Testing

Regularly test performance on actual devices:

### Device Testing Matrix
Test on a representative set of devices:
- Low-end Android device
- Mid-range Android device
- Older iOS device
- Current iOS device

### Performance Budget
Establish and maintain performance budgets:
- JavaScript bundle size: < 200KB (gzipped)
- Time to Interactive: < 3 seconds on mid-range devices
- First Input Delay: < 100ms
- Largest Contentful Paint: < 2.5 seconds

### Automated Performance Testing
Consider implementing automated performance testing:
- Lighthouse CI for core web vitals
- Custom metrics for application-specific measurements
- Performance regression testing in CI pipeline
