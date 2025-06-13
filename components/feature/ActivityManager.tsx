import { useState } from 'react';
import { getNextAvailableColorSet, ColorSet } from '@lib/utils/colors';
import { TimelineEntry } from '@hooks/use-timeline-entries';
import { ActivityButton } from '@components/ui/ActivityButton';
import ActivityForm from './ActivityForm';

/**
 * Represents an activity that can be tracked in the application
 * 
 * @interface Activity
 */
export interface Activity {
  /** Unique identifier for the activity */
  id: string;
  
  /** The name of the activity */
  name: string;
  
  /** Optional description of the activity */
  description?: string;
  
  /** Whether the activity has been completed */
  completed?: boolean;
  
  /** Color scheme for the activity in light and dark mode */
  colors?: ColorSet;
  
  /** Index of the color in the color palette, used for color rotation */
  colorIndex?: number;
}

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
  // These props are unused but kept in the interface for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  timelineEntries,
  isTimeUp = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <div>
      <h2>Activities</h2>
      
      {/* Activity list */}
      <div>
        {activities.map((activity) => (
          <ActivityButton key={activity.id}
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
        <ActivityForm onSubmit={handleAddActivity}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button onClick={() => setShowForm(true)}
          disabled={isTimeUp}
        >
          + Add Activity
        </button>
      )}
      
      {/* No activities message */}
      {activities.length === 0 && !showForm && (
        <div>
          No activities yet. Add one to get started.
        </div>
      )}
      
      {/* Time up notification */}
      {isTimeUp && (
        <div>
          Time&apos;s up! You can no longer modify activities.
        </div>
      )}
    </div>
  );
}
