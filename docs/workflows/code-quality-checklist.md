# Code Quality Checklist and Standards

This document outlines code quality standards, verification procedures, and maintenance protocols.

## Deployment Verification Checklist

Before considering any feature or change complete, run these verification steps:

### Required Quality Checks
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# All tests must pass
npm test

# Build verification
npm run build
```

**All steps must pass without errors before deployment.** Address any warnings or errors that could impact deployment.

## Code Quality Standards

### Large File Refactoring
- IDENTIFY files exceeding 200 lines
- SUGGEST logical refactoring options:
  - Splitting into smaller modules
  - Creating new components for extracted functionality
  - Improving organization

### Package Management Evaluation
Before adding new packages, DISCUSS:
- Specific need addressed
- Alternative implementation approaches
- Security implications
- Added complexity
- Package maintenance status

### File Organization Standards
- Keep related functionality grouped together
- Separate concerns clearly between files
- Use consistent naming conventions
- Document complex logic inline
- Maintain clear import/export structure

## Verification Process

### Pre-Commit Verification
- Run all checks before marking work as complete
- Address ALL errors and warnings
- Document deployment-specific considerations in Memory Log
- Tag deployment issues with #deployment
- VERIFY link integrity after file reorganizations
- CHECK for duplicate files in scripts directory

### Post-Implementation Verification
- RUN `node scripts/check-markdown-links.js` for link validation
- Ensure all documentation is updated
- Verify component documentation is current
- Check that examples still work

## Security Standards

### Critical Security Guidelines
- **🚨 CRITICAL SECURITY**: NEVER insert any code into files that exposes local filesystem structure, absolute paths, or folder structures outside the repository
- Repository-relative paths are acceptable, but external filesystem details must never be committed to files
- AVOID hardcoded credentials, passwords, or sensitive data
- LIMIT shell commands to safe, project-scoped operations
- DOCUMENT any `execSync` or `spawn` usage with security justification
- REVIEW scripts for security implications before committing

### Script Security Protocols
- Use descriptive names: `fix-[specific-issue]-[date].js`
- Document script purpose in header comments
- Include cleanup instructions in script comments
- Archive with: `mv scripts/fix-*.js scripts/archive/` after completion

## Performance Standards

### Bundle Size Management
- Monitor bundle size impact of new dependencies
- Use dynamic imports for large, optional features
- Optimize images and assets
- Remove unused code and dependencies

### Runtime Performance
- Minimize re-renders in React components
- Use appropriate memoization strategies
- Optimize expensive calculations
- Monitor and profile performance-critical paths

### Build Performance
- Keep build times reasonable (< 60 seconds for development)
- Use appropriate caching strategies
- Minimize unnecessary processing

## Accessibility Standards

### Required Accessibility Features
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance (WCAG AA)
- Focus management in modals and dynamic content

### Testing Accessibility
- Include accessibility tests in Jest test suites
- Use testing-library accessibility utilities
- Test with keyboard-only navigation
- Verify screen reader compatibility

## Code Style Standards

### TypeScript Standards
- Use strict TypeScript configuration
- Avoid `any` types - use `unknown` with proper type guards
- Provide explicit return types for functions
- Use proper generic constraints
- Document complex type definitions

### React Standards
- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance-critical components
- Follow React best practices for state management
- Implement proper cleanup in useEffect hooks

### CSS and Styling Standards
- Use CSS modules or styled-components
- Follow BEM naming conventions for CSS classes
- Implement responsive design patterns
- Use CSS variables for theming
- Ensure consistent spacing and typography

## Documentation Standards

### Code Documentation
- Document complex algorithms and business logic
- Use JSDoc for public API functions
- Explain non-obvious code decisions
- Keep comments current with code changes

### Architecture Documentation
- Document component relationships
- Explain state management patterns
- Document data flow and dependencies
- Keep architecture diagrams current

## Testing Quality Standards

### Test Coverage Requirements
- Maintain high test coverage (>80% for critical paths)
- Test edge cases and error conditions
- Include accessibility tests
- Test both light and dark theme modes

### Test Quality Guidelines
- Write descriptive test names
- Keep tests focused and isolated
- Use appropriate test utilities and helpers
- Mock external dependencies consistently

## Link Integrity Standards

### Link Maintenance Requirements
- INCLUDE link validation in all documentation PRs
- FIX broken links immediately when discovered
- MAINTAIN audit trail of reference changes in Memory Log
- PREVENT false positives by proper code block formatting

### Reorganization Best Practices
- PLAN link update strategy before starting file reorganizations
- CREATE mapping files for any ID or filename changes
- UPDATE references systematically, not ad-hoc
- VALIDATE with automated tools, not manual checking

## Script Lifecycle Management

### One-Off Script Protocols
- ARCHIVE immediately after single-use scripts complete their purpose
- NEVER leave completed fix/reorganization scripts in main `scripts/` directory
- CREATE scripts in `scripts/` for development, MOVE to `scripts/archive/` when done
- DELETE duplicates - keep only one copy (preferably archived version for history)

### Infrastructure Script Exceptions
- KEEP scripts with ongoing utility in main `scripts/` directory
- Examples: `check-markdown-links.js`, `update-service-worker-version.js`
- Only archive scripts that have completed their one-time purpose

## Quality Gate Checklist

Before any code is considered complete:

### Development Quality Gates
- [ ] All TypeScript compilation errors resolved
- [ ] All ESLint errors and warnings addressed
- [ ] All tests passing (Jest and Cypress if applicable)
- [ ] Build completes successfully
- [ ] No console errors in development
- [ ] Performance impact assessed

### Documentation Quality Gates
- [ ] Code documentation updated
- [ ] Component documentation current
- [ ] README updated if functionality changed
- [ ] Memory logs created for complex issues
- [ ] Link integrity verified

### Security Quality Gates
- [ ] No sensitive information exposed
- [ ] Scripts reviewed for security implications
- [ ] Dependencies reviewed for vulnerabilities
- [ ] No hardcoded credentials or paths

### Accessibility Quality Gates
- [ ] ARIA labels implemented correctly
- [ ] Keyboard navigation working
- [ ] Color contrast verified
- [ ] Screen reader compatibility tested
- [ ] Focus management implemented

### Performance Quality Gates
- [ ] Bundle size impact acceptable
- [ ] Runtime performance tested
- [ ] Build time impact acceptable
- [ ] Memory leaks checked
- [ ] Accessibility performance verified

Use this checklist as a final verification step before considering any development work complete.
