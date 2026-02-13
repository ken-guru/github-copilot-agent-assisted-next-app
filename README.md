# Activity Timer and Tracker

[![Dependabot Updates](https://github.com/ken-guru/github-copilot-agent-assisted-next-app/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/ken-guru/github-copilot-agent-assisted-next-app/actions/workflows/dependabot/dependabot-updates)
[![CodeQL Security Scan](https://github.com/ken-guru/github-copilot-agent-assisted-next-app/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/ken-guru/github-copilot-agent-assisted-next-app/actions/workflows/codeql.yml)

## Project Context

A progressive web application (PWA) for time management and activity tracking built with Next.js 16, React 19, and Bootstrap 5. This is a learning project developed with AI-assisted techniques, focusing on modern web development practices and offline-first functionality.

## Development Philosophy

This application follows modern development practices:
- **Test-First Development**: Jest for unit/integration tests, Cypress for end-to-end workflows
- **Component-Based Architecture**: Reusable React components with TypeScript
- **Progressive Enhancement**: Works offline with service worker caching
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Theme System**: Light/Dark/System modes using CSS variables
- **Accessibility First**: WCAG compliance and semantic HTML

### AI-Assisted Development

This project uses GitHub Copilot and MCP (Model Context Protocol) servers for enhanced AI development:

**MCP Servers**:
- **github** - Issue/PR management
- **playwright** - Browser automation for UI verification
- **context7** - Real-time library documentation

**AI Configuration**:
- [AGENTS.md](./AGENTS.md) - Project context for AI agents
- [.github/copilot-instructions.md](.github/copilot-instructions.md) - Copilot instructions
- [.github/agents/](.github/agents/) - Custom agents (Researcher, Implementer, Reviewer)

**Workflows**: [GitHub Issue Resolution Guide](./docs/workflows/github-issue-resolution.md)

### Documentation System

Structured documentation for tracking development:
- **[docs/PLANNED_CHANGES.md](./docs/PLANNED_CHANGES.md)** - Feature specifications and upcoming changes
- **[docs/IMPLEMENTED_CHANGES.md](./docs/IMPLEMENTED_CHANGES.md)** - Completed features with timestamps
- **[docs/MEMORY_LOG.md](./docs/MEMORY_LOG.md)** - Debugging solutions and historical context
- **[docs/templates/](./docs/templates/)** - Standardized documentation templates

## Core Features

- **Time Management**
  - Duration setting for work sessions
  - Deadline tracking capabilities
  
- **Activity Management**
  - Create and track multiple activities
  - State machine-based lifecycle: `PENDING → RUNNING → COMPLETED`
  - Only one activity can run at a time
  - Real-time status monitoring
  
- **Visual Feedback**
  - Progress bar for ongoing activities
  - Timeline visualization with color-coded activities
  - Break visualization between activities
  
- **Theme System**
  - Light/Dark/System theme modes
  - HSL-based color system with CSS variables
  - Persistent theme preferences (localStorage)

- **Offline Support**
  - Full functionality without network connectivity
  - Offline status indicator
  - Service worker caching for PWA functionality
  - Update notification system
  
- **Session Sharing**
  - Create read-only share links
  - Theme-aware shared view
  - JSON export/import functionality
  
- **AI Features** (Experimental)
  - Activity planning with OpenAI (Bring Your Own Key)
  - AI-generated summaries

## Architecture

### Design Patterns

**State Management**:
- Activity lifecycle managed by state machine (`src/utils/activityStateMachine.ts`)
- React hooks for state orchestration (`src/hooks/useActivityState.ts`)
- Timeline management via `useTimelineEntries` hook

**Component Architecture**:
- Bootstrap 5 components with React Bootstrap
- TypeScript for type safety
- Organized by feature and responsibility

**Theme System**:
- CSS variables with Bootstrap's data-bs-theme
- Context-based theme management (`src/contexts/ThemeContext.tsx`)
- Light/Dark/System modes with localStorage persistence

### Project Structure

```
src/
  ├── app/              # Next.js app directory (App Router)
  │   ├── page.tsx     # Main application page
  │   ├── ai/          # AI features
  │   ├── shared/      # Session sharing
  │   └── layout.tsx   # Root layout
  ├── components/       # React components
  │   ├── feature/     # Feature-specific components
  │   └── __tests__/   # Component tests
  ├── hooks/            # Custom React hooks
  │   └── __tests__/   # Hook tests
  ├── contexts/         # React contexts (Theme, etc.)
  ├── utils/            # Utility functions
  │   └── __tests__/   # Utility tests
  ├── types/            # TypeScript type definitions
  └── constants/        # Application constants

docs/                   # Documentation
  ├── components/       # Component documentation
  ├── workflows/        # Development workflows
  ├── dev-guides/       # Developer guides
  ├── templates/        # Documentation templates
  └── logged_memories/  # Debugging history

.github/
  ├── workflows/        # CI/CD pipelines
  └── agents/           # AI agent definitions
```

### Color System

Activities use color indices mapped to predefined color sets:
```typescript
interface Activity {
  id: string;
  name: string;
  colorIndex: number;      // Maps to color palette
  createdAt: string;
  isActive: boolean;
}
```

Color sets are managed in `src/utils/colors.ts` using HSL values for theme compatibility.

### Design System

**Color Requirements**:
- Use HSL color format for theme compatibility
- Maintain consistent hue values across light/dark themes
- Adjust saturation/lightness for theme variants
- Ensure WCAG compliance for contrast ratios

**Theme Implementation**:
- Three modes: Light/Dark/System
- CSS variables for theme values
- Smooth transitions between themes
- Persistent user preferences via localStorage

## Development Setup

### Prerequisites
- Node.js (LTS version)
- npm or yarn

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:3000
```

### Development Commands

```bash
# Testing
npm test                    # Run Jest tests
npm run test:watch         # Watch mode for tests
npm run cypress            # Open Cypress Test Runner
npm run cypress:run        # Run Cypress tests headless

# Code Quality
npm run lint               # ESLint check
npm run type-check         # TypeScript validation

# Build
npm run build              # Production build
npm start                  # Start production server
```

### AI Feature Configuration

The application includes experimental AI features using OpenAI (Bring Your Own Key):

```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Configure variables (optional for local dev)
AI_ENABLE_MOCK=true              # Use mock responses
AI_FALLBACK_ON_429=true          # Fallback on rate limits

# 3. Use BYOK in the application
# - Navigate to /ai in the app
# - Enter your OpenAI API key in the BYOK section
# - Key is stored in memory only (not persisted)
```

**Security Notes**:
- Client-side BYOK only (no server API key needed)
- Strict CSP limits connections to `https://api.openai.com`
- Service worker bypasses OpenAI requests
- Keys are never persisted to localStorage/sessionStorage

## Quality Assurance

### Pre-Deployment Checklist

All checks must pass before deployment:

```bash
# 1. Type checking
npm run type-check

# 2. Linting
npm run lint

# 3. Tests
npm test

# 4. Build verification
npm run build
```

### Testing Strategy

**Test Pyramid Architecture** (85% Jest / 15% Cypress):

```
🔺 Test Pyramid
├── E2E Tests (Cypress) - ~16 tests, ~60 seconds
│   ├── Complete user workflows
│   ├── Cross-page navigation
│   ├── File import/export
│   └── Service worker UI
├── Integration Tests (Jest) - Component interactions
│   ├── Component composition
│   ├── Modal and keyboard navigation
│   ├── Accessibility compliance
│   └── Page-level integration
└── Unit Tests (Jest) - ~135+ tests, ~15 seconds
    ├── Component logic
    ├── Custom hooks
    ├── Utility functions
    └── State machine
```

**When to use Jest vs Cypress**:

| Use Jest For | Use Cypress For |
|--------------|-----------------|
| Component rendering | Complete user workflows |
| Form validation | Cross-page navigation |
| Keyboard navigation | File operations |
| State management | Service worker UI |
| Utility functions | Browser-specific behavior |
| Accessibility | End-to-end integration |

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 16.1.6 |
| UI Library | React | 19.2.4 |
| UI Components | React Bootstrap | 2.10.10 |
| CSS Framework | Bootstrap | 5.3.8 |
| Language | TypeScript | 5.x |
| Testing | Jest | 30.2.0 |
| E2E Testing | Cypress | 15.10.0 |
| PWA Support | Service Workers | Native |

## Documentation

### For Developers

- **[GitHub Issue Resolution](./docs/workflows/github-issue-resolution.md)** - Step-by-step process for resolving issues
- **[Testing Procedures](./docs/workflows/testing-procedures.md)** - Jest vs Cypress decision guide
- **[Code Quality Checklist](./docs/workflows/code-quality-checklist.md)** - Pre-deployment verification
- **[Test Pyramid Architecture](./docs/dev-guides/test-pyramid-architecture.md)** - Comprehensive testing strategy
- **[Memory Log Workflow](./docs/dev-guides/memory-log-workflow.md)** - Debugging knowledge management

### Component Documentation

- **[Component Index](./docs/components/README.md)** - Complete component documentation
- **[Session Sharing Guide](./docs/dev-guides/session-sharing.md)** - Developer guide for sharing features
- **[Time Utilities Guide](./docs/dev-guides/TIME_UTILITIES_GUIDE.md)** - Time calculation utilities

### For Users

- **[Session Sharing](./docs/SHARING.md)** - User guide for sharing sessions

## License

[MIT](https://choosealicense.com/licenses/mit/)

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
- The key is stored in memory for this tab only (never persisted to sessionStorage/localStorage) and is never sent to the server.

Security notes:
- A strict CSP limits outbound connections to https://api.openai.com.
- The service worker bypasses OpenAI requests (no caching/interception).
- Avoid using BYOK on untrusted pages; client code has access while open.

Authentication notes:
- There is no OAuth or cookie-based authentication gate. AI features are enabled purely via BYOK on the client.
