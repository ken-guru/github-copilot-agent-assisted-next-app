# ShareControls Component

## Overview
UI controls for session sharing: create/copy/open/download the share link and replace/import from a shared session.

## Features
- Copy full absolute share URL
- Open shared page in a new tab
- Download JSON snapshot
- Replace current activities from shared data
- Accessible toasts (role=status; polite, atomic)

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `shareUrl` | `string` | Yes | Absolute URL to the shared session page |
| `onReplace` | `(data: unknown) => Promise<void> | void` | No | Callback to import/replace from shared JSON |
| `disabled` | `boolean` | No | Disable all share actions |

## Implementation Details
- Ensures absolute URLs in Copy/Open.
- Uses `navigator.clipboard` when available; falls back gracefully.
- Revokes object URLs for downloads to avoid leaks.
- Toasts are announced individually with `role="status"`, `aria-live="polite"`, `aria-atomic="true"`.

## Theme Compatibility
Works in light and dark modes. Utilizes Bootstrap variables and inherits theme-aware colors from parent layout.

## Usage Example

```tsx
<ShareControls
  shareUrl={"https://example.com/shared/1234"}
  onReplace={async (data) => {
    // validate and import data
  }}
/>
```

## Accessibility Considerations
- Each toast uses `role=status` for screen reader announcements
- Buttons have descriptive labels and focus styles

## Related Components
- `Summary`, `ActivityManager`
- `ToastContainer`

## Test Coverage
- Copy/Open/Download interactions
- Replace/import preservation of activity descriptions and colors
- A11y announcements and focus behavior
