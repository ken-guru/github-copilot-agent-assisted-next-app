'use client';

import { useState } from 'react';
import TimeSetup from '@/components/TimeSetup';
import ActivityManager, { Activity } from '@/components/ActivityManager';
import Timeline from '@/components/Timeline';
import Summary from '@/components/Summary';
import { useActivityState } from '@/hooks/useActivityState';
import { useTimerState } from '@/hooks/useTimerState';
import styles from './page.module.css';

export default function Home() {
  const [timeSet, setTimeSet] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);

  const {
    currentActivity,
    timelineEntries,
    completedActivityIds,
    allActivitiesCompleted,
    handleActivitySelect,
    handleActivityRemoval,
    checkActivitiesCompleted
  } = useActivityState({
    onTimerStart: () => {
      if (!timerActive) startTimer();
    }
  });

  const {
    elapsedTime,
    isTimeUp,
    timerActive,
    startTimer
  } = useTimerState({
    totalDuration,
    isCompleted: allActivitiesCompleted
  });

  // Handle initial time setup
  const handleTimeSet = (durationInSeconds: number) => {
    setTotalDuration(durationInSeconds);
    setTimeSet(true);
  };

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
                  onActivityRemove={handleActivityRemoval}
                  currentActivityId={currentActivity?.id || null} 
                  completedActivityIds={completedActivityIds}
                  isTimeUp={isTimeUp}
                />
              </div>
              <div>
                <Timeline 
                  entries={timelineEntries} 
                  totalDuration={totalDuration} 
                  elapsedTime={elapsedTime}
                  allActivitiesCompleted={allActivitiesCompleted}
                  timerActive={timerActive}
                />
                {allActivitiesCompleted && (
                  <div className={styles.summaryContainer}>
                    <Summary 
                      entries={timelineEntries} 
                      totalDuration={totalDuration} 
                      elapsedTime={elapsedTime}
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
