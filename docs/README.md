# Project Documentation

This directory contains comprehensive documentation for the activity tracking application. The documentation is organized into several categories to support both developers and AI-assisted development.

## Documentation Structure

### Planning and Change Management
- **[PLANNED_CHANGES.md](./PLANNED_CHANGES.md)** - Upcoming feature specifications and changes
- **[IMPLEMENTED_CHANGES.md](./IMPLEMENTED_CHANGES.md)** - Completed changes with timestamps
- **[KNOWN_BUGS.md](./KNOWN_BUGS.md)** - Documented issues awaiting resolution

### Development Guides
- **[dev-guides/](./dev-guides/)** - Development best practices and guides
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
1. Check **[MEMORY_LOG.md](./MEMORY_LOG.md)** for similar issues
2. Document process in **[logged_memories/](./logged_memories/)**
3. Update main memory log with reference

### AI-Assisted Development Notes

This documentation structure is specifically designed to support AI-assisted development:
- **Templates provide consistent structure** for effective AI prompting
- **Planning template** (`templates/PLANNED_CHANGES_TEMPLATE.md`) must be used for all new feature requests
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
