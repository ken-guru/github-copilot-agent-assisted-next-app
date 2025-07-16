# ActivityForm Component

## Navigation

- [Component Documentation Home](./README.md)
- **Category**: [Auxiliary Components](./README.md#auxiliary-components)
- **Related Components**:
  - [ActivityManager](./ActivityManager.md) - Parent component that renders ActivityForm
  - [ActivityButton](./ActivityButton.md) - Used to interact with created activities

## Overview

The ActivityForm component provides a Bootstrap-powered interface for adding new activities within the application. It uses React Bootstrap Form components including InputGroup, Form.Control, and Button to deliver a consistent, responsive, and accessible form experience. The component handles form input validation and submission while maintaining compatibility with the application's existing activity management system.

## Table of Contents
- [Features](#features)
- [Props](#props)
- [Bootstrap Integration](#bootstrap-integration)
- [Theme Compatibility](#theme-compatibility)
- [Mobile Responsiveness](#mobile-responsiveness)
- [Accessibility](#accessibility)
- [Example Usage](#example-usage)
- [Known Limitations](#known-limitations)
- [Test Coverage](#test-coverage)
- [Related Components](#related-components)
- [Implementation Details](#implementation-details)
- [Change History](#change-history)

## Features

- **Bootstrap Form Integration**: Uses React Bootstrap components for consistent styling
- **Input Group Layout**: Implements Bootstrap InputGroup for seamless input-button combination
**Activity Creation**: Simple form interface for adding new activities using the canonical Activity type:
```typescript
interface Activity {
  id: string;
  name: string;
  colorIndex: number;
  createdAt: string;
  isActive: boolean;
}
```
Color sets for display are derived from `colorIndex` using `getNextAvailableColorSet`.
- **Input Validation**: Basic validation for required activity names
- **Responsive Design**: Bootstrap's responsive utilities ensure mobile compatibility
- **Keyboard Support**: Full keyboard navigation and form submission
- **Disabled State**: Properly handles disabled state when time is up
- **Theme Integration**: Works with Bootstrap's default theme system

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onAddActivity` | `(activityName: string) => void` | Yes | - | Callback when form is submitted with valid activity name |
| `isDisabled` | `boolean` | Yes | - | Whether the form should be disabled (e.g., when time is up) |

## Bootstrap Integration

The ActivityForm leverages several React Bootstrap components:

### Form Structure
```tsx
import { Form, InputGroup, Button } from 'react-bootstrap';

// Form with Bootstrap styling
<Form onSubmit={handleSubmit} className="mb-3" role="form">
  <InputGroup>
    <Form.Control
      type="text"
      placeholder="New activity name"
      disabled={isDisabled}
    />
    <Button 
      type="submit"
      variant="primary"
      disabled={isDisabled}
    >
      Add
    </Button>
  </InputGroup>
</Form>
```

### Bootstrap Classes Applied
- `mb-3`: Bootstrap margin-bottom utility for form spacing
- `form-control`: Applied automatically by Form.Control for consistent input styling
- `btn btn-primary`: Applied automatically by Button component for primary action styling
- `input-group`: Applied automatically by InputGroup for seamless input-button layout

### Theme Integration
The component uses Bootstrap's default theme system:
- Default primary color for the submit button
- Standard form control styling for inputs
- Bootstrap's disabled state handling
- Consistent spacing using Bootstrap's spacing utilities

## Theme Compatibility

The ActivityForm uses Bootstrap's default theme system:

- **Bootstrap Theme**: Inherits from Bootstrap's default light theme
- **Form Controls**: Uses Bootstrap's form control styling with built-in theme support
- **Primary Actions**: Submit button uses Bootstrap's primary variant
- **Disabled States**: Leverages Bootstrap's disabled state styling
- **Spacing**: Uses Bootstrap's spacing utilities (mb-3) for consistent layout
- **Focus States**: Bootstrap's focus ring styling for better accessibility

## Mobile Responsiveness

Bootstrap's responsive design ensures the ActivityForm works across all devices:

- **InputGroup**: Automatically stacks or stays inline based on screen size
- **Form Controls**: Bootstrap form controls are touch-friendly by default
- **Button Sizing**: Bootstrap buttons maintain proper touch targets
- **Spacing**: Bootstrap spacing utilities ensure appropriate mobile spacing
- **Viewport Adaptation**: Works seamlessly across different viewport sizes

## Accessibility

Bootstrap components provide built-in accessibility features:

- **Semantic HTML**: Form, InputGroup, and Button use proper semantic markup
- **ARIA Support**: Bootstrap components include appropriate ARIA attributes
- **Focus Management**: Bootstrap's focus styles ensure keyboard navigation visibility
- **Screen Reader Support**: Bootstrap markup is screen reader friendly
- **Form Validation**: Bootstrap provides accessible form validation patterns
- **Keyboard Navigation**: Full keyboard support through Bootstrap components

## Example Usage

### Basic Activity Form

```tsx
import ActivityForm from '../components/ActivityForm';

function ActivityCreationSection() {
  const [isTimeUp, setIsTimeUp] = useState(false);
  
  const handleAddActivity = (activityName: string) => {
    console.log('New activity:', activityName);
    // Add activity to state or send to API
  };
  
  return (
    <div className="activity-creation">
      <h2>Add New Activity</h2>
      <ActivityForm 
        onAddActivity={handleAddActivity}
        isDisabled={isTimeUp}
      />
    </div>
  );
}
```

### Within Activity Manager

```tsx
// Used within ActivityManager component
<ActivityForm
  onAddActivity={handleAddActivity}
  isDisabled={isTimeUp}
/>
```

### Testing with Bootstrap Classes

```tsx
// Component renders with Bootstrap classes
const form = screen.getByRole('form');
const input = screen.getByRole('textbox');
const button = screen.getByRole('button', { name: /add/i });

expect(form).toHaveClass('mb-3');
expect(input).toHaveClass('form-control');
expect(button).toHaveClass('btn', 'btn-primary');
```

## Known Limitations

1. **Single Purpose**: Only supports adding new activities, not editing
2. **Basic Validation**: Only validates that activity name is not empty
3. **No Complex Features**: No color selection, categories, or descriptions
4. **Bootstrap Dependency**: Requires React Bootstrap to be properly configured
5. **Theme Limitations**: Limited to Bootstrap's default theme system
6. **Simple Layout**: Uses basic InputGroup layout without advanced Bootstrap features

## Test Coverage

The ActivityForm has comprehensive test coverage including Bootstrap integration:

### Core Test Files
- **ActivityForm.test.tsx**: Original functionality tests ensuring backward compatibility
- **ActivityForm.bootstrap.test.tsx**: Bootstrap-specific integration tests

### Test Scenarios Covered
- **Form Rendering**: Verifies Bootstrap Form components render correctly
- **Input Styling**: Ensures form-control class is applied to inputs
- **Button Styling**: Validates btn and btn-primary classes on submit button
- **Input Group Layout**: Tests Bootstrap InputGroup structure
- **Responsive Behavior**: Verifies Bootstrap responsive utilities
- **Disabled States**: Tests Bootstrap disabled state handling
- **Form Submission**: Validates form submission with Bootstrap components
- **Keyboard Navigation**: Tests accessibility with Bootstrap markup
- **Theme Integration**: Ensures Bootstrap theme compatibility

### Bootstrap-Specific Tests
```typescript
// Example test for Bootstrap integration
it('renders with Bootstrap classes', () => {
  render(<ActivityForm onAddActivity={mockFn} isDisabled={false} />);
  
  const form = screen.getByRole('form');
  const input = screen.getByRole('textbox');
  const button = screen.getByRole('button', { name: /add/i });
  
  expect(form).toHaveClass('mb-3');
  expect(input).toHaveClass('form-control');
  expect(button).toHaveClass('btn', 'btn-primary');
});
```

## Implementation Details

The ActivityForm implements Bootstrap integration patterns:

### Bootstrap Component Usage
```tsx
import { Form, InputGroup, Button } from 'react-bootstrap';

// Bootstrap Form with proper structure
<Form onSubmit={handleSubmit} className="mb-3" role="form">
  <InputGroup>
    <Form.Control
      type="text"
      value={newActivityName}
      onChange={(e) => setNewActivityName(e.target.value)}
      placeholder={isDisabled ? "Time is up!" : "New activity name"}
      disabled={isDisabled}
    />
    <Button 
      type="submit"
      variant="primary"
      disabled={isDisabled}
    >
      Add
    </Button>
  </InputGroup>
</Form>
```

### State Management
```typescript
const [newActivityName, setNewActivityName] = useState('');

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (newActivityName.trim() && !isDisabled) {
    onAddActivity(newActivityName.trim());
    setNewActivityName('');
  }
};
```

### Bootstrap Classes Applied
- **Form**: `mb-3` for bottom margin spacing
- **InputGroup**: Automatic Bootstrap styling for input-button combination  
- **Form.Control**: Automatic `form-control` class for consistent input styling
- **Button**: Automatic `btn btn-primary` classes for primary action styling

## Change History

- **2025-06-28**: **MAJOR UPDATE** - Migrated to Bootstrap components
  - Replaced custom CSS with React Bootstrap Form, InputGroup, and Button
  - Added comprehensive Bootstrap integration tests
  - Updated documentation to reflect Bootstrap usage
  - Maintained backward compatibility with existing props interface
  - Added Bootstrap theme integration
- **2025-03-10**: Added real-time validation feedback
- **2025-02-15**: Enhanced color selection UI
- **2025-02-01**: Improved form accessibility
- **2025-01-20**: Added editing mode support
- **2025-01-05**: Enhanced validation logic
- **2025-01-01**: Initial implementation with basic form functionality

---

## Navigation

- [Back to Component Documentation Home](./README.md)
- **Previous Component**: [ServiceWorkerUpdater](./ServiceWorkerUpdater.md)
- **Next Component**: [TimeDisplay](./TimeDisplay.md)
