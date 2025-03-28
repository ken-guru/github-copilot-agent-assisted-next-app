# GitHub Copilot Instructions

## Testing Guidelines

1. **Test-First Development**: 
   - Always begin implementation of any functionality by writing tests first
   - Write test cases that verify both basic and complex scenarios
   - Consider edge cases and variations in the test data
   - Ask clarifying questions about expected behavior before writing these tests
   - When fixing failing tests, update the Memory Log before running tests
   - For data display, explicitly test:
     - Order of displayed items
     - Format of displayed values
     - Edge cases in the data

2. **Test Coverage for Refactoring**: 
   - Update all relevant tests to ensure they still work as intended
   - When changing display order or sorting, add specific order verification tests
   - If expected behavior in tests needs to change, ask clarifying questions
   - Verify that existing edge cases are still covered

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
   - When fixing failing tests or bugs, ALWAYS update the memory log BEFORE running the tests
   - Record the debugging approach and expected outcomes before test execution
   - Maintain institutional knowledge about effective and ineffective solutions

## Package Management

1. **New Package Evaluation**: Before introducing a new package, discuss:
   - The specific need the package addresses
   - Alternative implementation approaches without the package
   - Analysis of potential future consequences considering:
     - Security implications
     - Added complexity
     - Maintenance status of the package

## Debugging Process Documentation

1. **Memory Log Updates During Debugging**:
   - Document each significant debugging step in the Memory Log
   - Include failed attempts and their outcomes
   - Note any unexpected behavior or test failures
   - Tag entries appropriately for future reference

2. **Debugging Entry Format**:
   ```markdown
   ### Issue: [Test/Feature Name] Debugging Session
   **Date:** YYYY-MM-DD
   **Tags:** #debugging #tests #[relevant-area]
   **Status:** [In Progress|Resolved|Blocked]

   #### Initial State
   - Description of the failing tests/features
   - Error messages or unexpected behavior
   - Current implementation state

   #### Debug Process
   1. First investigation step
      - What was examined
      - What was found
      - Next steps determined

   2. Solution attempts
      - What was tried
      - Outcome
      - Why it did/didn't work

   #### Resolution (if reached)
   - Final solution implemented
   - Why it worked
   - Tests affected

   #### Lessons Learned
   - Key insights gained
   - Patterns identified
   - Future considerations
   ```

3. **Real-Time Documentation**:
   - Update Memory Log entries as debugging progresses
   - Include all significant solution attempts
   - Document both successful and failed approaches
   - Note any patterns or recurring issues

## Deployment Verification

1. **Pre-deployment Checks**: Before considering any feature or change complete, verify:
   - Type checking passes:
     ```bash
     npm run type-check
     npm run tsc
     ```
   - Linting passes:
     ```bash
     npm run lint
     ```
   - All tests pass:
     ```bash
     npm test
     ```

2. **Verification Process**:
   - Run all checks before marking work as complete
   - Address all type errors and warnings
   - Resolve any linting issues
   - Fix any test failures
   - Document any deployment-specific considerations in the Memory Log

3. **Error Resolution**:
   - Document any recurring deployment issues in the Memory Log
   - Track patterns in type errors or linting warnings
   - Note any workarounds needed for deployment
   - Tag entries with #deployment for future reference
