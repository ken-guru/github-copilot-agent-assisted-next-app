# UpdateNotification Component

## Navigation
- [Component Documentation Index](../README.md)
- [Bootstrap Migration Guide](../bootstrap-component-mapping.md)

## Overview

The `UpdateNotification` component provides a temporary notification system using Bootstrap Toast functionality. It displays messages to users and automatically dismisses after a specified time interval.

## Current Implementation

### Bootstrap Integration
- **Bootstrap Component**: `Toast` and `ToastContainer` from react-bootstrap
- **Styling**: Uses Bootstrap's `bg-info` variant with white text
- **Positioning**: Fixed positioning at bottom-end with proper z-index
- **Animation**: Bootstrap's built-in fade transitions

### Component API

```typescript
interface UpdateNotificationProps {
  message: string;
  onDismiss: () => void;
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `message` | `string` | Yes | - | The notification message to display |
| `onDismiss` | `() => void` | Yes | - | Callback function called when notification is dismissed |

## Usage Examples

### Basic Usage
```tsx
import { UpdateNotification } from '@/components/UpdateNotification';

function App() {
  const [showNotification, setShowNotification] = useState(false);
  
  const handleDismiss = () => {
    setShowNotification(false);
  };

  return (
    <div>
      {showNotification && (
        <UpdateNotification 
          message="Update available! Please refresh."
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
}
```

### Service Worker Integration
```tsx
// Used with ServiceWorkerUpdater
function ServiceWorkerUpdater() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  
  return updateAvailable ? (
    <UpdateNotification 
      message="New version available. Click to update."
      onDismiss={() => setUpdateAvailable(false)}
    />
  ) : null;
}
```

## Features

### Auto-Dismiss
- Automatically dismisses after 5 seconds
- Timer is cleared on component unmount
- Manual dismiss via close button

### Accessibility
- **Role**: `alert` with `aria-live="assertive"`
- **Focus Management**: Close button is keyboard accessible
- **Screen Reader**: Atomic updates with `aria-atomic="true"`

### Bootstrap Features
- **Responsive**: Works on all screen sizes
- **Theming**: Uses Bootstrap's info variant (blue background)
- **Positioning**: Fixed positioning system with ToastContainer
- **Animation**: Smooth fade in/out transitions

## Styling

### Bootstrap Classes Used
- `toast` - Base Toast component
- `toast-body` - Message content area
- `btn-close` - Close button styling
- `btn-close-white` - White close button for dark backgrounds
- `bg-info` - Blue info background
- `text-white` - White text color
- `position-fixed` - Fixed positioning
- `bottom-0`, `end-0` - Bottom-right positioning
- `p-3` - Padding around container

### Theme Compatibility
- **Light Mode**: Blue background with white text
- **Dark Mode**: Bootstrap's dark mode compatible
- **Custom Themes**: Uses Bootstrap design tokens

## Mobile Responsiveness

- Fixed positioning works on all devices
- Toast container adjusts to viewport
- Touch-friendly close button
- Proper z-index for overlay display

## State Management

### Internal State
- `isVisible`: Controls toast visibility
- Auto-dismiss timer management
- Cleanup on unmount

### External Integration
- Receives `message` and `onDismiss` from parent
- Stateless for message content
- Parent controls when to show/hide

## Test Coverage

### Test Files
- `UpdateNotification.test.tsx` - Core functionality tests (9 tests)
- `UpdateNotification.bootstrap.test.tsx` - Bootstrap integration tests (17 tests)

### Test Categories
- ✅ Basic rendering and message display
- ✅ Auto-dismiss functionality (5 second timer)
- ✅ Manual dismiss via close button
- ✅ Accessibility attributes and keyboard navigation
- ✅ Bootstrap Toast integration
- ✅ ARIA live regions and screen reader support
- ✅ SSR compatibility
- ✅ Dark mode support
- ✅ Animation and transition handling

### Coverage Statistics
- **Total Tests**: 26
- **Passing**: 26/26 (100%)
- **Coverage**: Core functionality, Bootstrap integration, accessibility

## Performance Considerations

- Lightweight Bootstrap Toast component
- Minimal re-renders with proper state management
- Efficient timer cleanup
- CSS-in-JS avoided in favor of Bootstrap classes

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Follows Bootstrap 5.3 browser support matrix

## Known Limitations

1. **Single Instance**: Only one notification at a time
2. **Fixed Timing**: 5-second auto-dismiss is not configurable
3. **Position**: Bottom-end position is not configurable
4. **Styling**: Limited to Bootstrap's info variant

## Future Enhancements

1. **Multiple Notifications**: Stack multiple toasts
2. **Configurable Timing**: Allow custom dismiss timing
3. **Variant Options**: Support success, warning, error variants
4. **Position Options**: Allow different positioning
5. **Action Buttons**: Support action buttons in notifications

## Migration Notes

### From Custom CSS to Bootstrap Toast
- **Before**: Custom CSS module with absolute positioning
- **After**: Bootstrap Toast with ToastContainer
- **Benefits**: 
  - Better accessibility with ARIA attributes
  - Consistent styling with Bootstrap design system
  - Built-in animations and transitions
  - Responsive behavior out of the box

### Breaking Changes
- ARIA role changed from `status` to `alert`
- Close button aria-label changed from "Dismiss notification" to "Close"
- CSS classes replaced with Bootstrap classes
- Component structure changed to use ToastContainer wrapper

### Backward Compatibility
- Same props interface maintained
- Same functional behavior preserved
- Test data-testids preserved for testing

## Change History

### 2025-06-20 - Bootstrap Migration
- **Added**: Bootstrap Toast and ToastContainer integration
- **Added**: Comprehensive Bootstrap integration tests (17 tests)
- **Updated**: Component to use react-bootstrap/Toast
- **Updated**: Accessibility attributes for Bootstrap compliance
- **Updated**: Styling to use Bootstrap's info variant
- **Removed**: Custom CSS module (UpdateNotification.module.css)
- **Removed**: Custom positioning and styling logic
- **Enhanced**: ARIA live regions and screen reader support
- **Enhanced**: Keyboard navigation and focus management

### Previous Implementation
- Custom CSS module with absolute positioning
- Manual styling for dark/light themes
- Custom close button implementation
- Limited accessibility features
