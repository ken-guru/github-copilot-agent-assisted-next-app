### Issue: MRTMLY-054: Duplicate Activity Addition Error
**Date:** 2025-04-10
**Tags:** #debugging #activities #state-machine #error-handling
**Status:** Resolved

#### Initial State
- Error messages appearing in browser console: `Failed to add activity X: Activity with ID X already exists`
- Multiple error messages for activities with IDs 1-4 (default activities)
- Errors occur during application initialization or when activities are added

#### Debug Process
1. Initial investigation of error messages
   - Found errors originating from ActivityStateMachine.addActivity method
   - Error occurs when attempting to add activities with IDs that already exist
   - Default activities in ActivityManager use hardcoded IDs ('1', '2', '3', '4')

2. Analysis of the initialization flow
   - Found that ActivityManager initializes default activities on mount
   - These activities are passed to onActivitySelect with justAdd=true flag
   - The hook then attempts to add these activities to the state machine
   - On subsequent render cycles, this initialization happens multiple times

3. Solution approaches considered:
   - Option 1: Add initialization flag in ActivityManager to prevent multiple initializations
   - Option 2: Modify addActivity method in useActivitiesTracking to handle duplicates gracefully
   - Option 3: Change default activity IDs to be dynamic

4. Solution implementation
   - Updated useActivitiesTracking.addActivity to silently handle duplicate activities
   - Modified error handling to avoid showing warnings in production
   - Preserved error throwing for test environments to maintain test integrity

#### Resolution
- Modified useActivitiesTracking hook to gracefully handle duplicate activity additions
- Eliminated console error messages while maintaining expected behavior
- Preserved state machine integrity with proper validation

#### Lessons Learned
- Error handling should be context-aware (development vs production)
- State machine integrity should be maintained while providing a good developer experience
- When using predefined IDs, duplicate handling logic is important
- Component mount/initialization cycles need careful handling to prevent duplicate operations
