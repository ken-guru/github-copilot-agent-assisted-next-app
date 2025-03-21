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
  onStartActivities?: (orderedActivities?: Activity[]) => void; // Modified to pass ordered activities
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
  planningMode = false,
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
    
    // Always start with empty list in planning mode
    if (planningMode) {
      setHasInitializedActivities(true);
      setActivities([]);
      setAssignedColorIndices([]);
    }
    setHasInitializedActivities(true);
  }, [hasInitializedActivities, planningMode]);

  // Listen for theme changes
  useEffect(() => {
    const updateColors = () => {
      setActivities(currentActivities => 
        currentActivities.map(activity => ({
          ...activity,
          colors: getNextAvailableColorSet(activity.colorIndex || 0)
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
  
  const normalizeActivityId = (name: string): string => {
    // Convert spaces to hyphens and make lowercase, but keep it simple
    return name.toLowerCase().trim();
  };

  const handleAddActivity = (activityName: string) => {
    const nextColorIndex = getNextColorIndex();
    const nextOrder = activities.length;
    
    // Generate a simple lowercase ID from the name
    const activityId = normalizeActivityId(activityName);
    
    const newActivity: Activity = {
      id: activityId,
      name: activityName, // Keep the original name for display
      colorIndex: nextColorIndex,
      colors: getNextAvailableColorSet(nextColorIndex),
      order: nextOrder
    };
    
    setAssignedColorIndices([...assignedColorIndices, nextColorIndex]);
    setActivities([...activities, newActivity]);
    
    // Just add the activity without starting it
    onActivitySelect(newActivity, true);
  };
  
  const handleActivitySelect = (activity: Activity) => {
    // In planning mode, selecting an activity doesn't start it
    if (planningMode) {
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
    if (onActivityRemove && planningMode) {
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

  const handleDragStart = (activity: Activity) => (e: React.DragEvent) => {
    if (!planningMode) return;
    setDraggedActivity(activity);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    (e.target as HTMLElement).setAttribute('data-y', rect.top.toString());
  };

  const handleDragOver = (activity: Activity) => (e: React.DragEvent) => {
    if (!planningMode || !draggedActivity) return;
    e.preventDefault();
    if (activity.id !== draggedActivity.id) {
      const dropTarget = e.currentTarget;
      const dropRect = dropTarget.getBoundingClientRect();
      const dragY = parseFloat(document.querySelector(`[data-testid="activity-${draggedActivity.id}"]`)?.getAttribute('data-y') || '0');
      
      dropTarget.classList.remove(styles.dragOverTop, styles.dragOverBottom);
      if (dragY < dropRect.top) {
        dropTarget.classList.add(styles.dragOverTop);
      } else {
        dropTarget.classList.add(styles.dragOverBottom);
      }
    }
  };

  const handleDrop = (activity: Activity) => (e: React.DragEvent) => {
    if (!planningMode || !draggedActivity) return;
    e.preventDefault();
    const dropTarget = e.currentTarget;
    dropTarget.classList.remove(styles.dragOverTop, styles.dragOverBottom);
    
    if (draggedActivity.id === activity.id) return;
    
    const draggedIndex = activities.findIndex(a => a.id === draggedActivity.id);
    const dropIndex = activities.findIndex(a => a.id === activity.id);
    
    if (draggedIndex === -1 || dropIndex === -1) return;
    
    const updatedActivities = [...activities];
    const [removed] = updatedActivities.splice(draggedIndex, 1);
    const insertAt = draggedIndex < dropIndex ? dropIndex : dropIndex;
    updatedActivities.splice(insertAt, 0, removed);
    
    // Update order property for all activities
    const reorderedActivities = updatedActivities.map((act, index) => ({
      ...act,
      order: index
    }));
    
    setActivities(reorderedActivities);
  };

  const handleDragEnd = () => {
    if (!planningMode) return;
    setDraggedActivity(null);
    // Clean up data-y attributes
    document.querySelectorAll('[data-y]').forEach(el => el.removeAttribute('data-y'));
  };

  // Update hasActivities to be based on activities array length
  const hasActivities = activities.length > 0;

  // Update the showStartButton logic to be based on planningMode only
  const showStartButton = planningMode && onStartActivities;

  // Sort activities by order before rendering
  const sortedActivities = [...activities].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Handler for the Start Activities button
  const handleStartActivities = () => {
    if (onStartActivities) {
      // Reset any completion or removal states before transitioning
      const initialActivities = sortedActivities.map(activity => ({
        ...activity,
        completed: false
      }));
      onStartActivities(initialActivities);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {planningMode ? 'Plan Your Activities' : 'Activities'}
      </h2>
      
      {planningMode && (
        <ActivityForm
          onAddActivity={handleAddActivity}
          isDisabled={isTimeUp}
          data-testid="activity-input"
        />
      )}
      
      {!hasActivities && (
        <div className={styles.emptyState} role="status">
          {planningMode 
            ? 'Add activities to get started' 
            : 'No activities defined'}
        </div>
      )}
      
      {hasActivities && (
        <div 
          className={styles.activityList} 
          role="list"
          onDragOver={(e) => {
            e.preventDefault();
            const dropTarget = e.currentTarget;
            dropTarget.classList.add(styles.dragOverList);
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove(styles.dragOverList);
          }}
        >
          {sortedActivities.map((activity) => {
            const isCompleted = completedActivityIds.includes(activity.id);
            const isRunning = activity.id === currentActivityId;
            const isInTimeline = isActivityInTimeline(activity.id, timelineEntries);
            
            return (
              <div
                key={activity.id}
                role="listitem"
                className={styles.activityListItem}
                draggable={!!planningMode}
                onDragStart={handleDragStart(activity)}
                data-testid={`activity-${activity.id}`}
              >
                <ActivityButton
                  activity={activity}
                  isCompleted={isCompleted}
                  isRunning={isRunning}
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
      {showStartButton && (
        <button
          className={styles.startActivitiesButton}
          onClick={handleStartActivities}
          disabled={!hasActivities}
          aria-disabled={!hasActivities}
          aria-label="Start Activities"
          type="button"
          data-testid="start-activities"
        >
          Start Activities
        </button>
      )}
    </div>
  );
}