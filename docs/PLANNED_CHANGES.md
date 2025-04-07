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

# Component Documentation Initiative

## Context
This initiative addresses the need for comprehensive component documentation to improve developer onboarding, maintainability, and component reuse across the application.

## Requirements
1. Create or update documentation for key components following the template at `docs/templates/COMPONENT_DOCUMENTATION_TEMPLATE.md`
   - Phase 1: Core visualization components
     - Timeline Component (high priority)
     - ProgressBar Component (high priority)
   - Phase 2: Core state management components
     - ActivityManager Component (high priority) 
     - Summary Component (high priority)
   - Phase 3: User input components
     - TimeSetup Component (medium priority)
     - ActivityButton Component (medium priority)
   - Phase 4: Auxiliary components
     - ServiceWorkerUpdater Component (medium priority)
     - ActivityForm Component (medium priority)
   - Phase 5: Additional utility components
     - TimeDisplay Component (medium priority)
     - OfflineIndicator Component (medium priority)
     - ThemeToggle Component (medium priority)
     - ErrorBoundary Component (medium priority)

2. Documentation requirements for each component:
   - Comprehensive props documentation with types and defaults
   - State management approach and internal workings
   - Theme compatibility details
   - Mobile responsiveness specifications
   - Accessibility considerations
   - Test coverage summary
   - Example code snippets showing usage patterns
   - Known limitations and edge cases

## Technical Guidelines
- Use the established template at `docs/templates/COMPONENT_DOCUMENTATION_TEMPLATE.md`
- Store component documentation files in `docs/components/` directory
- Name files to match component names (e.g., `Timeline.md`)
- Include links to relevant memory logs for implementation context
- Keep example code up-to-date with current component APIs

## Validation Criteria
- [x] Timeline component documentation complete
- [x] ProgressBar component documentation complete
- [x] ActivityManager component documentation complete
- [x] Summary component documentation complete
- [x] TimeSetup component documentation complete
- [x] ActivityButton component documentation complete
- [x] ServiceWorkerUpdater component documentation complete
- [x] ActivityForm component documentation complete
- [x] TimeDisplay component documentation complete
- [x] OfflineIndicator component documentation complete
- [x] ThemeToggle component documentation complete
- [x] ErrorBoundary component documentation complete

## Notes
Priority components were selected based on complexity, usage frequency, and existing memory logs that reference them.

Related memory logs:
- [MRTMLY-019: Timeline Break Visualization Fix](./logged_memories/MRTMLY-019-timeline-break-visualization.md)
- [MRTMLY-023: Timeline Calculation Test Update](./logged_memories/MRTMLY-023-timeline-calculation-test.md)
- [MRTMLY-036: Progress Bar Theme Compatibility Testing](./logged_memories/MRTMLY-036-progress-bar-theme-testing.md)
- [MRTMLY-030: Progress Bar Conditional Visibility Fix](./logged_memories/MRTMLY-030-progress-bar-visibility.md)
- [MRTMLY-028: Progress Element Repositioning](./logged_memories/MRTMLY-028-progress-element-repositioning.md)

# Documentation Linking Structure Initiative

## Context
Now that we have comprehensive documentation for all key components, we need to implement a linking structure that helps developers discover and navigate between related documentation. This will improve the overall developer experience, speed up onboarding, and ensure documentation is easily discoverable.

## Requirements
1. Create a comprehensive documentation linking structure:
   - Phase 1: Core navigation framework
     - Create Component Documentation Index in `docs/components/README.md`
     - Update main README.md with documentation section and links
     - Update copilot instructions with documentation linking guidelines
   
   - Phase 2: Component documentation updates
     - Add Navigation section to all component documentation files
     - Link to related components from each document
     - Ensure consistent cross-references between related components
   
   - Phase 3: Additional navigation enhancements
     - Create component relationship diagram for visual reference
     - Add component relationship section to the documentation index
     - Consider implementing breadcrumbs for deeper documentation pages

2. Documentation linking requirements for each component:
   - Navigation section at the top of each component documentation
   - Link back to Component Documentation Index
   - Category indication with link to that section in the index
   - Direct links to related components
   - Consistent mention of related components in the "Related Components" section
   - Links to relevant memory logs where applicable

## Technical Guidelines
- Use relative links for all documentation references
- Maintain consistent linking patterns across all documentation
- Group components by logical categories
- Ensure bidirectional linking between related components
- Make sure all links are valid and point to existing files

## Validation Criteria
- [x] Component Documentation Index created
- [x] Main README.md updated with documentation section
- [x] Copilot instructions updated with linking guidelines
- [x] Timeline component documentation updated with navigation
- [x] ProgressBar component documentation updated with navigation
- [x] ActivityManager component documentation updated with navigation
- [x] Summary component documentation updated with navigation
- [x] TimeSetup component documentation updated with navigation
- [x] ActivityButton component documentation updated with navigation
- [x] ServiceWorkerUpdater component documentation updated with navigation
- [x] ActivityForm component documentation updated with navigation
- [x] TimeDisplay component documentation updated with navigation
- [x] OfflineIndicator component documentation updated with navigation
- [x] ThemeToggle component documentation updated with navigation
- [x] ErrorBoundary component documentation updated with navigation
- [ ] Component relationship diagram created (if feasible)

## Notes
This initiative builds upon the completed Component Documentation Initiative, enhancing the documentation with a structured navigation system. The goal is to create an interconnected documentation ecosystem that developers can easily explore.
