import { useState, useEffect } from 'react';
import { getNextAvailableColorSet, ColorSet } from '../utils/colors';
import { TimelineEntry } from '@/types';
import { ActivityButton } from './ActivityButton';
import ActivityForm from './ActivityForm';
import styles from './ActivityManager.module.css';

export interface Activity {
  id: string;
  name: string;
  completed?: boolean;
  colors?: ColorSet;
  colorIndex?: number;
}

interface ActivityManagerProps {
  onActivitySelect: (activity: Activity | null, justAdd?: boolean) => void;
  onActivityRemove?: (activityId: string) => void;
  currentActivityId: string | null;
  completedActivityIds: string[];
  timelineEntries: TimelineEntry[];
  isTimeUp?: boolean;
  elapsedTime?: number;
}

export default function ActivityManager({ 
  onActivitySelect, 
  onActivityRemove,
  currentActivityId, 
  completedActivityIds,
  timelineEntries,
  isTimeUp = false,
  elapsedTime = 0
}: ActivityManagerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [assignedColorIndices, setAssignedColorIndices] = useState<number[]>([]);
  const [hasInitializedActivities, setHasInitializedActivities] = useState(false);
  
  const getNextColorIndex = (): number => {
    let index = 0;
    while (assignedColorIndices.includes(index)) {
      index++;
    }
    return index;
  };

  useEffect(() => {
    const defaultActivities = [
      { id: '1', name: 'Homework', colorIndex: 0 },
      { id: '2', name: 'Reading', colorIndex: 1 },
      { id: '3', name: 'Play Time', colorIndex: 2 },
      { id: '4', name: 'Chores', colorIndex: 3 }
    ];

    if (!hasInitializedActivities) {
      setAssignedColorIndices(defaultActivities.map(a => a.colorIndex));
      
      // Add activities to the state machine in pending state
      defaultActivities.forEach(activity => {
        const activityWithColors = {
          ...activity,
          colors: getNextAvailableColorSet(activity.colorIndex || 0)
        };
        // Pass true as second argument to just add the activity without starting it
        onActivitySelect(activityWithColors, true);
      });
      
      setActivities(defaultActivities);
      setHasInitializedActivities(true);
    }
  }, [hasInitializedActivities, onActivitySelect]);
  
  useEffect(() => {
    setActivities(currentActivities => 
      currentActivities.map(activity => ({
        ...activity,
        colors: getNextAvailableColorSet(activity.colorIndex || 0)
      }))
    );
  }, []);

  // Listen for theme changes
  useEffect(() => {
    const updateColors = () => {
      setActivities(currentActivities => 
        currentActivities.map(activity => ({
          ...activity,
          colors: getNextAvailableColorSet(activity.colorIndex)
        }))
      );
    };

    // Update colors when theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateColors);

    // Update colors when manually switching themes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateColors();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      mediaQuery.removeEventListener('change', updateColors);
      observer.disconnect();
    };
  }, []);

  const handleAddActivity = (activityName: string) => {
    const nextColorIndex = getNextColorIndex();
    
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: activityName,
      colorIndex: nextColorIndex,
      colors: getNextAvailableColorSet(nextColorIndex)
    };
    
    setAssignedColorIndices([...assignedColorIndices, nextColorIndex]);
    setActivities([...activities, newActivity]);
    // Pass true as second argument to just add the activity without starting it
    onActivitySelect(newActivity, true);
  };

  const handleActivitySelect = (activity: Activity) => {
    if (activity.id === currentActivityId) {
      onActivitySelect(null);
    } else {
      onActivitySelect({
        ...activity,
        colors: activity.colors || getNextAvailableColorSet(activity.colorIndex || 0)
      });
    }
  };

  const handleRemoveActivity = (id: string) => {
    if (id === currentActivityId) {
      onActivitySelect(null);
    }
    
    const activity = activities.find(a => a.id === id);
    if (activity && typeof activity.colorIndex === 'number') {
      setAssignedColorIndices(assignedColorIndices.filter(i => i !== activity.colorIndex));
    }
    
    setActivities(activities.filter(activity => activity.id !== id));
    if (onActivityRemove) {
      onActivityRemove(id);
    }
  };

  return (
    <div className={`${styles.activityManager} ${isTimeUp ? styles.disabled : ''}`}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Activities</h2>
          <p className={styles.description}>
            {isTimeUp 
              ? 'Time is up! No more activities can be added.' 
              : 'Manage your session activities below.'
            }
          </p>
        </div>
      </header>
      
      {!isTimeUp && (
        <section className={styles.formSection}>
          <ActivityForm 
            onAddActivity={handleAddActivity}
            isDisabled={isTimeUp}
          />
        </section>
      )}
      
      <section className={styles.activityList}>
        {activities.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No activities defined yet.</p>
            <p>Add your first activity above to get started!</p>
          </div>
        ) : (
          activities.map((activity) => {
            const isRunning = activity.id === currentActivityId;
            const isCompleted = completedActivityIds.includes(activity.id);
            const status = isCompleted ? 'completed' : isRunning ? 'running' : 'pending';
            
            return (
              <div 
                key={activity.id} 
                className={`${styles.activityItem} ${styles[status]}`}
              >
                <div className={styles.activityContent}>
                  <h3 className={styles.activityName}>{activity.name}</h3>
                  <span className={`${styles.activityStatus} ${styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}>
                    {status}
                  </span>
                  {isRunning && elapsedTime > 0 && (
                    <div className={styles.activityTimer}>
                      Running: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
                <div className={styles.activityActions}>
                  <ActivityButton 
                    activity={activity}
                    isCompleted={isCompleted}
                    isRunning={isRunning}
                    onSelect={handleActivitySelect}
                    onRemove={onActivityRemove ? handleRemoveActivity : undefined}
                    timelineEntries={timelineEntries}
                    elapsedTime={elapsedTime}
                  />
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}