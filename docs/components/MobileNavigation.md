# MobileNavigation Component

## Navigation
- [Component Documentation Index](./README.md#components)
- Related: [AppLayout](./AppLayout.md), [Header](./Header.md)

## Overview
The MobileNavigation component provides a touch-optimized navigation bar for switching between different application views on mobile devices. It's designed to be fixed at the bottom of the screen for easy thumb access and supports both button taps and swipe gestures.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| views | NavigationView[] | Yes | - | Array of views available for navigation |
| activeView | string | Yes | - | ID of the currently active view |
| onViewChange | (viewId: string) => void | Yes | - | Callback when view changes |

## Types

```typescript
interface NavigationView {
  id: string;
  label: string;
  icon: React.ReactNode;
}
```

## State Management

The component manages several pieces of state:
- Animation status for view transitions
- Touch/swipe gesture handling
- Swipe hint visibility for user onboarding

The component also uses the `useViewport` hook to conditionally render based on screen size.

## Theme Compatibility

- Adapts to light and dark themes automatically
- Uses CSS variables for theming consistency
- Provides appropriate contrast in both themes
- Maintains visibility of active state indicators

## Mobile Responsiveness

This component is specifically designed for mobile devices:
- Only renders on mobile viewports
- Placed at the bottom of the screen for easy thumb access
- Touch-friendly button sizes (minimum 48px)
- Support for swipe gestures for natural navigation
- Adapts to device-specific features like notches and safe areas
- Visual feedback for interactions

## Accessibility Considerations

- Proper ARIA roles and attributes
- Appropriate aria-pressed state for buttons
- Sufficient color contrast for both themes
- Respects reduced motion preferences
- Focus indicators for keyboard navigation
- Can be fully operated via buttons without requiring swipe gestures
- Proper semantic HTML structure

## Test Coverage

The component has comprehensive test coverage:
- Rendering the correct navigation options
- Touch gesture handling
- View switching behavior
- Mobile vs. desktop conditional rendering
- Accessibility attributes
- Integration with AppLayout
- Visual feedback and animations

## Usage Examples

### Basic Usage
```tsx
import MobileNavigation from '../components/MobileNavigation';
import { Activity, Clock, FileText } from 'react-feather';

const App = () => {
  const [activeView, setActiveView] = useState('activity');
  
  const navigationViews = [
    { id: 'activity', label: 'Activities', icon: <Activity size={20} /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock size={20} /> },
    { id: 'summary', label: 'Summary', icon: <FileText size={20} /> }
  ];
  
  return (
    <div className="app-container">
      {/* Main content here */}
      
      <MobileNavigation
        views={navigationViews}
        activeView={activeView}
        onViewChange={setActiveView}
      />
    </div>
  );
};
```

### Integration with AppLayout
```tsx
export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  initialView = 'activity'
}) => {
  const { isMobile } = useViewport();
  const [activeView, setActiveView] = useState(initialView);
  
  const navigationViews = [
    { id: 'activity', label: 'Activities', icon: <Activity size={20} /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock size={20} /> },
    { id: 'summary', label: 'Summary', icon: <FileText size={20} /> }
  ];
  
  return (
    <div className={containerClass}>
      <Header />
      <main className={mainClass}>{children}</main>
      
      {isMobile ? (
        <MobileNavigation
          views={navigationViews}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      ) : (
        <Footer />
      )}
    </div>
  );
};
```

## Swipe Gesture Implementation

The component implements horizontal swipe detection for natural navigation between views:

```typescript
const handleTouchEnd = (e: React.TouchEvent) => {
  if (!touchState.isSwiping) return;
  
  // Get touch end position
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  
  // Calculate distance moved
  const deltaX = touchState.startX - endX;
  const deltaY = Math.abs(touchState.startY - endY);
  
  // Only consider horizontal swipes (ignore diagonal/vertical)
  if (deltaY < 50) {
    // Minimum distance threshold for a swipe
    const SWIPE_THRESHOLD = 80;
    
    // Check swipe direction and distance
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      // Swipe left (next view)
      if (deltaX > 0 && activeIndex < views.length - 1) {
        onViewChange(views[activeIndex + 1].id);
      }
      // Swipe right (previous view)
      else if (deltaX < 0 && activeIndex > 0) {
        onViewChange(views[activeIndex - 1].id);
      }
    }
  }
}
```

## Known Limitations/Edge Cases

- Swipe gestures may conflict with horizontal scrolling content
- Does not currently support more than 5 navigation items comfortably
- On very small screens, labels may be truncated
- May need adjustments for landscape mode on small devices
- Users need to discover swipe functionality (hence the swipe hint)
- Not optimized for RTL languages (would need direction-aware swipe logic)

## Change History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2023-07-23 | Initial implementation with button and swipe navigation |
