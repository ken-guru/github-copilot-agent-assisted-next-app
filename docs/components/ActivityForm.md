# ActivityForm Component

## Navigation

- [Component Documentation Home](./README.md)
- **Category**: [Auxiliary Components](./README.md#auxiliary-components)
- **Related Components**:
  - [ActivityManager](./ActivityManager.md) - Parent component that renders ActivityForm
  - [ActivityButton](./ActivityButton.md) - Used to interact with created activities

## Overview

The ActivityForm component provides an interface for creating and editing activities within the application. It handles form input, validation, and submission while offering a consistent user experience for activity management. The component supports both creating new activities and editing existing ones, with appropriate validation and feedback mechanisms.

## Table of Contents
- [Features](#features)
- [Props](#props)
- [Types](#types)
- [State Management](#state-management)
- [Form Validation](#form-validation)
- [Theme Compatibility](#theme-compatibility)
- [Mobile Responsiveness](#mobile-responsiveness)
- [Accessibility](#accessibility)
- [Example Usage](#example-usage)
- [Known Limitations](#known-limitations)
- [Test Coverage](#test-coverage)
- [Related Components](#related-components)
- [Implementation Details](#implementation-details)
- [Change History](#change-history)
- [Related Memory Logs](#related-memory-logs)

## Features

- **Activity Creation**: Form interface for adding new activities
- **Activity Editing**: Support for modifying existing activities
- **Input Validation**: Validates user input for required fields and constraints
- **Error Messaging**: Clear error feedback for invalid inputs
- **Form Submission**: Handles form submission with appropriate callbacks
- **Keyboard Support**: Full keyboard navigation and submission
- **Theme Compatibility**: Adapts styling to light and dark themes
- **Mobile Optimized**: Responsive design for all screen sizes
- **Color Selection**: Optional color selection for activity categorization

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onSubmit` | `(activity: ActivityFormData) => void` | Yes | - | Callback when form is submitted with valid data |
| `onCancel` | `() => void` | No | - | Callback when form submission is canceled |
| `initialValues` | `ActivityFormData` | No | `{ name: '', colorIndex: 0 }` | Initial form values for editing mode |
| `isEditing` | `boolean` | No | `false` | Whether the form is in editing mode |
| `availableColors` | `number[]` | No | `[]` | Array of available color indices |

## Types

```typescript
interface ActivityFormData {
  name: string;
  colorIndex: number;
  id?: string;
}

interface ActivityFormProps {
  onSubmit: (activity: ActivityFormData) => void;
  onCancel?: () => void;
  initialValues?: ActivityFormData;
  isEditing?: boolean;
  availableColors?: number[];
}

interface ValidationErrors {
  name?: string;
}
```

## State Management

The ActivityForm component manages several pieces of state:

1. **Form values**: Tracks the current form input values
   ```typescript
   const [formValues, setFormValues] = useState<ActivityFormData>({
     name: initialValues?.name || '',
     colorIndex: initialValues?.colorIndex ?? 0,
     id: initialValues?.id
   });
   ```

2. **Validation errors**: Tracks form validation errors
   ```typescript
   const [errors, setErrors] = useState<ValidationErrors>({});
   ```

3. **Submission state**: Tracks whether the form is currently being submitted
   ```typescript
   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
   ```

4. **Touched fields**: Tracks which fields have been interacted with
   ```typescript
   const [touched, setTouched] = useState<Record<string, boolean>>({});
   ```

The component uses several key effects:

1. **Initialization effect**: Updates form values when initialValues changes
   ```typescript
   useEffect(() => {
     if (initialValues) {
       setFormValues({
         name: initialValues.name,
         colorIndex: initialValues.colorIndex,
         id: initialValues.id
       });
     }
   }, [initialValues]);
   ```

2. **Validation effect**: Validates form values on change
   ```typescript
   useEffect(() => {
     if (Object.keys(touched).length > 0) {
       setErrors(validateForm(formValues));
     }
   }, [formValues, touched]);
   ```

## Form Validation Logic

The ActivityForm implements comprehensive validation:

1. **Required fields**: Ensures required fields like activity name are provided
2. **Length constraints**: Validates text length (e.g., name between 2-50 characters)
3. **Special character handling**: Handles special characters in activity names
4. **Real-time validation**: Updates errors as the user types
5. **Submission validation**: Performs a final validation before submission

The validation logic is implemented as follows:

```typescript
const validateForm = (values: ActivityFormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!values.name.trim()) {
    errors.name = 'Activity name is required';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Activity name must be at least 2 characters';
  } else if (values.name.trim().length > 50) {
    errors.name = 'Activity name cannot exceed 50 characters';
  }
  
  return errors;
};
```

## Theme Compatibility

The ActivityForm adapts to the application theme:

- **Form styling**: Uses theme variables for colors, borders, and backgrounds
- **Error states**: Error styles adapt to the current theme
- **Focus states**: Focus indicators are visible in both light and dark themes
- **Color preview**: Activity color previews adjust for better visibility in different themes
- **Transition effects**: Smooth transitions between theme modes

## Mobile Responsiveness

The component is designed to be fully responsive:

- **Flexible layout**: Adapts to different screen sizes
- **Touch-friendly inputs**: Larger touch targets on mobile
- **Responsive spacing**: Adjusts margins and padding based on viewport
- **Keyboard handling**: Better virtual keyboard handling on mobile devices
- **Orientation support**: Works in both portrait and landscape orientations

## Accessibility

- **Semantic HTML**: Uses appropriate form elements
- **Label associations**: All inputs have properly associated labels
- **Error announcements**: Errors are announced to screen readers
- **ARIA attributes**: Uses aria-invalid, aria-required, and other appropriate attributes
- **Focus management**: Manages focus appropriately during form interactions
- **Keyboard navigation**: Full keyboard support for form completion

## Example Usage

### Basic New Activity Form

```tsx
import ActivityForm from '../components/ActivityForm';

function ActivityCreationPage() {
  const handleSubmit = (activityData) => {
    console.log('New activity:', activityData);
    // Create activity logic
  };
  
  const handleCancel = () => {
    // Navigate away or close modal
  };
  
  return (
    <div className="activity-creation">
      <h2>Create New Activity</h2>
      <ActivityForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
```

### Editing Existing Activity

```tsx
const existingActivity = {
  id: 'activity-123',
  name: 'Reading',
  colorIndex: 2
};

<ActivityForm
  onSubmit={handleUpdateActivity}
  onCancel={handleCancel}
  initialValues={existingActivity}
  isEditing={true}
/>
```

### With Available Color Constraints

```tsx
<ActivityForm
  onSubmit={handleCreateActivity}
  availableColors={[0, 2, 5, 7]} // Only these color indices are available
/>
```

## Form Submission Flow

The ActivityForm handles form submission through these steps:

1. **Validation**: Performs final validation of all form fields
2. **Error checking**: Checks if there are any validation errors
3. **Submission state**: Sets isSubmitting state to true during submission
4. **Callback invocation**: Calls onSubmit with the validated form data
5. **Form reset**: Optionally resets form after successful submission

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate all fields
  const formErrors = validateForm(formValues);
  setErrors(formErrors);
  
  // Mark all fields as touched
  const allTouched = Object.keys(formValues).reduce(
    (acc, field) => ({ ...acc, [field]: true }),
    {}
  );
  setTouched(allTouched);
  
  // If no errors, proceed with submission
  if (Object.keys(formErrors).length === 0) {
    setIsSubmitting(true);
    
    try {
      onSubmit({
        name: formValues.name.trim(),
        colorIndex: formValues.colorIndex,
        id: formValues.id
      });
      
      // Reset form if not in editing mode
      if (!isEditing) {
        setFormValues({
          name: '',
          colorIndex: 0
        });
        setTouched({});
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }
};
```

## Known Limitations

1. **Color selection**: Limited to predefined color indices
2. **Form state persistence**: Form state is not persisted across navigation
3. **Concurrent submissions**: No protection against multiple rapid submissions
4. **Image support**: No support for activity images or icons
5. **Advanced validation**: No support for complex validation rules
6. **Autofocus behavior**: May not work consistently across all browsers

## Test Coverage

The ActivityForm has comprehensive test coverage:

- **ActivityForm.test.tsx**: Core functionality tests
- **ActivityForm.validation.test.tsx**: Input validation tests
- **ActivityForm.submission.test.tsx**: Form submission tests
- **ActivityForm.a11y.test.tsx**: Accessibility tests

Key tested scenarios include:
- Form initialization with default and custom values
- Input validation for various scenarios
- Error message display
- Form submission with valid and invalid data
- Editing mode functionality
- Keyboard navigation and submission
- Color selection functionality

## Related Components

- **ActivityManager**: Parent component that renders ActivityForm for creation/editing
- **ColorPicker**: Sub-component used for color selection
- **FormInput**: Reusable input component with validation
- **Button**: Reusable button component used for form actions

## Implementation Details

The ActivityForm implements several key patterns:

1. **Controlled form pattern**:
   ```typescript
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setFormValues(prev => ({ ...prev, [name]: value }));
     setTouched(prev => ({ ...prev, [name]: true }));
   };
   ```

2. **Field blur handling**:
   ```typescript
   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
     const { name } = e.target;
     setTouched(prev => ({ ...prev, [name]: true }));
   };
   ```

3. **Color selection handling**:
   ```typescript
   const handleColorSelect = (colorIndex: number) => {
     setFormValues(prev => ({ ...prev, colorIndex }));
     setTouched(prev => ({ ...prev, colorIndex: true }));
   };
   ```

## Change History

- **2025-03-10**: Added real-time validation feedback
- **2025-02-15**: Enhanced color selection UI
- **2025-02-01**: Improved form accessibility
- **2025-01-20**: Added editing mode support
- **2025-01-05**: Enhanced validation logic
- **2025-01-01**: Initial implementation with basic form functionality

## Related Memory Logs

// Add relevant memory logs if any exist

---

## Navigation

- [Back to Component Documentation Home](./README.md)
- **Previous Component**: [ServiceWorkerUpdater](./ServiceWorkerUpdater.md)
- **Next Component**: [TimeDisplay](./TimeDisplay.md)
