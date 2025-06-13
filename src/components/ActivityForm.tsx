import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit}  role="form" data-testid="activity-form">
      <div >
        <input
          type="text"
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
          placeholder={isDisabled ? "Time is up!" : "New activity name"}
          
          disabled={isDisabled}
        />
        <button 
          type="submit"
           ${isDisabled ? styles.disabled : ''}`}
          disabled={isDisabled}
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;