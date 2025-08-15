### Issue: Activity Timer Badge Restoration During Session Recovery Bug Fix
**Date:** 2025-01-15
**Tags:** #debugging #session-restoration #timer-badge #activity-manager #ui-synchronization
**Status:** Resolved

#### Initial State
User reported that during session recovery:
- Timeline timer correctly restored ✓
- Timeline duration correctly restored ✓
- Timeline colors correctly restored ✓ (just fixed in previous session)
- **NEW BUG**: Activity manager timer badge shows 0:00 instead of actual elapsed time

The timer badge on the activity button was resetting to zero during session restoration instead of showing the actual time spent on the running activity.

#### Debug Process

1. **Activity Button Analysis**
   - Examined ActivityButton component: Uses `elapsedTime` prop to display timer badge
   - Timer badge only shows when `isRunning` is true (correct behavior)
   - Badge uses `formatTime(elapsedTime)` for display - function works correctly

2. **Activity Manager Investigation**
   - ActivityManager passes `elapsedTime` prop to all ActivityButton components
   - The `elapsedTime` comes from the main page component via useTimerState hook
   - During session restoration, elapsedTime should be restored to correct value

3. **Timer State Hook Analysis**
   - Found root cause in `useTimerState.ts`:
   ```typescript
   const [elapsedTime, setElapsedTime] = useState(initialElapsedTime);
   ```
   - React's `useState` only uses initial value during **first render**
   - When `initialElapsedTime` prop changes during session restoration, state doesn't update!

4. **Race Condition Discovery**
   - Session restoration sequence:
     1. `setRestoredElapsedTime(sessionData.elapsedTime)` (120 seconds)
     2. `setShouldRestartTimer(true)`
     3. useTimerState receives new props
     4. Auto-start effect triggers timer start
     5. But `elapsedTime` state still has old value (0) in `startTimer` callback!

5. **Test Verification**
   - Created comprehensive session restoration tests
   - Test confirmed: Expected 130 (120 restored + 10 elapsed), Actual 10
   - Proved that timer was starting from 0 instead of restored 120 seconds

#### Implementation

**Primary Fix: State Synchronization**
```typescript
// Update elapsed time when initialElapsedTime changes (for session restoration)
useEffect(() => {
  if (!timerActive) {
    setElapsedTime(initialElapsedTime);
  }
}, [initialElapsedTime, timerActive]);
```

**Secondary Fix: Auto-Start Timing**
```typescript
// Effect to auto-start timer if requested (for session restoration)
// This runs after elapsedTime has been updated to ensure proper timer calculation
useEffect(() => {
  if (shouldAutoStart && !timerActive && !isCompleted && elapsedTime === initialElapsedTime) {
    startTimer();
  }
}, [shouldAutoStart, timerActive, isCompleted, startTimer, elapsedTime, initialElapsedTime]);
```

**Key Changes:**
- Added useEffect to sync `elapsedTime` state with `initialElapsedTime` prop changes
- Modified auto-start effect to wait until elapsedTime syncs with initialElapsedTime
- Prevents race condition between state update and timer start
- Only updates when timer is not active (prevents interference with running timer)

#### Testing Strategy

**New Test Suite: `useTimerState.sessionRestoration.test.tsx`**
1. **Session Recovery Test**: Verifies elapsed time restores correctly and timer continues from right point
2. **Active Timer Protection**: Ensures elapsed time doesn't update when timer is already running
3. **Multiple Restoration Attempts**: Handles repeated session restoration scenarios
4. **Timer Progression Validation**: Confirms timer calculation works correctly after restoration

**Results:**
- All 4 new session restoration tests pass ✅
- All 16 existing timer state tests continue to pass ✅
- Total: 20 timer state tests all passing ✅

#### Resolution

**What Was Fixed:**
- Activity timer badge now shows correct elapsed time during session recovery
- Eliminates race condition between prop updates and timer state
- Maintains backward compatibility with existing timer functionality
- Proper session restoration timing and sequencing

**Session Restoration System Now Complete:**
- ✅ Timeline timer restoration (maintains visual countdown)
- ✅ Activity UI state synchronization (running/completed states)  
- ✅ Timeline color preservation (proper activity colors)
- ✅ Activity timer badge restoration (shows actual elapsed time)

#### Lessons Learned

1. **React useState Behavior**: Initial values are only used on first render - prop changes don't automatically update state
2. **Race Conditions in Effects**: Multiple useEffect hooks can run simultaneously, requiring careful dependency management
3. **Session Restoration Complexity**: Complete state restoration requires synchronization across multiple state layers
4. **Testing Race Conditions**: Comprehensive tests help identify timing-sensitive bugs that might not appear in normal usage
5. **Effect Dependency Design**: Careful effect dependencies ensure proper execution order during complex state updates

#### MCP Tool Usage

- **Sequential Thinking**: Systematic problem breakdown from UI symptom to root cause identification
- **File Operations**: Examined ActivityButton, ActivityManager, and useTimerState for data flow analysis
- **Terminal Operations**: Ran targeted tests to verify fix, then full test suite for regression testing
- **Code Analysis**: Deep dive into React useState behavior and useEffect timing to understand race condition

#### Technical Impact

- Completes comprehensive session restoration functionality
- Eliminates visual inconsistency between timeline and activity manager during recovery
- Provides robust timer state management for complex React component hierarchies
- Establishes pattern for handling prop-to-state synchronization in session restoration scenarios

#### Related Work

- Builds on previous timeline timer restoration fix (MRTMLY-276)
- Complements activity UI state synchronization improvements
- Works with timeline color restoration fix (MRTMLY-278)
- Finalizes the complete session persistence and auto-recovery system (Issue #325)
