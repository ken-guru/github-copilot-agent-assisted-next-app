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
- **Memory Tool**: Maintains persistent knowledge graphs for project context
- **Sequential Thinking Tool**: Enables step-by-step problem analysis and solution development
- **Time Tool**: Provides timezone-aware time handling for documentation and coordination

These tools enable more sophisticated AI assistance in debugging, planning, and implementation tasks.

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
1. Write tests first (TDD approach)
2. Ensure full coverage of new functionality
3. Update existing tests when changing behavior
4. Validate both light and dark theme scenarios
5. Test system theme preference handling
6. For complex browser APIs:
   - Use module-level mock functions for consistency
   - Properly restore original methods in afterEach blocks
   - Clear mock call counts between tests when needed
   - Document all testing approaches in Memory Log
7. For service worker tests:
   - Provide explicit mocks for navigator.serviceWorker
   - Handle event timing with appropriate test patterns
   - Test network-awareness functionality
   - Test update mechanisms and user notifications
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

- [Planning Changes](./docs/PLANNED_CHANGES.md) - How to document upcoming changes
- [Planning Template](./docs/templates/PLANNED_CHANGES_TEMPLATE.md) - Template for new change requests
- [Memory Log](./docs/MEMORY_LOG.md) - Project history and issue resolutions
- **[Memory Log Workflow](./docs/dev-guides/memory-log-workflow.md) - Complete guide for creating and accessing debugging knowledge**
- **[MCP Memory Tool Usage](./docs/dev-guides/mcp-memory-tool-usage.md) - AI agent guide for semantic search and knowledge building**
- [Time Utilities Testing Guide](./docs/dev-guides/TIME_UTILITIES_TESTING.md)

## License
[MIT](https://choosealicense.com/licenses/mit/)

---
Note: When using this document as a prompt for AI assistance, ensure to provide specific context about which section or feature you're working on to receive more targeted and relevant responses.

## Testing

### Unit Testing
Tests are run using Jest:

```bash
npm test           # Run all tests
npm run test:watch # Run tests in watch mode
```

### End-to-End Testing
This project uses Cypress for end-to-end testing:

```bash
npm run cypress       # Open Cypress Test Runner
npm run cypress:run   # Run Cypress tests in headless mode
```

### CI/CD Integration
All tests (including Cypress E2E tests) are automatically run in our GitHub Actions CI/CD pipeline:
- On push to main branch
- On pull requests to main branch

Test artifacts (screenshots and videos) for failed Cypress tests are available in the GitHub Actions workflow.
