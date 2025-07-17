# Project Documentation

This directory contains comprehensive documentation for the activity tracking application. The documentation is organized into several categories to support both developers and AI-assisted development.

## Documentation Structure

### Planning and Change Management
- **[PLANNED_CHANGES.md](./PLANNED_CHANGES.md)** - Upcoming feature specifications and changes
- **[IMPLEMENTED_CHANGES.md](./IMPLEMENTED_CHANGES.md)** - Completed changes with timestamps
- **[KNOWN_BUGS.md](./KNOWN_BUGS.md)** - Documented issues awaiting resolution

### Development Guides
- **[dev-guides/](./dev-guides/)** - Development best practices and guides
  - **[test-pyramid-architecture.md](./dev-guides/test-pyramid-architecture.md)** - Complete testing strategy with Jest vs Cypress decision matrix
  - **[memory-log-workflow.md](./dev-guides/memory-log-workflow.md)** - Complete workflow for debugging knowledge management
  - **[mcp-memory-tool-usage.md](./dev-guides/mcp-memory-tool-usage.md)** - AI agent guide for semantic search and knowledge building
  - **[ai-agent-memory-quick-reference.md](./dev-guides/ai-agent-memory-quick-reference.md)** - Quick reference for AI agents
  - **[human-developer-memory-quick-reference.md](./dev-guides/human-developer-quick-reference.md)** - Quick reference for human developers
  - Time utilities testing and implementation
  - Development workflow guidelines

### Component Documentation
- **[components/](./components/)** - Comprehensive component documentation
  - Props, state management, theme compatibility
  - Usage examples and accessibility considerations

### Memory Log
- **[MEMORY_LOG.md](./MEMORY_LOG.md)** - Project history and issue resolutions
- **[logged_memories/](./logged_memories/)** - Individual debugging and implementation entries

### Templates
- **[templates/](./templates/)** - Standardized documentation templates
  - **[PLANNED_CHANGES_TEMPLATE.md](./templates/PLANNED_CHANGES_TEMPLATE.md)** - For planning new features
  - **[COMPONENT_DOCUMENTATION_TEMPLATE.md](./templates/COMPONENT_DOCUMENTATION_TEMPLATE.md)** - For component docs
  - **[UTILITY_PROPOSAL_TEMPLATE.md](./templates/UTILITY_PROPOSAL_TEMPLATE.md)** - For utility function proposals

### Analysis and Migration
- **[analysis/](./analysis/)** - Code analysis results and findings
- **[migration/](./migration/)** - Migration plans and strategies

## Quick Navigation for Common Tasks

### Planning a New Feature
1. Use **[templates/PLANNED_CHANGES_TEMPLATE.md](./templates/PLANNED_CHANGES_TEMPLATE.md)**
2. Add the specification to **[PLANNED_CHANGES.md](./PLANNED_CHANGES.md)**
3. After implementation, move to **[IMPLEMENTED_CHANGES.md](./IMPLEMENTED_CHANGES.md)**

### Documenting a Component
1. Use **[templates/COMPONENT_DOCUMENTATION_TEMPLATE.md](./templates/COMPONENT_DOCUMENTATION_TEMPLATE.md)**
2. Create documentation in **[components/](./components/)**
3. Link from **[components/README.md](./components/README.md)**

### Debugging an Issue
1. **Search existing solutions**: Check **[MEMORY_LOG.md](./MEMORY_LOG.md)** and use MCP memory search
2. **Follow workflow**: Use **[memory-log-workflow.md](./dev-guides/memory-log-workflow.md)** for complete process
3. **Quick reference**: Use **[ai-agent-memory-quick-reference.md](./dev-guides/ai-agent-memory-quick-reference.md)** or **[human-developer-memory-quick-reference.md](./dev-guides/human-developer-memory-quick-reference.md)**
4. **Document process**: Create entry in **[logged_memories/](./logged_memories/)**
5. **Sync to MCP**: Run migration script for AI agent accessibility

### Writing Tests
1. **Review testing strategy**: Start with **[test-pyramid-architecture.md](./dev-guides/test-pyramid-architecture.md)**
2. **Choose test type**: Use Jest vs Cypress decision matrix
3. **Follow examples**: Reference provided test patterns for consistency
4. **Optimize performance**: Prefer Jest for 85% of test coverage
5. **Run test suite**: `npm test` for Jest, `npm run cypress:run` for e2e

### AI-Assisted Development Notes

This documentation structure is specifically designed to support AI-assisted development:
- **Templates provide consistent structure** for effective AI prompting
- **Planning template** (`templates/PLANNED_CHANGES_TEMPLATE.md`) must be used for all new feature requests
- **Test Pyramid Architecture** (`dev-guides/test-pyramid-architecture.md`) provides clear Jest vs Cypress guidelines
- **Memory log prevents repeated debugging efforts** by documenting solutions and approaches
- **Component docs include implementation context** for AI modifications
- **Change planning uses prompt-friendly format** for implementation assistance
- **Template compliance** ensures all necessary information is provided before implementation begins

## Documentation Standards

- **Use templates** for all new documentation
- **Keep documentation current** with code changes
- **Include context and examples** for AI assistance
- **Link related documents** for easy navigation
- **Tag entries appropriately** for searchability
