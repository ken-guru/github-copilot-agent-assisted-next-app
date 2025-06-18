# MRTMLY-200: GitHub Actions CI node_modules Caching Fix

**Date:** 2025-06-18  
**Tags:** #ci-cd #github-actions #debugging #node-modules #deployment  
**Status:** Resolved

## Initial State

GitHub Actions CI tests were failing with the error:
```
sh: 1: jest: not found
Process completed with exit code 127.
```

The workflow was attempting to cache `node_modules` across different jobs and restore them in subsequent jobs (test, lint, type-check, build). This approach was fundamentally flawed and causing the jest binary to be unavailable in the test job.

### Current Workflow Issues
- Install job runs `npm ci` and caches `node_modules`
- Other jobs depend on install job and try to restore cached `node_modules`
- Cache restoration was unreliable, leading to missing dependencies
- `node_modules` contains platform-specific binaries that don't transfer well across runner instances

## Implementation Process

GitHub Copilot provided an excellent analysis and suggestion to fix this CI/CD anti-pattern:

### Root Cause Analysis
1. **Platform Dependencies**: `node_modules` contains platform-specific binaries that may not work across different runner instances
2. **Cache Reliability**: The cache may not be available on first runs or may fail to restore properly  
3. **Silent Failures**: Cache restoration can fail silently, leaving jobs without dependencies

### Solution Approach
- Remove the problematic `node_modules` caching entirely
- Run `npm ci` in each job that needs dependencies
- Leverage the built-in npm cache provided by `setup-node` action (caches npm cache, not `node_modules`)
- Eliminate the separate "install" job since each job installs its own dependencies

### Implementation Steps
1. Removed the `install` job entirely
2. Removed all `node_modules` cache/restore steps
3. Added `npm ci` to each job (test, lint, type-check, build, cypress)
4. Removed `needs: install` dependencies since jobs can now run independently
5. Kept `cache: 'npm'` in `setup-node` action for npm cache optimization

## Resolution

Updated `.github/workflows/main.yml` to implement GitHub Copilot's recommended approach:

**Before (Problematic):**
```yaml
jobs:
  install:
    # Installs dependencies and caches node_modules
  test:
    needs: install
    # Restores node_modules cache
```

**After (Fixed):**
```yaml
jobs:
  test:
    steps:
      - uses: actions/setup-node@v4
        with:
          cache: 'npm'  # Caches npm cache, not node_modules
      - run: npm ci     # Fresh install in each job
```

### Benefits of New Approach
1. **Reliability**: Each job gets its own fresh, complete dependency installation
2. **Consistency**: No dependency on cache availability or cache hit/miss scenarios
3. **Performance**: `setup-node` npm cache still provides speed optimization
4. **Best Practice**: Standard CI/CD pattern used by most successful projects
5. **Parallelization**: Jobs can run independently without sequential dependency

## Lessons Learned

### CI/CD Best Practices
- **Never cache `node_modules`** across different runner instances in CI/CD
- Use npm cache (provided by `setup-node`) instead of `node_modules` cache
- Each job should be self-contained with its own dependency installation
- Prefer reliability over marginal performance gains in CI/CD

### GitHub Actions Patterns
- `cache: 'npm'` in `setup-node` is the correct caching strategy
- Dependencies on cache availability create fragile CI pipelines
- Simple, reliable patterns are better than complex optimization attempts

### Evaluation Process
- GitHub Copilot's analysis was spot-on and represented industry best practices
- The suggested solution was simpler, more reliable, and followed established patterns
- This fix eliminates a class of CI/CD failures related to dependency availability

### Future Considerations
- Monitor CI run times to ensure npm cache provides adequate performance
- This pattern scales well and remains reliable as the project grows
- No additional maintenance needed for cache key management
