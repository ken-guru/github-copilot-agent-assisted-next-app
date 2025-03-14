# Known bugs

When adding a new activity, it instantly gets started, which also means the activity that was currently running is completed.

The list of activities in the summary aren't listed in the correct order, which should be the order they were done.

The timer at the top isn't updating properly when an activity is active.

The break element in the timeline isn't added until the next activity is started, instead we want the break to be shown immediately in the timeline just like a running activity is shown.

The idle time in the summary should reflect how much time has passed during breaks, meaning total time spent without any running activities after having started the first activity.

If the available duration set initially was input as a time instead of as seconds, minutes and hours, a break should immediately be inserted into the timeline, and the time should start running.