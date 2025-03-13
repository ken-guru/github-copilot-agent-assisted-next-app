import { useState, useEffect } from 'react';
import styles from './ActivityManager.module.css';
import { getNextAvailableColorSet, ColorSet } from '../utils/colors';
import { TimelineEntry } from '../hooks/useTimelineEntries';
import { ActivityButton } from './ActivityButton';
import ActivityForm from './ActivityForm';

export interface Activity {
  id: string;
  name: string;
  isDefault?: boolean;
  completed?: boolean;
  colors?: ColorSet;
  colorIndex?: number;
}

interface ActivityManagerProps {
  onActivitySelect: (activity: Activity | null) => void;
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
  
  const getNextColorIndex = (): number => {
    let index = 0;
    while (assignedColorIndices.includes(index)) {
      index++;
    }
    return index;
  };

  useEffect(() => {
    const defaultActivities: Activity[] = [
      { id: '1', name: 'Homework', isDefault: true, colorIndex: 0, colors: getNextAvailableColorSet(0) },
      { id: '2', name: 'Reading', isDefault: true, colorIndex: 1, colors: getNextAvailableColorSet(1) },
      { id: '3', name: 'Play Time', isDefault: true, colorIndex: 2, colors: getNextAvailableColorSet(2) },
      { id: '4', name: 'Chores', isDefault: true, colorIndex: 3, colors: getNextAvailableColorSet(3) },
    ];
    
    setAssignedColorIndices([0, 1, 2, 3]);
    setActivities(defaultActivities);
  }, []);
  
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
    onActivityRemove?.(id);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Activities</h2>
      

      {activities.length === 0 ? (
        <div className={styles.emptyState}>
          No activities defined
        </div>
      ) : (
        <div className={styles.activityList}>
          <ActivityForm
            onAddActivity={handleAddActivity}
            isDisabled={isTimeUp}
          />
          {activities.map((activity) => (
            <ActivityButton
              key={activity.id}
              activity={activity}
              isCompleted={completedActivityIds.includes(activity.id)}
              isRunning={activity.id === currentActivityId}
              onSelect={handleActivitySelect}
              onRemove={onActivityRemove ? handleRemoveActivity : undefined}
              timelineEntries={timelineEntries}
              elapsedTime={elapsedTime}
            />
          ))}
        </div>
      )}
    </div>
  );
}