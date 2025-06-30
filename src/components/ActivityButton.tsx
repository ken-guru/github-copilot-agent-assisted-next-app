import React from 'react';
import { Button, Card, Badge, ButtonGroup } from 'react-bootstrap';
import { Activity } from './ActivityManager';
import { TimelineEntry } from '@/types';
import { formatTime } from '@/utils/timeUtils';

interface ActivityButtonProps {
  activity: Activity;
  isCompleted: boolean;
  isRunning: boolean;
  onSelect: (activity: Activity) => void;
  onRemove?: (id: string) => void;
  timelineEntries?: TimelineEntry[];
  elapsedTime?: number;
}

/**
 * ActivityButton component for displaying and interacting with activity items
 * Migrated to use Bootstrap components for consistent styling
 */
const ActivityButton: React.FC<ActivityButtonProps> = ({
  activity,
  isCompleted,
  isRunning,
  onSelect,
  onRemove,
  timelineEntries = [],
  elapsedTime = 0,
}) => {
  const { id, name, colors } = activity;
  const isInUse = timelineEntries?.some(entry => entry.activityId === id);
  
  const handleClick = () => {
    onSelect(activity);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(id);
    }
  };

  // Calculate duration from timeline entries for completed activities
  const calculateDuration = () => {
    if (!timelineEntries.length || !isCompleted) return null;
    
    let totalDuration = 0;
    timelineEntries.forEach(entry => {
      if (entry.activityId === id) {
        const endTime = entry.endTime || Date.now();
        totalDuration += endTime - entry.startTime;
      }
    });
    
    const seconds = Math.floor(totalDuration / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const duration = calculateDuration();

  return (
    <Card 
      className={`h-100 ${isCompleted ? 'border-success' : ''}`}
      style={colors ? {
        backgroundColor: colors.background,
        borderColor: colors.border
      } : undefined}
    >
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 
            className={`fw-bold mb-1 ${isCompleted ? 'text-success' : ''}`}
            style={colors ? { color: colors.text } : undefined}
          >
            {name}
          </h6>
          
          {/* Status Badge */}
          <div className="d-flex flex-column align-items-end gap-1">
            {isRunning && (
              <Badge bg="primary" className="d-flex align-items-center gap-1">
                <span className="fw-normal small text-muted">{formatTime(elapsedTime)}</span>
              </Badge>
            )}
            {isCompleted && (
              <Badge 
                bg="success"
                className="d-flex align-items-center gap-1"
                title="Completed"
                aria-label="Completed"
              >
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Done
              </Badge>
            )}
          </div>
        </div>

        {/* Duration Display */}
        {duration && (
          <div className="text-muted small mb-2">
            <span className="text-muted">{duration}</span>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="mt-auto">
          {!isCompleted && (
            <ButtonGroup className="d-flex gap-2 w-100">
              <Button
                variant={isRunning ? "success" : "primary"}
                size="sm"
                onClick={handleClick}
                disabled={isCompleted}
                className="flex-grow-1"
                title={isRunning ? "Complete" : "Start"}
                aria-label={isRunning ? "Complete" : "Start"}
                data-testid={`${isRunning ? 'complete' : 'start'}-activity-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              >
                {isRunning ? (
                  <>
                    <svg className="me-1" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Complete
                  </>
                ) : (
                  <>
                    <svg className="me-1" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Start
                  </>
                )}
              </Button>
              
              {onRemove && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isInUse}
                  className={isInUse ? "disabled" : ""}
                  title={isInUse ? "Can't remove while activity is in use" : "Remove activity"}
                  aria-label="Remove"
                  data-testid={`remove-activity-${name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </Button>
              )}
            </ButtonGroup>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ActivityButton;
export { ActivityButton };