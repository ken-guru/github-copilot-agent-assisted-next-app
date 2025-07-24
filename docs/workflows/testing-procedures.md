# Testing Procedures and Guidelines

This document outlines comprehensive testing strategies, including the Jest vs Cypress decision matrix and testing protocols.

## Test Pyramid Architecture

- ✅ FOLLOW: Jest for component logic → Cypress for user workflows
- ✅ PERFORMANCE: Prefer Jest over Cypress when coverage is equivalent (15x faster)
- ✅ ARCHITECTURE: Unit → Integration → E2E pyramid structure

## Test-First Development

- ✅ REQUIRED: Write Jest tests BEFORE implementing any functionality
- Write tests covering basic scenarios, complex scenarios, and edge cases
- Ask clarifying questions about expected behavior before writing tests
- For data display, explicitly test:
  - Order of displayed items
  - Format of displayed values
  - Edge cases in the data

## Jest vs Cypress Decision Matrix

### ✅ USE JEST FOR:
- Component rendering and props testing
- Form validation and error handling
- Keyboard navigation and focus management
- State management hooks (useActivityState, etc.)
- Utility function testing
- Accessibility compliance (ARIA, screen readers)
- Modal interactions and lifecycle
- Theme switching behavior
- **DETAILED UI INTERACTIONS**: Toast notifications, alert handling, component state changes
- **COMPONENT INTEGRATION**: How components work together within single page contexts
- **ERROR HANDLING**: Form validation, API error states, edge cases

### ✅ USE CYPRESS FOR:
- **HIGH-LEVEL USER WORKFLOWS ONLY**: Complete end-to-end user journeys that span multiple components/pages
- **CORE BUSINESS FLOWS**: Critical paths users take to accomplish primary application goals
- Cross-page navigation with data persistence
- File upload/download operations
- Service worker update notifications (UI only)
- Browser-specific behavior requiring real browser environment
- **AVOID DETAILED UI TESTING**: Don't test individual component states, form validation details, or UI element specifics

## Test Coverage Management

- Update all relevant tests when refactoring code
- Add specific order verification tests when changing display order or sorting
- Ask clarifying questions if expected test behavior needs to change
- Verify existing edge cases remain covered after changes

## Missing Test Coverage Protocol

- Flag when working with code lacking test coverage
- Present options:
  1. Create Jest tests immediately (preferred)
  2. Create Cypress tests only if true user workflow
  3. Postpone test creation with justification
- If postponement chosen, do not remind again in current session unless requested

## Test Verification

- Remind to run test suite after ANY code changes
- ALWAYS use terminal commands via `run_in_terminal` for reliable execution:
  - `npm test` for full Jest test suite
  - `npm test -- --testPathPatterns="pattern"` for specific test patterns
  - `npm run lint` for linting checks
  - `npm run type-check` for TypeScript validation
  - `npm run cypress:run` for e2e validation when needed
- AVOID VS Code tasks for test execution as they can cause hanging/incomplete output issues

## Terminal Command Guidelines

- **NEVER run interactive commands** that require user input to complete
- **AVOID commands that open pagers** (less, more, man pages) without proper flags
- **PREVENT hanging commands** that wait for user selection or navigation
- **USE non-interactive flags** when available:
  - `gh pr view --json` instead of `gh pr view` (which opens pager)
  - `git log --oneline -n 5` instead of `git log` (which opens pager)
  - `cat file.txt` instead of `less file.txt` or `more file.txt`
  - `--no-pager` flag for git commands when needed
- **CHECK command completion** - ensure all commands return to prompt
- **TERMINATE hanging commands** immediately if they don't complete within reasonable time

## Performance Optimization Guidelines

- PERFORMANCE FIRST: Choose Jest over Cypress when possible (15x faster)
- CYPRESS USAGE: Only for true user workflows that provide unique value
- TEST PYRAMID: Maintain 85% Jest, 15% Cypress distribution
- CI/CD EFFICIENCY: Fast Jest tests enable rapid feedback loops

## GitHub PR Check Monitoring

- **PREFER MCP GitHub tools** when available for comprehensive PR information:
  - Use `mcp_github_get_pull_request_status` for CI/CD check status
  - Use `mcp_github_get_pull_request` for overall PR state and details
  - Use `mcp_github_list_pull_requests` to find PR numbers by branch
- **FALLBACK to CLI for real-time monitoring**: Use `gh pr checks <PR_NUMBER> --fail-fast --watch` for real-time updates
- Avoid using `gh pr checks` without flags as it may hang indefinitely
- The `--fail-fast` flag ensures quick response when checks fail
- The `--watch` flag provides live updates as checks complete

## Code Review Monitoring Protocol

- **MANDATORY**: Check for code review comments before considering any PR work complete
- **ALWAYS use MCP GitHub tools** when available for PR operations:
  - Use `mcp_github_get_pull_request` to get comprehensive PR details
  - Use `mcp_github_get_pull_request_comments` to check for review comments
  - Use `mcp_github_get_pull_request_reviews` to check for formal reviews
  - Use `mcp_github_get_pull_request_files` to see changed files and line comments
- **FALLBACK to CLI only when MCP tools unavailable**: `gh pr view <PR_NUMBER>`
- **NEVER finish PR work** without addressing all code review feedback
- **ALWAYS respond to reviewer requests** before marking work as done
- Code review feedback takes precedence over completion - address all comments first
- Use `mcp_github_create_pull_request_review` or `gh pr review <PR_NUMBER> --approve` only after all feedback is addressed

## Specific Testing Patterns

### Component Testing with Jest
```javascript
// Example component test structure
describe('ComponentName', () => {
  it('renders with required props', () => {
    // Test basic rendering
  });

  it('handles user interactions correctly', () => {
    // Test click handlers, form submissions, etc.
  });

  it('manages state correctly', () => {
    // Test state updates and side effects
  });

  it('handles error states gracefully', () => {
    // Test error boundaries and fallbacks
  });

  it('supports accessibility requirements', () => {
    // Test ARIA labels, keyboard navigation, screen reader support
  });

  it('works in both light and dark themes', () => {
    // Test theme compatibility
  });
});
```

### Hook Testing with Jest
```javascript
// Example hook test structure
describe('useCustomHook', () => {
  it('initializes with correct default state', () => {
    // Test initial state
  });

  it('updates state correctly on action', () => {
    // Test state transitions
  });

  it('handles edge cases and errors', () => {
    // Test error conditions and boundary cases
  });
});
```

### End-to-End Testing with Cypress
```javascript
// Example Cypress test structure - only for complete user workflows
describe('Activity Management Workflow', () => {
  it('allows users to create, run, and complete activities', () => {
    // Test complete user journey across multiple components
    cy.visit('/');
    cy.get('[data-testid="create-activity"]').click();
    cy.get('[data-testid="activity-name"]').type('Test Activity');
    // ... complete workflow testing
  });
});
```

## Testing Best Practices

### For Components
1. Test behavior, not implementation details
2. Use data-testid attributes for reliable element selection
3. Mock external dependencies and API calls
4. Test both success and error scenarios
5. Verify accessibility compliance

### For Hooks
1. Test state transitions and side effects
2. Verify cleanup functions are called
3. Test dependency array changes
4. Mock external dependencies consistently

### For Utilities
1. Test pure functions with various inputs
2. Cover edge cases and boundary conditions
3. Test error handling and validation
4. Verify performance characteristics where relevant

### For Integration
1. Test component communication and data flow
2. Verify proper prop passing between components
3. Test context providers and consumers
4. Validate theme and responsive behavior

## Test Quality Gates

Before marking tests complete:
- [ ] All new functionality has corresponding tests
- [ ] All tests pass consistently
- [ ] Edge cases and error conditions are covered
- [ ] Accessibility requirements are tested
- [ ] Theme compatibility is verified
- [ ] No test flakiness or timing issues
- [ ] Test performance is acceptable (Jest tests under 30 seconds)
- [ ] Cypress tests are minimal and focused on user value
