import React from 'react';
import { Activity } from '../types/activity';
import { getActivityColorsForTheme } from '../utils/colors';
import { useThemeReactive } from '../hooks/useThemeReactive';
import { TimelineEntry } from '@/types';
import { formatTime } from '@/utils/timeUtils';
import Material3Card from '@/design-system/components/Card';
import Material3Button from '@/design-system/components/Button';

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

  return (
    <Material3Card 
      className={`${isCompleted ? 'border-success-container' : ''} cursor-pointer transition-all duration-200 hover:shadow-md`}
      style={colors ? {
        backgroundColor: colors.background,
        borderColor: colors.border
      } : undefined}
      onClick={handleClick}
    >
      <div className="py-3 px-4">
        <div className="flex justify-between items-center">
          {/* Left side: Activity name */}
          <div className="flex flex-col flex-grow">
            <h6 
              className={`font-medium mb-0 break-words ${isCompleted ? 'text-success' : ''}`}
              style={colors ? { 
                color: colors.text,
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              } : {
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {name}
            </h6>
          </div>

          {/* Right side: Status badge and action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0" style={{ minHeight: '32px' }}>
            {/* Status Badge */}
            {isRunning && (
              <div className="bg-primary text-on-primary px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <span className="text-white">{formatTime(elapsedTime)}</span>
              </div>
            )}
            {isCompleted && (
              <div 
                className="bg-success-container text-on-success-container px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                title="Completed"
                aria-label="Completed"
              >
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Done
              </div>
            )}
            
            {/* Action buttons */}
            {!isCompleted && (
              <div className="flex gap-1">
                <Material3Button
                  variant={isRunning ? "filled" : "filled"}
                  size="small"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  disabled={isCompleted}
                  className="whitespace-nowrap"
                  title={isRunning ? "Complete" : "Start"}
                  aria-label={isRunning ? "Complete" : "Start"}
                  data-testid={`${isRunning ? 'complete' : 'start'}-activity-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                >
                  {isRunning ? (
                    <>
                      <svg className="mr-1" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Complete
                    </>
                  ) : (
                    <>
                      <svg className="mr-1" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Start
                    </>
                  )}
                </Material3Button>
                
                {onRemove && (
                  <Material3Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleRemove(e);
                    }}
                    disabled={isInUse}
                    className={`whitespace-nowrap ${isInUse ? "opacity-50" : ""}`}
                    title={isInUse ? "Can't remove while activity is in use" : "Remove activity"}
                    aria-label="Remove"
                    data-testid={`remove-activity-${name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </Material3Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Material3Card>
  );
};

export default ActivityButton;
export { ActivityButton };