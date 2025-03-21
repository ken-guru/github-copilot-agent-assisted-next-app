# Known Bugs

This document tracks known bugs in the application. Each bug is documented following a standard template to make it easier to convert these into GitHub issues.

## Bug Template
```markdown
### Bug Title
Clear, concise title describing the issue

#### Description
Detailed description of the bug

#### Current Behavior
What currently happens

#### Expected Behavior
What should happen instead

#### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

#### Impact
How this affects users/functionality

#### Related Components
- List of affected components
- Or functionality areas
```

## Current Bugs

### Incorrect Activity Order in Summary

#### Description
Activities in the summary view are not displayed in chronological order.

#### Current Behavior
Activities appear in an inconsistent order that doesn't match their execution sequence

#### Expected Behavior
Activities should be listed in chronological order based on their start times

#### Steps to Reproduce
1. Complete multiple activities in a specific order
2. Open the summary view
3. Observe that the order doesn't match the execution sequence

#### Impact
- Makes it difficult to track activity sequence
- Affects readability of activity history
- Could lead to confusion in time tracking

#### Related Components
- Summary component
- useActivitiesTracking

---

### Timer Display Update Issue

#### Description
Main timer display doesn't synchronize properly during active sessions

#### Current Behavior
Timer display doesn't refresh at regular intervals during activity execution

#### Expected Behavior
Timer should update smoothly and consistently at regular intervals

#### Steps to Reproduce
1. Start any activity
2. Observe the main timer display
3. Notice irregular or missing updates

#### Impact
- Affects user's ability to track time accurately
- Creates uncertainty about current session progress

#### Related Components
- TimeDisplay
- useTimeDisplay
- useTimerState

---

### Delayed Break Visualization

#### Description
Break periods in the timeline don't appear until the next activity starts

#### Current Behavior
Break visualization is delayed until a new activity begins

#### Expected Behavior
Breaks should appear in the timeline immediately when they begin

#### Steps to Reproduce
1. Complete an activity
2. Enter a break period
3. Observe that the break isn't shown in timeline
4. Start next activity
5. Notice break suddenly appears

#### Impact
- Creates visual inconsistency
- Makes it difficult to track current state
- Could lead to confusion about active breaks

#### Related Components
- Timeline
- useTimelineEntries
- timelineCalculations

---

### Inaccurate Idle Time Calculation

#### Description
Summary's idle time calculation doesn't properly account for break periods

#### Current Behavior
Idle time calculations show incorrect or inconsistent duration for breaks

#### Expected Behavior
Idle time should accurately reflect total duration of breaks after first activity

#### Steps to Reproduce
1. Complete several activities with breaks between them
2. Check summary view
3. Compare actual break durations with reported idle time

#### Impact
- Inaccurate reporting of unused time
- Affects time management decisions
- Could lead to incorrect scheduling

#### Related Components
- Summary
- timeUtils
- useActivitiesTracking

---

### Initial Time Input Edge Case

#### Description
System behaves incorrectly when setting initial duration using time format

#### Current Behavior
When using time format input (e.g., "14:00"):
1. No automatic break insertion
2. Timer doesn't start properly

#### Expected Behavior
Behavior should be consistent regardless of input method:
1. Breaks should be inserted automatically
2. Timer should start normally

#### Steps to Reproduce
1. Start new session
2. Input duration using time format (e.g., "14:00")
3. Observe missing break and timer issues

#### Impact
- Inconsistent user experience
- Affects initial session setup
- Could lead to confusion about available time

#### Related Components
- TimeSetup
- useTimerState
- timeUtils