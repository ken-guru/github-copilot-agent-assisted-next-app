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

# Feature/Change Title: Project Restructuring for Next.js Best Practices

## Context
The project needs to be restructured to better align with Next.js best practices as outlined in the official Next.js documentation. This will improve:
- Code organization and discoverability
- Team collaboration efficiency
- Adherence to framework conventions
- Long-term maintainability
- Developer onboarding experience

## Requirements

### Phase 1: Initial Analysis and Planning
1. Project structure audit
   - Create inventory of current project structure
   - Identify components, utilities, and other code assets
   - Document current routing structure
   - Map out dependencies between components/modules

2. Gap analysis
   - Compare current structure with Next.js recommendations
   - Identify specific structural changes needed
   - Prioritize changes based on impact and complexity

### Phase 2: Top-Level Directory Restructuring
1. App Router implementation/verification
   - Ensure `/app` directory exists and follows Next.js routing conventions
   - Verify or implement proper layout and page structure
   - Validate route groups and dynamic routes follow best practices

2. Public assets organization
   - Ensure `public` directory contains only static assets
   - Verify proper referencing of assets throughout the application

3. Source organization
   - Consider moving application code into a `src` directory
   - Organize components, utilities, and other shared code within appropriate directories

### Phase 3: Route Structure Implementation
1. Route segment organization
   - Implement folder structure that properly maps to URL paths
   - Organize nested routes according to application hierarchy
   - Apply route groups where appropriate to improve code organization

2. Special files implementation
   - Add/verify required special files (`layout.js`, `page.js`, etc.)
   - Implement proper error handling with `error.js` files
   - Add loading states with `loading.js` files where appropriate

3. Metadata implementation
   - Organize metadata files according to Next.js conventions
   - Implement proper SEO files (sitemap, robots, etc.)
   - Set up appropriate Open Graph and app icon files

### Phase 4: Component and Code Organization
1. Component organization
   - Implement consistent component hierarchy
   - Organize components using either colocation or centralized approaches
   - Consider using private folders (`_folderName`) for internal components

2. Shared code organization
   - Establish consistent patterns for utilities, hooks, and contexts
   - Consider organization by feature vs. type based on project needs
   - Implement proper import/export patterns

3. Type definitions organization
   - Organize TypeScript interfaces and types
   - Consider central type definitions vs. colocated types

### Phase 5: Configuration and Documentation
1. Configuration file organization
   - Verify proper setup of Next.js configuration files
   - Organize environment variables according to best practices
   - Ensure proper ESLint and TypeScript configuration

2. Documentation updates
   - Update README.md with new project structure information
   - Document organization patterns and conventions
   - Create folder/file structure visualization
   - Update GitHub Copilot instructions to reflect new structure
   - Update any component documentation to reflect new file paths
   - Update Memory Log references if needed

3. Project-specific documentation updates
   - Update copilot-instructions.md to include guidance about the new structure
   - Add information about directory conventions to relevant documentation
   - Create or update contributing guidelines to reflect structural standards
   - Document folder naming conventions and their significance

## Technical Guidelines
- Ensure backwards compatibility during migration
- Use route groups and private folders to better organize code without affecting URLs
- Consider colocation of related files when appropriate
- Implement proper component hierarchy with layouts and pages
- Follow naming conventions for special files
- Use route groups to organize routes by site section or team
- Apply private folders for implementation details not part of routing
- Create explicit mappings between old paths and new paths for reference
- Document any naming convention changes clearly
- Maintain detailed logs of each structural change for rollback capability

## Expected Outcome
- A project structure that follows Next.js best practices
- Improved developer experience with intuitive code organization
- Better separation of concerns between different parts of the application
- More maintainable and scalable codebase
- Improved build performance through better code organization

## AI Agent Execution Guidelines
1. Step-by-step execution approach
   - Complete each step in sequence before proceeding
   - Document all changes made, including file paths and content modifications
   - Create checkpoints after each major change to enable rollbacks if needed
   - Run tests after each significant restructuring step

2. Error handling process
   - If an error occurs during restructuring, document it completely
   - Include the full error message, context, and the operation being performed
   - Propose solutions based on error analysis
   - Document successful resolution approaches

3. Path management
   - Create a mapping document between old and new file paths
   - Update import statements methodically, one component at a time
   - Verify each updated import works before proceeding
   - Maintain a list of any complex path transformations

4. Progress tracking
   - Report completion status for each phase clearly
   - Identify any blockers or challenges encountered
   - Document any decisions made or assumptions followed
   - Flag areas that may need human review

5. Structure Analysis Tool Usage
   - Run the improved analyze-structure.js script at key milestones:
     - Before beginning each phase to establish a baseline
     - After completing each major restructuring step
     - After completing each phase to verify progress
     - Before final verification to ensure compliance
   - Use the compliance recommendations to identify remaining issues
   - Compare structure snapshots to track changes over time
   - Include snapshot comparisons in the memory logs for documentation

## Validation Criteria for Each Phase

### Phase 1: Initial Analysis and Planning
- [x] Set up analysis tools and documentation structure
- [x] Complete inventory of current project structure
- [x] Gap analysis document created based on actual file structure
- [ ] Migration strategy approved by team

### Phase 2: Top-Level Directory Restructuring
- [ ] App Router properly implemented/verified
- [ ] Public assets correctly organized
- [ ] Source organization implemented
- [ ] Build and tests pass after restructuring

### Phase 3: Route Structure Implementation
- [ ] Routes properly organized and functioning
- [ ] Special files implemented in appropriate locations
- [ ] Metadata files correctly configured
- [ ] All routes accessible and functioning as before

### Phase 4: Component and Code Organization
- [ ] Components organized according to chosen strategy
- [ ] Shared code properly structured
- [ ] Type definitions organized
- [ ] No regression in functionality

### Phase 5: Configuration and Documentation
- [ ] Configuration files properly set up
- [ ] Documentation updated
- [ ] GitHub Copilot instructions updated to reflect new structure
- [ ] Component documentation reflects new file paths
- [ ] Contributing guidelines updated with structural standards
- [ ] Team briefed on new structure
- [ ] Final testing complete with no regressions
