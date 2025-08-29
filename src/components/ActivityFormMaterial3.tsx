import React, { useState } from 'react';
import { Material3TextField } from './ui/Material3TextField';
import { Material3Button } from './ui/Material3Button';
import { Material3InputGroup } from './ui/Material3InputGroup';

interface ActivityFormMaterial3Props {
  onAddActivity: (activityName: string) => void;
  isDisabled: boolean;
}

const ActivityFormMaterial3: React.FC<ActivityFormMaterial3Props> = ({ 
  onAddActivity, 
  isDisabled 
}) => {
  const [newActivityName, setNewActivityName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = newActivityName.trim();
    
    if (!trimmedName) {
      setError('Activity name is required');
      return;
    }
    
    if (trimmedName.length > 100) {
      setError('Activity name must be 100 characters or less');
      return;
    }
    
    if (isDisabled) {
      setError('Cannot add activities when time is up');
      return;
    }
    
    setError('');
    onAddActivity(trimmedName);
    setNewActivityName('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewActivityName(e.target.value);
    if (error) {
      setError(''); // Clear error when user starts typing
    }
  };

  const isSubmitDisabled = isDisabled || !newActivityName.trim();

  return (
    <form onSubmit={handleSubmit} role="form" data-testid="activity-form-material3">
      <Material3InputGroup 
        variant="attached" 
        data-testid="activity-form-input-group"
      >
        <Material3TextField
          label="Activity Name"
          placeholder={isDisabled ? "Time is up!" : "Enter new activity name"}
          value={newActivityName}
          onChange={handleChange}
          disabled={isDisabled}
          error={!!error}
          helperText={error || (isDisabled ? "Cannot add activities when timer has ended" : undefined)}
          maxLength={100}
          autoComplete="off"
          data-testid="activity-name-input"
        />
        <Material3Button
          type="submit"
          variant="filled"
          disabled={isSubmitDisabled}
          data-testid="add-activity-button"
        >
          Add Activity
        </Material3Button>
      </Material3InputGroup>
    </form>
  );
};

export default ActivityFormMaterial3;