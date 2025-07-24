# Documentation Templates

This directory contains templates for various types of documentation used throughout the project.

## Available Templates

### Component Documentation Template
**File**: `COMPONENT_DOCUMENTATION_TEMPLATE.md`
**Purpose**: Standardized format for documenting React components
**Usage**: Copy and fill out when creating new component documentation in `docs/components/`

**Key Sections**:
- Navigation and overview
- Props documentation with types and defaults
- State management approach
- Theme compatibility details
- Mobile responsiveness considerations
- Accessibility features
- Test coverage summary
- Usage examples (basic and advanced)
- Known limitations and edge cases
- Change history

### Planned Changes Template
**File**: `PLANNED_CHANGES_TEMPLATE.md`
**Purpose**: Structured format for documenting upcoming features and changes
**Usage**: Copy and fill out when planning new features or significant changes

**Key Sections**:
- Context and background
- Detailed requirements
- Technical guidelines
- Expected outcomes
- Validation criteria

### Debugging Session Template
**File**: `DEBUGGING_SESSION_TEMPLATE.md`
**Purpose**: Standardized format for documenting debugging sessions and issue resolution
**Usage**: Copy and fill out when creating memory log entries for complex debugging sessions

**Key Sections**:
- Issue description and initial state
- Debug process with investigation steps
- Solution attempts (successful and failed)
- Final resolution and implementation
- Lessons learned and future considerations
- MCP tool usage when available

### Utility Proposal Template
**File**: `UTILITY_PROPOSAL_TEMPLATE.md`
**Purpose**: Format for proposing new utility functions or improvements
**Usage**: Copy and fill out when suggesting new utilities or enhancements

**Key Sections**:
- Problem statement
- Proposed solution
- Implementation approach
- Testing strategy
- Integration considerations

## Workflow Templates

### GitHub Issue Resolution Workflow
**File**: `../workflows/github-issue-resolution.md`
**Purpose**: Complete step-by-step process for resolving GitHub issues using MCP tools
**Usage**: Reference when working on any GitHub issue

**Key Features**:
- MCP tool integration examples
- Branch protection protocols
- Quality gate requirements
- Iterative resolution process

### Commit Procedures
**File**: `../workflows/commit-procedures.md`
**Purpose**: Standard procedures for committing code changes and PR fixes
**Usage**: Follow when making any code commits

**Key Features**:
- Standard PR fix procedure
- Issue resolution continuity protocol
- Quality assurance checklist
- Commit message formatting

### Testing Procedures
**File**: `../workflows/testing-procedures.md`
**Purpose**: Comprehensive testing strategies and Jest vs Cypress decision matrix
**Usage**: Reference when writing tests or deciding on testing approach

**Key Features**:
- Test pyramid architecture
- Performance optimization guidelines
- Testing best practices
- Quality gate requirements

### Code Quality Checklist
**File**: `../workflows/code-quality-checklist.md`
**Purpose**: Code quality standards and verification procedures
**Usage**: Use as final checklist before considering any development work complete

**Key Features**:
- Deployment verification checklist
- Security standards
- Performance standards
- Accessibility requirements

## Template Usage Guidelines

### For AI-Assisted Development
- Use complete template structures for optimal AI assistance
- Fill out all sections thoroughly before implementation
- Ask clarifying questions if any section cannot be completed
- Templates are designed to provide comprehensive context for AI agents
- Reference workflow templates for systematic issue resolution

### For Human Developers
- Templates provide consistency across documentation
- Use as checklists to ensure comprehensive coverage
- Modify templates as needed for specific use cases
- Keep templates updated with project evolution
- Follow workflow templates for reliable development processes

### Template Maintenance
- Review templates quarterly for relevance and completeness
- Update based on lessons learned from usage
- Ensure templates align with current project standards
- Add new templates as documentation needs evolve

## Integration with Planning Process

Templates integrate with the project's change management approach:
1. **Planning Phase**: Use appropriate template to document requirements
2. **Implementation Phase**: Reference workflow templates during development
3. **Quality Assurance**: Use code quality checklist for verification
4. **Documentation Phase**: Complete template with final implementation details
5. **Archival Phase**: Move completed templates to appropriate archive locations

## MCP Tool Integration

Templates are designed to work seamlessly with Model Context Protocol (MCP) tools:
- **GitHub Tools**: Issue analysis and PR management workflows
- **Sequential Thinking**: Complex problem analysis templates
- **Memory Tools**: Knowledge persistence and retrieval patterns
- **Playwright Tools**: Issue verification procedures
- **Time Tools**: Timezone-aware documentation practices

For more information on the complete planning and documentation workflow, see the [Memory Log Workflow Guide](../dev-guides/memory-log-workflow.md).
