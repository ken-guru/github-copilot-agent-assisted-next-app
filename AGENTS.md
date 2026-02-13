# AGENTS.md

Project context for AI coding agents working on this Next.js activity tracking application.

## Project Overview

**Stack**: Next.js 16 + React 19 + Bootstrap 5 + TypeScript

A progressive web application (PWA) for activity tracking with time management. Activities follow a state machine where only ONE activity can be RUNNING at a time.

## Architecture

### State Management Pattern
```typescript
// Activity State Machine: PENDING → RUNNING → COMPLETED/REMOVED
// Location: src/utils/activityStateMachine.ts

// Hook Architecture:
useActivityState (main orchestrator)
├── useActivitiesTracking (state machine wrapper)
└── useTimelineEntries (timeline management)

// Theme System: CSS Variables + Bootstrap data-bs-theme
// Light/Dark/System modes with localStorage persistence
// Location: src/contexts/ThemeContext.tsx
```

### Key Files
```
src/hooks/useActivityState.ts      # Main state orchestrator
src/utils/activityStateMachine.ts  # State machine core
src/contexts/ThemeContext.tsx      # Theme management
src/components/                    # Bootstrap components
```

## MCP Tools Available

The following MCP servers are configured for AI-assisted development:

| Server | Purpose |
|--------|---------|
| **github** | Issue/PR management, repository operations |
| **playwright** | Browser automation for UI verification |
| **context7** | Real-time library documentation and code examples |

## Testing Strategy

- **85% Jest** (component logic, hooks, utilities) - Fast execution (~15s)
- **15% Cypress** (complete user workflows only) - Slower but comprehensive (~60s)
- **Test-First Development**: Write Jest tests BEFORE implementation

```bash
npm test                    # All Jest tests
npm run lint               # ESLint compliance  
npm run type-check         # TypeScript validation
npm run build              # Build verification
```

## Development Rules

### Branch Protection
- **NEVER commit directly to main** - Protected branch
- **ALWAYS create feature branch**: `fix-<issue-number>-<brief-description>`
- **Create PRs into main** - All changes require review
- **If working on existing PR branch**: Continue on same branch, don't create new PR

### Quality Gates (All Must Pass)
Before pushing code, ensure:
1. `npm test` - Jest tests pass
2. `npm run lint` - ESLint compliance
3. `npm run type-check` - TypeScript validation
4. `npm run build` - Build succeeds

### Security
- Never expose local filesystem paths
- Use repository-relative paths only
- No hardcoded credentials or secrets

## Subagent Guidance

For complex tasks, consider delegating to specialized subagents:

| Agent | Use For |
|-------|---------|
| **Researcher** | Context gathering, code analysis, documentation lookup |
| **Implementer** | Focused code implementation after research is complete |
| **Reviewer** | Security review, code quality analysis, accessibility checks |

**Pattern**: Research → Plan → Implement → Review

## Key Documentation

- **[GitHub Issue Resolution](docs/workflows/github-issue-resolution.md)** - Complete workflow
- **[Testing Procedures](docs/workflows/testing-procedures.md)** - Jest vs Cypress guide
- **[Memory Log Index](docs/MEMORY_LOG.md)** - Historical debugging sessions

## Important Notes

**Current Versions**:
- Next.js 16.1.6, React 19.2.4, Bootstrap 5.3.8, TypeScript 5.x

**For Next.js Tasks**:
Use the context7 MCP server to fetch current documentation rather than relying on training data.
