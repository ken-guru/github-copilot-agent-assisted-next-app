# ESLint 10 Upgrade Note

## Issue
Dependabot attempted to upgrade ESLint from 9.39.2 to 10.0.0, but this upgrade cannot be completed at this time.

## Root Cause
ESLint 10 was just released (February 2026), but the `typescript-eslint` package (used by `eslint-config-next`) only supports ESLint `^8.57.0 || ^9.0.0`. It does not yet support ESLint 10.

## Resolution
- **Reverted ESLint to version 9.39.2** (latest 9.x release)
- This ensures compatibility with `typescript-eslint` v8.x and `eslint-config-next`
- All checks pass: linting ✓, type-checking ✓, tests ✓

## When Can We Upgrade?
Monitor the `typescript-eslint` project for ESLint 10 support:
- **Current**: typescript-eslint v8.x supports ESLint ^8.57.0 || ^9.0.0
- **Future**: typescript-eslint v9.x is expected to add ESLint 10 support
- Track progress: https://github.com/typescript-eslint/typescript-eslint/issues

## Other Updates in This PR
While addressing the ESLint issue, the following dependencies were also updated to their latest versions:
- `@types/node`: 25.2.1 → 25.2.3
- `@types/react`: 19.2.13 → 19.2.14  
- `cypress`: 15.9.0 → 15.10.0

## Recommendation
- Keep ESLint at 9.x for now
- Monitor typescript-eslint releases
- Upgrade to ESLint 10 once typescript-eslint v9.x is released with official support
