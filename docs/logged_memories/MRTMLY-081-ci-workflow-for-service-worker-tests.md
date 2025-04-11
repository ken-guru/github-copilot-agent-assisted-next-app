### Issue: Service Worker Tests Need Special Handling in CI Workflow
**Date:** 2025-04-14
**Tags:** #ci #testing #service-worker #workflow #deployment
**Status:** Resolved

#### Initial State
- Service worker tests are now isolated from the main test suite due to environment conflicts
- A dedicated `test:sw` script runs service worker tests with a specialized configuration
- The main `test` script only runs the regular tests, excluding service worker tests
- GitHub CI workflow was missing the service worker tests since they're excluded from the main test run

#### Debug Process
1. CI pipeline analysis
   - Examined the current GitHub workflow configuration
   - Verified how tests are triggered in the CI environment
   - Discovered that the main `test` script is called in the workflow, which now excludes service worker tests
   - Identified the need for a comprehensive test command that runs both regular and service worker tests

2. Options evaluation
   - Considered modifying GitHub workflow files directly (requires more maintenance)
   - Considered adding a new npm script that runs all tests (more portable solution)
   - Evaluated parallelization options vs. sequential runs
   - Determined a sequential run is more reliable for our current needs

3. Implementation plan
   - Create a new npm script specifically for CI environments
   - Ensure it runs both main tests and service worker tests
   - Keep it simple by running them sequentially
   - Document the new command for team knowledge
   - Update GitHub workflow to use the new command

#### Resolution
- Added a new `test:ci` script to package.json:
  ```json
  "test:ci": "npm test && npm run test:sw"
  ```
  
- This script:
  - Runs the main test suite first (excluding service worker tests)
  - Then runs the service worker tests with their specialized configuration
  - Works sequentially to ensure cleaner logs and better error reporting
  - Returns a non-zero exit code if either test run fails, preserving CI safety

- Updated CI workflow configuration:
  - Modified GitHub Actions workflow file to use the new command
  - Changed `run: npm test` to `run: npm run test:ci` in the test job
  - Updated job name to "Run all tests" for clarity

- Update process:
  1. Added the new `test:ci` script to package.json
  2. Updated GitHub Actions workflow file with the new command
  3. Documented the usage in the memory log
  4. Notified the team about the new CI workflow command

#### Lessons Learned
- CI workflows need to be updated when test strategies change
- It's better to create specialized npm scripts for CI than to modify workflow files directly
- Sequential execution of test suites is cleaner for diagnostics but less efficient
- Using npm script composition (running multiple scripts in sequence) is a simple but effective pattern
- When tests require different environments, it's important to ensure all environments are tested in CI
- A clear naming convention helps developers understand the purpose of each test command
- Updating both the npm scripts and the CI workflow ensures consistent behavior across environments
