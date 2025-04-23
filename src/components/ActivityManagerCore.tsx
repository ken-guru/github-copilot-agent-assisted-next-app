import { useEffect } from 'react';
import { TimelineEntry } from '../hooks/useTimelineEntries';
import { ActivityButton, ActivityForm } from './ActivityManagerUI';
import { useActivityManagerState } from '../hooks/useActivityManagerState';
import { useActivityManagerTheme } from './ActivityManagerTheme';
import styles from './ActivityManager.module.css';
import { ColorSet } from '@/contexts/LoadingContext';
import { getNextAvailableColorSet } from '../utils/colors';

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
  const { activities, setActivities, assignedColorIndices, setAssignedColorIndices, getNextColorIndex, initializeActivities } = useActivityManagerState();

  useActivityManagerTheme(activities, setActivities);

  useEffect(() => {
    const defaultActivities = [
      { id: '1', name: 'Homework', colorIndex: 0, colors: getNextAvailableColorSet(0) },
      { id: '2', name: 'Reading', colorIndex: 1, colors: getNextAvailableColorSet(1) },
      { id: '3', name: 'Play Time', colorIndex: 2, colors: getNextAvailableColorSet(2) },
      { id: '4', name: 'Chores', colorIndex: 3, colors: getNextAvailableColorSet(3) }
    ];

    initializeActivities(defaultActivities, onActivitySelect);
  }, [initializeActivities, onActivitySelect]);
  
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
