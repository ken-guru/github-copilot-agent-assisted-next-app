# GitHub Copilot Instructions

## PREAMBLE
This document contains guidelines for GitHub Copilot to follow when assisting with this project. The instructions are organized by category with clear priorities to ensure consistent, quality assistance. Follow ALL instructions carefully.

## CORE PRINCIPLES [PRIORITY: HIGHEST]
- Always write tests before implementing functionality
- Maintain thorough documentation with each code change
- Update the Memory Log for all debugging and issue resolution
- Verify code quality through testing, linting, and type checking
- Communicate clearly about implementation choices and alternatives

## TESTING PROTOCOLS [PRIORITY: HIGHEST]
### Test-First Development
- ✅ REQUIRED: Write tests BEFORE implementing any functionality
- Write tests covering basic scenarios, complex scenarios, and edge cases
- Ask clarifying questions about expected behavior before writing tests
- For data display, explicitly test:
  - Order of displayed items
  - Format of displayed values
  - Edge cases in the data

### Test Coverage Management
- Update all relevant tests when refactoring code
- Add specific order verification tests when changing display order or sorting
- Ask clarifying questions if expected test behavior needs to change
- Verify existing edge cases remain covered after changes

### Missing Test Coverage Protocol
- Flag when working with code lacking test coverage
- Present options:
  1. Create tests immediately
  2. Postpone test creation
- If postponement chosen, do not remind again in current session unless requested

### Test Verification
- Remind to run test suite after ANY code changes
- Syntax: `npm test`

## DOCUMENTATION STANDARDS [PRIORITY: HIGH]
### Component Documentation
- CREATE/UPDATE in `docs/components/` when:
  - Implementing new components
  - Making significant changes to existing components
  - Improving component APIs
- USE TEMPLATE: `docs/templates/COMPONENT_DOCUMENTATION_TEMPLATE.md`
- MUST INCLUDE:
  - Props documentation (types, defaults)
  - State management approach
  - Theme compatibility
  - Mobile responsiveness details
  - Accessibility considerations
  - Test coverage summary
  - Basic and advanced usage examples
  - Known limitations/edge cases
  - Up-to-date Change History

### Documentation Structure
- Add Navigation section at top of component documentation
- Link back to Component Documentation Index
- Link to related interacting components
- Add component to appropriate category in index
- Ensure component is linked from README.md documentation section

### Documentation Enhancement Priority Order
1. Interactive Component Diagrams
2. Search Functionality Enhancement
3. Code Snippet Improvements
4. Documentation Versioning
5. API Reference Enhancement
6. Memory Log Integration Improvements
7. Documentation Testing

### README Maintenance
- UPDATE when changes alter functionality described in README.md
- EVALUATE after each development cycle for needed updates regarding:
  - New features/functionality
  - Installation/setup changes
  - Usage examples
  - Configuration options
  - Dependencies/requirements

## MEMORY LOG PROTOCOLS [PRIORITY: HIGH]
### File Organization
- Store individual entries in: `docs/logged_memories/`
- Filename format: `MRTMLY-XXX-descriptive-name.md`
- NEVER add detailed entries directly to main MEMORY_LOG.md
- ONLY add reference links in main file pointing to individual entries

### New Entry Creation Process
1. Create new file in `docs/logged_memories/` with proper naming
2. Add entry details using template format
3. Add ONLY a reference link to MEMORY_LOG.md
4. Match existing reference format
5. Group by date/month in index
6. Add as LAST item in respective date section
7. NEVER overwrite existing entries
8. Use next available sequential ID number

### Entry Format Requirements
- Follow established template structure
- Include all required sections:
  - Initial State
  - Debug Process/Implementation
  - Resolution
  - Lessons Learned
- Use consistent heading levels
- Apply appropriate tags for searchability

### Debugging Documentation
- Document each debugging step in real-time
- Include ALL solution attempts (successful AND failed)
- Note unexpected behaviors and test failures
- Use appropriate tags for future reference
- Update entries as debugging progresses

### Memory Log Maintenance
- Edit individual files, not MEMORY_LOG.md
- Check for consistent formatting
- Ensure proper referencing in main index
- Link related issues
- Verify unique IDs
- Maintain chronological order within date sections
- Add new date sections at bottom of file when needed

## PROJECT STRUCTURE STANDARDS [PRIORITY: HIGH]
### Next.js File Organization
- Follow Next.js App Router conventions strictly
- Place all routing components in the `app` directory
- Use the following folder structure:
  - `app/` - For all route-related components and files
  - `components/` - For shared UI components
  - `lib/` or `utils/` - For utility functions and shared logic
  - `public/` - For static assets only
  - `styles/` - For global styles and theme definitions
  - `types/` - For TypeScript type definitions

### Naming Conventions
- Use kebab-case for folders within the app router
- Use PascalCase for component files
- Use camelCase for utility files
- Follow Next.js special file conventions exactly:
  - `page.tsx` - For route pages
  - `layout.tsx` - For layout components
  - `loading.tsx` - For loading states
  - `error.tsx` - For error boundaries

### File Organization Principles
- Colocate related files when appropriate
- Use route groups (parentheses folders) to organize related routes
- Use private folders (underscore prefix) for implementation details
- Keep components focused on single responsibilities
- Extract complex logic to separate utility functions
- Document component hierarchy in comments

## CODE QUALITY STANDARDS [PRIORITY: HIGH]
### Large File Refactoring
- IDENTIFY files exceeding 200 lines
- SUGGEST logical refactoring options:
  - Splitting into smaller modules
  - Creating new components for extracted functionality
  - Improving organization

### Package Management Evaluation
- Before adding new packages, DISCUSS:
  - Specific need addressed
  - Alternative implementation approaches
  - Security implications
  - Added complexity
  - Package maintenance status

### Deployment Verification Checklist
- Type checking:
  ```bash
  npm run type-check
  npm run tsc
  ```
- Linting:
  ```bash
  npm run lint
  ```
- Tests:
  ```bash
  npm test
  ```

### Verification Process
- Run all checks before marking work as complete
- Address ALL errors and warnings
- Document deployment-specific considerations in Memory Log
- Tag deployment issues with #deployment

## COMMUNICATION GUIDELINES [PRIORITY: MEDIUM]
### Change Summary Format
- Provide concise implementation summaries covering:
  - Reasoning behind choices
  - Follow-up question opportunities
  - Alternative approach possibilities

### Implementation Approach
- Prioritize based on immediate developer needs and resources
- Create clear implementation plans with milestones
- Document technical requirements before implementation
- Update Memory Log with progress and challenges
- Review completed work against expected benefits
- Focus on one enhancement at a time

## DEBUGGING TEMPLATE [REFERENCE]
```markdown
### Issue: [Test/Feature Name] Debugging Session
**Date:** YYYY-MM-DD
**Tags:** #debugging #tests #[relevant-area]
**Status:** [In Progress|Resolved|Blocked]

#### Initial State
- Description of the failing tests/features
- Error messages or unexpected behavior
- Current implementation state

#### Debug Process
1. First investigation step
   - What was examined
   - What was found
   - Next steps determined

2. Solution attempts
   - What was tried
   - Outcome
   - Why it did/didn't work

#### Resolution (if reached)
- Final solution implemented
- Why it worked
- Tests affected

#### Lessons Learned
- Key insights gained
- Patterns identified
- Future considerations
```
