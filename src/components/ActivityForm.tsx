import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

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
    <Form onSubmit={handleSubmit} role="form" data-testid="activity-form">
      <Form.Group controlId="activityName">
        <Form.Control
          type="text"
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
          placeholder={isDisabled ? "Time is up!" : "New activity name"}
          disabled={isDisabled}
          aria-label="Activity name"
          aria-describedby="activity-form-description"
        />
      </Form.Group>
      <Button
        type="submit"
        variant="primary"
        disabled={isDisabled || !newActivityName.trim()}
        aria-label={isDisabled ? "Cannot add activity - time is up" : "Add new activity"}
      >
        Add
      </Button>
      <div id="activity-form-description" className="visually-hidden">
        {isDisabled 
          ? "Activity form is disabled because time has expired"
          : "Enter a name for your new activity and click Add to include it in your timeline"
        }
      </div>
    </Form>
  );
};

export default ActivityForm;