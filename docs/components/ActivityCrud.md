# ActivityCrud Component Documentation

## Navigation
- [Component Documentation Index](../README.md)
- [ActivityForm](./ActivityForm.md)
- [ActivityList](./ActivityList.md)

## Overview
`ActivityCrud` provides a management interface for creating, editing, deleting, importing, and exporting activities. It uses React-Bootstrap modals for confirmation dialogs and import/export UX, with robust accessibility and error handling.

## Props
- None (stateful management component)

## State Management
- `activities: Activity[]` — List of activities
- `showForm: boolean` — Show add/edit modal
- `editingActivity: Activity | null` — Activity being edited
- `showConfirm: boolean` — Show delete confirmation modal
- `activityToDelete: Activity | null` — Activity pending deletion
- `showExport: boolean` — Show export modal
- `exportUrl: string | null` — Download URL for exported JSON
- `showImport: boolean` — Show import modal
- `showImportConfirm: boolean` — Show import overwrite confirmation
- `importFile: File | null` — File selected for import
- `importError: string | null` — Error message for import
- `importSuccess: boolean` — Success state for import
- `formError: string | null` — Error message for form

## Theme Compatibility
- Uses Bootstrap classes for styling
- Supports light/dark mode via inherited theme

## Mobile Responsiveness
- All modals and controls are responsive
- Layout adapts to mobile screens

## Accessibility
- ARIA labels for all modals and controls
- Static backdrop for destructive actions
- Keyboard navigation and focus management
- Accessible error and success feedback

## Test Coverage Summary
- CRUD operations: create, edit, delete
- Confirmation dialogs: delete, import overwrite
- Import/export: file validation, error handling, success feedback
- Accessibility: ARIA, keyboard navigation
- Edge cases: empty data, malformed files, localStorage errors

## Usage Examples
```tsx
<ActivityCrud />
```

## Known Limitations / Edge Cases
- React-Bootstrap modal validation feedback may not be detected by RTL tests (see PLANNED_CHANGES.md)
- Import only supports valid JSON array of activities
- Skipped RTL test for required field validation (documented)

## Change History
- 2024-06-13: Enhanced confirmation dialogs, import/export UX, accessibility, error handling
- 2024-06-13: Initial implementation with localStorage CRUD

## Related Components
- [ActivityForm](./ActivityForm.md)
- [ActivityList](./ActivityList.md)

---
[Back to Component Documentation Index](../README.md)
