'use client';

import { useEffect, useState, useRef } from 'react';
import TimeSetup from '@/components/TimeSetup';
import ActivityManager, { Activity } from '@/components/ActivityManager';
import Timeline, { TimelineEntry } from '@/components/Timeline';
import Summary from '@/components/Summary';
import styles from './page.module.css';

export default function Home() {
  const [timeSet, setTimeSet] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0); // in seconds
  const [startTime, setStartTime] = useState<number | null>(null); // When the timer actually started
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [allActivitiesCompleted, setAllActivitiesCompleted] = useState(false);
  const [activities, setActivities] = useState<Set<string>>(new Set()); // IDs of activities that have been started
  const [timerStopped, setTimerStopped] = useState(false);
  const finalElapsedTimeRef = useRef(0);
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>([]);
  const [timerActive, setTimerActive] = useState(false); // New state to track if timer is active

  // Handle timer to update elapsed time - only run when timerActive is true
  useEffect(() => {
    if (!timeSet || !startTime || timerStopped || !timerActive) return;

    const timer = setInterval(() => {
      const now = Date.now();
      setElapsedTime(Math.floor((now - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeSet, startTime, timerStopped, timerActive]);

  // Handle setting the initial time - now just stores duration, doesn't start timer
  const handleTimeSet = (durationInSeconds: number) => {
    setTotalDuration(durationInSeconds);
    setTimeSet(true);
    setTimerStopped(false);
    // Don't set startTime yet - this will happen when first activity starts
    setElapsedTime(0); // Reset elapsed time
    setTimerActive(false); // Ensure timer isn't active yet
  };

  // Handle selecting a new activity
  const handleActivitySelect = (activity: Activity | null) => {
    // End the current activity if there is one
    if (timelineEntries.length > 0) {
      const lastEntry = timelineEntries[timelineEntries.length - 1];
      if (!lastEntry.endTime) {
        const updatedEntries = [...timelineEntries];
        updatedEntries[timelineEntries.length - 1] = {
          ...lastEntry,
          endTime: Date.now()
        };
        setTimelineEntries(updatedEntries);

        // Mark the activity as completed when it ends
        if (lastEntry.activityId) {
          setCompletedActivityIds(prev => [...prev, lastEntry.activityId!]);
        }
      }
    }

    setCurrentActivity(activity);

    // Start timer if this is the first activity and timer isn't active yet
    if (activity && !timerActive) {
      setStartTime(Date.now());
      setTimerActive(true);
    }

    // Add the new activity to the timeline
    const newEntry: TimelineEntry = {
      id: Date.now().toString(),
      activityId: activity ? activity.id : null,
      activityName: activity ? activity.name : null,
      startTime: Date.now(),
      endTime: null
    };

    setTimelineEntries(prev => [...prev, newEntry]);

    // Track this activity as started
    if (activity) {
      setActivities(prev => new Set(prev).add(activity.id));
    }
  };

  // Check if all default activities have been completed
  const checkAllActivitiesCompleted = () => {
    // This is a simplified check - in a real app you might have a more sophisticated way
    // to determine if all required activities are complete
    if (activities.size >= 4 && !currentActivity) {
      setAllActivitiesCompleted(true);
      // Stop the timer when all activities are completed
      if (!timerStopped) {
        setTimerStopped(true);
        finalElapsedTimeRef.current = elapsedTime;
      }
    }
  };

  // Check completion status when activities or current activity changes
  useEffect(() => {
    checkAllActivitiesCompleted();
  }, [activities, currentActivity]);

  // Use the fixed elapsed time for the summary when timer is stopped
  const displayedElapsedTime = timerStopped ? finalElapsedTimeRef.current : elapsedTime;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Kid's Activity Timer</h1>
          <p className={styles.subtitle}>Track activities and manage your time!</p>
        </header>

        <div className={styles.grid}>
          {!timeSet ? (
            <div className={styles.fullWidth}>
              <TimeSetup onTimeSet={handleTimeSet} />
            </div>
          ) : (
            <>
              <div>
                <ActivityManager 
                  onActivitySelect={handleActivitySelect} 
                  currentActivityId={currentActivity?.id || null} 
                  completedActivityIds={completedActivityIds}
                />
              </div>
              <div>
                <Timeline 
                  entries={timelineEntries} 
                  totalDuration={totalDuration} 
                  elapsedTime={displayedElapsedTime} 
                />
                {allActivitiesCompleted && (
                  <div className={styles.summaryContainer}>
                    <Summary 
                      entries={timelineEntries} 
                      totalDuration={totalDuration} 
                      elapsedTime={displayedElapsedTime} 
                      allActivitiesCompleted={allActivitiesCompleted} 
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
