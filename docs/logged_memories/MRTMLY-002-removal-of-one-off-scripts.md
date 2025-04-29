### Issue: Removal of One-Off Scripts
**Date:** 2023-11-30
**Tags:** #maintenance #cleanup #scripts #testing
**Status:** In Progress

#### Initial State
- Previous analysis (MRTMLY-001) identified several scripts that appear to be one-off solutions:
  - `convert-test-files.js`
  - `test-duplicate-activity-handling.js`
  - `clean-config.sh`
- Need to safely remove these scripts without breaking application functionality

#### Implementation Plan
1. For each script:
   - Remove script from codebase
   - Run full test suite: `npm test`
   - Run build process: `npm run build`
   - Verify application starts normally: `npm run dev`
   - If any issues occur, restore the script using Git and document the dependency

2. Script removal sequence (from least likely to most likely to cause issues):
   - Step 1: Remove `convert-test-files.js` ✅
   - Step 2: Remove `test-duplicate-activity-handling.js` ✅
   - Step 3: Remove `clean-config.sh`
   - Step 4: Remove `extended-build.js`
   - Step 5: Remove `temp-data-migration.js`
   - Step 6: Further investigate `legacy-component-adapters/` directory

3. Final verification:
   - Run full test suite again: `npm test`
   - Perform type checking: `npm run type-check`
   - Run linting: `npm run lint`
   - Build the application: `npm run build`
   - Start the application: `npm run dev`
   - Verify core functionality manually

#### Debug Process
##### Step 1: Remove `convert-test-files.js`
- Removed script from `scripts/convert-test-files.js`
- Ran test suite: `npm test`
  - Result: ✅ All tests passed successfully
- Built application: `npm run build`
  - Result: ✅ Build completed without errors
- Started application: `npm run dev`
  - Result: ✅ Application started normally
- Conclusion: Script safely removed, no dependencies detected

##### Step 2: Remove `test-duplicate-activity-handling.js`
- Removed script from `scripts/test-duplicate-activity-handling.js`
- Ran test suite: `npm test`
  - Result: ✅ All tests passed successfully
- Built application: `npm run build`
  - Result: ✅ Build completed without errors
- Started application: `npm run dev`
  - Result: ✅ Application started normally
- Conclusion: Script safely removed, no dependencies detected

##### Step 3: Remove `clean-config.sh`
- Removed script from `scripts/clean-config.sh`
- Ran test suite: `npm test`
  - Result: ✅ All tests passed successfully
- Built application: `npm run build`
  - Result: ✅ Build completed without errors
- Started application: `npm run dev`
  - Result: ✅ Application started normally
- Conclusion: Script safely removed, no dependencies detected

##### Step 4: Remove `extended-build.js`
- Removed script from `scripts/extended-build.js`
- Ran test suite: `npm test`
  - Result: ✅ All tests passed successfully
- Built application: `npm run build`
  - Result: ✅ Build completed without errors
- Started application: `npm run dev`
  - Result: ✅ Application started normally
- Conclusion: Script safely removed, no dependencies detected

##### Step 5: Remove `temp-data-migration.js`
- Removed script from `scripts/utils/temp-data-migration.js`
- Ran test suite: `npm test`
  - Result: ✅ All tests passed successfully
- Built application: `npm run build`
  - Result: ✅ Build completed without errors
- Started application: `npm run dev`
  - Result: ✅ Application started normally
- Conclusion: Script safely removed, no dependencies detected

##### Step 6: Investigate and possibly remove legacy component adapters
- Performed code search for imports from 'legacy-component-adapters'
- Found no references to these components in the codebase
- Removed directory `src/components/legacy-component-adapters/`
- Ran test suite: `npm test`
  - Result: ✅ All tests passed successfully
- Built application: `npm run build`
  - Result: ✅ Build completed without errors
- Started application: `npm run dev`
  - Result: ✅ Application started normally
- Conclusion: Directory safely removed, no dependencies detected

#### Additional Cleanup Candidates for Future Consideration

During this cleanup process, several other files were identified as potential candidates for future pruning:

1. **`deprecated-utils/`**
   - Location: `/src/utils/deprecated-utils/`
   - Current status: Some utilities are still imported, but marked as deprecated in comments
   - Recommendation: Create gradual migration plan to replace with modern alternatives

2. **`beta-features/`**
   - Location: `/src/features/beta-features/`
   - Current status: Contains experimental features from previous development cycles
   - Recommendation: Evaluate which features should be promoted to production status and which should be removed

3. **`old-test-helpers.js`**
   - Location: `/test/helpers/old-test-helpers.js`
   - Current status: Appears to contain outdated test helper functions
   - Recommendation: Verify if any tests still depend on these helpers and plan migration

4. **Draft documentation files**
   - Location: `/docs/drafts/`
   - Current status: Contains incomplete documentation from previous features
   - Recommendation: Complete relevant documentation or remove outdated drafts

#### Plan for Addressing Additional Cleanup Candidates

##### Phase 1: Analysis and Documentation (To be executed by AI agent or developer)

1. **Create memory log entry**: 
   - Create a new memory log entry file named `MRTMLY-003-additional-cleanup-candidates.md`
   - Add reference to main memory log
   - Tag with `#maintenance` `#cleanup` `#code-quality`

2. **Deprecated Utils Analysis**:
   - Execute script to find all imports of deprecated utils:
     ```bash
     grep -r "from '.*deprecated-utils" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" src/
     ```
   - Document all files that import these utilities
   - For each utility:
     - Document its purpose
     - Identify modern equivalents in the codebase
     - Calculate usage frequency
   - Output analysis results to `/docs/analysis/deprecated-utils-usage.md`

3. **Beta Features Analysis**:
   - Execute script to find all imports/references to beta features:
     ```bash
     grep -r "from '.*beta-features" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" src/
     ```
   - Document all beta features and their current state
   - Check commit history for last modifications
   - Identify which features are:
     - Actively used in production
     - Used in testing/development only
     - Completely unused
   - Output analysis results to `/docs/analysis/beta-features-status.md`

4. **Test Helpers Analysis**:
   - Execute script to find all imports of old test helpers:
     ```bash
     grep -r "from '.*old-test-helpers" --include="*.test.js" --include="*.spec.js" --include="*.test.ts" --include="*.spec.ts" test/
     ```
   - Document all tests that rely on these helpers
   - Identify modern equivalents for each helper function
   - Output analysis results to `/docs/analysis/test-helpers-usage.md`

5. **Draft Documentation Analysis**:
   - List all files in `/docs/drafts/`
   - For each draft:
     - Check last modified date
     - Check if related features still exist in codebase
     - Determine if content is still relevant
   - Output analysis results to `/docs/analysis/draft-docs-status.md`

##### Phase 2: Migration Planning

1. **Deprecated Utils Migration Plan**:
   - Create detailed migration plan for each utility:
     - Define replacement utility or function
     - Provide code snippets for conversion
     - Estimate effort required (low/medium/high)
   - Define testing strategy for replacements
   - Define rollout strategy (all at once or incremental)
   - Output plan to `/docs/migration/deprecated-utils-migration-plan.md`

2. **Beta Features Decision Matrix**:
   - Create decision matrix for each beta feature:
     - Criteria: Usage, Completeness, Value, Maintenance cost
     - Actions: Promote to production / Keep as beta / Remove
   - Define testing requirements for promotion to production
   - Define user notification requirements for removals
   - Output plan to `/docs/migration/beta-features-decision-matrix.md`

3. **Test Helpers Migration Plan**:
   - Create detailed migration plan for test helpers:
     - Define replacement helper function
     - Provide code snippets for conversion
     - Create test update script template
   - Output plan to `/docs/migration/test-helpers-migration-plan.md`

4. **Documentation Plan**:
   - Create plan for each draft document:
     - Complete / Update / Remove
     - Define missing sections
     - Define reviewers
   - Output plan to `/docs/migration/documentation-completion-plan.md`

##### Phase 3: Execution Plan (Step-by-step instructions for AI agent)

1. **Deprecated Utils Migration Execution**:
   - For each utility in migration plan:
     - Create new tests for replacement utility
     - Replace import statements one file at a time
     - Update function calls to new signature
     - Run tests: `npm test`
     - Fix any failures before continuing
     - Commit changes with descriptive message
   - After all imports are updated:
     - Remove deprecated utils file/directory
     - Run final verification tests
     - Update documentation

2. **Beta Features Execution**:
   - For features to be promoted:
     - Remove beta designation
     - Move to appropriate production directory
     - Update imports
     - Update documentation
     - Run tests: `npm test`
   - For features to be removed:
     - Create backup if valuable code exists
     - Remove feature files
     - Remove related imports
     - Run tests: `npm test`
     - Update documentation

3. **Test Helpers Migration Execution**:
   - For each test helper:
     - Update imports in test files
     - Replace function calls to new signature
     - Run tests: `npm test`
     - Fix any failures before continuing
     - Commit changes with descriptive message
   - After all imports are updated:
     - Remove old test helpers file
     - Run final verification tests

4. **Documentation Execution**:
   - For each draft to complete:
     - Update content as per documentation plan
     - Move to appropriate documentation directory
     - Update links in main documentation
   - For each draft to remove:
     - Ensure no references exist in other documentation
     - Remove file
     - Update documentation index

##### Phase 4: Verification and Reporting

1. **Final Verification**:
   - Run full test suite: `npm test`
   - Run linting: `npm run lint`
   - Run type checking: `npm run type-check`
   - Build application: `npm run build`
   - Run manual verification of key functionality

2. **Reporting**:
   - Update memory log with results
   - Document any issues encountered
   - List all files removed/modified
   - Summarize improvements in code quality metrics
   - Update status to "Completed"

#### Resolution
All identified one-off scripts and superfluous code have been successfully removed from the codebase:

1. Removed `scripts/convert-test-files.js`
2. Removed `scripts/test-duplicate-activity-handling.js`
3. Removed `scripts/clean-config.sh`
4. Removed `scripts/extended-build.js`
5. Removed `scripts/utils/temp-data-migration.js`
6. Removed `src/components/legacy-component-adapters/` directory

The application continues to function correctly with all tests passing. This cleanup has:
- Reduced codebase size and complexity
- Removed potential sources of confusion for new developers
- Eliminated maintenance burden for obsolete code
- Improved the overall cleanliness and maintainability of the project

#### Lessons Learned
- Document scripts' purposes when creating them to facilitate future cleanup
- Consider moving one-off scripts to an archive directory rather than deleting them immediately
- Include script lifecycle information in documentation (whether it's ongoing or temporary)
- Add header comments to scripts explaining their purpose and whether they're intended for one-time use
- Create a convention for naming one-time scripts (e.g., prefixing with "once-")
- Schedule regular code cleanup sprints to prevent accumulation of obsolete files
- For complex one-off scripts, document the resolution of the issue they addressed in the Memory Log
