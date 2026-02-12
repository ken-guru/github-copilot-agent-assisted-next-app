# AGENTS.md

Project context for AI coding agents working on this Next.js activity tracking application.

## Project Overview

**Stack**: Next.js 15 + React 19 + Bootstrap 5 + TypeScript

An activity timer and tracker application built with AI assistance. Track activities with a state machine approach where only ONE activity can be RUNNING at a time.

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

### Key Files
```
src/hooks/useActivityState.ts      # Main state orchestrator
src/utils/activityStateMachine.ts  # Business logic core
src/contexts/ThemeContext.tsx      # Theme management
src/components/                    # Bootstrap-wrapped components
```

## MCP Tools Available

The following MCP servers are configured for AI-assisted development:

| Server | Purpose |
|--------|---------|
| **github** | Issue/PR management, repository operations |
| **microsoft.docs.mcp** | Microsoft/Azure documentation lookup |
| **playwright** | Browser automation for UI verification |
| **upstash/context7** | Real-time library documentation and code examples |

## Testing Strategy

- **85% Jest** (component logic, hooks, utilities) - 15x faster
- **15% Cypress** (complete user workflows only)
- **Test-First Development**: Write Jest tests BEFORE implementation

```bash
npm test                    # All Jest tests
npm run lint               # ESLint compliance  
npm run type-check         # TypeScript validation
npm run build              # Build verification
```

## Development Rules

### Branch Protection
- **NEVER commit directly to main** - branch is protected
- **ALWAYS create feature branch**: `fix-<issue-number>-<brief-description>`
- **Create PRs into main** - all changes require PR reviews

### Quality Gates (All Must Pass)
All of these must pass before pushing:
1. `npm test` - Jest tests
2. `npm run lint` - ESLint
3. `npm run type-check` - TypeScript
4. `npm run build` - Build verification

### Security
- Never expose local filesystem paths
- Repository-relative paths only
- No hardcoded credentials

## Subagent Guidance

For complex tasks, consider delegating to specialized subagents:

| Agent | Use For |
|-------|---------|
| **Researcher** | Context gathering, code analysis, documentation lookup |
| **Implementer** | Focused code implementation after research is complete |
| **Reviewer** | Security review, code quality analysis, accessibility checks |

**Pattern**: Research → Plan → Implement → Review

## Key Documentation

- [GitHub Issue Resolution](docs/workflows/github-issue-resolution.md) - Complete workflow for issue resolution
- [Testing Procedures](docs/workflows/testing-procedures.md) - Jest vs Cypress decision matrix
- [Memory Log Index](docs/MEMORY_LOG.md) - Historical debugging sessions

## IMPORTANT

Prefer retrieval-led reasoning over pre-training-led reasoning for any Next.js tasks. Use the context7 MCP server to fetch current documentation rather than relying on training data.
