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

1. **Bootstrap Setup and Configuration** ✅ **COMPLETED**
   - ✅ Install Bootstrap 5.x and react-bootstrap packages (react-bootstrap@2.10.10 and bootstrap@5.3.7)
   - ✅ Configure Bootstrap CSS integration with Next.js
   - ✅ Use Bootstrap's default styling and theming system
   - ✅ Defer custom theme integration for future consideration
   - ✅ Testing: Verify Bootstrap loads correctly with default styles

2. **Component Inventory and Mapping** ✅ **COMPLETED**
   - ✅ Create comprehensive checklist of all custom UI components
   - ✅ Map each custom component to appropriate Bootstrap equivalent:
     - `ActivityButton` → Bootstrap `Button` with custom variants
     - `ConfirmationDialog` → Bootstrap `Modal`
     - `ProgressBar` → Bootstrap `ProgressBar`
     - `ThemeToggle` → Bootstrap `ButtonGroup` or `ToggleButton`
     - `ActivityForm`/`TimeSetup` → Bootstrap `Form`, `FormControl`, `InputGroup`
     - Cards and containers → Bootstrap `Card`, `Container`, `Row`, `Col`
   - ✅ Identify components that need custom wrapper components
   - ✅ Document any Bootstrap gaps that require alternative solutions
   - ✅ Testing: Validate mapping decisions with UI mockups

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
   - Use Bootstrap's default theme and color system initially
   - Phase out custom CSS properties in favor of Bootstrap's design tokens
   - Consider future Bootstrap theme customization to match brand colors
   - Maintain light/dark mode support using Bootstrap's dark mode features (data-bs-theme)
   - Handle transition from custom CSS variables to Bootstrap's approach
   - Testing: Verify default Bootstrap styling works correctly

6. **Documentation and Cleanup**
   - Update component documentation to reflect Bootstrap usage patterns
   - Remove unused custom CSS modules and related files
   - Update import statements and component usage throughout codebase
   - Document any Bootstrap-specific patterns or customizations needed
   - Log challenges, workarounds, and decisions in Memory Log
   - Testing: Documentation examples must work correctly

## Technical Guidelines

- **Official Documentation**: Always refer to official documentation for best practices:
  - React Bootstrap: https://react-bootstrap.github.io/docs/getting-started/introduction
  - Bootstrap 5.3: https://getbootstrap.com/docs/5.3/getting-started/introduction/
- **Package Versions**: Using bootstrap@5.3.7 and react-bootstrap@2.10.10
- **Next.js Integration**: Use proper Bootstrap integration for Next.js 15.x with official documentation guidance
- **React Bootstrap**: Prefer react-bootstrap over direct Bootstrap CSS classes for better React integration
- **Documentation References**: Follow https://react-bootstrap.github.io/docs/getting-started/introduction and https://getbootstrap.com/docs/5.3/getting-started/introduction/
- **Package Versions**: Use react-bootstrap@2.10.10 and bootstrap@5.3.7 specifically
- **Default Styling**: Use Bootstrap's default theme and design tokens instead of custom CSS properties
- **Accessibility**: Ensure Bootstrap components meet existing accessibility standards
- **Performance**: Monitor bundle size impact and lazy load Bootstrap components where appropriate
- **TypeScript**: Maintain full TypeScript support with proper Bootstrap component types
- **Testing Strategy**: Use testing-library patterns that work well with Bootstrap components
- **Migration Approach**: Use feature flags or component aliases to enable gradual migration
- **CSS Modules**: Phase out custom CSS modules gradually, replacing with Bootstrap's utility classes and components

## Expected Outcome

**User Perspective:**
- Visual consistency maintained or improved
- All existing functionality preserved
- Improved accessibility through Bootstrap's built-in features
- Consistent interaction patterns across components
- Theme switching continues to work seamlessly

**Technical Perspective:**
- Reduced custom CSS codebase by ~70-80%
- Standardized component library using Bootstrap's default design system
- Improved maintainability through well-documented Bootstrap patterns
- Enhanced accessibility through Bootstrap's ARIA implementations
- Faster development of new UI components using Bootstrap primitives
- Better responsive design through Bootstrap's grid system
- Reduced bundle size through elimination of redundant custom styles
- Consistent design language using Bootstrap's default theme

**Testing Criteria:**
- All existing tests pass with Bootstrap components
- Visual regression tests show Bootstrap's default styling is applied correctly
- Accessibility audit passes with same or better scores
- Performance metrics remain within acceptable ranges
- Bootstrap's default theme renders consistently across components

## Validation Criteria

### 🎯 Overall Project Milestones
- [x] Bootstrap 5.x and react-bootstrap successfully installed and configured
- [x] Component inventory and mapping document completed
- [ ] All existing component tests updated and passing
- [ ] All custom CSS modules reviewed and removed where replaced by Bootstrap
- [ ] Default Bootstrap styling verified across all migrated components
- [ ] Bootstrap's default theme consistency validated
- [ ] Accessibility testing completed and passing
- [ ] Documentation updated for all migrated components
- [ ] Memory Log entries created for migration decisions and challenges
- [ ] Performance impact assessed and within acceptable limits
- [ ] Visual regression testing completed
- [ ] Integration testing with full application flow completed

### 📋 Component Migration Checklist

#### Phase 1: Low Complexity Components (Quick Wins)

##### ProgressBar Component ✅ **COMPLETED**
- [x] Review existing ProgressBar tests and functionality
- [x] Write tests for Bootstrap ProgressBar integration
- [x] Migrate ProgressBar to react-bootstrap/ProgressBar
- [x] Update component props and interfaces
- [x] Remove custom CSS module (ProgressBar.module.css)
- [x] Update all imports and usage throughout codebase
- [x] Run tests and verify functionality
- [x] Update component documentation
- [x] **COMMIT:** "Migrate ProgressBar to Bootstrap ProgressBar component"

##### OfflineIndicator Component ✅ COMPLETED
- [x] Review existing OfflineIndicator tests and functionality
- [x] Write tests for Bootstrap Alert integration
- [x] Migrate OfflineIndicator to react-bootstrap/Alert
- [x] Update component props and interfaces
- [x] Remove custom CSS module (OfflineIndicator.module.css)
- [x] Update all imports and usage throughout codebase
- [x] Run tests and verify functionality
- [x] Update component documentation
- [x] **COMMIT:** "Migrate OfflineIndicator to Bootstrap Alert component"

##### UpdateNotification Component ✅ COMPLETED
- [x] Review existing UpdateNotification tests and functionality
- [x] Write tests for Bootstrap Toast/Alert integration
- [x] Migrate UpdateNotification to react-bootstrap/Toast or Alert
- [x] Update component props and interfaces
- [x] Remove custom CSS module (UpdateNotification.module.css)
- [x] Update all imports and usage throughout codebase
- [x] Run tests and verify functionality
- [x] Update component documentation
- [x] **COMMIT:** "Migrate UpdateNotification to Bootstrap Toast/Alert component"

##### ConfirmationDialog Component
- [ ] Review existing ConfirmationDialog tests and functionality
- [ ] Write tests for Bootstrap Modal integration
- [ ] Migrate ConfirmationDialog to react-bootstrap/Modal
- [ ] Update component props and interfaces
- [ ] Remove custom CSS module (ConfirmationDialog.module.css)
- [ ] Update all imports and usage throughout codebase
- [ ] Run tests and verify functionality
- [ ] Update component documentation
- [ ] **COMMIT:** "Migrate ConfirmationDialog to Bootstrap Modal component"

#### Phase 2: Medium Complexity Components

##### ActivityForm Component
- [ ] Review existing ActivityForm tests and functionality
- [ ] Write tests for Bootstrap Form integration
- [ ] Migrate ActivityForm to react-bootstrap/Form components
- [ ] Update component props and interfaces
- [ ] Remove custom CSS module (ActivityForm.module.css)
- [ ] Update all imports and usage throughout codebase
- [ ] Run tests and verify functionality
- [ ] Update component documentation
- [ ] **COMMIT:** "Migrate ActivityForm to Bootstrap Form components"

##### TimeSetup Component
- [ ] Review existing TimeSetup tests and functionality
- [ ] Write tests for Bootstrap Form integration
- [ ] Migrate TimeSetup to react-bootstrap/Form components
- [ ] Update component props and interfaces
- [ ] Remove custom CSS module (TimeSetup.module.css)
- [ ] Update all imports and usage throughout codebase
- [ ] Run tests and verify functionality
- [ ] Update component documentation
- [ ] **COMMIT:** "Migrate TimeSetup to Bootstrap Form components"

##### ActivityManager Component
- [ ] Review existing ActivityManager tests and functionality
- [ ] Write tests for Bootstrap layout integration
- [ ] Migrate ActivityManager to Bootstrap Container/Row/Col
- [ ] Update component props and interfaces
- [ ] Remove custom CSS module (ActivityManager.module.css)
- [ ] Update all imports and usage throughout codebase
- [ ] Run tests and verify functionality
- [ ] Update component documentation
- [ ] **COMMIT:** "Migrate ActivityManager to Bootstrap layout components"

##### Summary Component
- [ ] Review existing Summary tests and functionality
- [ ] Write tests for Bootstrap Card integration
- [ ] Migrate Summary to react-bootstrap/Card system
- [ ] Update component props and interfaces
- [ ] Remove custom CSS module (Summary.module.css)
- [ ] Update all imports and usage throughout codebase
- [ ] Run tests and verify functionality
- [ ] Update component documentation
- [ ] **COMMIT:** "Migrate Summary to Bootstrap Card components"

##### TimeDisplay Component
- [ ] Review existing TimeDisplay tests and functionality
- [ ] Write tests for Bootstrap typography integration
- [ ] Migrate TimeDisplay to Bootstrap utilities and layout
- [ ] Update component props and interfaces
- [ ] Remove custom CSS module (TimeDisplay.module.css)
- [ ] Update all imports and usage throughout codebase
- [ ] Run tests and verify functionality
- [ ] Update component documentation
- [ ] **COMMIT:** "Migrate TimeDisplay to Bootstrap typography and layout"

##### ServiceWorkerUpdater Component
- [ ] Review existing ServiceWorkerUpdater tests and functionality
- [ ] Write tests for Bootstrap Toast/Alert integration
- [ ] Migrate ServiceWorkerUpdater to react-bootstrap/Toast or Alert
- [ ] Update component props and interfaces
- [ ] Remove custom CSS module (ServiceWorkerUpdater.module.css)
- [ ] Update all imports and usage throughout codebase
- [ ] Run tests and verify functionality
- [ ] Update component documentation
- [ ] **COMMIT:** "Migrate ServiceWorkerUpdater to Bootstrap Toast/Alert"

#### Phase 3: High Complexity Components

##### ActivityButton Component
- [ ] Review existing ActivityButton tests and functionality
- [ ] Write tests for Bootstrap Button with custom wrapper
- [ ] Create ActivityButtonWrapper component
- [ ] Migrate ActivityButton to react-bootstrap/Button with wrapper
- [ ] Update component props and interfaces
- [ ] Remove custom CSS module (ActivityButton.module.css)
- [ ] Update all imports and usage throughout codebase
- [ ] Run tests and verify functionality
- [ ] Update component documentation
- [ ] **COMMIT:** "Migrate ActivityButton to Bootstrap Button with custom wrapper"

##### ThemeToggle Component
- [ ] Review existing ThemeToggle tests and functionality
- [ ] Write tests for Bootstrap ButtonGroup integration
- [ ] Create ThemeToggleWrapper component if needed
- [ ] Migrate ThemeToggle to react-bootstrap/ButtonGroup
- [ ] Update component props and interfaces
- [ ] Remove custom CSS module (ThemeToggle.module.css)
- [ ] Update all imports and usage throughout codebase
- [ ] Run tests and verify functionality
- [ ] Update component documentation
- [ ] **COMMIT:** "Migrate ThemeToggle to Bootstrap ButtonGroup"

##### Timeline Component
- [ ] Review existing Timeline tests and functionality
- [ ] Write tests for Bootstrap layout with custom styling
- [ ] Create TimelineWrapper component
- [ ] Migrate Timeline to Bootstrap layout + custom timeline styles
- [ ] Update component props and interfaces
- [ ] Remove/update custom CSS module (Timeline.module.css)
- [ ] Update all imports and usage throughout codebase
- [ ] Run tests and verify functionality
- [ ] Update component documentation
- [ ] **COMMIT:** "Migrate Timeline to Bootstrap layout with custom styling"

#### Final Integration and Cleanup
- [ ] Run full test suite to ensure all components work together
- [ ] Perform visual regression testing
- [ ] Conduct accessibility audit
- [ ] Review and clean up any remaining custom CSS
- [ ] Update README and main documentation
- [ ] Create Memory Log entry for overall migration experience
- [ ] **COMMIT:** "Complete Bootstrap migration - final cleanup and documentation"

### 🔄 Regular Commit Protocol
For each component migration:
1. **Before starting:** Commit current state with "Start [ComponentName] Bootstrap migration"
2. **After tests:** Commit with "Add Bootstrap tests for [ComponentName]"
3. **After migration:** Commit with "Migrate [ComponentName] to Bootstrap [BootstrapComponent]"
4. **After cleanup:** Commit with "Clean up [ComponentName] - remove custom CSS and update docs"

### 📊 Progress Tracking
- **Phase 1 Progress:** 0/4 components completed
- **Phase 2 Progress:** 0/6 components completed  
- **Phase 3 Progress:** 0/3 components completed
- **Overall Progress:** 3/13 components completed (23%)