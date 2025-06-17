import React from 'react';
import { Button } from 'react-bootstrap';
import type { Activity } from '@components/feature/ActivityManager';

/**
 * Props for the ActivityButton component
 *
 * @interface ActivityButtonProps
 */
export interface ActivityButtonProps {
  /** The activity to display in this button */
  activity: Activity;

  /** Whether this activity has been completed */
  isCompleted: boolean;

  /** Whether this activity is currently active/selected */
  isActive: boolean;

  /**
   * Handler for when the activity button is clicked
   *
   * @returns {void}
   */
  onClick: () => void;

  /**
   * Handler for when the remove button is clicked
   *
   * @returns {void}
   */
  onRemove: () => void;

  /** Whether the button is disabled */
  disabled: boolean;
}

export function ActivityButton({
  activity,
  isCompleted,
  isActive,
  onClick,
  onRemove,
  disabled,
}: ActivityButtonProps) {
  const buttonVariant = () => {
    if (isCompleted) return 'success';
    if (isActive) return 'primary';
    return 'secondary';
  };

  return (
    <div className="d-flex align-items-center mb-2">
      <Button
        variant={buttonVariant()}
        onClick={onClick}
        disabled={disabled || isCompleted}
        className={`flex-grow-1 me-2 ${isActive ? 'active' : ''}`}
        data-testid={`activity-button-${activity.id}`}
        aria-label={activity.name}
        aria-pressed={isActive}
      >
        <span>{activity.name}</span>
        {isCompleted && (
          <span className="ms-2 badge bg-light text-dark">Completed</span>
        )}
      </Button>
      <span className="d-inline-block">
        <Button
          variant="danger"
          size="sm"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remove ${activity.name}`}
          data-testid={`remove-activity-${activity.id}-button`}
        >
          &times;
        </Button>
      </span>
    </div>
  );
}
