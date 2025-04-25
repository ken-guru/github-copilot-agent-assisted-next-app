# AppLayout Component

## Navigation
- [Component Documentation Index](../README.md#components)
- Related: [Header](./Header.md), [Footer](./Footer.md)

## Overview
The AppLayout component provides a responsive layout structure for the application using semantic HTML elements. It adapts to different viewport sizes and organizes content into a logical header, main content, and footer structure.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Content to display in the main area of the layout |

## State Management

The component uses:
- The `useViewport` hook to detect viewport size and adapt the layout
- The `useTheme` hook to apply the current theme

## Theme Compatibility

- Passes the current theme via the `data-theme` attribute for styling
- Uses theme-aware CSS variables for colors and borders
- Adapts header and footer styling based on theme

## Mobile Responsiveness

- Mobile-first approach with responsive adaptations
- Sticky header and footer on mobile for improved usability
- Proper spacing and padding adjustments for different screen sizes
- Viewport-specific CSS classes for targeted styling

## Accessibility Considerations

- Uses proper semantic HTML elements (header, main, footer)
- Applies appropriate ARIA roles
- Ensures proper keyboard navigation order
- Maintains minimum touch target sizes on mobile
- Preserves content hierarchy

## Test Coverage

The component has comprehensive test coverage for:
- Proper rendering of semantic structure
- Viewport-specific class application
- Children rendering in the main section
- Header and footer inclusion

## Usage Examples

### Basic Usage
```tsx
<AppLayout>
  <h1>Welcome to the App</h1>
  <p>This content will appear in the main section.</p>
</AppLayout>
```

### With Router Integration
```tsx
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  );
}
```

### With Context Providers
```tsx
function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <AppLayout>
          <DashboardContent />
        </AppLayout>
      </AppStateProvider>
    </ThemeProvider>
  );
}
```

## Known Limitations/Edge Cases

- The layout assumes a vertical mobile orientation; horizontal mobile may need adjustments
- Very tall content on small screens may cause scrolling issues with sticky header/footer
- Components within the layout should handle their own responsive behavior
- Requires the CSS variables system to be loaded for proper styling

## Change History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2023-07-13 | Initial implementation with mobile/desktop adaptations |
