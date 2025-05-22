### Issue: CodeQL Configuration Not Found Error
**Date:** 2023-06-16
**Tags:** #security #codeql #github-actions #troubleshooting
**Status:** Resolved

#### Initial State
- GitHub Actions showed an error after setting up CodeQL:
  "Warning: Code scanning cannot determine the alerts introduced by this pull request, because 2 configurations present on refs/heads/main were not found"
- Specifically mentioned missing configurations:
  - /language:actions
  - /language:javascript-typescript
- First-time setup issue with CodeQL not having baseline analysis

#### Debug Process
1. Analyzed the error message
   - Determined GitHub was looking for default configurations
   - Identified that our custom setup didn't match expected configuration paths

2. Solution approach
   - Modified the workflow file to use the expected category paths
   - Simplified language matrix to just use 'javascript' (which includes TypeScript)
   - Added explicit category parameter to the analyze action
   - Added proper permissions for the sarif upload

#### Resolution
- Updated the CodeQL workflow configuration
- Explicitly specified the category path to match what GitHub expects
- Simplified the language configuration to avoid duplication
- Added proper upload parameter

#### Lessons Learned
- When setting up custom CodeQL configurations, GitHub expects specific category paths
- The first run always shows a warning because there's no baseline to compare against
- It's better to use the combined 'javascript' language option than separate 'javascript' and 'typescript'
- Category paths should follow the format "/language:[language]" to match GitHub's expectations
