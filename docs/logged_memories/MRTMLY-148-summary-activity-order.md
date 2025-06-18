### Issue: MRTMLY-019: Summary Activity Order Fix
**Date:** 2025-03-15
**Tags:** #bug-fix #summary #chronological-order #testing
**Status:** Resolved

#### Initial State
- Summary component displaying activities in incorrect order
- Expected: Chronological order by start time
- Actual: Random or insertion order
- Users confused by inconsistent display of activity history

#### Debug Process
1. Investigated activity data flow
   - Found activities being passed to Summary without sorting
   - Identified source of activities in useActivitiesTracking hook
   - Determined sort operation was missing before rendering

2. Solution attempts
   - Added sort in Summary component render
     - Implemented sort by startTime before mapping activities
     - Outcome: Worked but sorting logic duplicated elsewhere in app
     - Issue: Violates DRY principle, potential for inconsistent sorting

   - Moved sorting to useActivitiesTracking hook
     - Ensured activities always returned pre-sorted
     - Outcome: Better but caused test failures
     - Why: Tests expected original ordering for specific scenarios

   - Modified useActivitiesTracking with sort parameter
     - Added optional parameter to control sorting behavior
     - Updated Summary to explicitly request chronological sort
     - Outcome: Successful, with tests passing

#### Resolution
- Final solution implemented:
  - Enhanced useActivitiesTracking with sort options
  - Default is chronological for UI display
  - Tests updated to explicitly set sorting expectations
  - Added test cases for different sort orders
- All components now display consistent activity ordering

#### Lessons Learned
- Key insights:
  - Data sorting should be handled consistently at the source
  - UI components should not need to implement sorting logic
  - Test expectations should be explicit about data ordering
- Future considerations:
  - Consider implementing more sort options (by duration, by type)
  - Create a standardized sorting utility for all timeline data
  - Add user preference for default sort order