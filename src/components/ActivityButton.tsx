import React from 'react';
import { Button, Card, Badge } from 'react-bootstrap';
import { Activity } from '../types/activity';
import { getActivityColorsForTheme } from '../utils/colors';
import { useThemeReactive } from '../hooks/useThemeReactive';
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
  const { id, name, colorIndex } = activity;
  const theme = useThemeReactive();
  const themeColors = getActivityColorsForTheme(theme);
  const colors = themeColors[colorIndex] || themeColors[0]; // Fallback to first color if index out of bounds
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

  // Extract word wrap styles to avoid duplication
  const wordWrapStyles = {
    wordWrap: 'break-word' as const,
    overflowWrap: 'break-word' as const,
  };

  return (
    <Card 
      className={`${isCompleted ? 'border-success' : ''}`}
      style={colors ? {
        backgroundColor: colors.background,
        borderColor: colors.border
      } : undefined}
    >
      <Card.Body className="py-2 px-3">
        <div className="d-flex justify-content-between align-items-center">
          {/* Left side: Activity name */}
          <div className="d-flex flex-column flex-grow-1">
            <h6 
              className={`fw-bold mb-0 ${isCompleted ? 'text-success' : ''}`}
              style={colors ? { 
                color: colors.text,
                ...wordWrapStyles
              } : wordWrapStyles}
            >
              {name}
            </h6>
          </div>

          {/* Right side: Status badge and action buttons */}
          <div className="d-flex align-items-center gap-2 flex-shrink-0" style={{ minHeight: '32px' }}>
            {/* Status Badge */}
            {isRunning && (
              <Badge bg="primary" className="d-flex align-items-center">
                <span className="fw-normal text-white">{formatTime(elapsedTime)}</span>
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
            
            {/* Action buttons */}
            {!isCompleted && (
              <div className="d-flex gap-1">
                <Button
                  variant={isRunning ? "success" : "primary"}
                  size="sm"
                  onClick={handleClick}
                  disabled={isCompleted}
                  className="text-nowrap"
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
                    className={`text-nowrap ${isInUse ? "disabled" : ""}`}
                    title={isInUse ? "Can't remove while activity is in use" : "Remove activity"}
                    aria-label="Remove"
                    data-testid={`remove-activity-${name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ActivityButton;
export { ActivityButton };