# Known bugs

## Activity Auto-Start Issue
When adding a new activity to the list, the system automatically starts it without user confirmation. This has two unintended consequences:
1. The new activity begins running immediately upon creation
2. If there was already an activity in progress, it gets marked as completed without user intention
This behavior removes user control over when activities should start and end.

## Incorrect Activity Order in Summary
The summary view displays activities in an incorrect sequence. Activities should be listed in chronological order (the order in which they were performed), but currently, they appear in a different order. This makes it difficult to track the actual sequence of completed activities.

## Timer Display Update Issue
The main timer display at the top of the application isn't properly synchronizing when an activity is in progress. This appears to be a UI update issue where the timer doesn't refresh at regular intervals as expected during active sessions.

## Delayed Break Visualization
The timeline's break element visualization has a timing issue. Currently, breaks only appear in the timeline when the next activity starts, rather than appearing immediately when a break begins. This creates a disconnect between the actual state of activities and their visual representation. The break should be visible in real-time, similar to how running activities are shown.

## Inaccurate Idle Time Calculation
The summary's idle time calculation isn't correctly reflecting break periods. Idle time should represent the total duration of breaks (time periods without any running activities) after the first activity has started. Currently, this calculation appears to be incorrect or inconsistent.

## Initial Time Input Edge Case
There's a specific behavior issue when setting up the initial available duration. When users input the duration as a time (e.g., "14:00") instead of using the hours/minutes/seconds fields, two issues occur:
1. The system doesn't automatically insert a break into the timeline
2. The timer doesn't start running as expected
This creates inconsistency between different methods of time input.