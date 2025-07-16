# ActivityList Component Documentation

## Navigation
- [Component Documentation Index](../README.md)
- [ActivityCrud](./ActivityCrud.md)
- [ActivityForm](./ActivityForm.md)

## Overview
`ActivityList` displays a list of activities with edit and delete actions. It is used within `ActivityCrud` for activity management. The component is styled with Bootstrap and supports accessibility and responsive design.

## Props
| Prop           | Type                | Required | Description                                 |
|----------------|---------------------|----------|---------------------------------------------|
| activities     | Activity[]          | Yes      | List of activities to display (canonical type, see ActivityForm.md) |
| onEdit         | (activity: Activity) => void | Yes      | Callback for editing an activity            |
| onDelete       | (activity: Activity) => void | Yes      | Callback for deleting an activity           |

## State Management
- Stateless; receives all data and callbacks via props

## Theme Compatibility
Uses Bootstrap classes for styling
Inherits theme from parent
Color sets for display are derived from `colorIndex` using `getNextAvailableColorSet`.

## Mobile Responsiveness
- Responsive layout adapts to mobile screens
- Touch-friendly action buttons

## Accessibility
- ARIA labels for action buttons
- Keyboard navigation for edit/delete actions
- Semantic HTML for list structure

## Test Coverage Summary
- Renders activity list
- Edit and delete actions
- Accessibility: ARIA, keyboard navigation
- Edge cases: empty list, long activity names

## Usage Examples
```tsx
<ActivityList activities={activities} onEdit={handleEdit} onDelete={handleDelete} />
```

## Known Limitations / Edge Cases
- No bulk actions (handled in ActivityCrud)
- Relies on parent for error handling and state

## Change History
- 2024-06-13: Initial implementation with Bootstrap styling and accessibility

## Related Components
- [ActivityCrud](./ActivityCrud.md)
- [ActivityForm](./ActivityForm.md)

---
[Back to Component Documentation Index](../README.md)
