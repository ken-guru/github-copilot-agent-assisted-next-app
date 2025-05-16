import { useState } from 'react';
import styles from './ActivityManager.module.css';
import { getNextAvailableColorSet, ColorSet } from '@lib/utils/colors';
import { TimelineEntry } from '@hooks/use-timeline-entries';
import { ActivityButton } from '@components/ui/ActivityButton';
import ActivityForm from './ActivityForm';

export interface Activity {
  id: string;
  name: string;
  description?: string;
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
  const [showForm, setShowForm] = useState(false);
  
  // Handle adding a new activity
  const handleAddActivity = (name: string, description: string = '') => {
    // Generate a unique ID for the activity
    const id = `activity-${Date.now()}`;
    
    // Get the next available color set for the activity
    const { colors, index } = getNextAvailableColorSet(activities.length);
    
    // Create the new activity
    const newActivity: Activity = {
      id,
      name,
      description,
      colors,
      colorIndex: index
    };
    
    // Update the activities list
    setActivities(prevActivities => [...prevActivities, newActivity]);
    
    // Hide the form after adding
    setShowForm(false);
    
    // Notify parent about the new activity
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
    // Update local state
    setActivities(prevActivities => 
      prevActivities.filter(activity => activity.id !== activityId)
    );
    
    // Notify parent
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
            isActive={currentActivityId === activity.id}
            isCompleted={completedActivityIds.includes(activity.id)}
            onClick={() => handleActivityClick(activity)}
            onRemove={() => handleRemoveActivity(activity.id)}
            disabled={isTimeUp}
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
