import { useState } from 'react';
import styles from './ActivityManager.module.css';
import { getNextAvailableColorSet, ColorSet } from '@/utils/colors';
import { getActivities, addActivity, deleteActivity } from '@/utils/activity-storage';
import { TimelineEntry } from '@/types';
import { Activity } from '@/types/activity';
import { ActivityButton } from '@/components/ActivityButton';
import ActivityForm from './ActivityForm';

/**
 * Props for the ActivityManager component
 * 
 * @interface ActivityManagerProps
 */
export interface ActivityManagerProps {
  /**
   * Callback when an activity is selected
   * 
   * @param activity - The selected activity or null if deselecting
   * @param justAdd - If true, the activity was just added but not selected
   * @returns {void}
   */
  onActivitySelect: (activity: Activity | null, justAdd?: boolean) => void;
  
  /**
   * Optional callback when an activity is removed
   * 
   * @param activityId - ID of the activity to remove
   * @returns {void}
   */
  onActivityRemove?: (activityId: string) => void;
  
  /** ID of the currently selected activity, or null if none selected */
  currentActivityId: string | null;
  
  /** Array of IDs for completed activities */
  completedActivityIds: string[];
  
  /** Array of timeline entries to calculate activity duration */
  timelineEntries: TimelineEntry[];
  
  /** Whether the time limit has been reached */
  isTimeUp?: boolean;
  
  /** Current elapsed time in seconds */
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
  const [activities, setActivities] = useState<Activity[]>(() => getActivities());
  const [showForm, setShowForm] = useState(false);
  
  // Handle adding a new activity
  const handleAddActivity = (activity: Activity | null) => {
    if (!activity) {
      setShowForm(false);
      return;
    }
    // Assign ID and color if not present
    const id = activity.id || `activity-${Date.now()}`;
    const colorIndex = typeof activity.colorIndex === 'number' ? activity.colorIndex : activities.length;
    const newActivity = {
      ...activity,
      id,
      colorIndex,
      createdAt: activity?.createdAt || new Date().toISOString(),
      isActive: activity?.isActive ?? true
    };
    addActivity(newActivity);
    setActivities(getActivities());
    setShowForm(false);
    onActivitySelect(newActivity, true);
  };
  
  // Handle activity selection
  const handleActivityClick = (activity: Activity) => {
    // Don't allow activity changes when time is up
    if (isTimeUp) return;
    
    // Don't allow selecting the currently active activity again
    if (currentActivityId === activity.id) return;
    
    onActivitySelect(activity);
  };
  
  // Handle activity removal
  const handleRemoveActivity = (activityId: string) => {
    deleteActivity(activityId);
    setActivities(getActivities());
    if (onActivityRemove) {
      onActivityRemove(activityId);
    }
  };
  
  return (
    <div className={styles.activityManager}>
      <h2 className={styles.title}>Activities</h2>
      
      {/* Activity list */}
      <div className={styles.activitiesList}>
        {activities.map((activity) => (
          <ActivityButton
            key={activity.id}
            activity={activity}
            isRunning={currentActivityId === activity.id}
            isCompleted={completedActivityIds.includes(activity.id)}
            onSelect={() => handleActivityClick(activity)}
            onRemove={() => handleRemoveActivity(activity.id)}
            timelineEntries={timelineEntries}
            elapsedTime={elapsedTime}
          />
        ))}
      </div>
      
      {/* Add activity button or form */}
      {showForm ? (
        <ActivityForm
          onSubmit={handleAddActivity}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button 
          className={styles.addButton}
          onClick={() => setShowForm(true)}
          disabled={isTimeUp}
        >
          + Add Activity
        </button>
      )}
      
      {/* No activities message */}
      {activities.length === 0 && !showForm && (
        <div className={styles.emptyState}>
          No activities yet. Add one to get started.
        </div>
      )}
      
      {/* Time up notification */}
      {isTimeUp && (
        <div className={styles.timeupNotification}>
          Time&apos;s up! You can no longer modify activities.
        </div>
      )}
    </div>
  );
}
