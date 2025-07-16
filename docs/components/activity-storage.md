# Activity Storage Utility Documentation

---

## Navigation
- [Component Documentation Index](../components/README.md)
- [ActivityManager](../components/ActivityManager.md)
- [ActivityCrud](../components/ActivityCrud.md)

---

## Overview
This utility provides localStorage-based CRUD operations for customizable activities. It ensures instant loading, offline support, and robust error handling for all modern browsers.

## Props Documentation
- N/A (utility functions only)

## State Management Approach
- Activities are cached in memory and synced to localStorage
- Fallback to default activities if localStorage is unavailable or corrupted

## Theme Compatibility
- Maintains colorIndex for theme integration

## Mobile Responsiveness
- N/A (utility functions only)

## Accessibility Considerations
- N/A (utility functions only)

## Test Coverage Summary
- 100% unit test coverage for all CRUD operations
- Edge cases: quota exceeded, disabled localStorage, corrupted data, cross-session persistence

## Usage Examples
```typescript
import { getActivities, addActivity, updateActivity, deleteActivity } from '../utils/activity-storage';

const activities = getActivities();
addActivity({ ... });
updateActivity({ ... });
deleteActivity('id');
```

## Known Limitations / Edge Cases
- Soft deletion only (isActive flag)
- No cloud sync (local only)
- Handles localStorage errors gracefully

## Change History
- 2025-07-16: Initial implementation and documentation

---

## API Reference
### getActivities(): Activity[]
Returns all activities from localStorage, or defaults if unavailable/corrupted.

### saveActivities(activities: Activity[]): void
Saves all activities to localStorage.

### addActivity(activity: Activity): void
Adds a new activity to localStorage.

### updateActivity(activity: Activity): void
Updates an existing activity in localStorage.

### deleteActivity(id: string): void
Soft deletes an activity by id (sets isActive to false).

### validateActivity(activity: unknown): activity is Activity
Validates the structure of an activity object.

---

## Planned Enhancements
- Export/import functionality for backup
- Data migration/versioning support
- Integration with ActivityManager and ActivityCrud

---
