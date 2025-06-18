### Issue: MRTMLY-020: Timeline Component Countdown Timer Fix
**Date:** 2025-03-15
**Tags:** #debugging #timer #useEffect #cleanup
**Status:** Resolved

#### Initial State
- Timeline countdown timer showing incorrect values
- Timer not updating consistently
- Memory leaks related to timer implementation
- Console errors about setState on unmounted component

#### Debug Process
1. Investigated timer implementation
   - Found timer logic using both setInterval and setTimeout
   - Identified cleanup issues in useEffect hooks
   - Determined race conditions in timer updates

2. Solution attempts
   - Consolidated timer implementation
     - Standardized on setInterval approach
     - Added proper cleanup in useEffect
     - Outcome: Improved but still occasional issues
     - Issue: Timer drift occurring over longer durations

   - Addressed timer drift
     - Implemented reference time comparison
     - Added drift compensation
     - Outcome: Better timing accuracy but still cleanup issues
     - Why: Multiple timer instances still being created

   - Comprehensive timer refactoring
     - Created centralized timer hook with proper lifecycle
     - Implemented complete cleanup for all timers
     - Added unmount detection to prevent state updates
     - Created time synchronization mechanism
     - Outcome: Successfully resolved all timer issues

#### Resolution
- Final solution implemented:
  - Custom useTimer hook with proper lifecycle management
  - Centralized time calculation for consistency
  - Complete cleanup handling for all timer intervals
  - Drift compensation for long-running timers
  - Proper unmount detection
- Timeline timer now accurate with no memory leaks

#### Lessons Learned
- Key insights:
  - Timer logic should be centralized in custom hooks
  - Cleanup functions must handle all timer instances
  - Time calculations need reference point for drift prevention
- Future considerations:
  - Create standardized timer library for the application
  - Consider worker-based timers for background tabs
  - Implement more sophisticated time synchronization