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

# Development Process Guidelines

## Sequential Implementation
- Work on one change at a time - never move to the next item until the current one is complete
- Complete all validation criteria for the current task before starting a new one
- Avoid parallel development to prevent code conflicts and maintain focus
- For multi-phase changes (like the Time Utilities Consolidation below), complete each phase fully before starting the next
- Mark completed items in the validation criteria as they are finished

## Testing Requirements
- Each implementation must include appropriate tests before considering it complete
- Tests should be written before or alongside implementation (Test-Driven Development)
- All tests must pass before a change is considered complete

## Documentation
- Update documentation alongside code changes
- Document all key decisions made during implementation
- Update the Memory Log for all significant changes or bug fixes

# Mobile UI Improvements

## Context
The current UI works on mobile devices but is not optimized for touch interactions or smaller screens. When users enter overtime, there's no clear indication. The visual structure needs improvement to better organize content on mobile devices.

## Requirements
1. Touch-friendly UI elements
   - Minimum touch target size of 44px
   - Proper spacing between interactive elements
   - Optimized touch feedback (visual indicators)
   - Use CSS variables for consistent scaling
   
2. Overtime indication
   - Clear visual feedback when user enters overtime
   - Formatted display of overtime duration
   - Animation to draw attention without being distracting
   - Accessibility considerations for all users
   
3. Improved visual structure
   - Reorganize layout into clear semantic sections:
     - Header with logo and theme switcher
     - Main content with components for different states
     - Footer with primary actions
   - Ensure proper hierarchy and focus on current task
   - Apply consistent spacing and component sizing

## Technical Guidelines
- Use the `useViewport` hook for responsive behavior detection
- Leverage CSS modules with mobile-specific classes
- Follow accessibility best practices (WCAG 2.1 AA)
- Implement performant animations using CSS transitions
- Support reduced motion preferences
- Add touch gesture support where appropriate

## Implementation Plan

### Phase 1: Foundation (Current Sprint)
- [x] Create test infrastructure for mobile UI components
- [x] Implement useViewport hook for responsive detection
- [x] Create ThemeContext and AppStateContext for component support
- [x] Build OvertimeIndicator component with tests
- [ ] Define mobile-first CSS variables system in global stylesheet
- [ ] Create TouchableButton component with proper sizing for all devices

### Phase 2: Core Structure (Next Sprint)
- [ ] Implement mobile App layout structure with semantic HTML
- [ ] Create responsive header component with mobile adaptations
- [ ] Build footer with touch-friendly action buttons
- [ ] Enhance OvertimeIndicator with haptic feedback
- [ ] Update Progress component for better mobile visibility

### Phase 3: Content Components (Future Sprint)
- [ ] Optimize ActivityManager for touch interactions
- [ ] Improve Timeline component for mobile viewing
- [ ] Update Summary component with mobile-friendly layout
- [ ] Create mobile navigation pattern for switching views
- [ ] Add pull-to-refresh and swipe gestures where appropriate

### Phase 4: Refinement (Future Sprint)
- [ ] Implement performance optimizations for mobile
- [ ] Add advanced touch interactions (gestures, etc.)
- [ ] Conduct usability testing on various devices
- [ ] Address feedback and fix edge cases
- [ ] Final accessibility audit and fixes

## Task Details

### Foundation Phase Tasks

#### 1. Mobile-First CSS Variables
**Status**: 🔄 In Progress
**Priority**: HIGH
**Description**: Define a comprehensive set of CSS variables for consistent mobile-friendly design
- [ ] Create spacing variables (margins, paddings)
- [ ] Define touch target size variables
- [ ] Set up responsive typography scale
- [ ] Add animation/transition timing variables
- [ ] Create layout dimension variables (header/footer heights)

#### 2. TouchableButton Component
**Status**: ⏱️ Not Started
**Priority**: HIGH
**Description**: Create a flexible button component with touch-friendly sizing and feedback
- [ ] Write tests for button variations and touch behavior
- [ ] Implement component with appropriate CSS modules
- [ ] Ensure proper ARIA attributes and keyboard navigation
- [ ] Add visual touch feedback states
- [ ] Document component with examples

### Core Structure Phase Tasks

#### 1. Mobile App Layout 
**Status**: ⏱️ Not Started
**Priority**: HIGH
**Description**: Restructure App component with clear semantic sections
- [ ] Create tests for responsive layout structure
- [ ] Implement header, main, footer organization
- [ ] Add responsive container styles
- [ ] Ensure proper component nesting
- [ ] Test on various viewport sizes

#### 2. Enhanced OvertimeIndicator
**Status**: ⏱️ Not Started
**Priority**: MEDIUM
**Description**: Add mobile-specific enhancements to overtime indicator
- [ ] Add haptic feedback API integration
- [ ] Improve animation visibility on small screens
- [ ] Ensure text readability at various sizes
- [ ] Implement banner style for critical notifications

## Expected Outcome
- **User Perspective**:
  - More comfortable interaction on mobile devices
  - Clear understanding of overtime status
  - Logical progression through the application
  - No frustration with small touch targets

- **Technical Perspective**:
  - Maintainable responsive code using hooks and CSS modules
  - Clear separation of concerns between components
  - Easy theme integration across viewport sizes
  - Good performance on mobile devices

## Progress Tracking

### Foundation Phase: 33% Complete
- [x] Test infrastructure (100%)
- [x] useViewport hook (100%)
- [x] Context providers (100%)
- [x] OvertimeIndicator component (100%)
- [ ] CSS variables system (0%)
- [ ] TouchableButton component (0%)

### Overall Project: 25% Complete
- [x] Phase 1: Foundation (33%)
- [ ] Phase 2: Core Structure (0%)
- [ ] Phase 3: Content Components (0%)
- [ ] Phase 4: Refinement (0%)

## Validation Criteria
- [x] Test cases written for all components
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Theme compatibility verified
- [ ] Documentation updated
- [ ] Accessibility tested
- [ ] Performance verified on mobile devices
