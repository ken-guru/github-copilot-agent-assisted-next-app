
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Activity } from '../../types/activity';

interface ActivityFormProps {
  activity?: Activity | null;
  onSubmit: (activity: Activity | null) => void;
  error?: string | null;
  onCancel?: () => void;
}




const ActivityForm: React.FC<ActivityFormProps> = ({ activity, onSubmit, error, onCancel }) => {
  const [name, setName] = useState(activity?.name || '');
  const [description, setDescription] = useState(activity?.description || '');
  const [colorIndex, setColorIndex] = useState(activity?.colorIndex || 0);
  const [validated, setValidated] = useState(false);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  // Support cancel button if onCancel is provided
  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  React.useEffect(() => {
    // Always log error prop changes for debugging
    // eslint-disable-next-line no-console
    console.log('[ActivityForm] error prop updated:', error);
    if (error && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [error]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidated(true);
    if (!name || !name.trim()) {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
      onSubmit(null); // Signal error to parent
      return;
    }
    onSubmit({
      id: activity?.id || crypto.randomUUID(),
      name,
      description,
      colorIndex: Number(colorIndex),
      createdAt: activity?.createdAt || new Date().toISOString(),
      isActive: true,
    });
  };

  // Debug log to confirm error prop value on each render
  // eslint-disable-next-line no-console
  console.log('[ActivityForm] render error prop:', error);
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit} aria-label="Activity Form">
      <Form.Group controlId="activityName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          aria-required="true"
          autoFocus
          ref={nameInputRef}
          isInvalid={!!error}
        />
        <Form.Control.Feedback type="invalid" data-testid="activity-form-error">
          {error ? error : ''}
        </Form.Control.Feedback>
        {/* Always render a visible error message below the name input for accessibility and testability */}
        {error && (
          <div data-testid="activity-form-error-message" style={{ color: 'red', marginTop: 4 }}>{error}</div>
        )}
      </Form.Group>
      <Form.Group controlId="activityDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="activityColor">
        <Form.Label>Color</Form.Label>
        <Form.Control
          type="number"
          min={0}
          max={7}
          value={colorIndex}
          onChange={e => setColorIndex(Number(e.target.value))}
          required
          aria-required="true"
        />
      </Form.Group>
      <Button type="submit" variant="primary">Save</Button>
      {typeof onCancel === 'function' && (
        <Button type="button" variant="secondary" className="ms-2" onClick={handleCancel}>
          Cancel
        </Button>
      )}
    </Form>
  );
};

export default ActivityForm;
