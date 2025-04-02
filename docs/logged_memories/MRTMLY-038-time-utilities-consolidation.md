### Issue: MRTMLY-038: Time Utilities Consolidation
**Date:** 2023-07-01
**Tags:** #refactoring #utilities #time #circular-reference
**Status:** Resolved

#### Initial State
- Two duplicate implementations of time-related utilities with overlapping functionality:
  - `/src/utils/timeUtils.ts` - Contains a `formatTime` function that formats seconds to "MM:SS" format
  - `/src/utils/testUtils/timeUtils.ts` - Contains a different `formatTime` that formats to "HH:MM:SS" format
- This duplication created confusion for developers and potential maintenance issues

#### Debug Process
1. Investigated circular reference issues
   - Found that renaming the imported formatTime from main utils prevented conflicts
   - Resolved maximum call stack size exceeded errors
   - Used import aliasing to maintain clear code structure

2. Consolidated time utility functions
   - Created a unified formatTime function with options parameter
   - Added support for both MM:SS and HH:MM:SS formats
   - Implemented consistent handling of negative values and zero
   - Added thorough JSDoc documentation with examples

3. Fixed padding inconsistencies
   - Discovered tests expected seconds to always be padded with zeros
   - Modified formatTime to handle padWithZeros option correctly
   - Ensured seconds are always padded regardless of padWithZeros setting for minutes/hours

#### Resolution
- Final solution implemented:
  - Unified time utility module with configurable formatting options
  - Clear distinction between production and test-specific utilities
  - Comprehensive test coverage for all time utility functions
  - Backward compatibility maintained through deprecated exports
  - Fixed circular reference and stack overflow issues

#### Lessons Learned
- Circular references can cause runtime stack overflow errors that might not be caught by TypeScript
- When refactoring utility functions, carefully consider how they're used across the codebase
- Including comprehensive test coverage helps catch inconsistencies in behavior
- Keeping backward compatibility reduces the risk during refactoring
- Using options objects makes utilities more flexible and future-proof

#### Guidelines for Future Time Utility Functions
1. Use options objects for flexible configuration instead of multiple similar functions
2. Include thorough JSDoc documentation with examples for each format option
3. Consider backward compatibility when modifying existing functions
4. Add explicit tests for each behavior variation and edge case
5. Prefer a single source of truth for related functionality
