# Planned Changes

This file contains specifications for upcoming changes to the application. Each change should be documented in a format suitable for AI-assisted implementation following the template in `docs/templates/PLANNED_CHANGES_TEMPLATE.md`.

Once implemented, move the change to `IMPLEMENTED_CHANGES.md` with a timestamp.

## Issue #308: Activity CRUD Empty State Toolbar (IMPLEMENTED ✅)

### Context
- Users couldn't access Import JSON and Reset actions when the activities list was empty.
- Request: Keep the "Your Activities" card visible in empty state and surface Import/Reset there; hide Export when no activities exist.

### Implementation Summary
- Always render `ActivityList` from `ActivityCrud` regardless of list length.
- In `ActivityList` empty state:
   - Keep header with "Add Activity" button.
   - Show empty-state guidance in `Card.Body`.
   - Render `Card.Footer` with Import and Reset buttons when handlers are provided.
   - Do not render Export button when `activities.length === 0`.
- Tests updated to validate visibility of Import/Reset in empty state and absence of Export.

### Status
- Implemented on branch `fix-308-activitycrud-empty-state`.
- PR opened: #317.

## UI Inconsistencies Fixes (Issues #261, #265)

### Context
- **Issues**: GitHub issues #261 and #265 report UI inconsistencies across components
- **Components Affected**: Timeline, ActivityCrud (export modal), ActivityForm, TimeSetup
- **Current Behavior**: Various inconsistencies in card headers, button placement, and form structure
- **User Needs**: Consistent UI patterns across the application

### Requirements

#### Issue #261: Compact Activity Form (ALREADY IMPLEMENTED ✅)
- Form already uses Bootstrap InputGroup for single-line layout
- No changes needed

#### Issue #265: UI Inconsistencies (4 Sub-issues)

1. **Timeline Card Header Consistency**
   - Remove unnecessary Row/Col nesting in Card.Header
   - Match pattern used by Summary and ActivityManager components
   - Use direct content with `d-flex justify-content-between align-items-center`

2. **Export Modal Button Placement**
   - Move download button from Modal.Body to Modal.Footer
   - Follow standard modal pattern with action buttons in footer

3. **Activity Form Duplicate Submit Buttons**
   - Remove "Add Activity" button from ActivityForm component
   - Keep only "Save" button in modal footer
   - Form should submit via modal footer button, not internal button

4. **Setup Card Structure**
   - Move submit button from Card.Body to Card.Footer
   - Fix margin inconsistency for deadline input to match duration fields

### Technical Guidelines
- Maintain Bootstrap component structure and classes
- Preserve existing accessibility features and ARIA attributes
- Ensure responsive design is maintained
- Update tests to reflect structural changes
- Follow established component patterns from other parts of the app

### Expected Outcome
- Consistent card header structure across all components
- Proper modal action button placement
- Single submit button in activity forms
- Proper card footer usage for primary actions
- Consistent spacing and margins in form inputs

### Validation Criteria
- [ ] Timeline header matches Summary/ActivityManager pattern
- [ ] Export modal download button in footer not body
- [ ] Activity form has single submit button approach
- [ ] Setup card has submit button in footer
- [ ] All tests pass after changes
- [ ] Visual consistency verified across components
- [ ] Accessibility maintained (screen reader, keyboard nav)
- [ ] Responsive behavior preserved
