# Bootstrap Component Mapping

This document provides a comprehensive inventory of all custom UI components in the application and their mapping to Bootstrap equivalents.

## Component Inventory Checklist

### ✅ Completed Components
*Components that have been successfully migrated to Bootstrap*

- [ ] None yet

### 🔄 In Progress Components
*Components currently being migrated*

- [ ] None yet

### 📋 Pending Components
*Custom components awaiting migration*

#### Core UI Components
- [ ] **ActivityButton** - Activity selection and status display buttons
- [ ] **ActivityForm** - Form for adding new activities  
- [ ] **ActivityManager** - Container and management for activities
- [ ] **ConfirmationDialog** - Modal dialog for confirmations
- [ ] **ProgressBar** - Progress visualization component
- [ ] **Summary** - Statistics and summary display cards
- [ ] **ThemeToggle** - Theme selection toggle buttons
- [ ] **TimeDisplay** - Time and date display components
- [ ] **TimeSetup** - Time configuration form
- [ ] **Timeline** - Timeline visualization component

#### Notification Components
- [ ] **OfflineIndicator** - Offline status notification
- [ ] **ServiceWorkerUpdater** - Update notification component
- [ ] **UpdateNotification** - General notification component

## Component Mapping Details

### 1. ActivityButton
**Current Implementation:** Custom button component with activity state management
**Bootstrap Mapping:** `Button` + custom wrapper component
**Bootstrap Components:** 
- Primary: `react-bootstrap/Button`
- Supporting: Custom wrapper for state management
**Migration Complexity:** Medium
**Notes:** Will need custom wrapper to maintain activity state logic while using Bootstrap Button for styling

### 2. ActivityForm
**Current Implementation:** Custom form with input fields for activity creation
**Bootstrap Mapping:** Bootstrap Form components
**Bootstrap Components:**
- Primary: `react-bootstrap/Form`
- Supporting: `Form.Group`, `Form.Label`, `Form.Control`, `Button`
**Migration Complexity:** Low-Medium
**Notes:** Straightforward form migration using Bootstrap's form components

### 3. ActivityManager
**Current Implementation:** Container component managing list of activities
**Bootstrap Mapping:** Bootstrap layout and list components
**Bootstrap Components:**
- Primary: `react-bootstrap/Container`, `react-bootstrap/Row`, `react-bootstrap/Col`
- Supporting: `ListGroup` or custom layout with Bootstrap utilities
**Migration Complexity:** Low
**Notes:** Primarily layout changes, functionality remains the same

### 4. ConfirmationDialog
**Current Implementation:** Custom modal dialog for confirmations
**Bootstrap Mapping:** Bootstrap Modal
**Bootstrap Components:**
- Primary: `react-bootstrap/Modal`
- Supporting: `Modal.Header`, `Modal.Body`, `Modal.Footer`, `Button`
**Migration Complexity:** Low
**Notes:** Direct mapping to Bootstrap Modal with minimal changes needed

### 5. ProgressBar
**Current Implementation:** Custom progress visualization
**Bootstrap Mapping:** Bootstrap ProgressBar
**Bootstrap Components:**
- Primary: `react-bootstrap/ProgressBar`
**Migration Complexity:** Low
**Notes:** Direct replacement with Bootstrap ProgressBar component

### 6. Summary
**Current Implementation:** Statistics display with custom card layout
**Bootstrap Mapping:** Bootstrap Card system
**Bootstrap Components:**
- Primary: `react-bootstrap/Card`
- Supporting: `Card.Header`, `Card.Body`, `Card.Title`, `Container`, `Row`, `Col`
**Migration Complexity:** Low-Medium
**Notes:** Replace custom card styling with Bootstrap Card components

### 7. ThemeToggle
**Current Implementation:** Custom toggle buttons for theme selection
**Bootstrap Mapping:** Bootstrap ButtonGroup or ToggleButton
**Bootstrap Components:**
- Primary: `react-bootstrap/ButtonGroup`
- Alternative: `react-bootstrap/ToggleButton` + `ToggleButtonGroup`
**Migration Complexity:** Medium
**Notes:** May need custom wrapper to maintain theme switching logic

### 8. TimeDisplay
**Current Implementation:** Custom time and date display component
**Bootstrap Mapping:** Bootstrap typography and layout utilities
**Bootstrap Components:**
- Primary: Bootstrap utility classes + custom component wrapper
- Supporting: `Container`, `Row`, `Col` for layout
**Migration Complexity:** Low
**Notes:** Mainly styling changes, keep display logic intact

### 9. TimeSetup
**Current Implementation:** Time configuration form
**Bootstrap Mapping:** Bootstrap Form components
**Bootstrap Components:**
- Primary: `react-bootstrap/Form`
- Supporting: `Form.Group`, `Form.Label`, `Form.Control`, `InputGroup`, `Button`
**Migration Complexity:** Low-Medium
**Notes:** Similar to ActivityForm, straightforward form component migration

### 10. Timeline
**Current Implementation:** Custom timeline visualization
**Bootstrap Mapping:** Bootstrap layout + custom timeline component
**Bootstrap Components:**
- Primary: `react-bootstrap/Container`, `react-bootstrap/Row`, `react-bootstrap/Col`
- Supporting: Bootstrap utility classes for styling
**Migration Complexity:** Medium-High
**Notes:** Complex visualization, may need significant custom CSS alongside Bootstrap

### 11. OfflineIndicator
**Current Implementation:** Custom offline status notification
**Bootstrap Mapping:** Bootstrap Alert
**Bootstrap Components:**
- Primary: `react-bootstrap/Alert`
**Migration Complexity:** Low
**Notes:** Simple replacement with Bootstrap Alert component

### 12. ServiceWorkerUpdater
**Current Implementation:** Custom update notification component
**Bootstrap Mapping:** Bootstrap Toast or Alert
**Bootstrap Components:**
- Primary: `react-bootstrap/Toast` or `react-bootstrap/Alert`
- Supporting: `ToastContainer` if using Toast
**Migration Complexity:** Low-Medium
**Notes:** Choice between Toast (temporary) or Alert (persistent) based on UX needs

### 13. UpdateNotification
**Current Implementation:** General notification component
**Bootstrap Mapping:** Bootstrap Toast or Alert
**Bootstrap Components:**
- Primary: `react-bootstrap/Toast` or `react-bootstrap/Alert`
- Supporting: `ToastContainer` if using Toast
**Migration Complexity:** Low
**Notes:** Similar to ServiceWorkerUpdater, choose appropriate notification pattern

## Migration Priority Order

### Phase 1: Low Complexity (Start Here)
1. **ProgressBar** - Direct component replacement
2. **OfflineIndicator** - Simple Alert replacement
3. **UpdateNotification** - Toast/Alert replacement
4. **ConfirmationDialog** - Modal replacement

### Phase 2: Medium Complexity
5. **ActivityForm** - Form components migration
6. **TimeSetup** - Form components migration
7. **ActivityManager** - Layout migration
8. **Summary** - Card system migration
9. **TimeDisplay** - Typography and layout
10. **ServiceWorkerUpdater** - Toast/Alert with logic

### Phase 3: High Complexity (Save for Last)
11. **ActivityButton** - Complex state management
12. **ThemeToggle** - Theme integration complexity
13. **Timeline** - Complex visualization component

## Bootstrap Gaps and Custom Solutions

### Identified Gaps
1. **Activity State Management** - Bootstrap doesn't provide activity-specific state management
   - Solution: Create custom wrapper components that use Bootstrap styling
2. **Timeline Visualization** - No direct Bootstrap equivalent for timeline UI
   - Solution: Use Bootstrap layout utilities + custom timeline styling
3. **Theme Integration** - Bootstrap's theme system differs from current implementation
   - Solution: Gradually transition to Bootstrap's theming approach

### Custom Wrapper Components Needed
1. **ActivityButtonWrapper** - Wraps Bootstrap Button with activity state logic
2. **ThemeToggleWrapper** - Wraps Bootstrap ButtonGroup with theme switching
3. **TimelineWrapper** - Wraps Bootstrap layout with timeline-specific styling

## Testing Strategy for Each Component

### Standard Test Pattern
For each component migration:
1. **Before Migration:** Ensure existing tests pass
2. **During Migration:** Update tests to work with Bootstrap props/structure  
3. **After Migration:** Verify functionality and styling with Bootstrap components
4. **Regression Testing:** Confirm no functionality loss

### Component-Specific Test Considerations
- **Form Components:** Test form validation and submission
- **Interactive Components:** Test click handlers and state changes
- **Layout Components:** Test responsive behavior
- **Notification Components:** Test show/hide behavior
- **Complex Components:** Test all interaction patterns and edge cases

## Documentation Requirements

For each migrated component:
- [ ] Update component documentation in `docs/components/`
- [ ] Document Bootstrap-specific props and usage patterns
- [ ] Provide migration examples in documentation
- [ ] Update any referenced examples in README or other docs
- [ ] Add to component documentation index

---

**Last Updated:** 2025-06-19
**Status:** Component inventory and mapping complete
**Next Phase:** Begin Phase 1 migrations starting with ProgressBar
