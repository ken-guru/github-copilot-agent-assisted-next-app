import { useState, useEffect } from 'react';
import styles from './ActivityManager.module.css';
import { getNextAvailableColorSet, ColorSet } from '../utils/colors';
import { TimelineEntry } from '../hooks/useActivityState';

export interface Activity {
  id: string;
  name: string;
  isDefault?: boolean;
  completed?: boolean;
  colors?: ColorSet;
}

interface ActivityManagerProps {
  onActivitySelect: (activity: Activity | null) => void;
  onActivityRemove?: (activityId: string) => void;
  currentActivityId: string | null;
  completedActivityIds: string[];
  timelineEntries: TimelineEntry[];
  isTimeUp?: boolean;
}

export default function ActivityManager({ 
  onActivitySelect, 
  onActivityRemove,
  currentActivityId, 
  completedActivityIds,
  timelineEntries,
  isTimeUp = false
}: ActivityManagerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivityName, setNewActivityName] = useState('');

  // Initialize activities with colors on mount
  useEffect(() => {
    const defaultActivities: Activity[] = [
      { id: '1', name: 'Homework', isDefault: true, colors: getNextAvailableColorSet() },
      { id: '2', name: 'Reading', isDefault: true, colors: getNextAvailableColorSet() },
      { id: '3', name: 'Play Time', isDefault: true, colors: getNextAvailableColorSet() },
      { id: '4', name: 'Chores', isDefault: true, colors: getNextAvailableColorSet() },
    ];
    setActivities(defaultActivities);
  }, []);

  // Adding new activities is only disabled when time is up
  const isAddingDisabled = isTimeUp;

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivityName.trim() && !isAddingDisabled) {
      const newActivity: Activity = {
        id: Date.now().toString(),
        name: newActivityName.trim(),
        colors: getNextAvailableColorSet()
      };
      setActivities([...activities, newActivity]);
      setNewActivityName('');
    }
  };

  const handleActivitySelect = (activity: Activity) => {
    // If this activity is already running, complete it
    if (activity.id === currentActivityId) {
      onActivitySelect(null);
    } else {
      // Start the selected activity
      onActivitySelect({
        ...activity,
        colors: activity.colors || getNextAvailableColorSet()
      });
    }
  };

  const handleRemoveActivity = (id: string) => {
    // If removing current activity, mark as completed
    if (id === currentActivityId) {
      onActivitySelect(null);
    }
    setActivities(activities.filter(activity => activity.id !== id));
    onActivityRemove?.(id);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Activities</h2>

      <form onSubmit={handleAddActivity} className={styles.form}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newActivityName}
            onChange={(e) => setNewActivityName(e.target.value)}
            placeholder={isTimeUp ? "Time is up!" : "New activity name"}
            className={styles.input}
            disabled={isAddingDisabled}
          />
          <button 
            type="submit"
            className={`${styles.addButton} ${isAddingDisabled ? styles.disabled : ''}`}
            disabled={isAddingDisabled}
          >
            Add
          </button>
        </div>
      </form>

      {activities.length === 0 ? (
        <div className={styles.emptyState}>
          No activities defined
        </div>
      ) : (
        <div className={styles.activityList}>
          {activities.map((activity) => {
            const isCompleted = completedActivityIds.includes(activity.id);
            const isRunning = activity.id === currentActivityId;
            
            return (
              <div 
                key={activity.id} 
                className={isCompleted ? styles.completedActivityItem : styles.activityItem}
                style={activity.colors ? {
                  backgroundColor: activity.colors.background,
                  borderColor: activity.colors.border
                } : undefined}
              >
                <span 
                  className={isCompleted ? styles.completedActivityName : styles.activityName}
                  style={activity.colors ? { color: activity.colors.text } : undefined}
                >
                  {activity.name}
                </span>
                <div className={styles.buttonGroup}>
                  {isCompleted ? (
                    <span 
                      className={styles.completedTag}
                      style={activity.colors ? {
                        color: activity.colors.text,
                        borderColor: activity.colors.border
                      } : undefined}
                    >
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleActivitySelect(activity)}
                      className={isRunning ? styles.stopButton : styles.startButton}
                      disabled={isCompleted}
                    >
                      {isRunning ? 'Complete' : 'Start'}
                    </button>
                  )}
                  {!isCompleted && (
                    <button
                      onClick={() => handleRemoveActivity(activity.id)}
                      className={styles.removeButton}
                      disabled={timelineEntries?.some(entry => entry.activityId === activity.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {currentActivityId === null && !isTimeUp && (
        <div className={styles.breakMessage}>
          Taking a break - Click any activity to start
        </div>
      )}
    </div>
  );
}