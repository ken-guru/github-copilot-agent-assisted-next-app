import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

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
    <Form onSubmit={handleSubmit} className="mb-3" role="form" data-testid="activity-form">
      <InputGroup data-testid="activity-form-input-group">
        <Form.Control
          type="text"
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
          placeholder={isDisabled ? "Time is up!" : "New activity name"}
          disabled={isDisabled}
        />
        <Button 
          type="submit"
          variant="primary"
          disabled={isDisabled}
        >
          Add Activity
        </Button>
      </InputGroup>
    </Form>
  );
};

export default ActivityForm;