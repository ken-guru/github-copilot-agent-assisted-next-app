import React, { useState, forwardRef, useId } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ActivityFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onAddActivity: (activityName: string) => void | Promise<void>;
  isDisabled?: boolean;
  className?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

const ActivityForm = forwardRef<HTMLFormElement, ActivityFormProps>(
  ({ onAddActivity, isDisabled = false, className = '', ...props }, ref) => {
    const [activityName, setActivityName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [submitError, setSubmitError] = useState<string | null>(null);
    
    const inputId = useId();
    const errorId = useId();
    const helpTextId = useId();

    const validateActivityName = (name: string): ValidationError[] => {
      const trimmedName = name.trim();
      const errors: ValidationError[] = [];

      if (!trimmedName) {
        errors.push({
          field: 'activityName',
          message: 'Activity name is required'
        });
      } else if (trimmedName.length < 2) {
        errors.push({
          field: 'activityName',
          message: 'Activity name must be at least 2 characters'
        });
      } else if (trimmedName.length > 100) {
        errors.push({
          field: 'activityName',
          message: 'Activity name must be 100 characters or less'
        });
      }

      return errors;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setActivityName(newValue);
      
      // Clear validation errors when user starts typing
      if (errors.length > 0) {
        setErrors([]);
      }
      
      // Clear submit error when user starts typing
      if (submitError) {
        setSubmitError(null);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setActivityName('');
        setErrors([]);
        setSubmitError(null);
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (isDisabled || isSubmitting) {
        return;
      }

      const validationErrors = validateActivityName(activityName);
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      try {
        setIsSubmitting(true);
        setErrors([]);
        setSubmitError(null);
        
        await onAddActivity(activityName.trim());
        
        // Clear form on successful submission
        setActivityName('');
      } catch (error) {
        setSubmitError('Failed to add activity. Please try again.');
        console.error('Error adding activity:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const hasErrors = errors.length > 0;
    const activityNameError = errors.find(error => error.field === 'activityName');

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        noValidate
        role="form"
        className={`space-y-4 ${isDisabled ? 'disabled' : ''} ${className}`}
        {...props}
      >
        <div className="space-y-2">
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Activity Name
          </label>
          
          <Input
            id={inputId}
            type="text"
            value={activityName}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isDisabled 
                ? "Form is disabled" 
                : "Enter activity name..."
            }
            disabled={isDisabled}
            required
            aria-describedby={helpTextId}
            aria-invalid={hasErrors}
            className={`w-full ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          
          <div id={helpTextId} className="sr-only">
            Enter a name for your new activity (2-100 characters)
          </div>
          
          {activityNameError && (
            <p
              id={errorId}
              className="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {activityNameError.message}
            </p>
          )}
        </div>

        {submitError && (
          <div
            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
            role="alert"
          >
            <p className="text-sm text-red-700 dark:text-red-400">
              {submitError}
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isDisabled || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Adding...' : 'Add Activity'}
        </Button>
      </form>
    );
  }
);

ActivityForm.displayName = 'ActivityForm';

export default ActivityForm;
