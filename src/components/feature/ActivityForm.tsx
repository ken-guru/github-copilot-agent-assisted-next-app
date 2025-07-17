
import React, { useState } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import { Activity } from '../../types/activity';
import { getColorName } from '../../utils/colorNames';
import { getActivityColorsForTheme } from '../../utils/colors';
import { useThemeReactive } from '../../hooks/useThemeReactive';

interface ActivityFormProps {
  activity?: Activity | null;
  onSubmit?: (activity: Activity | null) => void;
  onAddActivity?: (activity: Activity) => void;
  error?: string | null;
  isDisabled?: boolean;
}

interface ActivityFormRef {
  submitForm: () => void;
}

const ActivityForm = React.forwardRef<ActivityFormRef, ActivityFormProps>(
  ({ activity, onSubmit, onAddActivity, error }, ref) => {
  const [name, setName] = useState(activity?.name || '');
  const [description, setDescription] = useState(activity?.description || '');
  const [colorIndex, setColorIndex] = useState(activity?.colorIndex || 0);
  const [validated, setValidated] = useState(false);
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  
  // Get theme using new reactive hook - this ensures component re-renders when theme changes
  const theme = useThemeReactive();
  
  // Get current theme colors for visual display - will be reactive to theme changes
  const activityColors = getActivityColorsForTheme(theme);

  // Expose form submission method to parent components
  React.useImperativeHandle(ref, () => ({
    submitForm: () => {
      // Create a synthetic form event for programmatic submission
      const event = {
        preventDefault: () => {},
        currentTarget: null as unknown as HTMLFormElement,
      } as React.FormEvent<HTMLFormElement>;
      handleSubmit(event);
    }
  }));

  React.useEffect(() => {
    // Focus on error input for accessibility
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
      onSubmit?.(null); // Signal error to parent
      return;
    }
    
    const activityData = {
      id: activity?.id || crypto.randomUUID(),
      name,
      description,
      colorIndex: Number(colorIndex),
      createdAt: activity?.createdAt || new Date().toISOString(),
      isActive: true,
    };
    
    // Call the appropriate callback based on what's provided
    if (onSubmit) {
      onSubmit(activityData);
    } else if (onAddActivity) {
      onAddActivity(activityData);
    }
  };

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
