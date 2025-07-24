# Commit Procedures and Guidelines

This document outlines the standard procedures for committing code changes, particularly when implementing fixes for PR comments or issues.

## Standard PR Fix Procedure

When implementing fixes for PR comments or issues, ALWAYS follow this established procedure:

### Step 1: Implement Fix
- Make the necessary code changes to address the issue
- Update related tests if needed

### Step 2: Run Targeted Tests
- Use `npm test -- --testPathPatterns="ComponentName"` for specific component tests
- Verify the fix works correctly and doesn't break existing functionality

### Step 3: Run Full Test Suite
- Execute `npm run test` to ensure all tests pass
- Address any test failures before proceeding

### Step 4: Run Quality Checks
- Execute `npm run lint` to ensure code style compliance
- Execute `npm run type-check` to verify TypeScript type safety
- Address any linting or type errors

### Step 5: Run Cypress Tests (Optional but Recommended)
- Execute `npm run cypress:run` to run end-to-end tests locally
- Only run if changes affect user workflows or cross-component interactions
- Skip if changes are purely unit-level (covered by Jest in Step 3)
- Address any Cypress test failures before proceeding
- Note: This prevents waiting for GitHub CI/CD to catch e2e issues

### Step 6: Commit and Push
- Stage changes: `git add .`
- Commit with descriptive message explaining the fix
- Push to feature branch: `git push origin <branch-name>`

### Step 7: Verify PR Update
- Confirm changes appear in the PR
- Monitor CI/CD pipeline to ensure all checks pass

## Issue Resolution Continuity Protocol

**CRITICAL**: Never identify an issue and then forget to resolve it after committing.

### The Problem Pattern to AVOID:
1. Identify a specific issue (e.g., "simplified form logic needs debugging")
2. Commit current progress 
3. **FORGET** to continue working on the identified issue
4. Move on to other tasks, leaving the issue unresolved

### MANDATORY Resolution Protocol:
When you identify ANY issue or debugging need:

1. **EXPLICITLY STATE** the next action required
2. **IMMEDIATELY AFTER COMMITTING**: Continue with the identified issue resolution
3. **NEVER END** a response by just committing without addressing identified issues
4. **USE CLEAR TRANSITION LANGUAGE**: 
   - "Now that changes are committed, let me debug the simplified form logic..."
   - "With progress saved, I'll investigate why the description field still shows..."
   - "Commit complete. Continuing with the identified issue..."

### Session Memory Management:
- **DOCUMENT UNRESOLVED ISSUES** in commit messages for context preservation
- **START NEXT ACTIONS** with explicit reference to previously identified issues
- **MAINTAIN ISSUE TRACKING** throughout the debugging session
- **CREATE MEMORY LOG ENTRIES** for complex debugging sessions with identified issues

### Enforcement Guidelines:
- ⚠️ **CRITICAL**: This rule supersedes all other commit guidelines
- 🔄 **CONTINUOUS FLOW**: Identification → Commit → **IMMEDIATE CONTINUATION** → Resolution
- 📝 **EXPLICIT COMMUNICATION**: Always state what you will work on next after committing
- ✅ **COMPLETION VERIFICATION**: Only end work when issues are fully resolved, not just identified

## Frequent Commit Strategy

- COMMIT early and often to maintain development momentum
- LIMIT each commit to maximum 5 files unless tightly coupled
- ENSURE each commit represents a logical, complete unit of work
- INCLUDE meaningful commit messages describing the specific change
- UPDATE planning documents before each commit to reflect current progress

## Commit Scope Guidelines

- **Single Component Changes**: One commit per component when migrating or refactoring
- **Related File Groups**: Group tightly coupled changes (component + test + documentation)
- **Feature Increments**: Commit each working increment of a feature implementation
- **Test Updates**: Separate commits for test-only changes when appropriate
- **Documentation Updates**: Can be combined with related code changes or separate if substantial

## Commit Quality Standards

- VERIFY all tests pass before committing
- ENSURE code compiles and type-checks successfully
- RUN linting and fix any issues before commit
- INCLUDE any necessary documentation updates in the same commit
- VALIDATE that the commit doesn't break existing functionality

## Planning Document Commit Protocol

- ALWAYS update planning documents (PLANNED_CHANGES.md) BEFORE committing
- MARK completed tasks with checkboxes and completion status
- UPDATE progress tracking percentages to reflect current state
- ENSURE planning document accurately reflects completed work
- COMMIT planning document updates along with implementation changes
- NEVER commit implementation without corresponding planning document updates

## Commit Message Format

Use clear, descriptive commit messages:
- Include component/area affected in the message
- Reference issue numbers when applicable
- Use consistent format for related changes

### Examples:
```bash
# Component changes
git commit -m "Migrate ActivityButton to Bootstrap Button component"

# Test additions
git commit -m "Add tests for ProgressBar Bootstrap migration"

# Documentation updates
git commit -m "Update component documentation for ThemeToggle"

# Issue fixes
git commit -m "Fix issue #123: Button accessibility improvements

- Add proper ARIA labels
- Implement keyboard navigation
- Update focus management
- Add comprehensive test coverage"
```

## Quality Assurance Checklist

Before any commit, ensure:
- [ ] All tests pass (`npm test`)
- [ ] Code compiles (`npm run build`)
- [ ] TypeScript validation passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Related documentation updated
- [ ] Planning documents reflect current progress
- [ ] Commit message clearly describes changes
- [ ] No unresolved issues identified but not addressed

This procedure ensures:
- Code quality and consistency
- All tests pass before pushing (including e2e tests when relevant)
- Clear commit history
- Automated CI/CD validation
- Proper PR documentation
- Early detection of integration issues through local testing
