# Common UI Component Library

This library provides reusable UI components with consistent styling for use throughout the application. These components follow the project's design system and theme implementation.

## Table of Contents

1. [Installation](#installation)
2. [Components](#components)
   - [Button](#button)
   - [IconButton](#iconbutton)
   - [StatusIndicator](#statusindicator)
   - [Card](#card)
3. [Theme Integration](#theme-integration)
4. [Best Practices](#best-practices)
5. [Contribution Guidelines](#contribution-guidelines)

## Installation

No additional installation is required. The components are already available in the project's codebase.

To use components in your code, import them from the common components library:

```tsx
import { Button, IconButton, StatusIndicator, Card } from '@/components/common';
```

## Components

### Button

A versatile button component that supports various styling options, text labels, and icons.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | Required | Button content |
| onClick | (e: React.MouseEvent<HTMLButtonElement>) => void | Required | Click handler |
| className | string | '' | Additional CSS class |
| disabled | boolean | false | Disable the button |
| variant | 'default' \| 'primary' \| 'secondary' \| 'danger' \| 'success' | 'default' | Button variant (controls styling) |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Button size |
| iconLeft | keyof typeof ICON_PATHS \| string | undefined | Icon to display on the left side |
| iconRight | keyof typeof ICON_PATHS \| string | undefined | Icon to display on the right side |
| fullWidth | boolean | false | Make the button take full width |
| testId | string | undefined | Test ID for testing |
| type | 'button' \| 'submit' \| 'reset' | 'button' | HTML button type |

#### Usage Examples

Basic Button:
```tsx
<Button onClick={handleClick}>
  Click Me
</Button>
```

Primary Button with Left Icon:
```tsx
<Button 
  onClick={handleSave} 
  variant="primary" 
  iconLeft="check"
>
  Save Changes
</Button>
```

Danger Button with Right Icon:
```tsx
<Button 
  onClick={handleDelete} 
  variant="danger" 
  iconRight="delete"
>
  Delete Item
</Button>
```

Full Width Submit Button:
```tsx
<Button 
  onClick={handleSubmit} 
  variant="primary" 
  fullWidth 
  type="submit"
>
  Submit Form
</Button>
```

### IconButton

An icon-only button that provides a compact UI control with icon representation.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| icon | keyof typeof ICON_PATHS \| string | Required | Icon to display |
| label | string | Required | Button label (for accessibility) |
| onClick | (e: React.MouseEvent<HTMLButtonElement>) => void | Required | Click handler |
| className | string | '' | Additional CSS class |
| disabled | boolean | false | Disable the button |
| variant | 'default' \| 'primary' \| 'secondary' \| 'danger' \| 'success' | 'default' | Button variant |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Button size |
| testId | string | undefined | Test ID for testing |

#### Usage Examples

Basic IconButton:
```tsx
<IconButton
  icon="play"
  label="Start Activity"
  onClick={handleStart}
/>
```

Danger Delete IconButton:
```tsx
<IconButton
  icon="delete"
  label="Delete Item"
  onClick={handleDelete}
  variant="danger"
  size="small"
/>
```

Edit IconButton with Primary styling:
```tsx
<IconButton
  icon="edit"
  label="Edit Activity"
  onClick={handleEdit}
  variant="primary"
/>
```

### StatusIndicator

A visual status representation component for showing state information.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| status | 'active' \| 'inactive' \| 'warning' \| 'error' \| 'success' | Required | The status to display |
| label | string | Required | Text description of the status |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Size of the indicator |
| className | string | '' | Additional CSS class |
| hideLabel | boolean | false | Hide the text label |
| testId | string | undefined | Test ID for testing |

#### Usage Examples

Basic status indicator:
```tsx
<StatusIndicator
  status="active"
  label="Activity Running"
/>
```

Warning status with no label:
```tsx
<StatusIndicator
  status="warning"
  label="Connection unstable"
  hideLabel
/>
```

Error status with custom size:
```tsx
<StatusIndicator
  status="error"
  label="Failed to save"
  size="large"
/>
```

### Card

A container component that provides consistent styling for content sections.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | Required | Card content |
| className | string | '' | Additional CSS class |
| title | string | undefined | Card title (optional) |
| padding | 'none' \| 'small' \| 'medium' \| 'large' | 'medium' | Padding size |
| elevation | 'none' \| 'low' \| 'medium' \| 'high' | 'low' | Shadow elevation |
| testId | string | undefined | Test ID for testing |

#### Usage Examples

Basic card:
```tsx
<Card>
  <p>This is the card content</p>
</Card>
```

Card with title and custom padding:
```tsx
<Card
  title="Activity Details"
  padding="large"
>
  <p>Start time: 9:00 AM</p>
  <p>Duration: 2 hours</p>
</Card>
```

High-elevation card with custom class:
```tsx
<Card
  title="Important Notice"
  elevation="high"
  className="notification-card"
>
  <p>Your subscription will expire in 3 days</p>
  <Button onClick={handleRenew} variant="primary">Renew Now</Button>
</Card>
```

## Theme Integration

All common components have been designed to work seamlessly with the application's theme system. They:

1. Use CSS variables defined in the theme
2. Adapt automatically to light/dark/system theme modes
3. Maintain accessibility standards across all theme variations

### Theme-Aware Properties

The components use the following theme variables:

- **Colors**: Use theme-defined HSL variables for consistent appearances
- **Spacing**: Follow the application's spacing scale
- **Typography**: Use theme font settings
- **Border radius**: Consistent across components
- **Animations**: Consistent transitions

### Theme Variants Example

```tsx
// Components automatically adapt to the active theme
<div className="theme-dark">
  <Card title="Dark Theme Example">
    <Button variant="primary">Primary Button</Button>
    <StatusIndicator status="active" label="Status" />
  </Card>
</div>

<div className="theme-light">
  <Card title="Light Theme Example">
    <Button variant="primary">Primary Button</Button>
    <StatusIndicator status="active" label="Status" />
  </Card>
</div>
```

## Best Practices

When using these components, follow these guidelines:

1. **Consistency**: Use the appropriate component variant for similar actions across the application
2. **Accessibility**: Always provide meaningful labels, especially for IconButton
3. **Responsive Design**: Consider how components will behave at different screen sizes
4. **Composition**: Combine components thoughtfully (e.g., Button inside Card)
5. **Testing**: Test components in both light and dark themes

### Common Patterns

```tsx
// Form submission pattern
<Card title="Activity Form">
  <form onSubmit={handleSubmit}>
    {/* Form inputs */}
    <div className="button-group">
      <Button 
        onClick={() => {}} 
        variant="secondary"
        type="button"
      >
        Cancel
      </Button>
      <Button 
        onClick={() => {/* Form handled by onSubmit */}} 
        variant="primary"
        type="submit"
      >
        Save
      </Button>
    </div>
  </form>
</Card>

// Action confirmation pattern
<Card title="Confirm Action">
  <p>Are you sure you want to delete this item?</p>
  <div className="button-group">
    <Button onClick={handleCancel} variant="secondary">Cancel</Button>
    <Button onClick={handleConfirm} variant="danger">Delete</Button>
  </div>
</Card>

// Status display pattern
<Card>
  <div className="status-container">
    <StatusIndicator status={isOnline ? "active" : "inactive"} 
                     label={isOnline ? "Online" : "Offline"} />
    <p>Last updated: {lastUpdated}</p>
  </div>
</Card>
```

## Contribution Guidelines

When extending or modifying the component library:

1. **Maintain Consistency**: Follow the established patterns and naming conventions
2. **Test-First Development**: Write tests before implementing changes
3. **Documentation**: Update this documentation when adding new components or props
4. **Accessibility**: Ensure all components meet WCAG standards
5. **Theme Compatibility**: Test in all theme modes
6. **Pull Requests**: Include before/after screenshots with PR submissions