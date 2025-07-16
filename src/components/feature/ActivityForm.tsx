
import React, { useState } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { Activity } from '../../types/activity';
import { getColorName } from '../../utils/colorNames';
import { getActivityColors } from '../../utils/colors';
import { useTheme } from '../../contexts/theme';

interface ActivityFormProps {
  activity?: Activity | null;
  onSubmit: (activity: Activity | null) => void;
  error?: string | null;
  onCancel?: () => void;
}

interface ActivityFormRef {
  submitForm: () => void;
}

const ActivityForm = React.forwardRef<ActivityFormRef, ActivityFormProps>(({ activity, onSubmit, error, onCancel }, ref) => {
  const [name, setName] = useState(activity?.name || '');
  const [description, setDescription] = useState(activity?.description || '');
  const [colorIndex, setColorIndex] = useState(activity?.colorIndex || 0);
  const [validated, setValidated] = useState(false);
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  
  // Get theme from context - this ensures component re-renders when theme changes
  const themeContext = useTheme();
  
  // Get current theme colors for visual display - call on each render to be reactive to theme changes
  const activityColors = getActivityColors();

  // Expose form submission method to parent components
  React.useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(new Event('submit') as any);
    }
  }));

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
      <Form.Group controlId="activityColor" className="mb-3">
        <Form.Label>Color</Form.Label>
        <Dropdown>
          <Dropdown.Toggle 
            variant="outline-secondary" 
            id="color-dropdown"
            className="w-100 d-flex align-items-center justify-content-between"
            style={{ textAlign: 'left' }}
          >
            <div className="d-flex align-items-center">
              <div 
                className="me-2 rounded border"
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: activityColors[colorIndex]?.background,
                  borderColor: activityColors[colorIndex]?.border,
                  borderWidth: '2px'
                }}
                aria-hidden="true"
              ></div>
              {getColorName(colorIndex)}
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu className="w-100">
            {activityColors.map((colorSet, index) => (
              <Dropdown.Item 
                key={index} 
                onClick={() => setColorIndex(index)}
                active={index === colorIndex}
                className="d-flex align-items-center"
              >
                <div 
                  className="me-2 rounded border"
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: colorSet.background,
                    borderColor: colorSet.border,
                    borderWidth: '2px'
                  }}
                  aria-hidden="true"
                ></div>
                {getColorName(index)}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {/* Hidden input for form validation */}
        <input 
          type="hidden" 
          value={colorIndex} 
          required 
          aria-required="true"
          aria-label="Selected color index"
        />
      </Form.Group>
    </Form>
  );
});

ActivityForm.displayName = 'ActivityForm';

export default ActivityForm;
