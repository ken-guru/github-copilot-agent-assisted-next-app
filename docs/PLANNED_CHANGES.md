# Planned Changes Prompt Template
This file contains specifications for upcoming changes to the application. Each change should be documented in a format suitable for AI-assisted implementation. Once implemented, move the change to IMPLEMENTED_CHANGES.md with a timestamp.

## Change Request Template
```markdown
# Feature/Change Title

## Context
Provide context about the part of the application this change affects.
- Which components/utilities are involved?
- What current behavior needs to change?
- What user needs does this address?

## Requirements
Detailed specifications for the change:
1. First requirement
   - Implementation details
   - Technical considerations
   - Testing requirements
2. Second requirement
   - Sub-points
   - Edge cases to handle
3. Additional requirements as needed

## Technical Guidelines
- Framework-specific considerations
- Performance requirements
- Accessibility requirements
- Theme compatibility requirements
- Testing approach

## Expected Outcome
Describe what success looks like:
- User perspective
- Technical perspective
- Testing criteria

## Validation Criteria
- [ ] Test cases written
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Theme compatibility verified
- [ ] Documentation updated
```

Note: When implementing a change, copy this template and fill it out completely. The more detailed the prompt, the better the AI assistance will be in implementation.

# Theme System Unification

## Context
The application currently handles theme management inconsistently across components:
- Theme detection code is duplicated in multiple components (Timeline.tsx, Summary.tsx, etc.)
- Color utility functions are scattered throughout the codebase
- HSL color manipulation logic appears in multiple places
- Theme preference detection is reimplemented several times

This leads to inconsistent behavior, maintenance challenges, and potential bugs when theme-related changes are needed.

## Requirements

1. Create a centralized theme context system
   - Implement a React Context for global theme state management
   - Add support for light/dark themes and system preference detection
   - Include support for theme transitions and animations
   - Ensure theme state persists across sessions

2. Develop a comprehensive useTheme hook
   - Expose current theme state (light/dark)
   - Provide functions to toggle theme manually
   - Include system preference detection and auto-switching
   - Add TypeScript types for all theme-related values

3. Consolidate color utilities
   - Create a unified color utility module
   - Implement HSL/RGB conversion functions
   - Add contrast checking utilities for accessibility
   - Develop helpers for color manipulation (lighten, darken, etc.)
   - Ensure proper TypeScript typing for all color functions

4. Refactor existing components
   - Remove duplicate theme detection code
   - Update components to use the new theme context
   - Ensure consistent theme application across all components
   - Maintain backward compatibility during the transition

## Technical Guidelines
- Use React.createContext and useContext for the implementation
- Implement theme detection using window.matchMedia
- Store theme preference in localStorage for persistence
- Use CSS variables for theme values to ensure consistency
- Add comprehensive unit tests for all theme utilities
- Document the theme API for other developers
- Ensure theme context is designed to be extendable for future theme properties beyond light/dark
- Write tests that verify system preference detection in different scenarios
- Consider implementing a theme diagnostic tool for development

## Expected Outcome

User perspective:
- Consistent theme appearance across the entire application
- Smooth theme transitions when switching between light/dark
- Proper respect for system theme preferences
- Persistent theme choice across sessions

Technical perspective:
- Centralized theme management through a single API
- Elimination of duplicate theme detection code
- Improved maintainability for theme-related changes
- Better testability for theme-switching functionality
- Consistent color manipulation across the application

## Validation Criteria
- [ ] Unit tests for theme context and useTheme hook
- [ ] Unit tests for color utility functions
- [ ] Verified theme persistence across page reloads
- [ ] Confirmed system preference detection works correctly
- [ ] Components successfully migrated to use the new theme system
- [ ] Documentation for the theme system and color utilities

# CSS Framework Unification

## Context
The application currently lacks a consistent approach to styling:
- CSS utility classes are duplicated across multiple files
- Common patterns like transitions, focus states, and shadows have multiple implementations
- Responsive breakpoints are inconsistently defined
- Design tokens (colors, spacing, typography) are scattered throughout the codebase

This creates visual inconsistencies, makes maintenance difficult, and slows down development of new features.

## Requirements

1. Create a comprehensive design token system
   - Define semantic color variables for both light and dark themes
   - Establish standard spacing scales and typography sizes
   - Create animation and transition timing variables
   - Define consistent border-radius and shadow values
   - Implement focus state styling tokens

2. Develop a responsive breakpoint system
   - Define standard breakpoints for mobile, tablet, and desktop
   - Create utility mixins or classes for responsive layouts
   - Ensure consistent media query usage across components
   - Document responsive design patterns and best practices
   - Build integration with the Theme System context for responsive adjustments

3. Implement utility classes for common patterns
   - Create reusable focus state utilities 
   - Develop transition/animation utility classes
   - Implement layout helper classes (flex, grid patterns)
   - Add typography utility classes for consistent text styling
   - Create spacing utility classes based on the token system

4. Document the CSS framework
   - Create usage guidelines and examples
   - Document all available tokens and utilities
   - Provide visual examples of common patterns
   - Add migration guide for updating existing components

## Technical Guidelines
- Use CSS custom properties for all design tokens
- Implement the framework as importable CSS modules
- Add comments explaining the purpose of each utility
- Ensure browser compatibility across all target browsers
- Use naming conventions that are consistent and intuitive
- Consider developer experience and ease of use

## Expected Outcome

User perspective:
- Consistent visual appearance across the application
- Improved responsive behavior on all device sizes
- More predictable interaction states (hover, focus, etc.)
- Better accessibility with consistent focus indicators

Technical perspective:
- Reduced CSS duplication across components
- Faster development through reusable utility classes
- Easier maintenance with centralized design tokens
- Improved theme compatibility with semantic variable names
- Better organization of styling concerns

## Validation Criteria
- [ ] Design token system implemented and documented
- [ ] Responsive breakpoint system tested across devices
- [ ] Utility classes implemented and verified
- [ ] Documentation created with examples
- [ ] Existing components updated to use the new system
- [ ] Visual regression testing to ensure consistent appearance

# Shared Utilities Unification

## Context
The application has several utility functions duplicated across components:
- Time formatting and manipulation appears in multiple components
- Status management and detection logic is reimplemented
- Common hooks for repeated behaviors are duplicated
- Helper functions for data manipulation have parallel implementations

This duplication increases maintenance burden and risks inconsistent behavior across the application.

## Requirements

1. Create centralized time utility functions
   - Implement consistent date formatting functions
   - Add time duration calculation utilities
   - Create elapsed time display functions
   - Develop timezone handling utilities
   - Add proper TypeScript types for all time functions

2. Develop shared custom hooks
   - Create useOnlineStatus hook for connectivity detection
   - Implement useElapsedTime for time tracking
   - Develop useLocalStorage for persistent storage
   - Add useMediaQuery for responsive behavior
   - Ensure proper TypeScript typing for all hooks

3. Implement data processing utilities
   - Create array manipulation helpers (sorting, filtering)
   - Add string processing functions
   - Implement number formatting utilities
   - Develop data validation helpers
   - Add TypeScript generics for type safety

4. Consolidate status management utilities
   - Create unified status checking functions
   - Implement status display formatting
   - Add helper functions for status transitions
   - Create TypeScript types for status values

## Technical Guidelines
- Create a structured directory for utility organization
- Write comprehensive unit tests for all utilities
- Use TypeScript for type safety and documentation
- Implement pure functions wherever possible
- Document function parameters and return values
- Consider edge cases and error handling
- Test utilities with the same data formats used in actual components
- Include internationalization considerations in time/date formatting tests
- Verify hooks work correctly during component lifecycle events

## Expected Outcome

User perspective:
- Consistent behavior for similar functionality
- Uniform display of time, status, and other data
- More predictable application behavior
- Improved reliability through well-tested utilities

Technical perspective:
- Reduced code duplication across the application
- Improved maintainability with centralized utilities
- Better testability with isolated, pure functions
- Enhanced developer experience with well-documented utilities
- Easier debugging with consistent implementations

## Validation Criteria
- [ ] Comprehensive unit tests for all utility functions
- [ ] TypeScript type coverage for all utilities
- [ ] Documentation for utility usage and examples
- [ ] Existing components refactored to use shared utilities
- [ ] Verified consistent behavior across the application
- [ ] Edge case testing for all critical utilities

# Component Library Unification

## Context
The application contains numerous UI components with similar patterns but different implementations:
- Status indicators (offline, completed, running) vary across components
- Button styles have inconsistent hover/focus states
- Form inputs lack unified styling and behavior
- Container and card elements have parallel implementations
- Navigation elements lack consistency

This creates a fragmented user experience and increases development time for new features.

## Requirements

1. Create foundational UI components
   - Develop Button component with variants (primary, secondary, danger)
   - Implement Input components with consistent validation
   - Create Card/Container components for content grouping
   - Add Typography components for headings and text
   - Implement Icon system with consistent styling

2. Build status and feedback components
   - Create StatusIndicator with different states
   - Implement Alert/Notification components
   - Develop ProgressIndicator components
   - Add Loading/Spinner components
   - Create Toast/Snackbar components for feedback

3. Implement form components
   - Develop FormField wrapper with validation
   - Create Select/Dropdown components
   - Implement Checkbox and Radio components
   - Add specialized inputs (date, number, etc.)
   - Build multi-step form components

4. Create layout and navigation components
   - Implement navigation bar components
   - Develop sidebar/drawer components
   - Create tab navigation components
   - Add pagination components
   - Implement layout grid/container systems

## Technical Guidelines
- Use React functional components with hooks
- Implement proper accessibility (ARIA attributes, keyboard navigation)
- Ensure components work with the theme system
- Add comprehensive TypeScript interfaces
- Create storybook or similar documentation
- Test components for responsiveness
- Consider component composition patterns
- Begin with a minimum set of components needed by most features
- Create a migration strategy for replacing existing component instances
- Develop a versioning approach for component API changes

# Implementation Sequence

To minimize dependency conflicts between these unification initiatives, follow this recommended implementation order:

1. **Theme System Unification** (First) - PARTIALLY COMPLETED - MUST COMPLETE BEFORE NEXT STEP
   - ✅ Initial color utilities implemented (`colors.ts`, `themeColors.ts`)
   - ✅ Basic theme detection functionality created (`themeUtils.ts`)
   - ❌ React Context for global theme state not yet implemented
   - ❌ useTheme hook not yet created
   - ❌ Component refactoring not yet completed

2. **Shared Utilities Unification** (Second) - BLOCKED UNTIL THEME SYSTEM COMPLETION
   - Requires proper directory structure (`src/hooks`, organized `src/utils`)
   - Should build upon existing utilities rather than replacing them
   - Needs integration with fully completed theme system
   - Will leverage the theme context components for status and data hooks

3. **CSS Framework Unification** (Third)
   - Builds on the theme system to create styling approach
   - Leverages shared utilities for implementation and testing
   - Creates utility classes needed by component library

4. **Component Library Unification** (Last)
   - Depends on all previous systems
   - Leverages theme system, shared utilities, and CSS framework

## Detailed Plan to Complete Theme System Unification

Before proceeding with Shared Utilities Unification, we must fully complete the Theme System implementation. Here's the action plan:

### 1. Test Suite Development (Test-First Approach)

- **Theme Context Tests**
  - [ ] Test context creation with default values
  - [ ] Test theme toggle functionality (light/dark/system)
  - [ ] Test system preference detection and response
  - [ ] Test localStorage persistence across page reloads
  - [ ] Test context provider cleanup on unmount

- **useTheme Hook Tests**
  - [ ] Test hook returns current theme value
  - [ ] Test theme toggle functions
  - [ ] Test system preference change detection
  - [ ] Test error handling when used outside provider
  - [ ] Test proper cleanup of event listeners

- **Component Integration Tests**
  - [ ] Test existing components receive theme values
  - [ ] Test components respond to theme changes
  - [ ] Test backwards compatibility during migration

### 2. Implementation Plan

- **Directory Structure**
  - [ ] Create `src/context` directory with ThemeContext.tsx
  - [ ] Create `src/hooks` directory with useTheme.ts
  - [ ] Organize existing theme utilities in `src/utils/theme/`
  - [ ] Create proper barrel files for clean exports

- **Theme Context Implementation**
  - [ ] Create ThemeContext with proper TypeScript types
  - [ ] Implement ThemeProvider component with:
    - Theme state management (light/dark/system)
    - Theme toggle functions
    - System preference detection
    - localStorage persistence
    - Proper context cleanup

- **useTheme Hook Development**
  - [ ] Create hook to consume ThemeContext
  - [ ] Add theme state and toggle functions
  - [ ] Add system preference detection
  - [ ] Include proper TypeScript types
  - [ ] Add error handling for usage outside provider

- **Utilities Reorganization**
  - [ ] Move existing utilities to appropriate directories
  - [ ] Create theme utility index exports
  - [ ] Ensure backward compatibility
  - [ ] Add any missing color utilities

### 3. Component Integration

- **Migration Strategy**
  - [ ] Identify all components using direct theme detection
  - [ ] Create priority list for component updates
  - [ ] Document migration pattern for components

- **Component Refactoring**
  - [ ] Replace direct theme detection with useTheme hook
  - [ ] Remove duplicate theme detection code
  - [ ] Update event listeners and cleanup
  - [ ] Verify visual consistency across all components

- **Documentation**
  - [ ] Create theme API documentation
  - [ ] Add usage examples
  - [ ] Document migration patterns
  - [ ] Update any existing documentation

### 4. Validation Criteria

- [ ] All theme context tests passing
- [ ] All useTheme hook tests passing
- [ ] Components successfully migrated to use the new theme system
- [ ] No duplicate theme detection code in components
- [ ] Theme toggle functionality working across the application
- [ ] System preference detection working correctly
- [ ] Theme persistence across page reloads verified
- [ ] Documentation for theme system completed

Only after all validation criteria are met should we proceed to the Shared Utilities Unification step.

## Updated Approach for Shared Utilities Unification

After completing the Theme System Unification, we'll proceed with:

1. **Leverage the Completed Theme System**
   - Use the established directory structure from Theme System Unification
   - Ensure all utilities work with the theme system
   - Implement hooks that integrate with the theme context

2. **Establish Directory Structure**
   - Expand the `src/hooks` directory with additional hooks
   - Further organize `src/utils` into logical subdirectories (time, data, status, etc.)
   - Build upon the existing `src/context` directory as needed

3. **Consolidate Existing Utilities**
   - Review and extend existing time-related utilities (`time.ts`, `timeUtils.ts`)
   - Build upon activity and status utilities rather than creating new ones
   - Ensure backward compatibility with components already using these utilities

This revised approach ensures we build on a properly completed Theme System rather than working with partial implementations, reducing technical debt and integration challenges later.

## Test-First Development Strategy

Before implementing each remaining phase, establish these test suites:

1. **Theme System Tests** - TO BE COMPLETED FIRST:
   - ✅ Tests for basic color utility functions
   - [ ] Tests for theme detection under various system preferences
   - [ ] Tests for theme context subscription and updates
   - [ ] Tests for theme persistence across simulated page reloads
   
   **Next steps**:
   - Write tests for the React Context implementation
   - Create test cases for the useTheme hook
   - Test theme persistence and preference saving
   - Verify component integration with the theme system

2. **Shared Utilities Tests** - AFTER THEME SYSTEM COMPLETION:
   - Create tests for existing utilities first to ensure backward compatibility
   - Write tests for new time formatting with various locales and formats
   - Develop tests for hook behavior during mount/unmount cycles
   - Add tests for data processing with empty/null/malformed inputs
   - Create test cases for status transitions through all possible states
   
   **Combined approach**:
   - Test theme and utility integration points
   - Ensure each utility works with both light and dark themes
   - Verify hooks interact correctly with theme context