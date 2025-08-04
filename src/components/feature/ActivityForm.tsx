
import React, { useState } from 'react';
import { Form, Dropdown, Button, InputGroup } from 'react-bootstrap';
import { Activity } from '../../types/activity';
import { getColorName } from '../../utils/colorNames';
import { getActivityColorsForTheme, getSmartColorIndex } from '../../utils/colors';
import { useThemeReactive } from '../../hooks/useThemeReactive';

// Constants
const PLACEHOLDER_TEXT = "Quick add activity name";

interface ActivityFormProps {
  activity?: Activity | null;
  onSubmit?: (activity: Activity | null) => void;
  onAddActivity?: (activity: Activity) => void;
  error?: string | null;
  isDisabled?: boolean;
  existingActivities?: Activity[]; // New prop for smart color selection
  isSimplified?: boolean; // New prop to determine if form should be simplified (timeline context vs modal context)
}

interface ActivityFormRef {
  submitForm: () => void;
}

const ActivityForm = React.memo(React.forwardRef<ActivityFormRef, ActivityFormProps>(
  ({ activity, onSubmit, onAddActivity, error, existingActivities = [], isDisabled = false, isSimplified = false }, ref) => {
  const [name, setName] = useState(activity?.name || '');
  const [description, setDescription] = useState(activity?.description || '');
  // Use smart color selection for default if no activity is provided
  const defaultColorIndex = activity?.colorIndex ?? getSmartColorIndex(existingActivities);
  const [colorIndex, setColorIndex] = useState(defaultColorIndex);
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
    if (!name || !name.trim() || isDisabled) {
      if (nameInputRef.current && !isDisabled) {
        nameInputRef.current.focus();
      }
      onSubmit?.(null); // Signal error to parent
      return;
    }
    
    // Generate ID and timestamp safely to prevent hydration issues
    // Only generate ID when actually submitting, not during render
    const generateId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      // Fallback that's deterministic during SSR
      return `activity-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };
    
    const activityId = activity?.id || generateId();
    const timestamp = activity?.createdAt || new Date().toISOString();
    
    const activityData = {
      id: activityId,
      name: name.trim(), // Trim the name
      description: isSimplified ? '' : description, // Auto-empty description in simplified mode
      colorIndex: Number(colorIndex),
      createdAt: timestamp,
      isActive: true,
    };
    
    // Call the appropriate callback based on what's provided
    if (onSubmit) {
      onSubmit(activityData);
    } else if (onAddActivity) {
      onAddActivity(activityData);
      // Clear form after successful add
      setName('');
      setDescription('');
      // Reset to smart color selection for next activity
      setColorIndex(getSmartColorIndex([...existingActivities, activityData]));
      setValidated(false);
    }
  };

  return (
    <Form 
      noValidate 
      validated={validated} 
      onSubmit={handleSubmit} 
      aria-label="Activity Form"
      data-testid="activity-form"
    >
      {isSimplified ? (
        // Simplified inline layout for timeline/compact usage
        <>
          <InputGroup data-testid="activity-form-input-group">
            <Form.Control
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              aria-required="true"
              autoFocus
              ref={nameInputRef}
              isInvalid={!!error}
              disabled={isDisabled}
              placeholder={PLACEHOLDER_TEXT}
              aria-label="Activity name"
            />
            {onAddActivity && (
              <Button 
                type="submit"
                variant="primary"
                disabled={isDisabled}
              >
                Add Activity
              </Button>
            )}
          </InputGroup>
          {/* Error message for simplified mode */}
          {error && (
            <div 
              data-testid="activity-form-error" 
              className="text-danger mt-2" 
              style={{ fontSize: '0.875rem' }}
            >
              {error}
            </div>
          )}
        </>
      ) : (
        // Full vertical layout for modal usage
        <>
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
              disabled={isDisabled}
            />
            <Form.Control.Feedback type="invalid" data-testid="activity-form-error">
              {error ? error : ''}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group controlId="activityDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={isDisabled}
            />
          </Form.Group>
          <Form.Group controlId="activityColor" className="mb-3">
            <Form.Label>Color</Form.Label>
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-secondary" 
                id="activityColor"
                className="w-100 d-flex align-items-center justify-content-between"
                style={{ textAlign: 'left' }}
                disabled={isDisabled}
                aria-describedby="activityColor"
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
          
          {/* Submit button - only show for standalone usage (not in modal) */}
          {onAddActivity && (
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isDisabled}
              className="w-100"
            >
              Add Activity
            </Button>
          )}
        </>
      )}
    </Form>
  );
}), (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if these specific props change
  return (
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.isSimplified === nextProps.isSimplified &&
    prevProps.existingActivities === nextProps.existingActivities &&
    prevProps.activity === nextProps.activity &&
    prevProps.error === nextProps.error &&
    prevProps.onSubmit === nextProps.onSubmit &&
    prevProps.onAddActivity === nextProps.onAddActivity
  );
});

ActivityForm.displayName = 'ActivityForm';

export default ActivityForm;
