# Test Pyramid Architecture Guide

## Overview

This project follows a **Test Pyramid Architecture** designed for optimal performance, reliability, and maintainability. This guide explains when to use each testing approach and provides examples for both human developers and AI agents.

## Test Pyramid Structure

```
🔺 Test Pyramid (Performance Optimized)
├── E2E Tests (Cypress) - 16 tests, ~60 seconds
│   ├── Complete user workflows
│   ├── Cross-page navigation with data persistence  
│   ├── File import/export operations
│   └── Service worker UI interactions
├── Integration Tests (Jest) - Component interaction testing
│   ├── Component composition and prop passing
│   ├── Modal focus management and keyboard navigation
│   ├── Accessibility features and ARIA compliance
│   └── Page-level component integration
└── Unit Tests (Jest) - 135+ tests, ~15 seconds
    ├── Component logic and state management
    ├── Hook behavior and edge cases
    ├── Utility functions and algorithms
    └── State machine transitions
```

## Decision Matrix: Jest vs Cypress

### ✅ Use Jest When

**Component Logic & Behavior**
- Form validation and error handling
- Input validation and sanitization
- Component state management
- Prop handling and default values
- Event handler logic

**User Interface Elements**
- Button states and interactions
- Modal lifecycle (open/close/focus)
- Theme switching behavior
- Loading states and transitions
- Error boundary behavior

**Accessibility Features**
- ARIA labels and semantic HTML
- Keyboard navigation patterns
- Screen reader compatibility
- Focus management
- Color contrast compliance

**Business Logic & Utilities**
- Activity state machine transitions
- Time calculations and formatting
- Data transformation functions
- Validation algorithms
- Storage operations (localStorage/sessionStorage)

**React Hooks & State**
- Custom hook behavior
- State updates and side effects
- Context provider functionality
- Effect cleanup and dependencies
- Memoization and performance optimizations

### ✅ Use Cypress When

**Complete User Workflows**
- Full CRUD operations (Create → Read → Update → Delete)
- Multi-step user journeys
- Data persistence across actions
- Complex interaction sequences

**Cross-Page Navigation**
- Route transitions with state preservation
- Browser history management
- Deep linking functionality
- URL parameter handling

**File Operations**
- File upload/download workflows
- Import/export functionality
- Drag and drop interactions
- File validation and processing

**Browser-Specific Features**
- Service worker update notifications
- Offline/online state transitions
- PWA installation prompts
- Push notifications (if implemented)

**Integration Scenarios**
- Multiple components working together
- Real browser environment behavior
- Network request/response cycles
- Authentication flows (if implemented)

## Example Test Cases

### Jest Example: Component Logic
```javascript
// ✅ GOOD: Test component behavior in Jest
describe('ActivityForm Validation', () => {
  it('should show error for empty activity name', () => {
    render(<ActivityForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(screen.getByRole('alert')).toHaveTextContent('Activity name is required');
    expect(screen.getByLabelText(/activity name/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('should handle special characters in activity names', () => {
    render(<ActivityForm onSubmit={mockSubmit} />);
    
    const input = screen.getByLabelText(/activity name/i);
    fireEvent.change(input, { target: { value: 'Test @#$%^&*()_+ Activity' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Test @#$%^&*()_+ Activity'
    });
  });
});
```

### Cypress Example: User Workflow
```javascript
// ✅ GOOD: Test complete user workflow in Cypress
describe('Activity Management Workflow', () => {
  it('should complete full CRUD lifecycle', () => {
    cy.visit('/activities');
    
    // Create
    cy.contains('Add Activity').click();
    cy.get('[role="dialog"]').within(() => {
      cy.get('input[type="text"]').type('Test Activity');
    });
    cy.get('button').contains('Save').click();
    cy.contains('Test Activity').should('be.visible');
    
    // Read
    cy.contains('Test Activity').should('be.visible');
    
    // Update
    cy.get('button').contains('Edit').first().click();
    cy.get('[role="dialog"]').within(() => {
      cy.get('input[type="text"]').clear().type('Updated Activity');
    });
    cy.get('button').contains('Save').click();
    cy.contains('Updated Activity').should('be.visible');
    
    // Delete
    cy.get('button').contains('Delete').first().click();
    cy.get('[role="dialog"]').within(() => {
      cy.get('button').contains('Delete').click();
    });
    cy.contains('Updated Activity').should('not.exist');
  });
});
```

## Anti-Patterns to Avoid

### ❌ Don't Use Cypress For

**Component Logic Testing**
```javascript
// ❌ BAD: Testing component logic in Cypress
it('should validate form fields', () => {
  cy.visit('/activities');
  cy.contains('Add Activity').click();
  cy.get('button').contains('Save').click();
  // This is testing component logic, should be Jest
});
```

**Simple Interactions**
```javascript
// ❌ BAD: Testing simple button clicks in Cypress
it('should toggle theme', () => {
  cy.visit('/');
  cy.get('[data-testid="theme-toggle"]').click();
  // This is testing component behavior, should be Jest
});
```

### ❌ Don't Use Jest For

**Cross-Page Workflows**
```javascript
// ❌ BAD: Testing navigation in Jest
it('should navigate to activities page', () => {
  // Jest can't test real navigation between pages
  // This needs Cypress for proper browser environment
});
```

**File Upload Workflows**
```javascript
// ❌ BAD: Testing file uploads in Jest
it('should upload activity file', () => {
  // File upload needs real browser environment
  // This should be tested in Cypress
});
```

## Performance Guidelines

### Speed Comparison
- **Jest Tests**: ~15 seconds for 135+ tests
- **Cypress Tests**: ~60 seconds for 16 tests
- **Performance Ratio**: Jest is 15x faster per test

### Optimization Strategies

1. **Favor Jest When Possible**
   - 85% of tests should be Jest
   - 15% of tests should be Cypress
   - Only use Cypress for unique value

2. **Mock External Dependencies**
   - Mock API calls in Jest tests
   - Mock browser APIs when not essential
   - Keep tests isolated and fast

3. **Parallel Execution**
   - Jest runs tests in parallel by default
   - Cypress tests run sequentially
   - Structure tests for optimal parallelization

## Test Organization

### File Structure
```
src/
├── components/
│   ├── ActivityForm.tsx
│   └── __tests__/
│       ├── ActivityForm.test.tsx          # Component logic
│       ├── ActivityForm.integration.test.tsx # Component interaction
│       └── ActivityForm.accessibility.test.tsx # A11y features
├── hooks/
│   ├── useActivityState.ts
│   └── __tests__/
│       └── useActivityState.test.tsx      # Hook behavior
└── utils/
    ├── activityStateMachine.ts
    └── __tests__/
        └── activityStateMachine.test.tsx  # Business logic

cypress/e2e/
├── activity-crud.cy.ts                   # Complete workflows
└── service-worker.cy.ts                  # UI integration
```

### Naming Conventions
- **Jest**: `*.test.tsx` for unit tests, `*.integration.test.tsx` for integration
- **Cypress**: `*.cy.ts` for end-to-end workflows
- **Test IDs**: Use `data-testid` attributes for reliable selectors

## Migration Benefits

### Performance Improvements
- **Before Migration**: 48 Cypress tests, ~4+ minutes
- **After Migration**: 16 Cypress tests, ~60 seconds
- **Performance Gain**: 75% faster execution
- **Developer Experience**: Faster feedback loop

### Quality Improvements
- **Better Coverage**: More granular edge case testing
- **Improved Reliability**: Less flaky than e2e equivalents
- **Enhanced Maintainability**: Faster tests encourage frequent execution
- **Clearer Separation**: Obvious boundaries between test types

## Commands & Scripts

### Running Tests
```bash
# Jest tests (fast, frequent)
npm test                                 # All Jest tests
npm test -- --watch                     # Watch mode
npm test -- --testPathPatterns="Form"   # Specific patterns

# Cypress tests (slow, essential)
npm run cypress:run                      # Headless e2e tests
npm run cypress                         # Interactive test runner
```

### CI/CD Integration
```bash
# Fast feedback pipeline
npm run test && npm run lint && npm run type-check

# Complete validation pipeline
npm run test && npm run cypress:run && npm run build
```

## Best Practices Summary

### For Human Developers
1. **Start with Jest** - Write unit tests first
2. **Add Cypress sparingly** - Only for unique user workflows
3. **Think performance** - Fast tests enable better TDD
4. **Mock dependencies** - Keep tests isolated and reliable

### For AI Agents
1. **Default to Jest** - Unless explicitly asked for e2e testing
2. **Check existing coverage** - Avoid duplicating test scenarios
3. **Follow decision matrix** - Use the guidelines above
4. **Consider performance** - Prefer faster test execution

### Code Quality
1. **Test-driven development** - Write tests before implementation
2. **Descriptive test names** - Clear intention and expected behavior
3. **Arrange-Act-Assert** - Consistent test structure
4. **Single responsibility** - One concept per test

This architecture ensures optimal performance while maintaining comprehensive coverage and enabling confident development workflows.
