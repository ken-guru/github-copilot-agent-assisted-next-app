### Issue: GitHub Actions Workflow Cypress Videos Upload Debugging Session
**Date:** 2023-11-10
**Tags:** #debugging #github-actions #cypress #artifacts
**Status:** Resolved

#### Initial State
- GitHub Actions workflow attempting to upload Cypress videos as artifacts
- Warning message: "No files were found with the provided path: cypress/videos. No artifacts will be uploaded."
- Current implementation in main.yml was trying to upload videos unconditionally

#### Debug Process
1. First investigation step
   - Examined the GitHub Actions workflow file
   - Found that the workflow is trying to upload Cypress videos without checking if they exist
   - Cypress doesn't always generate videos, especially if tests pass without issues

2. Solution attempts
   - Considered using a conditional step that depends on the existence of the videos directory
   - Researched GitHub Actions syntax for conditional artifact uploads
   - Found that we can use the `if` condition with `hashFiles` function to check for the presence of files

#### Resolution
- Modified the GitHub Actions workflow to check if files exist in the cypress/videos directory before attempting upload
- Used the `hashFiles` function in the `if` condition: `if: always() && hashFiles('cypress/videos/**') != ''`
- This ensures the step only runs when the videos directory contains files
- Maintained the `always()` condition to ensure videos are uploaded even if tests fail

#### Lessons Learned
- GitHub Actions steps should check for the existence of files before attempting to upload them as artifacts
- The `hashFiles` function is useful for conditionally executing steps based on file existence
- It's important to handle optional artifacts in CI/CD pipelines to avoid misleading warnings
