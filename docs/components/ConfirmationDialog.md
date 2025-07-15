# ConfirmationDialog Component Documentation

---

## Navigation
- [Component Documentation Index](./README.md)
- [Related: ActivityManager](./ActivityManager.md)

---

## Overview
`ConfirmationDialog` is a modal dialog component for confirming user actions, migrated to use [react-bootstrap/Modal](https://react-bootstrap.github.io/components/modal/). It supports imperative opening via ref, customizable button text, and full accessibility compliance.

---

## Props
| Name         | Type     | Default   | Description                                 |
|--------------|----------|-----------|---------------------------------------------|
| message      | string   | —         | The message to display in the dialog.       |
| confirmText  | string   | 'Confirm' | Text for the confirm button.                |
| cancelText   | string   | 'Cancel'  | Text for the cancel button.                 |
| onConfirm    | () => void | —       | Called when the user confirms.              |
| onCancel     | () => void | —       | Called when the user cancels or closes.     |

## Ref API
- `showDialog()`: Imperatively opens the dialog.

---

## State Management
- Internal state: `show` (boolean) controls modal visibility.
- State is managed locally within the component.

---

## Theme Compatibility
- Inherits Bootstrap theme styles.
- Button variants and modal appearance are theme-aware.

---

## Mobile Responsiveness
- Modal is centered and responsive by default via Bootstrap.
- Buttons are touch-friendly.

---

## Accessibility
- Uses `role="dialog"`, `aria-modal="true"`.
- Focus is managed by Bootstrap Modal.
- Keyboard navigation and Escape key supported.
- Button labels are customizable for clarity.

---

## Test Coverage Summary
- All core behaviors are tested:
  - Rendering with default/custom props
  - Imperative open via ref
  - Confirm/cancel actions
  - Backdrop and Escape key handling
  - Accessibility and edge cases
- **Known Limitation:**
  - The backdrop click test is skipped due to a jsdom/react-bootstrap limitation: Bootstrap Modal's backdrop click and animation-based DOM removal are not fully simulated in jsdom. See [react-bootstrap issue #5075](https://github.com/react-bootstrap/react-bootstrap/issues/5075).

---

## Usage Examples

### Basic
```tsx
const ref = useRef<ConfirmationDialogRef>(null);
<ConfirmationDialog
  ref={ref}
  message="Are you sure?"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
// ...
ref.current?.showDialog();
```

### Custom Button Text
```tsx
<ConfirmationDialog
  ref={ref}
  message="Delete this item?"
  confirmText="Delete"
  cancelText="Keep"
  onConfirm={deleteItem}
  onCancel={closeDialog}
/>
```

---

## Known Limitations / Edge Cases
- **Backdrop click test**: Not fully testable in jsdom; see Test Coverage Summary.
- Modal is not rendered server-side (SSR) due to Bootstrap Modal requirements.

---

## Change History
- 2025-06-23: Migrated to react-bootstrap/Modal, updated tests, and documentation.

---
