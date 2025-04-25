# TouchableButton Component

## Navigation
- [Component Documentation Index](../README.md#components)
- Related: [App](./App.md), [ActivityManager](./ActivityManager.md)

## Overview
The TouchableButton component is a flexible button implementation that adapts to both desktop and touch environments. It provides proper touch targets on mobile devices while maintaining a consistent design across all platforms.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| children | React.ReactNode | Yes | - | Content to display in the button |
| onClick | () => void | Yes | - | Function to call when button is clicked |
| variant | 'primary' \| 'secondary' \| 'outline' \| 'danger' | No | 'primary' | Visual style of the button |
| size | 'small' \| 'medium' \| 'large' | No | 'medium' | Size of the button |
| fullWidth | boolean | No | false | Whether button should take full width of its container |
| disabled | boolean | No | false | Whether button is disabled |
| icon | React.ReactNode | No | - | Optional icon to display before text |
| className | string | No | '' | Additional CSS class names |
| ...rest | ButtonHTMLAttributes | No | - | HTML button attributes passed to the element |

## State Management

The component uses:
- The `useViewport` hook to detect touch capability
- Internal reactive styling based on props and touch detection

## Theme Compatibility

- Uses CSS variables for colors, ensuring theme consistency
- Automatically adapts to light and dark themes
- Focus states are visible in both themes
- All color variables have fallbacks for non-themed environments

## Mobile Responsiveness

- Automatically detects touch devices using the `useViewport` hook
- Increases touch target size to minimum 44px (WCAG 2.1) or 48px (Apple HIG)
- Provides visual feedback optimized for touch interactions
- Uses larger padding on mobile for better touch accuracy
- Properly handles reduced motion preferences

## Accessibility Considerations

- Meets WCAG 2.1 AA requirements for touch target size (minimum 44px)
- Maintains keyboard focus styles for non-mouse users
- Supports all standard button ARIA attributes
- Proper disabled state handling
- Respects user motion preferences
- High contrast between text and background

## Test Coverage

The component has comprehensive test coverage for:
- Rendering with different variants and sizes
- Touch detection and adaptation
- Click handler execution
- Disabled state
- Proper class application
- Icon rendering
- Accessibility attributes

## Usage Examples

### Basic Usage
```tsx
<TouchableButton onClick={() => alert('Clicked!')}>
  Click Me
</TouchableButton>
```

### With Different Variants
```tsx
<TouchableButton
  variant="primary"
  onClick={handleSubmit}
>
  Submit
</TouchableButton>

<TouchableButton
  variant="secondary"
  onClick={handleCancel}
>
  Cancel
</TouchableButton>

<TouchableButton
  variant="outline"
  onClick={handleSave}
>
  Save Draft
</TouchableButton>

<TouchableButton
  variant="danger"
  onClick={handleDelete}
>
  Delete
</TouchableButton>
```

### With Icons
```tsx
<TouchableButton
  onClick={handleSearch}
  icon={<SearchIcon />}
>
  Search
</TouchableButton>
```

### Full Width Button
```tsx
<TouchableButton
  onClick={handleCheckout}
  fullWidth
  size="large"
>
  Proceed to Checkout
</TouchableButton>
```

## Known Limitations/Edge Cases

- The component assumes CSS variables are defined at the :root level
- Focus styles may vary across browsers
- Very small container widths may cause text truncation
- Custom icons should be properly sized to match button text
- Virtual keyboards on mobile may affect the visual appearance when tapped

## Change History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 2023-07-12 | Initial implementation with touch detection and variants |
