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
- ALWAYS use terminal command: `npm run test`
- Run tests in terminal, not through other interfaces

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

### Change Planning Documentation
- USE TEMPLATE: `docs/templates/PLANNED_CHANGES_TEMPLATE.md` for all new feature/change requests
- REQUIRED SECTIONS in change planning:
  - Context: Components affected, current behavior, user needs
  - Requirements: Detailed specifications with implementation details
  - Technical Guidelines: Framework considerations, performance, accessibility
  - Expected Outcome: Success criteria from user and technical perspectives
  - Validation Criteria: Checklist for completion verification
- DOCUMENT in `docs/PLANNED_CHANGES.md` using template format
- MOVE to `docs/IMPLEMENTED_CHANGES.md` with timestamp when complete
- ENSURE template format for effective AI-assisted implementation

### Template Usage for AI Agents
- ALWAYS use `docs/templates/PLANNED_CHANGES_TEMPLATE.md` when user requests new features
- COPY the complete template structure - never create partial specifications
- FILL OUT ALL SECTIONS completely before implementation
- ASK clarifying questions if template sections cannot be completed
- REFERENCE existing template when explaining change planning process
- VALIDATE that all template requirements are met before proceeding with implementation
- UPDATE related documentation (component docs, README) when changes affect described functionality

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
5. Add as LAST item
6. NEVER overwrite existing entries
7. Use next available sequential ID number

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
- Maintain sequential ID order (not necessarily creation date order)

### Large-Scale Reorganization Protocol
- BEFORE starting: Document reorganization plan and scope
- CREATE backup/mapping strategy for reference preservation  
- PLAN systematic approach to reference updates
- EXECUTE reorganization with validation checkpoints
- VALIDATE all links and references after completion
- DOCUMENT process and lessons learned in Memory Log

### Memory Log ID Management
- ASSIGN sequential IDs in chronological order for consistency
- NEVER reuse or skip ID numbers
- MAINTAIN ID-to-filename consistency in all references
- UPDATE display IDs when files are renumbered
- VALIDATE ID consistency with automated tools

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
  npm run test
  ```

### Verification Process
- Run all checks before marking work as complete
- Address ALL errors and warnings
- Document deployment-specific considerations in Memory Log
- Tag deployment issues with #deployment
- VERIFY link integrity after file reorganizations
- CHECK for duplicate files in scripts directory
- RUN `node scripts/check-markdown-links.js` for link validation

## COMMIT GUIDELINES [PRIORITY: HIGH]
### Frequent Commit Strategy
- COMMIT early and often to maintain development momentum
- LIMIT each commit to maximum 5 files unless tightly coupled
- ENSURE each commit represents a logical, complete unit of work
- INCLUDE meaningful commit messages describing the specific change
- UPDATE planning documents before each commit to reflect current progress

### Commit Scope Guidelines
- **Single Component Changes**: One commit per component when migrating or refactoring
- **Related File Groups**: Group tightly coupled changes (component + test + documentation)
- **Feature Increments**: Commit each working increment of a feature implementation
- **Test Updates**: Separate commits for test-only changes when appropriate
- **Documentation Updates**: Can be combined with related code changes or separate if substantial

### Commit Quality Standards
- VERIFY all tests pass before committing
- ENSURE code compiles and type-checks successfully
- RUN linting and fix any issues before commit
- INCLUDE any necessary documentation updates in the same commit
- VALIDATE that the commit doesn't break existing functionality

### Planning Document Commit Protocol
- ALWAYS update planning documents (PLANNED_CHANGES.md) BEFORE committing
- MARK completed tasks with checkboxes and completion status
- UPDATE progress tracking percentages to reflect current state
- ENSURE planning document accurately reflects completed work
- COMMIT planning document updates along with implementation changes
- NEVER commit implementation without corresponding planning document updates

### Commit Message Format
- Use clear, descriptive commit messages
- Include component/area affected in the message
- Reference issue numbers when applicable
- Examples:
  - "Migrate ActivityButton to Bootstrap Button component"
  - "Add tests for ProgressBar Bootstrap migration"
  - "Update component documentation for ThemeToggle"

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

## SCRIPT LIFECYCLE MANAGEMENT [PRIORITY: HIGH]
### One-Off Script Protocols
- ARCHIVE immediately after single-use scripts complete their purpose
- NEVER leave completed fix/reorganization scripts in main `scripts/` directory
- CREATE scripts in `scripts/` for development, MOVE to `scripts/archive/` when done
- DELETE duplicates - keep only one copy (preferably archived version for history)

### Script Naming and Organization
- Use descriptive names: `fix-[specific-issue]-[date].js`
- Document script purpose in header comments
- Include cleanup instructions in script comments
- Archive with: `mv scripts/fix-*.js scripts/archive/` after completion

### Script Security Guidelines
- AVOID hardcoded credentials, passwords, or sensitive data
- LIMIT shell commands to safe, project-scoped operations
- DOCUMENT any `execSync` or `spawn` usage with security justification
- REVIEW scripts for security implications before committing

## LINK INTEGRITY PROTOCOLS [PRIORITY: HIGH]
### Systematic Link Validation
- RUN link checker after ANY large-scale file reorganization
- VALIDATE all markdown links before completing documentation changes
- USE `node scripts/check-markdown-links.js` as standard validation step
- NEVER complete reorganization without link verification

### Reorganization Best Practices
- PLAN link update strategy before starting file reorganizations
- CREATE mapping files for any ID or filename changes
- UPDATE references systematically, not ad-hoc
- VALIDATE with automated tools, not manual checking

### Link Maintenance Requirements
- INCLUDE link validation in all documentation PRs
- FIX broken links immediately when discovered
- MAINTAIN audit trail of reference changes in Memory Log
- PREVENT false positives by proper code block formatting

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
