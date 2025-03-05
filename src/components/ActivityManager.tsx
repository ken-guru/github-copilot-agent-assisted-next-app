import { useState } from 'react';
import styles from './ActivityManager.module.css';

export interface Activity {
  id: string;
  name: string;
  isDefault?: boolean;
  completed?: boolean;
}

interface ActivityManagerProps {
  onActivitySelect: (activity: Activity | null) => void;
  currentActivityId: string | null;
  completedActivityIds: string[];
}

export default function ActivityManager({ 
  onActivitySelect, 
  currentActivityId, 
  completedActivityIds 
}: ActivityManagerProps) {
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', name: 'Homework', isDefault: true },
    { id: '2', name: 'Reading', isDefault: true },
    { id: '3', name: 'Play Time', isDefault: true },
    { id: '4', name: 'Chores', isDefault: true },
  ]);
  const [newActivityName, setNewActivityName] = useState('');

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivityName.trim()) {
      const newActivity: Activity = {
        id: Date.now().toString(),
        name: newActivityName.trim()
      };
      setActivities([...activities, newActivity]);
      setNewActivityName('');
    }
  };

  const handleSelectActivity = (activity: Activity) => {
    // If this activity is already running, stop it
    if (activity.id === currentActivityId) {
      onActivitySelect(null);
    } else {
      onActivitySelect(activity);
    }
  };

  const handleRemoveActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  // Remove sorting - show activities in their original order
  const displayActivities = activities;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Activities</h2>

      <form onSubmit={handleAddActivity} className={styles.form}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newActivityName}
            onChange={(e) => setNewActivityName(e.target.value)}
            placeholder="New activity name"
            className={styles.input}
          />
          <button 
            type="submit"
            className={styles.addButton}
          >
            Add
          </button>
        </div>
      </form>

      {activities.length === 0 ? (
        <div style={{ padding: '1rem 0', color: '#4b5563', textAlign: 'center' }}>
          No activities defined
        </div>
      ) : (
        <div className={styles.activityList}>
          {/* All activities in their original order */}
          {displayActivities.map((activity) => {
            const isCompleted = completedActivityIds.includes(activity.id);
            const isRunning = activity.id === currentActivityId;
            
            return (
              <div 
                key={activity.id} 
                className={isCompleted ? styles.completedActivityItem : styles.activityItem}
              >
                <span className={isCompleted ? styles.completedActivityName : styles.activityName}>
                  {activity.name}
                </span>
                <div className={styles.buttonGroup}>
                  {isCompleted ? (
                    <span className={styles.completedTag}>Completed</span>
                  ) : (
                    <button
                      onClick={() => handleSelectActivity(activity)}
                      className={isRunning ? styles.stopButton : styles.startButton}
                    >
                      {isRunning ? 'Click to Stop' : 'Start'}
                    </button>
                  )}
                  {!activity.isDefault && !isCompleted && (
                    <button
                      onClick={() => handleRemoveActivity(activity.id)}
                      className={styles.removeButton}
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
    </div>
  );
}