### Issue: CodeQL Configuration Path Mismatch Debugging Session
**Date:** 2025-06-02
**Tags:** #debugging #codeql #security #configuration
**Status:** Resolved

#### Initial State
- Code scanning produces error: "1 configuration not found"
- Warning message: "Code scanning cannot determine the alerts introduced by this pull request, because 1 configuration present on refs/heads/main was not found"
- CodeQL workflow is configured but failing to compare results between branches

#### Debug Process
1. Configuration file investigation
   - Examined `.github/workflows/codeql-analysis.yml`
   - Found reference to config file at `./.github/codeql/codeql-config.yml`
   - Verified config file exists at the specified location

2. Custom queries path analysis
   - Config file expects custom queries at `./.github/codeql/custom-queries`
   - Found actual custom queries at root in `codeql-custom-queries-javascript/`
   - Identified path mismatch as the root cause

#### Resolution
Created a solution with two possible approaches:

1. Move custom queries to the expected location:
   ```bash
   mkdir -p .github/codeql/custom-queries
   mv codeql-custom-queries-javascript/* .github/codeql/custom-queries/
   ```

2. Update config to point to the existing location:
   ```yaml
   # In .github/codeql/codeql-config.yml
   queries:
     - name: Custom Queries
       uses: ./codeql-custom-queries-javascript
   ```

#### Lessons Learned
- GitHub CodeQL requires precise path alignment between workflow file, config file, and actual directory structure
- Path references in CodeQL configs are relative to the repository root
- When troubleshooting code scanning issues, always verify the entire configuration chain
- Document code scanning setup carefully to prevent similar issues in future PRs