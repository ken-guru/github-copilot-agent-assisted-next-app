# Activity Timer and Tracker

[![Dependabot Updates](https://github.com/ken-guru/github-copilot-agent-assisted-next-app/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/ken-guru/github-copilot-agent-assisted-next-app/actions/workflows/dependabot/dependabot-updates)
[![CodeQL Security Scan](https://github.com/ken-guru/github-copilot-agent-assisted-next-app/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/ken-guru/github-copilot-agent-assisted-next-app/actions/workflows/codeql.yml)

## Project Context
You are working on a time management and activity tracking application built with Next.js. This documentation serves as both a guide for developers and a prompt for AI assistance in development.

## Project Scope and Limitations
```markdown
This is a hobby project with the following characteristics:
- Created for learning and experimentation purposes
- Not intended for production use
- May contain experimental features
- Built with AI assistance (primarily GitHub Copilot)
```

## Development Philosophy
The application is developed using AI-assisted techniques with these principles:
- Test-Driven Development (TDD)
- Component-based architecture
- Responsive design
- Theme-aware styling
- Accessibility considerations

### AI Development Enhancement
This project leverages Model Context Protocol (MCP) tools to enhance AI-assisted development:
- **GitHub Tools**: [Documentation](https://github.com/github/github-mcp-server) - Issue/PR management and analysis
- **Sequential Thinking**: [Documentation](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) - Complex problem analysis
- **Memory Tools**: [Documentation](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - Knowledge persistence and retrieval
- **Time Tools**: [Documentation](https://github.com/modelcontextprotocol/servers/tree/main/src/time) - Timezone-aware handling
- **Playwright Tools**: [Documentation](https://github.com/executeautomation/mcp-playwright) - Browser automation and UI verification

**Key Workflow**: [GitHub Issue Resolution](./docs/workflows/github-issue-resolution.md)

**Practical Examples:**
```bash
# Issue analysis with GitHub tools
mcp_github_get_issue(issue_number=123)
mcp_github_get_issue_comments(issue_number=123)

# Complex problem breakdown
mcp_sequential-th_sequentialthinking({
  thought: "Breaking down this issue: components affected, user impact, root cause..."
})

# Search existing solutions
mcp_memory_search_nodes(query="similar debugging patterns")

# UI verification
mcp_playwright_browser_navigate(url="http://localhost:3000")
mcp_playwright_browser_snapshot()
```

These tools enable systematic issue resolution and enhanced AI assistance. For complete usage guides, see [GitHub Issue Resolution Workflow](./docs/workflows/github-issue-resolution.md) and [Memory Log Workflow](./docs/dev-guides/memory-log-workflow.md).

### Change Management Approach
```markdown
The project uses a documentation system for tracking changes:
1. docs/PLANNED_CHANGES.md: 
   - Contains upcoming feature specifications
   - Uses standardized template format from docs/templates/PLANNED_CHANGES_TEMPLATE.md
   - Written in a prompt-friendly format for AI-assisted implementation
   - Used as input for AI-assisted implementation
2. docs/IMPLEMENTED_CHANGES.md:
   - Chronicles completed implementations
   - Includes timestamps and implementation details
   - Serves as reference for similar future changes
3. docs/MEMORY_LOG.md:
   - Tracks solutions attempted by AI for application issues
   - Prevents repetitive solution attempts 
   - Maintains a history of approaches with outcomes and tags
   - Documents debugging processes in a structured format
   - Records test implementation strategies and lessons learned
   - Preserves institutional knowledge about effective approaches
   - Should be consulted before addressing recurring issues

For GitHub issue resolution, follow the systematic workflow: docs/workflows/github-issue-resolution.md
```

## Core Features
When implementing or modifying features, ensure adherence to these core functionalities:
```markdown
- Time Management
  - Duration setting for work sessions
  - Deadline tracking capabilities
  
- Activity Management
  - Creation and tracking of multiple activities
  - State machine-based activity lifecycle (PENDING → RUNNING → COMPLETED)
  - Validated state transitions
  - Real-time status monitoring
  
- Visual Feedback
  - Progress bar for ongoing activities
  - Timeline visualization
   - Color-coded activity identification
      - Activities use a canonical type:
         ```typescript
         interface Activity {
            id: string;
            name: string;
            colorIndex: number;
            createdAt: string;
            isActive: boolean;
         }
         ```
      - Color sets for display are derived from `colorIndex` using `getNextAvailableColorSet` (see `src/utils/colors.ts`)
  - Break visualization between activities
  
- Theme System
  - Light/Dark/System theme modes
  - HSL-based color system
  - Persistent theme preferences

- Offline Support
  - Full functionality without network connectivity
  - Offline status indication
  - Service worker caching strategies
  - Update notification system
```

## Implementation Guidelines

### Architecture Patterns
```markdown
- Component-based UI architecture
- Custom React hooks for state management
- Activity State Machine for lifecycle management
- Theme system using CSS variables
```

### Project Structure
```
src/
  ├── app/            # Next.js app directory (routes, layout)
  ├── components/     # React components
  │   └── __tests__/  # Component tests
  ├── hooks/          # Custom React hooks
  │   └── __tests__/  # Hook tests
  └── utils/          # Utility functions
      └── __tests__/  # Utility tests
docs/                 # Project documentation
  ├── PLANNED_CHANGES.md    # Upcoming changes (uses template format)
  ├── IMPLEMENTED_CHANGES.md # Completed changes
  └── templates/        # Documentation templates
      ├── PLANNED_CHANGES_TEMPLATE.md
      ├── COMPONENT_DOCUMENTATION_TEMPLATE.md
      └── UTILITY_PROPOSAL_TEMPLATE.md
```

### Design System Specifications

#### Color System Requirements
```markdown
- Use HSL color format exclusively
- Maintain consistent hue values across themes
- Adjust saturation/lightness for theme variants
- Implement via CSS variables
- Ensure WCAG compliance for contrast ratios
```

#### Theme Implementation Requirements
```markdown
- Support three modes: Light/Dark/System
- Use CSS variables for theme values
- Implement smooth transitions
- Persist user preferences
- Handle system preference changes
```

## Development Setup

### Environment Requirements
```bash
Node.js (Latest LTS)
npm or yarn
```

### Installation Commands
```bash
# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev

# Run tests
npm test
# or
yarn test

# Watch mode for tests
npm run test:watch
# or
yarn test:watch
```

### AI Feature (Issue #307) - Local Dev Quickstart

```markdown
1) Copy .env.example to .env.local and set variables as needed:
   - AI_ENABLE_MOCK=true (recommended for local dev)
   - AI_FALLBACK_ON_429=true (default). Set to false to surface real 429 errors instead of mock fallback.
   - Note: OPENAI_API_KEY is deprecated and not used; BYOK is client-only.

2) Start the app and open /ai.
   - If unauthenticated, click "Enable AI (dev)" to set a temporary cookie (ai_auth=1).
   - Submit a prompt to generate a plan; when AI_ENABLE_MOCK=true, the API returns a mock plan.

3) Summary AI
   - The Summary component can request an AI summary via /api/ai/summary.
   - With AI_ENABLE_MOCK=true or when OpenAI returns 429 insufficient_quota, a mock summary is returned.

Notes:
- Service Worker is disabled on localhost to avoid intercepting dev assets; it still runs in previews/production.
- The temporary cookie gate is for development only.
```

### Deployment Verification
Before considering any feature or change complete, run these verification steps:
```markdown
1. Type checking:
   ```bash
   npm run type-check
   npm run tsc
   ```
2. Linting:
   ```bash
   npm run lint
   ```
3. Ensure all tests pass:
   ```bash
   npm test
   ```

All steps must pass without errors before deploying to Vercel. Address any warnings or errors that could impact deployment.

### Testing Requirements
When implementing new features or modifying existing ones:
```markdown
1. Follow Test Pyramid Architecture:
   - Jest for component logic, hooks, utilities (fast, comprehensive)
   - Cypress only for complete user workflows (slow, essential)
   
2. Test-Driven Development (TDD):
   - Write Jest tests before implementation
   - Focus on edge cases and error conditions
   - Test both light and dark theme scenarios
   
3. Performance Considerations:
   - Prefer Jest over Cypress when coverage is equivalent
   - Keep Cypress tests focused on user value
   - Mock external dependencies in Jest tests

4. Coverage Requirements:
   - Update existing tests when changing behavior
   - Validate accessibility compliance in Jest tests
   - Test keyboard navigation and focus management
   
5. For complex browser APIs:
   - Use module-level mock functions for consistency
   - Properly restore original methods in afterEach blocks
   - Clear mock call counts between tests when needed
   - Document all testing approaches in Memory Log
   
6. For service worker tests:
   - Test logic in Jest (fast, reliable)
   - Test UI interactions in Cypress (complete workflows)
   - Handle event timing with appropriate test patterns
   - Test network-awareness functionality
```

## Technology Stack
When implementing features, utilize these core technologies:
```markdown
- Next.js: Application framework
- React: UI component library
- TypeScript: Type safety
- Jest: Testing framework
- React Testing Library: Component testing
```

## Documentation

### Component Documentation

The application is built using a collection of reusable components. Comprehensive documentation for these components is available in the [Component Documentation Index](./docs/components/README.md).

Key component categories:

- **Visualization Components**: [Timeline](./docs/components/Timeline.md), [ProgressBar](./docs/components/ProgressBar.md)
- **State Management Components**: [ActivityManager](./docs/components/ActivityManager.md), [Summary](./docs/components/Summary.md)
- **User Input Components**: [TimeSetup](./docs/components/TimeSetup.md), [ActivityButton](./docs/components/ActivityButton.md)
- **Auxiliary Components**: [ServiceWorkerUpdater](./docs/components/ServiceWorkerUpdater.md), [ActivityForm](./docs/components/ActivityForm.md), [ConfirmationDialog](./docs/components/ConfirmationDialog.md)
- **Utility Components**: [TimeDisplay](./docs/components/TimeDisplay.md), [OfflineIndicator](./docs/components/OfflineIndicator.md), [ThemeToggle](./docs/components/ThemeToggle.md), [ErrorBoundary](./docs/components/ErrorBoundary.md)

### Development Resources

- [GitHub Issue Resolution Workflow](./docs/workflows/github-issue-resolution.md) - **Complete step-by-step process for resolving GitHub issues with MCP tools**
- [Commit Procedures](./docs/workflows/commit-procedures.md) - Standard procedures for code commits and PR fixes
- [Testing Procedures](./docs/workflows/testing-procedures.md) - Jest vs Cypress decision matrix and testing strategies
- [Code Quality Checklist](./docs/workflows/code-quality-checklist.md) - Final verification before deployment
- [Planning Changes](./docs/PLANNED_CHANGES.md) - How to document upcoming changes
- [Planning Template](./docs/templates/PLANNED_CHANGES_TEMPLATE.md) - Template for new change requests
- [Memory Log](./docs/MEMORY_LOG.md) - Project history and issue resolutions
- **[Memory Log Workflow](./docs/dev-guides/memory-log-workflow.md) - Complete guide for creating and accessing debugging knowledge**
- **[MCP Memory Tool Usage](./docs/dev-guides/mcp-memory-tool-usage.md) - AI agent guide for semantic search and knowledge building**
- [Time Utilities Testing Guide](./docs/dev-guides/TIME_UTILITIES_TESTING.md)

### Development Scripts

- **Memory Log Synchronization**: `node scripts/migrate-memory-logs-to-mcp.js`
  - Syncs markdown memory logs with MCP Memory Tool for AI search
  - Use `--dry-run` to preview changes before execution
  - Essential for maintaining hybrid markdown + MCP memory system
  - Not a one-off tool - keep for ongoing synchronization and disaster recovery

## License
[MIT](https://choosealicense.com/licenses/mit/)

---
Note: When using this document as a prompt for AI assistance, ensure to provide specific context about which section or feature you're working on to receive more targeted and relevant responses.

## Testing

This project follows a **Test Pyramid Architecture** optimized for speed, reliability, and maintainability.

### Test Architecture Strategy

```markdown
🔺 Test Pyramid (Optimized for Performance)
├── E2E Tests (Cypress) - ~16 tests, ~60 seconds
│   ├── Complete user workflows
│   ├── Cross-page navigation with data persistence  
│   ├── File import/export operations
│   └── Service worker UI interactions
├── Integration Tests (Jest) - Component interaction testing
│   ├── Component composition and prop passing
│   ├── Modal focus management and keyboard navigation
│   ├── Accessibility features and ARIA compliance
│   └── Page-level component integration
└── Unit Tests (Jest) - ~135+ tests, ~15 seconds
    ├── Component logic and state management
    ├── Hook behavior and edge cases
    ├── Utility functions and algorithms
    └── State machine transitions
```

### Running Tests

#### Jest Tests (Fast - Unit & Integration)
```bash
npm test                    # Run all Jest tests (~15 seconds)
npm run test:watch         # Run Jest tests in watch mode
npm test -- --testPathPatterns="pattern"  # Run specific test patterns
```

#### Cypress Tests (Focused - End-to-End)
```bash
npm run cypress            # Open Cypress Test Runner (~60 seconds total)
npm run cypress:run        # Run Cypress tests in headless mode
```

### Test Development Guidelines

#### When to Use Jest vs Cypress

**✅ Use Jest for:**
- Component rendering and props testing
- Form validation and error handling
- Keyboard navigation and focus management
- State management hooks (useActivityState, etc.)
- Utility function testing
- Accessibility compliance (ARIA, screen readers)
- Modal interactions and lifecycle
- Theme switching behavior

**✅ Use Cypress for:**
- Complete user workflows (Create → Read → Update → Delete)
- Cross-page navigation with data persistence
- File upload/download operations
- Service worker update notifications (UI only)
- Integration between multiple components/pages
- Browser-specific behavior that requires real browser environment

#### Testing Best Practices
```markdown
1. **Test-Driven Development (TDD)**
   - Write tests before implementation
   - Start with Jest for component logic
   - Add Cypress only for true user workflows

2. **Performance Optimization**
   - Favor Jest over Cypress when possible (15x faster)
   - Keep Cypress tests focused on user value
   - Mock external dependencies in Jest tests

3. **Maintainability**
   - Use descriptive test names
   - Group related tests in describe blocks
   - Keep test files close to source code
```

### CI/CD Integration
All tests are automatically run in our GitHub Actions CI/CD pipeline:
- **Jest tests**: Run on every push and PR (fast feedback)
- **Cypress tests**: Run on PR validation (thorough integration testing)
- **Performance**: Total test suite ~75 seconds (down from 4+ minutes)

Test artifacts (screenshots and videos) for failed Cypress tests are available in the GitHub Actions workflow.

### Migration Notes
This project recently migrated from a Cypress-heavy approach to a balanced test pyramid:
- **Eliminated**: 32 redundant Cypress tests
- **Added**: 35+ focused Jest tests  
- **Performance**: 75% faster execution
- **Coverage**: Enhanced with better edge case testing

For detailed migration information, see [MRTMLY-221](./docs/logged_memories/MRTMLY-221-comprehensive-cypress-jest-migration.md).

## Bring Your Own Key (BYOK) for OpenAI

You can use OpenAI features without configuring server env vars:

- Open the AI page from the navbar (always visible).
- In the AI page, enter your OpenAI key (sk-...) in the BYOK section and save.
- The key is kept only for this tab (sessionStorage) and never sent to the server.

Security notes:
- A strict CSP limits outbound connections to https://api.openai.com.
- The service worker bypasses OpenAI requests (no caching/interception).
- Avoid using BYOK on untrusted pages; client code has access while open.
