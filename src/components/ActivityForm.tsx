import React, { useState } from 'react';
// import styles from './ActivityForm.module.css';

interface ActivityFormProps {
  onAddActivity: (activityName: string) => void;
  isDisabled: boolean;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onAddActivity, isDisabled }) => {
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
      // className={styles.activityForm}
      role="form" 
      data-testid="activity-form"
    >
      {/* <div className={styles.inputContainer}> */}
      <div>
        <input 
          type="text"
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
          placeholder={isDisabled ? "Time is up!" : "New activity name"}
          // className={styles.textInput}
          disabled={isDisabled}
          aria-label="Activity name"
          aria-describedby="activity-form-description"
        />
        <button 
          type="submit"
          disabled={isDisabled || !newActivityName.trim()}
          // className={styles.submitButton}
          aria-label={isDisabled ? "Cannot add activity - time is up" : "Add new activity"}
        >
          Add
        </button>
      </div>
      <div 
        id="activity-form-description" 
        // className={styles.visuallyHidden}
      >
        {isDisabled 
          ? "Activity form is disabled because time has expired"
          : "Enter a name for your new activity and click Add to include it in your timeline"
        }
      </div>
    </form>
  );
};

export default ActivityForm;