import React, { useState } from 'react';
import styles from './ActivityManager.module.css';

interface ActivityFormProps {
  onAddActivity: (activityName: string) => void;
  isDisabled: boolean;
  'data-testid'?: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ 
  onAddActivity, 
  isDisabled,
  'data-testid': dataTestId 
}) => {
  const [newActivityName, setNewActivityName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivityName.trim() && !isDisabled) {
      onAddActivity(newActivityName.trim());
      setNewActivityName('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={styles.form}
      role="form"
    >
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
          placeholder={isDisabled ? "Time is up!" : "New activity name"}
          className={styles.input}
          disabled={isDisabled}
          data-testid="activity-input"
        />
        <button 
          type="submit"
          className={`${styles.addButton} ${isDisabled ? styles.disabled : ''}`}
          disabled={isDisabled}
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;