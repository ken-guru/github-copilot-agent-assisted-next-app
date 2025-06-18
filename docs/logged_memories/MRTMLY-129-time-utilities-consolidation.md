### Issue: MRTMLY-032: Time Utilities Consolidation
**Date:** 2023-07-01
**Tags:** #refactoring #utilities #time #circular-reference
**Status:** Resolved

#### Initial State
- Two duplicate implementations of time-related utilities with overlapping functionality:
  - `/src/utils/timeUtils.ts` - Contains a `formatTime` function that formats seconds to "MM:SS" format
  - `/src/utils/testUtils/timeUtils.ts` - Contains a different `formatTime` that formats to "HH:MM:SS" format
- This duplication created confusion for developers and potential maintenance issues

#### Implementation
1. Created a unified flexible `formatTime` function with options
   - Added TimeFormatOptions interface with includeHours and padWithZeros options
   - Implemented both MM:SS and HH:MM:SS formatting in a single function
   - Added proper JSDoc documentation with examples

2. Fixed circular reference issues
   - Renamed imported formatTime to mainFormatTime in testUtils
   - Updated test utilities to use the main implementation
   - Added appropriate deprecation notices
   - Fixed the formatTimeFromMs function to always include hours in testUtils

3. Fixed padding inconsistencies
   - Ensured seconds are always padded with zeros for consistency
   - Modified formatTime to handle padWithZeros option correctly while keeping seconds padded

#### Lessons Learned
- Circular references can cause runtime stack overflow errors that might not be caught by TypeScript
- When refactoring utility functions, carefully consider how they're used across the codebase
- Including comprehensive test coverage helps catch inconsistencies in behavior
- Keeping backward compatibility reduces the risk during refactoring
- Using options objects makes utilities more flexible and future-proof
