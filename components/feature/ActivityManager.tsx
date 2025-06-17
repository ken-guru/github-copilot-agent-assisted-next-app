import { useState } from 'react';
import { TimelineEntry } from '@hooks/use-timeline-entries';
import { ActivityButton } from '@components/ui/ActivityButton';
import ActivityForm from './ActivityForm';
import { ListGroup, Button, Alert, Card } from 'react-bootstrap';

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
    
    // Create the new activity
    const newActivity: Activity = {
      id,
      name,
      description,
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
    <Card className="mb-3">
      <Card.Header as="h2">Activities</Card.Header>
      <Card.Body>
        {/* Activity list */}
        {activities.length > 0 && (
          <ListGroup variant="flush" className="mb-3">
            {activities.map((activity) => (
              <ListGroup.Item key={activity.id} className="p-0 border-0">
                <ActivityButton 
                  activity={activity}
                  isActive={currentActivityId === activity.id}
                  isCompleted={completedActivityIds.includes(activity.id)}
                  onClick={() => handleActivityClick(activity)}
                  onRemove={() => handleRemoveActivity(activity.id)}
                  disabled={isTimeUp}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        
        {/* Add activity button or form */}
        {showForm ? (
          <ActivityForm onSubmit={handleAddActivity}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <Button 
            variant="primary" 
            onClick={() => setShowForm(true)}
            disabled={isTimeUp}
            className="w-100"
          >
            + Add Activity
          </Button>
        )}
        
        {/* No activities message */}
        {activities.length === 0 && !showForm && (
          <Alert variant="info" className="mt-3">
            No activities yet. Add one to get started.
          </Alert>
        )}
        
        {/* Time up notification */}
        {isTimeUp && (
          <Alert variant="warning" className="mt-3">
            Time&apos;s up! You can no longer modify activities.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}
