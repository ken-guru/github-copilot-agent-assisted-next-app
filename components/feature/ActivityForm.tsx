import { useState } from 'react';
import styles from './ActivityForm.module.css';

interface ActivityFormProps {
  onSubmit: (name: string, description?: string) => void;
  onCancel: () => void;
  isDisabled?: boolean;
}

export default function ActivityForm({ 
  onSubmit, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCancel, 
  isDisabled = false 
}: ActivityFormProps) {
  const [activityName, setActivityName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activityName.trim() && !isDisabled) {
      onSubmit(activityName.trim());
      setActivityName('');
    }
  };
  
  return (
    <form className={styles.addActivityForm} onSubmit={handleSubmit}>
      <input
        type="text"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        placeholder="Add new activity..."
        className={styles.addActivityInput}
        disabled={isDisabled}
        data-testid="activity-name-input"
      />
      <button
        type="submit"
        className={styles.addButton}
        disabled={!activityName.trim() || isDisabled}
        data-testid="add-activity-button"
      >
        Add
      </button>
    </form>
  );
}
