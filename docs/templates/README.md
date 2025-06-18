# Documentation Templates

This directory contains standardized templates for consistent project documentation. These templates ensure comprehensive documentation and enable effective AI-assisted development.

## Available Templates

### [PLANNED_CHANGES_TEMPLATE.md](./PLANNED_CHANGES_TEMPLATE.md)
**Purpose**: Structure for documenting upcoming feature requests and changes
**Usage**: Copy this template when adding new planned changes to `docs/PLANNED_CHANGES.md`
**Key Sections**:
- Context (components affected, current behavior, user needs)
- Requirements (detailed specifications with implementation details)
- Technical Guidelines (framework considerations, performance, accessibility)
- Expected Outcome (success criteria from user and technical perspectives)
- Validation Criteria (checklist for completion verification)

**AI-Assisted Development**: This template format is specifically designed for effective AI assistance in implementation.

### [COMPONENT_DOCUMENTATION_TEMPLATE.md](./COMPONENT_DOCUMENTATION_TEMPLATE.md)
**Purpose**: Comprehensive documentation for React components
**Usage**: Create component documentation in `docs/components/` using this template
**Key Sections**:
- Props documentation (types, defaults)
- State management approach
- Theme compatibility
- Mobile responsiveness details
- Accessibility considerations
- Test coverage summary
- Usage examples

### [UTILITY_PROPOSAL_TEMPLATE.md](./UTILITY_PROPOSAL_TEMPLATE.md)
**Purpose**: Structured proposals for new utility functions
**Usage**: Use when proposing new utility functions for review
**Key Sections**:
- Implementation details with JSDoc
- Usage examples and edge cases
- Alternative approaches considered
- Testing strategy
- Integration with existing utilities

## Template Usage Guidelines

1. **Copy the Template**: Always start with the complete template structure
2. **Fill Out All Sections**: Incomplete documentation reduces effectiveness
3. **Be Specific**: The more detailed the documentation, the better the AI assistance
4. **Update When Changed**: Keep documentation current with implementation
5. **Follow Naming Conventions**: Use consistent file naming as shown in templates

## For AI Agents

When working with this project:
- **Always use templates** for new documentation
- **REQUIRED: Use PLANNED_CHANGES_TEMPLATE.md** for ALL new feature requests - never implement without using the template
- **Copy the complete template structure** - never create partial specifications 
- **Fill out ALL sections** before proceeding with implementation
- **Ask clarifying questions** if any template section cannot be completed
- **Reference existing templates** to understand expected documentation quality
- **Suggest template improvements** when patterns emerge that aren't covered
- **Maintain template consistency** across all project documentation
- **Validate template compliance** before beginning any implementation work
