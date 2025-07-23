```instructions
# GitHub Copilot Instructions

## PREAMBLE
This document contains guidelines for GitHub Copilot to follow when assisting with this project. The instructions are organized by category with clear priorities to ensure consistent, quality assistance. Follow ALL instructions carefully.

## PROJECT ARCHITECTURE ESSENTIALS [PRIORITY: CRITICAL]
**Read this section first for immediate productivity in the codebase.**

### Core Architecture Patterns
This is a **Next.js 15 + React 19 + Bootstrap 5 + TypeScript** activity tracking application with these architectural patterns:

#### Activity State Machine (`src/utils/activityStateMachine.ts`)
```typescript
// Activity lifecycle: PENDING → RUNNING → COMPLETED/REMOVED
// Only ONE activity can be RUNNING at a time
// State machine enforces valid transitions and business rules
// Used by useActivitiesTracking hook for state management
```

#### Hook-Based State Architecture
```
useActivityState (main orchestrator)
├── useActivitiesTracking (state machine wrapper)
└── useTimelineEntries (timeline management)
```

#### Theme System (`src/contexts/ThemeContext.tsx`)
- **CSS Variables** + **Bootstrap data-bs-theme** for theming
- **Light/Dark/System** modes with localStorage persistence
- **DOM Updates**: `data-theme`, `data-bs-theme` attributes on `html` and `body`
- **Critical**: Theme changes require both CSS variables AND Bootstrap attribute updates

#### Component Migration Status
- **✅ MIGRATED**: All UI components use React-Bootstrap components
- **🔧 PATTERN**: Custom components wrap Bootstrap for consistent theming
- **📍 LOCATION**: `src/components/` (organized by UI vs business logic)

### Key Integration Points
#### Service Worker Architecture (`public/service-worker.js`)
```javascript
// Offline-first PWA with update notifications
// ServiceWorkerUpdater component manages lifecycle
// Caches Next.js static assets + app shell
// Custom offline fallback page generation
```

#### Color System (`src/utils/colors.ts`)
```typescript
// HSL-based color generation with getNextAvailableColorSet()
// Activities use colorIndex for consistent color assignment
// Theme-aware saturation/lightness adjustments
```

#### Test Architecture (Jest + Cypress)
```
85% Jest (fast unit/integration) + 15% Cypress (e2e workflows)
- Jest: Component logic, hooks, utilities, accessibility
- Cypress: Complete user workflows, cross-page navigation
- Performance: 15x faster with Jest-first approach
```

### Critical File Locations
```
src/
├── hooks/useActivityState.ts      # Main state orchestrator
├── utils/activityStateMachine.ts  # Business logic core
├── contexts/ThemeContext.tsx      # Theme management
└── components/                    # Bootstrap-wrapped components

docs/
├── PLANNED_CHANGES.md            # AI-ready change specs
├── MEMORY_LOG.md                 # Debugging knowledge index
├── logged_memories/              # Detailed debugging sessions
└── templates/                    # Change planning templates

scripts/
├── migrate-memory-logs-to-mcp.js # MCP knowledge sync (keep)
└── check-markdown-links.js       # Link validation tool
```

## CRITICAL WORKFLOW RULES [PRIORITY: ABSOLUTE HIGHEST]
### Issue Resolution Continuity Protocol
**NEVER identify an issue and then forget to resolve it after committing.**

#### The Problem Pattern to AVOID:
1. Identify a specific issue (e.g., "simplified form logic needs debugging")
2. Commit current progress 
3. **FORGET** to continue working on the identified issue
4. Move on to other tasks, leaving the issue unresolved

#### MANDATORY Resolution Protocol:
When you identify ANY issue or debugging need:

1. **EXPLICITLY STATE** the next action required
2. **IMMEDIATELY AFTER COMMITTING**: Continue with the identified issue resolution
3. **NEVER END** a response by just committing without addressing identified issues
4. **USE CLEAR TRANSITION LANGUAGE**: 
   - "Now that changes are committed, let me debug the simplified form logic..."
   - "With progress saved, I'll investigate why the description field still shows..."
   - "Commit complete. Continuing with the identified issue..."

#### Session Memory Management:
- **DOCUMENT UNRESOLVED ISSUES** in commit messages for context preservation
- **START NEXT ACTIONS** with explicit reference to previously identified issues
- **MAINTAIN ISSUE TRACKING** throughout the debugging session
- **CREATE MEMORY LOG ENTRIES** for complex debugging sessions with identified issues

#### Enforcement Guidelines:
- ⚠️ **CRITICAL**: This rule supersedes all other commit guidelines
- 🔄 **CONTINUOUS FLOW**: Identification → Commit → **IMMEDIATE CONTINUATION** → Resolution
- 📝 **EXPLICIT COMMUNICATION**: Always state what you will work on next after committing
- ✅ **COMPLETION VERIFICATION**: Only end work when issues are fully resolved, not just identified

## CORE PRINCIPLES [PRIORITY: HIGHEST]
- Always write tests before implementing functionality
- Maintain thorough documentation with each code change
- Update the Memory Log for all debugging and issue resolution
- Verify code quality through testing, linting, and type checking
- **NEVER push code that fails CI/CD pipeline tests**
- **Ensure all code passes npm run test, npm run lint, npm run type-check, and npm run build before commits**
- Communicate clearly about implementation choices and alternatives

## TESTING PROTOCOLS [PRIORITY: HIGHEST]
### Test Pyramid Architecture
- ✅ FOLLOW: Jest for component logic → Cypress for user workflows
- ✅ PERFORMANCE: Prefer Jest over Cypress when coverage is equivalent (15x faster)
- ✅ ARCHITECTURE: Unit → Integration → E2E pyramid structure

### Test-First Development
- ✅ REQUIRED: Write Jest tests BEFORE implementing any functionality
- Write tests covering basic scenarios, complex scenarios, and edge cases
- Ask clarifying questions about expected behavior before writing tests
- For data display, explicitly test:
  - Order of displayed items
  - Format of displayed values
  - Edge cases in the data

### Jest vs Cypress Decision Matrix
#### ✅ USE JEST FOR:
- Component rendering and props testing
- Form validation and error handling
- Keyboard navigation and focus management
- State management hooks (useActivityState, etc.)
- Utility function testing
- Accessibility compliance (ARIA, screen readers)
- Modal interactions and lifecycle
- Theme switching behavior

#### ✅ USE CYPRESS FOR:
- Complete user workflows (Create → Read → Update → Delete)
- Cross-page navigation with data persistence
- File upload/download operations
- Service worker update notifications (UI only)
- Integration between multiple components/pages
- Browser-specific behavior requiring real browser environment

### Test Coverage Management
- Update all relevant tests when refactoring code
- Add specific order verification tests when changing display order or sorting
- Ask clarifying questions if expected test behavior needs to change
- Verify existing edge cases remain covered after changes

### Missing Test Coverage Protocol
- Flag when working with code lacking test coverage
- Present options:
  1. Create Jest tests immediately (preferred)
  2. Create Cypress tests only if true user workflow
  3. Postpone test creation with justification
- If postponement chosen, do not remind again in current session unless requested

### Test Verification
- Remind to run test suite after ANY code changes
- ALWAYS use terminal commands via `run_in_terminal` for reliable execution:
  - `npm test` for full Jest test suite
  - `npm test -- --testPathPatterns="pattern"` for specific test patterns
  - `npm run lint` for linting checks
  - `npm run type-check` for TypeScript validation
  - `npm run cypress:run` for e2e validation when needed
- AVOID VS Code tasks for test execution as they can cause hanging/incomplete output issues

### Terminal Command Guidelines
- **NEVER run interactive commands** that require user input to complete
- **AVOID commands that open pagers** (less, more, man pages) without proper flags
- **PREVENT hanging commands** that wait for user selection or navigation
- **USE non-interactive flags** when available:
  - `gh pr view --json` instead of `gh pr view` (which opens pager)
  - `git log --oneline -n 5` instead of `git log` (which opens pager)
  - `cat file.txt` instead of `less file.txt` or `more file.txt`
  - `--no-pager` flag for git commands when needed
- **CHECK command completion** - ensure all commands return to prompt
- **TERMINATE hanging commands** immediately if they don't complete within reasonable time

### Performance Optimization Guidelines
- PERFORMANCE FIRST: Choose Jest over Cypress when possible (15x faster)
- CYPRESS USAGE: Only for true user workflows that provide unique value
- TEST PYRAMID: Maintain 85% Jest, 15% Cypress distribution
- CI/CD EFFICIENCY: Fast Jest tests enable rapid feedback loops

### GitHub PR Check Monitoring
- Use `gh pr checks <PR_NUMBER> --fail-fast --watch` for real-time updates
- Avoid using `gh pr checks` without flags as it may hang indefinitely
- The `--fail-fast` flag ensures quick response when checks fail
- The `--watch` flag provides live updates as checks complete

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

### Planning Document Lifecycle Management
- **CLEAR** `docs/PLANNED_CHANGES.md` after completing major features/PRs
- **RESET** to template reference only to prepare for future work
- **DOCUMENT** completed changes in `docs/IMPLEMENTED_CHANGES.md` before clearing
- **COMMIT** the cleanup as part of PR completion process
- **MAINTAIN** clean slate for next development cycle

### Template Usage for AI Agents
- ALWAYS use `docs/templates/PLANNED_CHANGES_TEMPLATE.md` when user requests new features
- COPY the complete template structure - never create partial specifications
- FILL OUT ALL SECTIONS completely before implementation
- ASK clarifying questions if template sections cannot be completed
- REFERENCE existing template when explaining change planning process
- VALIDATE that all template requirements are met before proceeding with implementation
- UPDATE related documentation (component docs, README) when changes affect described functionality

## MEMORY LOG PROTOCOLS [PRIORITY: HIGH]
### Complete Workflow Reference
- **COMPLETE GUIDE**: Follow `docs/dev-guides/memory-log-workflow.md` for comprehensive instructions
- **AI AGENTS**: Use MCP Memory Tool first for semantic search, then markdown for detailed reference
- **HUMAN DEVELOPERS**: Create markdown first (authoritative), then sync to MCP for AI accessibility

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
8. **REQUIRED**: Always add memory entries to MCP Memory Tool for AI agent accessibility
   - Use `mcp_memory_create_entities` and `mcp_memory_create_relations` tools
   - Create entities for debugging sessions, patterns, components, and memory logs
   - Establish relationships between entities to build knowledge graph
   - This enables semantic search and persistent knowledge across sessions

### MCP Memory Tool Integration
- **MANDATORY**: All debugging sessions, fixes, and significant insights MUST be added to MCP
- **DUAL STORAGE**: Maintain both markdown files (authoritative) and MCP entities (searchable)
- **AI ACCESSIBILITY**: MCP enables AI agents to find relevant context from previous work
- **RELATIONSHIP MAPPING**: Connect related debugging sessions, patterns, and components
- **SEMANTIC SEARCH**: Use MCP search to find relevant historical context before starting new work

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
### Debug Output Suppression
**MANDATORY:** Avoid unnecessary debug console output (console.log/info/warn/error) in committed code unless required for test assertions or error reporting. 
- Debug output should only be present in development or Cypress environments, and must be conditionally suppressed in production and test runs.
- Remove or suppress all debug console output before committing unless explicitly required for CI/CD, error handling, or test validation.
- Review all components, utilities, and service worker scripts for noisy logs before finalizing PRs.
- If debug output is needed for troubleshooting, add a clear comment and ensure it is removed or suppressed before merging to main.
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
- VERIFY link integrity after file reorganizations
- CHECK for duplicate files in scripts directory
- RUN `node scripts/check-markdown-links.js` for link validation

## MCP TOOL USAGE GUIDELINES [PRIORITY: HIGH]
### Enhanced Problem-Solving Tools
When these MCP tools are available, leverage them to enhance development workflows and problem-solving capabilities:

#### Sequential Thinking Tool
**Purpose**: Dynamic, step-by-step problem analysis and solution development
**When to Use**:
- Breaking down complex implementation requirements
- Planning multi-step refactoring or migration processes
- Analyzing debugging challenges that require systematic investigation
- Design decisions that need thorough evaluation of alternatives
- Problems where the full scope isn't initially clear
- Tasks requiring context maintenance across multiple development steps

**Usage Guidelines**:
- START with initial thought estimate but adjust `totalThoughts` as understanding deepens
- USE `isRevision` and `revisesThought` to refine previous analysis
- EMPLOY `branchFromThought` and `branchId` for exploring alternative approaches
- SET `nextThoughtNeeded` to false only when satisfied with solution completeness
- INCLUDE hypothesis generation and verification in the thinking process
- DOCUMENT key insights in Memory Log after complex problem-solving sessions

**Example Applications**:
- Component migration planning with dependency analysis
- Test strategy development for complex features
- Architecture decisions requiring trade-off evaluation
- Debugging multi-layered issues with unknown root causes

#### Time Management Tool
**Purpose**: Timezone-aware time handling and conversion
**When to Use**:
- Documenting timestamps in Memory Log entries with timezone context
- Planning development schedules across team timezones
- Handling time-sensitive features or deployments
- Converting meeting times or deadlines for global collaboration
- Adding temporal context to development milestones

**Usage Guidelines**:
- USE `get_current_time` with specific IANA timezone names for accurate timestamps
- APPLY `convert_time` when coordinating across multiple timezones
- INCLUDE timezone information in all time-sensitive documentation
- STANDARDIZE on UTC for internal logging, convert for user-facing times

**Example Applications**:
- Memory Log entry timestamps: "Debugging session started at 2024-01-15 14:30:00 EST"
- Release planning: "Deploy window: 02:00 UTC (21:00 EST, 15:00 JST+1)"
- Meeting coordination: "Code review at 16:00 CET converts to 10:00 EST"

#### Memory Knowledge Graph Tool
**Purpose**: Persistent knowledge management across development sessions
**When to Use**:
- Tracking complex project relationships and dependencies
- Maintaining developer context across long-term initiatives
- Building institutional knowledge about codebase patterns
- Documenting architectural decisions and their relationships
- Creating searchable knowledge base of debugging solutions

**Usage Guidelines**:
**Entity Creation**:
- CREATE entities for: components, developers, issues, features, dependencies, patterns
- USE descriptive `entityType` classifications: "component", "developer", "issue", "pattern", "dependency"
- STORE atomic observations: one fact per observation entry
- MAINTAIN consistent naming conventions for entity references

**Relationship Mapping**:
- DEFINE relations in active voice: "depends_on", "implements", "resolves", "authored_by"
- MAP component dependencies, developer responsibilities, issue relationships
- TRACK architectural patterns and their usage across codebase
- DOCUMENT decision influences and implementation relationships

**Knowledge Retrieval**:
- USE `search_nodes` for finding related information during development
- APPLY `open_nodes` to retrieve specific context for current work
- LEVERAGE `read_graph` for comprehensive project understanding
- QUERY before starting complex tasks to gather relevant historical context

**Maintenance Practices**:
- UPDATE observations when component behavior or architecture changes
- ADD new relationships when dependencies or responsibilities shift
- DELETE obsolete entities when components are removed or refactored
- REGULAR cleanup of outdated observations and relationships

**Integration with Memory Log**:
- LINK Memory Log entries to relevant knowledge graph entities
- CREATE entities for significant debugging sessions and their outcomes
- REFERENCE knowledge graph findings in Memory Log documentation
- MAINTAIN bidirectional references between systems
- MIGRATE existing memory logs to MCP memory tool for AI-agent accessibility
- USE MCP search for finding relevant historical debugging sessions
- STORE new debugging sessions in both markdown and MCP formats during transition

**Memory Log Migration Status**:
- EXISTING LOGS: 219 memory log entries in `docs/logged_memories/`
- MIGRATION TOOL: Use `scripts/migrate-memory-logs-to-mcp.js` for automated migration
- POC COMPLETED: MRTMLY-001 and MRTMLY-002 successfully migrated with full entity/relation structure
- SEARCH VALIDATED: Semantic search working effectively for AI agent queries
- HYBRID APPROACH: Maintain both markdown files and MCP entities during transition

### Tool Combination Strategies
**Sequential Thinking + Memory Graph**:
- USE sequential thinking to analyze complex problems
- STORE analysis outcomes and decision rationale in knowledge graph
- REFERENCE previous similar analyses when facing comparable challenges

**Time + Memory Graph**:
- TIMESTAMP all knowledge graph updates with timezone context
- TRACK temporal patterns in development issues and solutions
- MAINTAIN historical timeline of architectural decisions

**All Three Tools Together**:
- ANALYZE problems systematically with sequential thinking
- DOCUMENT solutions and context in knowledge graph with time stamps
- BUILD comprehensive development intelligence over time
- CREATE searchable institutional memory for future reference

### Tool Availability Protocol
- CHECK for tool availability before complex problem-solving sessions
- INFORM users when enhanced capabilities are available
- FALLBACK to standard approaches when tools unavailable
- DOCUMENT enhanced workflows in Memory Log for process improvement

## COMMIT GUIDELINES [PRIORITY: HIGH]
### Standard PR Fix Procedure
When implementing fixes for PR comments or issues, ALWAYS follow this established procedure:

**Step 1: Implement Fix**
- Make the necessary code changes to address the issue
- Update related tests if needed

**Step 2: Run Targeted Tests**
- Use `npm test -- --testPathPatterns="ComponentName"` for specific component tests
- Verify the fix works correctly and doesn't break existing functionality

**Step 3: Run Full Test Suite**
- Execute `npm run test` to ensure all tests pass
- Address any test failures before proceeding

**Step 4: Run Quality Checks**
- Execute `npm run lint` to ensure code style compliance
- Execute `npm run type-check` to verify TypeScript type safety
- Address any linting or type errors

**Step 5: Run Cypress Tests (Optional but Recommended)**
- Execute `npm run cypress:run` to run end-to-end tests locally
- Only run if changes affect user workflows or cross-component interactions
- Skip if changes are purely unit-level (covered by Jest in Step 3)
- Address any Cypress test failures before proceeding
- Note: This prevents waiting for GitHub CI/CD to catch e2e issues

**Step 6: Commit and Push**
- Stage changes: `git add .`
- Commit with descriptive message explaining the fix
- Push to feature branch: `git push origin <branch-name>`

**Step 7: Verify PR Update**
- Confirm changes appear in the PR
- Monitor CI/CD pipeline to ensure all checks pass

This procedure ensures:
- Code quality and consistency
- All tests pass before pushing (including e2e tests when relevant)
- Clear commit history
- Automated CI/CD validation
- Proper PR documentation
- Early detection of integration issues through local Cypress testing

### Issue Resolution Continuity Protocol
**NEVER identify an issue and then forget to resolve it after committing.**

#### The Problem Pattern to AVOID:
1. Identify a specific issue (e.g., "simplified form logic needs debugging")
2. Commit current progress 
3. **FORGET** to continue working on the identified issue
4. Move on to other tasks, leaving the issue unresolved

#### MANDATORY Resolution Protocol:
When you identify ANY issue or debugging need:

1. **EXPLICITLY STATE** the next action required
2. **IMMEDIATELY AFTER COMMITTING**: Continue with the identified issue resolution
3. **NEVER END** a response by just committing without addressing identified issues
4. **USE CLEAR TRANSITION LANGUAGE**: 
   - "Now that changes are committed, let me debug the simplified form logic..."
   - "With progress saved, I'll investigate why the description field still shows..."
   - "Commit complete. Continuing with the identified issue..."

#### Session Memory Management:
- **DOCUMENT UNRESOLVED ISSUES** in commit messages for context preservation
- **START NEXT ACTIONS** with explicit reference to previously identified issues
- **MAINTAIN ISSUE TRACKING** throughout the debugging session
- **CREATE MEMORY LOG ENTRIES** for complex debugging sessions with identified issues

#### Enforcement Guidelines:
- ⚠️ **CRITICAL**: This rule supersedes all other commit guidelines
- 🔄 **CONTINUOUS FLOW**: Identification → Commit → **IMMEDIATE CONTINUATION** → Resolution
- 📝 **EXPLICIT COMMUNICATION**: Always state what you will work on next after committing
- ✅ **COMPLETION VERIFICATION**: Only end work when issues are fully resolved, not just identified

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

### Infrastructure Script Exceptions
- KEEP scripts with ongoing utility in main `scripts/` directory
- **Memory Log Sync**: `migrate-memory-logs-to-mcp.js` is infrastructure for hybrid memory system
  - Syncs new markdown memory logs to MCP knowledge graph
  - Serves as disaster recovery for rebuilding MCP store
  - Essential for team onboarding and system migration
  - NOT a one-off migration tool - retain for ongoing use

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

#### MCP Tool Usage (when available)
- **Sequential Thinking**: Record complex analysis steps and hypothesis testing
- **Memory Tool**: Document patterns and solutions for future reference
- **Time Tool**: Track debugging session duration and timezone context
