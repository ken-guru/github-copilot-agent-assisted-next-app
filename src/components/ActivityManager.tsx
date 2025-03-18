import { useState, useEffect } from 'react';
import styles from './ActivityManager.module.css';
import { getNextAvailableColorSet, ColorSet } from '../utils/colors';
import { TimelineEntry } from '../hooks/useTimelineEntries';
import { ActivityButton } from './ActivityButton';
import ActivityForm from './ActivityForm';

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
  planningMode?: boolean; // New prop for planning mode
  isTimeUp?: boolean;
  elapsedTime?: number;
  onStartActivities?: () => void; // New prop for transitioning to Activity state
}

function isActivityInTimeline(activityId: string, timelineEntries: TimelineEntry[]) {
  return timelineEntries.some(entry => entry.activityId === activityId);
}

export default function ActivityManager({ 
  onActivitySelect, 
  onActivityRemove,
  currentActivityId, 
  completedActivityIds,
  timelineEntries,
  planningMode = false, // Default to false (Activity mode)
  isTimeUp = false,
  elapsedTime = 0,
  onStartActivities
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
  
  // Initialize activities based on mode
  useEffect(() => {
    if (hasInitializedActivities) return;
    
    if (planningMode) {
      // In planning mode, we start with an empty list
      setHasInitializedActivities(true);
      setActivities([]);
      setAssignedColorIndices([]);
    } else {
      // In activity mode, initialize with default activities
      const defaultActivities = [
        { id: '1', name: 'Homework', colorIndex: 0 },
        { id: '2', name: 'Reading', colorIndex: 1 },
        { id: '3', name: 'Play Time', colorIndex: 2 },
        { id: '4', name: 'Chores', colorIndex: 3 }
      ];
      
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
  }, [hasInitializedActivities, onActivitySelect, planningMode]);
  
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
    
    // Just add the activity without starting it
    onActivitySelect(newActivity, true);
  };
  
  const handleActivitySelect = (activity: Activity) => {
    // In planning mode, selecting an activity doesn't start it
    // It just adds it to the planning list
    if (planningMode) {
      // In planning mode, just highlight the activity (don't start it)
      // This might be used for reordering in the future
      return;
    }
    
    // In activity mode, follow the original behavior
    if (activity.id === currentActivityId) {
      onActivitySelect(null);
    } else {
      onActivitySelect({
        ...activity,
        colors: activity.colors || getNextAvailableColorSet(activity.colorIndex || 0)
      });
    }
  };
  
  const handleRemoveActivity = (activityId: string) => {
    if (onActivityRemove) {
      onActivityRemove(activityId);
      
      // Get the activity being removed to find its colorIndex
      const activityToRemove = activities.find(a => a.id === activityId);
      
      // Update activities state
      setActivities(prevActivities => {
        return prevActivities.filter(a => a.id !== activityId);
      });
      
      // If we found the activity, remove its colorIndex
      if (activityToRemove && activityToRemove.colorIndex !== undefined) {
        setAssignedColorIndices(prevIndices => 
          prevIndices.filter(index => index !== activityToRemove.colorIndex)
        );
      }
    }
  };

  const hasActivities = activities.length > 0;
  const showStartButton = planningMode && onStartActivities && hasActivities;
  
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {planningMode ? 'Plan Your Activities' : 'Activities'}
      </h2>
      
      <ActivityForm
        onAddActivity={handleAddActivity}
        isDisabled={isTimeUp || (!planningMode && timelineEntries.length > 0)}
      />
      
      {!hasActivities ? (
        <div className={styles.emptyState}>
          {planningMode 
            ? 'Add activities to get started' 
            : 'No activities defined'}
        </div>
      ) : (
        <div className={styles.activityList}>
          {activities.map((activity) => {
            const isInTimeline = isActivityInTimeline(activity.id, timelineEntries);
            
            return (
              <ActivityButton
                key={activity.id}
                activity={activity}
                isCompleted={completedActivityIds.includes(activity.id)}
                isRunning={activity.id === currentActivityId}
                onSelect={handleActivitySelect}
                onRemove={onActivityRemove ? handleRemoveActivity : undefined}
                timelineEntries={timelineEntries}
                elapsedTime={elapsedTime}
                isInTimeline={isInTimeline && !planningMode}
              />
            );
          })}
        </div>
      )}
      
      {planningMode && onStartActivities && (
        <button
          className={styles.startActivitiesButton}
          onClick={onStartActivities}
          disabled={!hasActivities}
          aria-disabled={!hasActivities}
          aria-label="Start Activities"
          type="button"
        >
          Start Activities
        </button>
      )}
    </div>
  );
}