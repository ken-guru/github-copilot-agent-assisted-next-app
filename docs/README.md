# Project Documentation

Comprehensive documentation for the activity tracking PWA. Organized to support developers and AI-assisted development.

## Documentation Structure

### Development Guides
- **[dev-guides/](./dev-guides/)** - Development best practices
  - **[test-pyramid-architecture.md](./dev-guides/test-pyramid-architecture.md)** - Testing strategy with Jest vs Cypress guide
  - **[memory-log-workflow.md](./dev-guides/memory-log-workflow.md)** - Debugging knowledge management
  - **[human-developer-memory-quick-reference.md](./dev-guides/human-developer-memory-quick-reference.md)** - Quick reference
  - **[session-sharing.md](./dev-guides/session-sharing.md)** - Session sharing implementation
  - **[TIME_UTILITIES_GUIDE.md](./dev-guides/TIME_UTILITIES_GUIDE.md)** - Time calculation utilities

### Workflows
- **[workflows/](./workflows/)** - Development workflows
  - **[github-issue-resolution.md](./workflows/github-issue-resolution.md)** - Complete issue resolution workflow
  - **[testing-procedures.md](./workflows/testing-procedures.md)** - Jest vs Cypress decision matrix
  - **[code-quality-checklist.md](./workflows/code-quality-checklist.md)** - Pre-deployment verification
  - **[commit-procedures.md](./workflows/commit-procedures.md)** - Standard commit procedures

### Component Documentation
- **[components/](./components/)** - Component documentation
  - Props, state management, theme compatibility
  - Usage examples and accessibility notes
  - **[README.md](./components/README.md)** - Component index

### Change Management
- **[PLANNED_CHANGES.md](./PLANNED_CHANGES.md)** - Upcoming feature specifications
- **[IMPLEMENTED_CHANGES.md](./IMPLEMENTED_CHANGES.md)** - Completed changes with timestamps
- **[KNOWN_BUGS.md](./KNOWN_BUGS.md)** - Documented issues

### Memory Log
- **[MEMORY_LOG.md](./MEMORY_LOG.md)** - Project history and issue resolutions
- **[logged_memories/](./logged_memories/)** - Individual debugging sessions

### Templates
- **[templates/](./templates/)** - Documentation templates
  - **[PLANNED_CHANGES_TEMPLATE.md](./templates/PLANNED_CHANGES_TEMPLATE.md)** - Feature planning
  - **[COMPONENT_DOCUMENTATION_TEMPLATE.md](./templates/COMPONENT_DOCUMENTATION_TEMPLATE.md)** - Component docs
  - **[UTILITY_PROPOSAL_TEMPLATE.md](./templates/UTILITY_PROPOSAL_TEMPLATE.md)** - Utility functions
  - **[DEBUGGING_SESSION_TEMPLATE.md](./templates/DEBUGGING_SESSION_TEMPLATE.md)** - Debugging sessions

## Quick Reference

### Resolving a GitHub Issue
1. **Read issue**: Use GitHub MCP tools to understand requirements
2. **Search history**: Check [MEMORY_LOG.md](./MEMORY_LOG.md) and [logged_memories/](./logged_memories/)
3. **Follow workflow**: [github-issue-resolution.md](./workflows/github-issue-resolution.md)
4. **Verify problem**: Use Playwright MCP tools for UI issues
5. **Create branch**: `fix-<issue-number>-<brief-description>`
6. **Write tests first**: Follow test pyramid architecture
7. **Implement solution**: Make minimal, targeted changes
8. **Quality checks**: Run tests, lint, type-check, build
9. **Document**: Update memory log if needed

### Planning a New Feature
1. Use [templates/PLANNED_CHANGES_TEMPLATE.md](./templates/PLANNED_CHANGES_TEMPLATE.md)
2. Add specification to [PLANNED_CHANGES.md](./PLANNED_CHANGES.md)
3. After implementation, move to [IMPLEMENTED_CHANGES.md](./IMPLEMENTED_CHANGES.md)

### Documenting a Component
1. Use [templates/COMPONENT_DOCUMENTATION_TEMPLATE.md](./templates/COMPONENT_DOCUMENTATION_TEMPLATE.md)
2. Create documentation in [components/](./components/)
3. Link from [components/README.md](./components/README.md)

### Debugging/Memory Log
1. Search [MEMORY_LOG.md](./MEMORY_LOG.md) and [logged_memories/](./logged_memories/)
2. Follow [memory-log-workflow.md](./dev-guides/memory-log-workflow.md)
3. Use [templates/DEBUGGING_SESSION_TEMPLATE.md](./templates/DEBUGGING_SESSION_TEMPLATE.md)

### Writing Tests
1. Review [test-pyramid-architecture.md](./dev-guides/test-pyramid-architecture.md)
2. Use Jest vs Cypress decision matrix
3. Follow test patterns from existing tests
4. Run: `npm test` for Jest, `npm run cypress:run` for E2E

## AI-Assisted Development

This documentation supports AI-assisted development:
- **Templates** provide consistent structure for AI prompts
- **Planning template** ensures complete information before implementation
- **Test Pyramid guide** provides clear Jest vs Cypress decision criteria
- **Memory log** prevents repeated debugging efforts
- **Component docs** include implementation context
