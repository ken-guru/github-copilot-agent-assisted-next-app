# GitHub Copilot Instructions

## Testing Guidelines

1. **Test-First Development**: Always begin implementation of any functionality by writing tests first. Ask clarifying questions about expected behavior before writing these tests.

2. **Test Coverage for Refactoring**: When refactoring code, update all relevant tests to ensure they still work as intended. If expected behavior in tests needs to change, ask clarifying questions to prevent unintended behavioral changes.

3. **Missing Test Coverage**: When working on code without test coverage, raise this concern to allow me to decide whether to:
   - Create tests immediately before proceeding
   - Postpone test creation for later
   
   If I choose to postpone, don't remind me during the current session unless I indicate completion of planned tasks.

4. **Test Verification**: After any code changes, always remind me to run the test suite to ensure no regressions were introduced.

## Code Quality and Organization

1. **Large File Refactoring**: When working with files exceeding 200 lines of code, suggest logical refactoring options such as:
   - Splitting the file into smaller modules
   - Creating new components for extracted functionality
   - Improving code organization

2. **Documentation Updates**: If changes significantly alter functionality described in README.md, highlight this discrepancy and suggest appropriate documentation updates.

## Change Management

1. **Change Summary**: After implementing changes, provide a concise summary to facilitate:
   - Understanding the reasoning behind implementation choices
   - Asking follow-up questions
   - Requesting alternative approaches if needed

2. **Memory Log Management**: Always consult and update the Memory Log (docs/MEMORY_LOG.md) when working on issues or bugs:
   - Before attempting solutions, check for similar past issues to avoid repeating unsuccessful approaches
   - Document all solution attempts, outcomes, and relevant tags following the established format
   - Maintain institutional knowledge about effective and ineffective solutions

## Package Management

1. **New Package Evaluation**: Before introducing a new package, discuss:
   - The specific need the package addresses
   - Alternative implementation approaches without the package
   - Analysis of potential future consequences considering:
     - Security implications
     - Added complexity
     - Maintenance status of the package