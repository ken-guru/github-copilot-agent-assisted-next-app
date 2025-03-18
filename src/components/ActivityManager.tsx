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
  order?: number;
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
  const [draggedActivity, setDraggedActivity] = useState<Activity | null>(null);
  
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
        { id: '1', name: 'Homework', colorIndex: 0, order: 0 },
        { id: '2', name: 'Reading', colorIndex: 1, order: 1 },
        { id: '3', name: 'Play Time', colorIndex: 2, order: 2 },
        { id: '4', name: 'Chores', colorIndex: 3, order: 3 }
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
    const nextOrder = activities.length;
    
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: activityName,
      colorIndex: nextColorIndex,
      colors: getNextAvailableColorSet(nextColorIndex),
      order: nextOrder
    };
    
    setAssignedColorIndices([...assignedColorIndices, nextColorIndex]);
    setActivities([...activities, newActivity]);
    
    // Just add the activity without starting it
    onActivitySelect(newActivity, true);
  };

  // Add drag and drop handlers
  const handleDragStart = (activity: Activity) => (e: React.DragEvent) => {
    if (!planningMode) return;
    setDraggedActivity(activity);
    
    // Create a mock dataTransfer if none exists (for testing)
    if (!e.dataTransfer) {
      Object.defineProperty(e, 'dataTransfer', {
        value: {
          setData: () => {},
          effectAllowed: 'move'
        }
      });
    }
    
    e.dataTransfer?.setData('text/plain', activity.id);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (activity: Activity) => (e: React.DragEvent) => {
    if (!planningMode || !draggedActivity) return;
    e.preventDefault();
    
    // Create a mock dataTransfer if none exists (for testing)
    if (!e.dataTransfer) {
      Object.defineProperty(e, 'dataTransfer', {
        value: {
          dropEffect: 'move'
        }
      });
    }
    
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (targetActivity: Activity) => (e: React.DragEvent) => {
    if (!planningMode || !draggedActivity) return;
    e.preventDefault();

    // Don't do anything if dropping onto the same item
    if (draggedActivity.id === targetActivity.id) return;

    // Reorder activities
    setActivities(currentActivities => {
      const updatedActivities = currentActivities.map(activity => {
        if (activity.id === draggedActivity.id) {
          return { ...activity, order: targetActivity.order };
        }
        if (activity.id === targetActivity.id) {
          return { ...activity, order: draggedActivity.order };
        }
        return activity;
      });

      // Sort by order for consistent display
      return updatedActivities.sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    setDraggedActivity(null);
  };

  const handleDragEnd = () => {
    setDraggedActivity(null);
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

  // Sort activities by order before rendering
  const sortedActivities = [...activities].sort((a, b) => (a.order || 0) - (b.order || 0));
  
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
        <div className={styles.activityList} role="list">
          {sortedActivities.map((activity) => {
            const isInTimeline = isActivityInTimeline(activity.id, timelineEntries);
            
            return (
              <div
                key={activity.id}
                role="listitem"
                draggable={!!planningMode}
                onDragStart={handleDragStart(activity)}
                onDragOver={handleDragOver(activity)}
                onDrop={handleDrop(activity)}
                onDragEnd={handleDragEnd}
              >
                <ActivityButton
                  activity={activity}
                  isCompleted={completedActivityIds.includes(activity.id)}
                  isRunning={activity.id === currentActivityId}
                  onSelect={handleActivitySelect}
                  onRemove={onActivityRemove ? handleRemoveActivity : undefined}
                  timelineEntries={timelineEntries}
                  elapsedTime={elapsedTime}
                  isInTimeline={isInTimeline && !planningMode}
                />
              </div>
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