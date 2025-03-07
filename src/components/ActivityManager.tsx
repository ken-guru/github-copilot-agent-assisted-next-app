import { useState, useEffect } from 'react';
import styles from './ActivityManager.module.css';
import { getNextAvailableColorSet, ColorSet } from '../utils/colors';
import { TimelineEntry } from '../hooks/useActivityState';
import { useTheme } from '../contexts/ThemeContext';

export interface Activity {
  id: string;
  name: string;
  isDefault?: boolean;
  completed?: boolean;
  colors?: ColorSet;
  colorIndex?: number; // Add colorIndex to preserve color identity across theme changes
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
  const { isDarkMode } = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivityName, setNewActivityName] = useState('');
  // Track assigned color indices to prevent duplicates
  const [assignedColorIndices, setAssignedColorIndices] = useState<number[]>([]);
  
  // Get next available color index
  const getNextColorIndex = (): number => {
    // Find the smallest number (starting from 0) that isn't in assignedColorIndices
    let index = 0;
    while (assignedColorIndices.includes(index)) {
      index++;
    }
    return index;
  };

  // Initialize activities with colors on mount
  useEffect(() => {
    const defaultActivities: Activity[] = [
      { id: '1', name: 'Homework', isDefault: true, colorIndex: 0, colors: getNextAvailableColorSet(isDarkMode, 0) },
      { id: '2', name: 'Reading', isDefault: true, colorIndex: 1, colors: getNextAvailableColorSet(isDarkMode, 1) },
      { id: '3', name: 'Play Time', isDefault: true, colorIndex: 2, colors: getNextAvailableColorSet(isDarkMode, 2) },
      { id: '4', name: 'Chores', isDefault: true, colorIndex: 3, colors: getNextAvailableColorSet(isDarkMode, 3) },
    ];
    
    // Update assigned color indices
    setAssignedColorIndices([0, 1, 2, 3]);
    
    setActivities(defaultActivities);
  }, [isDarkMode]); // Add isDarkMode as dependency
  
  // Update activity colors when dark mode changes
  useEffect(() => {
    setActivities(currentActivities => 
      currentActivities.map(activity => ({
        ...activity,
        colors: getNextAvailableColorSet(isDarkMode, activity.colorIndex || 0)
      }))
    );
  }, [isDarkMode]);

  // Adding new activities is only disabled when time is up
  const isAddingDisabled = isTimeUp;

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivityName.trim() && !isAddingDisabled) {
      const nextColorIndex = getNextColorIndex();
      
      const newActivity: Activity = {
        id: Date.now().toString(),
        name: newActivityName.trim(),
        colorIndex: nextColorIndex,
        colors: getNextAvailableColorSet(isDarkMode, nextColorIndex)
      };
      
      // Add the new color index to assigned indices
      setAssignedColorIndices([...assignedColorIndices, nextColorIndex]);
      
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
        colors: activity.colors || getNextAvailableColorSet(isDarkMode, activity.colorIndex || 0)
      });
    }
  };

  const handleRemoveActivity = (id: string) => {
    // If removing current activity, mark as completed
    if (id === currentActivityId) {
      onActivitySelect(null);
    }
    
    // Find the color index of the activity being removed
    const activity = activities.find(a => a.id === id);
    if (activity && typeof activity.colorIndex === 'number') {
      // Remove the color index from assignedColorIndices
      setAssignedColorIndices(assignedColorIndices.filter(i => i !== activity.colorIndex));
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