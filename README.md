# Activity Timer and Tracker

[![Dependabot Updates](https://github.com/ken-guru/github-copilot-agent-assisted-next-app/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/ken-guru/github-copilot-agent-assisted-next-app/actions/workflows/dependabot/dependabot-updates)
[![CodeQL Security Scan](https://github.com/ken-guru/github-copilot-agent-assisted-next-app/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/ken-guru/github-copilot-agent-assisted-next-app/actions/workflows/codeql.yml)

A time management and activity tracking web application built with Next.js 16, React 19, Bootstrap 5, and TypeScript. Track activities with a state machine approach where only one activity can be running at a time.

> **Note:** This is a hobby/learning project built with AI assistance (primarily GitHub Copilot). It is not intended for production use.

## Development Philosophy

- Test-Driven Development (TDD)
- Component-based architecture
- Responsive, mobile-friendly design
- Theme-aware styling (Light/Dark/System)
- Accessibility considerations (WCAG compliance)
- AI-assisted development with GitHub Copilot and MCP servers

## Core Features

- **Time Management** — Set session durations, track deadlines, manage work periods
- **Activity Management** — Create and track multiple activities using a state machine lifecycle (`PENDING → RUNNING → COMPLETED`); only one activity can be running at a time
- **Visual Feedback** — Progress bar with color transitions, vertical timeline visualization, color-coded activities with break indicators
- **Theme System** — Light/Dark/System modes using HSL-based CSS variables with persistent preferences
- **Offline Support** — Full functionality without network via service worker caching, offline status indicator, and update notifications
- **Session Sharing** — Create read-only share links with theme-aware color normalization and privacy-preserving payloads
- **AI Integration** — OpenAI-powered features using Bring Your Own Key (BYOK) client-side approach

## Architecture

### Core Patterns

```typescript
// Activity State Machine: PENDING → RUNNING → COMPLETED/REMOVED
// Located: src/utils/activityStateMachine.ts

// Hook Architecture:
useActivityState (main orchestrator)
├── useActivitiesTracking (state machine wrapper)
└── useTimelineEntries (timeline management)

// Theme System: CSS Variables + Bootstrap data-bs-theme
// Light/Dark/System modes with localStorage persistence
// Located: src/contexts/ThemeContext.tsx
```

### Project Structure

```
src/
├── app/                 # Next.js App Router (routes, layouts, API routes)
│   ├── _components/     # Page-specific components
│   ├── activities/      # Activity management pages
│   ├── ai/              # AI feature pages
│   ├── api/             # API routes (sharing, AI)
│   └── shared/          # Shared session view pages
├── components/          # Reusable React components
│   ├── feature/         # Feature-specific components (ActivityCrud, ActivityForm, Timeline, etc.)
│   ├── forms/           # Form components (MobileOptimizedInput)
│   ├── ui/              # UI utility components (OfflineIndicator, ServiceWorkerUpdater, ToastContainer)
│   └── __tests__/       # Component tests
├── contexts/            # React contexts (Theme, Toast, ApiKey, Loading)
├── hooks/               # Custom React hooks
│   └── __tests__/       # Hook tests
├── types/               # TypeScript type definitions
├── constants/           # Application constants
└── utils/               # Utility functions
    ├── activity/        # Activity-related utilities
    ├── ai/              # AI-related utilities
    ├── sessionSharing/  # Session sharing utilities
    ├── service-worker/  # Service worker utilities
    ├── time/            # Time calculation utilities
    └── __tests__/       # Utility tests
```

## Development Setup

### Prerequisites

- Node.js (Latest LTS recommended)
- npm

### Getting Started

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm test             # Run Jest tests
npm run test:watch   # Run Jest tests in watch mode
```

### Quality Checks

All of these must pass before pushing changes:

```bash
npm run type-check   # TypeScript validation
npm run lint         # ESLint compliance
npm test             # Jest tests
npm run build        # Build verification
```

### AI Features (BYOK)

The app supports OpenAI integration using a Bring Your Own Key approach:

1. Start the app and navigate to `/ai`
2. Enter your OpenAI API key (`sk-...`) in the BYOK section — it is stored in memory only (never persisted or sent to the server)
3. A strict CSP limits outbound connections to `https://api.openai.com`

For local development, set `AI_ENABLE_MOCK=true` in `.env.local` to use mock AI responses.

## Technology Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router, Turbopack) |
| UI Library | [React](https://react.dev/) 19 |
| Styling | [Bootstrap](https://getbootstrap.com/) 5 + [React-Bootstrap](https://react-bootstrap.github.io/) |
| Language | [TypeScript](https://www.typescriptlang.org/) 5 |
| Validation | [Zod](https://zod.dev/) |
| Unit Testing | [Jest](https://jestjs.io/) 30 + [React Testing Library](https://testing-library.com/) |
| E2E Testing | [Cypress](https://www.cypress.io/) 15 |
| Deployment | [Vercel](https://vercel.com/) |

## Testing

This project follows a **Test Pyramid Architecture**: ~85% Jest (unit/integration) and ~15% Cypress (E2E workflows).

### Running Tests

```bash
npm test                                    # All Jest tests
npm run test:watch                          # Jest watch mode
npm test -- --testPathPatterns="pattern"    # Run specific tests
npm run cypress:run                         # Cypress E2E (headless)
```

### When to Use Jest vs Cypress

**Use Jest for:** Component logic, hooks, utilities, accessibility, form validation, theme switching, error handling

**Use Cypress for:** Complete multi-page user workflows, file operations, service worker UI interactions

See [Testing Procedures](./docs/workflows/testing-procedures.md) for the full decision matrix.

### CI/CD

All tests run automatically in the GitHub Actions pipeline:
- **Jest tests**: On every push and PR
- **Cypress tests**: On PR validation
- Test artifacts (screenshots/videos) available for failed Cypress runs

## Documentation

- [Component Documentation](./docs/components/README.md) — Props, state, accessibility for each component
- [Testing Procedures](./docs/workflows/testing-procedures.md) — Jest vs Cypress decision matrix
- [GitHub Issue Resolution](./docs/workflows/github-issue-resolution.md) — Step-by-step MCP workflow
- [Code Quality Checklist](./docs/workflows/code-quality-checklist.md) — Pre-deployment verification
- [Commit Procedures](./docs/workflows/commit-procedures.md) — Git workflow and PR procedures
- [Session Sharing](./docs/SHARING.md) — User guide for sharing features
- [Planned Changes](./docs/PLANNED_CHANGES.md) — Upcoming feature specifications
- [Full Documentation Index](./docs/README.md) — All documentation resources

### AI-Assisted Development

This project uses GitHub Copilot with MCP servers for development. See:
- [AGENTS.md](./AGENTS.md) — AI agent context and architecture overview
- [.github/copilot-instructions.md](.github/copilot-instructions.md) — Copilot-specific guidelines
- [.github/agents/](.github/agents/) — Custom subagent definitions (Researcher, Implementer, Reviewer)

## License

[MIT](https://choosealicense.com/licenses/mit/)
