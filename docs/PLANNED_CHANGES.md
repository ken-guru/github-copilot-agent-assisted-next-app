# Planned Changes

This document contains specifications for upcoming changes to the application. Each change should be documented using the template format to ensure AI-assisted implementation is effective.

## Using the Template

When planning a new feature or change:

1. **Use the Template**: Copy the structure from [PLANNED_CHANGES_TEMPLATE.md](./templates/PLANNED_CHANGES_TEMPLATE.md)
2. **Fill Out Completely**: The more detailed the specification, the better the AI assistance
3. **Include All Sections**: Context, Requirements, Technical Guidelines, Expected Outcome, and Validation Criteria
4. **Move When Complete**: After implementation, move the completed change to [IMPLEMENTED_CHANGES.md](./IMPLEMENTED_CHANGES.md) with timestamp

## Template Reference

See [docs/templates/PLANNED_CHANGES_TEMPLATE.md](./templates/PLANNED_CHANGES_TEMPLATE.md) for the complete template structure.

---

## Current Planned Changes

# Bootstrap Component Migration

## Context
This change affects the entire UI component library of the application. Currently, the application uses custom/local UI components with CSS modules for styling throughout the codebase. The components that need to be replaced include:

**Current Custom Components:**
- `ActivityButton` - Activity selection and status display buttons
- `ActivityForm` - Form for adding new activities
- `ActivityManager` - Container and management for activities
- `ConfirmationDialog` - Modal dialog for confirmations
- `ProgressBar` - Progress visualization component
- `Summary` - Statistics and summary display cards
- `ThemeToggle` - Theme selection toggle buttons
- `TimeDisplay` - Time and date display components
- `TimeSetup` - Time configuration form
- `Timeline` - Timeline visualization component
- `OfflineIndicator` - Offline status notification
- `ServiceWorkerUpdater` - Update notification component
- `UpdateNotification` - General notification component

**Current Behavior:** Each component uses custom CSS modules with custom styling, spacing systems, and design patterns.

**User Needs:** This migration aims to standardize the UI, improve maintainability, reduce custom CSS, and leverage Bootstrap's well-tested component library for better consistency and accessibility.

## Requirements

1. **Bootstrap Setup and Configuration**
   - Install Bootstrap 5.x and react-bootstrap packages
   - Configure Bootstrap CSS integration with Next.js
   - Set up Bootstrap theme customization to match current design system
   - Ensure Bootstrap works with existing CSS custom properties and theme system
   - Testing: Verify Bootstrap loads correctly and themes work

2. **Component Inventory and Mapping**
   - Create comprehensive checklist of all custom UI components
   - Map each custom component to appropriate Bootstrap equivalent:
     - `ActivityButton` → Bootstrap `Button` with custom variants
     - `ConfirmationDialog` → Bootstrap `Modal`
     - `ProgressBar` → Bootstrap `ProgressBar`
     - `ThemeToggle` → Bootstrap `ButtonGroup` or `ToggleButton`
     - `ActivityForm`/`TimeSetup` → Bootstrap `Form`, `FormControl`, `InputGroup`
     - Cards and containers → Bootstrap `Card`, `Container`, `Row`, `Col`
   - Identify components that need custom wrapper components
   - Document any Bootstrap gaps that require alternative solutions
   - Testing: Validate mapping decisions with UI mockups

3. **Test-First Migration Strategy**
   - Write/update tests for each component before refactoring
   - Ensure tests cover current behaviors, edge cases, and accessibility
   - Update test expectations to accommodate Bootstrap-specific props and behaviors
   - Test for visual regression and UI consistency during migration
   - Testing: All component tests must pass before and after migration

4. **Iterative Component Replacement**
   - Replace components one at a time or in small logical groups
   - For each component:
     - Refactor to use Bootstrap component instead of custom implementation
     - Remove custom CSS modules where Bootstrap handles styling
     - Update component interfaces to use Bootstrap props
     - Preserve existing functionality and accessibility features
     - Update associated tests to work with new Bootstrap implementation
   - Limit each commit to maximum 5 files unless tightly coupled
   - Testing: Manual verification after each component replacement

5. **Theme Integration and Customization**
   - Maintain existing light/dark theme compatibility
   - Customize Bootstrap theme variables to match current design tokens
   - Ensure CSS custom properties integration works with Bootstrap
   - Preserve current spacing system and component behavior
   - Handle any Bootstrap/custom CSS conflicts
   - Testing: Theme switching must work correctly with Bootstrap components

6. **Documentation and Cleanup**
   - Update component documentation to reflect Bootstrap usage patterns
   - Remove unused custom CSS modules and related files
   - Update import statements and component usage throughout codebase
   - Document any Bootstrap-specific patterns or customizations needed
   - Log challenges, workarounds, and decisions in Memory Log
   - Testing: Documentation examples must work correctly

## Technical Guidelines

- **Next.js Integration**: Use proper Bootstrap integration for Next.js 15.x
- **React Bootstrap**: Prefer react-bootstrap over direct Bootstrap CSS classes for better React integration
- **CSS Custom Properties**: Maintain existing CSS custom property system for theming
- **Accessibility**: Ensure Bootstrap components meet existing accessibility standards
- **Performance**: Monitor bundle size impact and lazy load Bootstrap components where appropriate
- **TypeScript**: Maintain full TypeScript support with proper Bootstrap component types
- **Testing Strategy**: Use testing-library patterns that work well with Bootstrap components
- **Migration Approach**: Use feature flags or component aliases to enable gradual migration
- **CSS Modules**: Phase out custom CSS modules gradually while preserving functionality

## Expected Outcome

**User Perspective:**
- Visual consistency maintained or improved
- All existing functionality preserved
- Improved accessibility through Bootstrap's built-in features
- Consistent interaction patterns across components
- Theme switching continues to work seamlessly

**Technical Perspective:**
- Reduced custom CSS codebase by ~70-80%
- Standardized component library using Bootstrap
- Improved maintainability through well-documented Bootstrap patterns
- Enhanced accessibility through Bootstrap's ARIA implementations
- Faster development of new UI components using Bootstrap primitives
- Better responsive design through Bootstrap's grid system
- Reduced bundle size through elimination of redundant custom styles

**Testing Criteria:**
- All existing tests pass with Bootstrap components
- Visual regression tests show no unintended changes
- Accessibility audit passes with same or better scores
- Performance metrics remain within acceptable ranges
- Theme switching works correctly in all scenarios

## Validation Criteria

- [ ] Bootstrap 5.x and react-bootstrap successfully installed and configured
- [ ] Component inventory and mapping document completed
- [ ] All existing component tests updated and passing
- [ ] ActivityButton migrated to Bootstrap Button with tests passing
- [ ] ConfirmationDialog migrated to Bootstrap Modal with tests passing
- [ ] ProgressBar migrated to Bootstrap ProgressBar with tests passing
- [ ] ThemeToggle migrated to Bootstrap ButtonGroup with tests passing
- [ ] Forms (ActivityForm, TimeSetup) migrated to Bootstrap Form components
- [ ] Card components migrated to Bootstrap Card system
- [ ] All custom CSS modules reviewed and removed where replaced by Bootstrap
- [ ] Theme compatibility verified across all migrated components
- [ ] Accessibility testing completed and passing
- [ ] Documentation updated for all migrated components
- [ ] Memory Log entries created for migration decisions and challenges
- [ ] Performance impact assessed and within acceptable limits
- [ ] Visual regression testing completed
- [ ] Integration testing with full application flow completed