# Planned Changes Prompt Template
This file contains specifications for upcoming changes to the application. Each change should be documented in a format suitable for AI-assisted implementation. Once implemented, move the change to IMPLEMENTED_CHANGES.md with a timestamp.

## Change Request Template
```markdown
# Feature/Change Title

## Context
Provide context about the part of the application this change affects.
- Which components/utilities are involved?
- What current behavior needs to change?
- What user needs does this address?

## Requirements
Detailed specifications for the change:
1. First requirement
   - Implementation details
   - Technical considerations
   - Testing requirements
2. Second requirement
   - Sub-points
   - Edge cases to handle
3. Additional requirements as needed

## Technical Guidelines
- Framework-specific considerations
- Performance requirements
- Accessibility requirements
- Theme compatibility requirements
- Testing approach

## Expected Outcome
Describe what success looks like:
- User perspective
- Technical perspective
- Testing criteria

## Validation Criteria
- [ ] Test cases written
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Theme compatibility verified
- [ ] Documentation updated
```

Note: When implementing a change, copy this template and fill it out completely. The more detailed the prompt, the better the AI assistance will be in implementation.

# Memory Log Reorganization and Indexing

## Context
- The project has a large collection of memory log files in `docs/logged_memories/` directory
- These files document debugging sessions, implementations, and issues encountered
- Currently, many files have duplicate IDs (e.g., multiple MRTMLY-001-* files) or placeholder IDs (MRTMLY-XXX-*)
- The main `MEMORY_LOG.md` file is empty and doesn't properly index these entries

## Requirements
1. Assign unique sequential IDs to all memory log files
   - Create a mapping of current filenames to new unique IDs
   - Preserve descriptive parts of filenames
   - Order by related subject matter and logical progression of changes
   - Start from ID 001 and assign sequentially

2. Update all filenames according to the new ID scheme
   - Rename files in the `docs/logged_memories/` directory
   - Maintain format: `MRTMLY-XXX-descriptive-name.md`
   - Ensure no duplicate IDs exist

3. Update all references to memory log files throughout the codebase
   - Identify files that reference memory logs (e.g., `IMPLEMENTED_CHANGES.md`, migration docs)
   - Update link texts and paths to reflect new filenames
   - Maintain format: `[MRTMLY-XXX: Title](./logged_memories/MRTMLY-XXX-descriptive-name.md)`

4. Create a comprehensive index in `MEMORY_LOG.md`
   - List all entries in sequential ID order
   - Format each entry as a reference link to individual file
   - Follow the format specified in `copilot-instructions.md`

## Technical Guidelines
- Script any bulk renaming operations to avoid manual errors
- Test all links after updating to ensure they work correctly
- Back up all files before making changes
- Maintain compatibility with existing documentation standards
- Handle edge cases like files referenced from multiple locations

## Expected Outcome
- Every memory log file has a unique ID (MRTMLY-001 through MRTMLY-NNN)
- All filenames consistently follow the pattern `MRTMLY-XXX-descriptive-name.md`
- All references to memory logs in other files are updated to match new IDs
- `MEMORY_LOG.md` contains a complete, sequential index of all memory log entries
- No broken links exist in the documentation

## Validation Criteria
- [ ] Complete inventory of all memory log files created
- [ ] Mapping table (old ID → new ID) developed
- [ ] All files renamed with unique sequential IDs
- [ ] All references to memory logs updated across the codebase
- [ ] `MEMORY_LOG.md` populated with organized index
- [ ] All links verified to be working
- [ ] Documentation updated to reflect the new organization

# Development Process Guidelines

## Sequential Implementation
- Work on one change at a time - never move to the next item until the current one is complete
- Complete all validation criteria for the current task before starting a new one
- Avoid parallel development to prevent code conflicts and maintain focus
- For multi-phase changes (like the Time Utilities Consolidation below), complete each phase fully before starting the next
- Mark completed items in the validation criteria as they are finished

## Testing Requirements
- Each implementation must include appropriate tests before considering it complete
- Tests should be written before or alongside implementation (Test-Driven Development)
- All tests must pass before a change is considered complete

## Documentation
- Update documentation alongside code changes
- Document all key decisions made during implementation
- Update the Memory Log for all significant changes or bug fixes
