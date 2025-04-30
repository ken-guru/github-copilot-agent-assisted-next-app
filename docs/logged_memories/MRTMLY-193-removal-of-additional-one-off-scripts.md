<!-- filepath: /Users/ken/Workspace/ken-guru/github-copilot-agent-assisted-next-app/docs/logged_memories/MRTMLY-004-removal-of-additional-one-off-scripts.md -->
### Issue: Removal of Additional One-Off Scripts
**Date:** 2025-04-29
**Tags:** #maintenance #cleanup #scripts #testing
**Status:** Completed

#### Initial State
After our initial cleanup of one-off scripts documented in [MRTMLY-191](./MRTMLY-191-removal-of-one-off-scripts.md), a more thorough code review identified additional one-off scripts that should be considered for removal. These scripts are:

1. **`scripts/extended-build.js`**: A build script that clears Next.js cache and temporarily modifies tsconfig.json to exclude Cypress files.
2. **`verify-fix.js`**: A simple verification script for testing ActivityStateMachine, likely used once to verify a bug fix.

The existence of these scripts contributes to maintenance overhead and potential confusion about which scripts are actively maintained versus deprecated.

#### Implementation Plan

##### Step 1: Remove `extended-build.js`
The `clean-build.js` script provides similar functionality with a cleaner implementation. Since the package.json still references `extended-build.js`, we need to:

1. Update package.json to replace the `clean-build` script reference to point to `clean-build.js` instead of `extended-build.js`
2. Remove the `build:extended` script entry from package.json
3. Delete the `scripts/extended-build.js` file

##### Step 2: Remove `verify-fix.js`
This file is not referenced from package.json and appears to be a one-time verification script:

1. Delete the `verify-fix.js` file from the project root

##### Step 3: Verification
After removing these scripts:

1. Verify build functionality: `npm run build`
2. Verify clean build functionality: `npm run clean-build:full`
3. Run tests to ensure no functionality is affected: `npm test`

#### Resolution
Successfully removed two additional one-off scripts from the codebase:

1. `scripts/extended-build.js` - This script was removed and the package.json was updated to use `clean-build.js` instead.
2. `verify-fix.js` - This simple verification script was removed from the project root.

Verification tests were run after removing the scripts:
- All builds are successful: `npm run build` and `npm run clean-build` both work properly
- All tests pass: `npm test` shows 73 test suites with 456 tests passing
- Application functionality is preserved

#### Lessons Learned
1. Regular codebase audits help identify and remove unnecessary scripts that accumulate over time
2. When multiple scripts serve similar purposes (like `extended-build.js` and `clean-build.js`), it's better to consolidate functionality into a single, well-maintained script
3. One-off verification scripts should be integrated into the test suite when possible, rather than left as standalone files
4. Proper documentation of cleanup activities helps track what was removed and why
