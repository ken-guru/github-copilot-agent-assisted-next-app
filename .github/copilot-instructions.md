```instructions
# GitHub Copilot Instructions

## PREAMBLE
Streamlined guidelines for AI-assisted development of a **Next.js 15 + React 19 + Bootstrap 5 + TypeScript** activity tracking application. Focus on GitHub issue resolution using MCP tools.

## PROJECT ARCHITECTURE ESSENTIALS

### Core Patterns
```typescript
// Activity State Machine: PENDING → RUNNING → COMPLETED/REMOVED
// Only ONE activity can be RUNNING at a time
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

### Test Architecture
- **85% Jest** (component logic, hooks, utilities) - 15x faster
- **15% Cypress** (complete user workflows only)
- **Test-First Development**: Write Jest tests BEFORE implementation

## GITHUB ISSUE RESOLUTION WORKFLOW

### CRITICAL: Branch Protection Rules
- **NEVER commit directly to main** - branch is protected
- **ALWAYS create feature branch**: `fix-<issue-number>-<brief-description>`
- **Create PRs into main** - all changes require PR reviews

### Complete Issue Resolution Process
**📚 Detailed Workflow**: [/docs/workflows/github-issue-resolution.md](../docs/workflows/github-issue-resolution.md)

1. **Analyze Issue** → Use GitHub MCP tools + Sequential Thinking
2. **Verify Problem** → Use Playwright MCP tools for UI issues  
3. **Create Branch** → Never work on main directly
4. **Implement Solution** → Test-first development with Jest
5. **Quality Checks** → All tests, lint, type-check must pass
6. **Create PR** → Good title/description referencing issue
7. **Monitor & Iterate** → Address CI/CD failures and code review comments

### Issue Understanding with MCP Tools
```bash
# Get issue details
mcp_github_get_issue(issue_number=<NUMBER>)
mcp_github_get_issue_comments(issue_number=<NUMBER>)

# Complex analysis
mcp_sequential-th_sequentialthinking({
  thought: "Breaking down this issue: components affected, user impact, root cause..."
})

# Search historical solutions
mcp_memory_search_nodes(query="similar issue keywords")
```

### Issue Verification (UI/UX Issues)
```bash
# Navigate and reproduce
mcp_playwright_browser_navigate(url="http://localhost:3000")
mcp_playwright_browser_snapshot()
mcp_playwright_browser_take_screenshot(filename="issue-<NUMBER>-current-state.png")
```

## MCP TOOL INTEGRATION

### Available Tools and Documentation
- **GitHub**: [github-mcp-server](https://github.com/github/github-mcp-server) - Issue/PR management
- **Sequential Thinking**: [sequentialthinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) - Complex problem analysis
- **Memory**: [memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) - Knowledge persistence
- **Time**: [time](https://github.com/modelcontextprotocol/servers/tree/main/src/time) - Timezone handling
- **Playwright**: [mcp-playwright](https://github.com/executeautomation/mcp-playwright) - Browser automation

### Tool Combination Strategies
```bash
# Problem Analysis → Documentation
mcp_sequential-th_sequentialthinking() → systematic analysis
mcp_memory_create_entities() → persist insights
mcp_time_get_current_time() → timestamp entries

# Issue Verification → Implementation
mcp_playwright_browser_* → verify problem
mcp_github_get_issue() → understand requirements  
mcp_memory_search_nodes() → find similar solutions
```

## CRITICAL DEVELOPMENT RULES

### Issue Resolution Continuity
**NEVER identify an issue and forget to resolve it after committing.**
- Explicitly state next actions before committing
- Continue immediately after commit with identified issues
- Document unresolved issues in commit messages

### Quality Gates (All Must Pass)
```bash
npm test                    # All Jest tests
npm run lint               # ESLint compliance  
npm run type-check         # TypeScript validation
npm run build              # Build verification
npm run cypress:run        # E2E tests (if workflow changes)
```

### Security Requirements
- **🚨 CRITICAL**: Never expose local filesystem paths or external structure
- Repository-relative paths only
- No hardcoded credentials or sensitive data

## TESTING PROTOCOLS

### Jest vs Cypress Decision Matrix
**Use Jest for**: Component logic, hooks, utilities, accessibility, theme switching, form validation, error handling

**Use Cypress for**: Complete user workflows spanning multiple pages, file operations, service worker UI interactions

**📚 Complete Testing Guide**: [../docs/workflows/testing-procedures.md](../docs/workflows/testing-procedures.md)

## DOCUMENTATION AND MEMORY

### Memory Log System
- **Search First**: `mcp_memory_search_nodes()` for similar issues
- **Document Solutions**: Create entries in `docs/logged_memories/`
- **Template**: [../docs/templates/DEBUGGING_SESSION_TEMPLATE.md](../docs/templates/DEBUGGING_SESSION_TEMPLATE.md)
- **Sync to MCP**: Use `scripts/migrate-memory-logs-to-mcp.js`

### Planning Documents
- **New Features**: Use [../docs/templates/PLANNED_CHANGES_TEMPLATE.md](../docs/templates/PLANNED_CHANGES_TEMPLATE.md)
- **Update Progress**: Mark completed items in `docs/PLANNED_CHANGES.md`
- **Archive Completed**: Move to `docs/IMPLEMENTED_CHANGES.md`

## QUICK REFERENCE LINKS

### Workflows and Procedures
- **GitHub Issue Resolution**: [../docs/workflows/github-issue-resolution.md](../docs/workflows/github-issue-resolution.md)
- **Commit Procedures**: [../docs/workflows/commit-procedures.md](../docs/workflows/commit-procedures.md)
- **Testing Procedures**: [../docs/workflows/testing-procedures.md](../docs/workflows/testing-procedures.md)
- **Code Quality Checklist**: [../docs/workflows/code-quality-checklist.md](../docs/workflows/code-quality-checklist.md)

### Templates
- **Planned Changes**: [../docs/templates/PLANNED_CHANGES_TEMPLATE.md](../docs/templates/PLANNED_CHANGES_TEMPLATE.md)
- **Component Documentation**: [../docs/templates/COMPONENT_DOCUMENTATION_TEMPLATE.md](../docs/templates/COMPONENT_DOCUMENTATION_TEMPLATE.md)
- **Debugging Sessions**: [../docs/templates/DEBUGGING_SESSION_TEMPLATE.md](../docs/templates/DEBUGGING_SESSION_TEMPLATE.md)

### Memory and Knowledge
- **Memory Log Workflow**: [../docs/dev-guides/memory-log-workflow.md](../docs/dev-guides/memory-log-workflow.md)
- **Memory Log Index**: [../docs/MEMORY_LOG.md](../docs/MEMORY_LOG.md)
- **Component Documentation**: [../docs/components/README.md](../docs/components/README.md)

## IMMEDIATE ACTION CHECKLIST

When given a GitHub issue number:
1. ✅ **Analyze**: Use GitHub MCP tools to understand issue and comments
2. ✅ **Think**: Use Sequential Thinking for complex problems  
3. ✅ **Search**: Check Memory Tool for similar historical solutions
4. ✅ **Verify**: Use Playwright tools for UI/UX issues
5. ✅ **Branch**: Create feature branch (never work on main)
6. ✅ **Implement**: Write tests first, then implement solution
7. ✅ **Quality**: Pass all quality gates before pushing
8. ✅ **PR**: Create PR with clear title/description referencing issue
9. ✅ **Monitor**: Watch CI/CD and address code review comments iteratively
10. ✅ **Document**: Update memory logs and planning documents

**Remember**: The goal is complete issue resolution, not just implementation. Use MCP tools throughout the process for enhanced development efficiency.
