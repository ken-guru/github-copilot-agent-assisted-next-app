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

2. **Documentation Updates**: 
   - If changes significantly alter functionality described in README.md, highlight this discrepancy and suggest appropriate documentation updates
   - After completing a development cycle, always evaluate if README.md needs updates to reflect:
     - New features or functionality added
     - Changes to installation or setup procedures
     - Updated usage examples
     - Modified configuration options
     - Revised dependencies or requirements
   - Prompt for README.md updates with specific suggestions based on the changes made
   - Ensure documentation remains synchronized with the current state of the application

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

## Memory Log Management

1. **File Organization**:
   - Always store individual memory log entries in separate files under `docs/logged_memories/`
   - Use consistent file naming: `MRTMLY-XXX-descriptive-name.md`
   - Never add detailed memory entries directly to the main MEMORY_LOG.md file
   - Only add reference links in MEMORY_LOG.md that point to the individual memory files

2. **Memory Entry Creation Process**:
   - Create a new file in `docs/logged_memories/` with the appropriate naming convention
   - Add the memory entry details to this new file using the template format
   - Add only a reference link to the main MEMORY_LOG.md file
   - Ensure the reference format matches existing entries in the memory index
   - Group memory entries by date/month in the index
   - Always add new memory entries as the LAST item in their respective date section
   - Never overwrite the existing memories in the list currently in the document
   - Never create duplicate MRTMLY-XXX IDs - always use the next available number in sequence

3. **Entry Format and Structure**:
   - Follow the established template structure for all memory entries
   - Include all required sections (Initial State, Debug Process or Implementation, Resolution, Lessons Learned)
   - Use consistent heading levels and formatting
   - Ensure appropriate tagging for easy searching

4. **Memory Log Updates During Debugging**:
   - Document each significant debugging step in the appropriate memory log file
   - Include failed attempts and their outcomes
   - Note any unexpected behavior or test failures
   - Tag entries appropriately for future reference

5. **Memory Log Maintenance**:
   - When updating existing entries, edit the individual memory file, not MEMORY_LOG.md
   - Periodically check for consistent formatting across memory entries
   - Ensure all memory entries are properly referenced in the main index
   - Look for patterns across related issues and link them where appropriate
   - Always check for and resolve any duplicate memory IDs
   - Maintain chronological order within each date section, with newest entries at the bottom
   - When adding a new entry with a date that doesn't have a section yet, add the new section at the bottom of the file

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
