import React, { useState } from 'react';
import { Activity } from '../types/activity';
import { getActivityColorsForTheme } from '../utils/colors';
import { useThemeReactive } from '../hooks/useThemeReactive';
import { TimelineEntry } from '@/types';
import { formatTime } from '@/utils/timeUtils';
import { Material3Container } from './ui/Material3Container';
import { Material3Button, Material3IconButton } from './ui/Material3Button';
import { useMotionSystem } from '@/hooks/useMotionSystem';
import styles from './ActivityButtonMaterial3.module.css';

interface ActivityButtonMaterial3Props {
  activity: Activity;
  isCompleted: boolean;
  isRunning: boolean;
  onSelect: (activity: Activity) => void;
  onRemove?: (id: string) => void;
  timelineEntries?: TimelineEntry[];
  elapsedTime?: number;
}

/**
 * Material 3 Expressive ActivityButton component
 * 
 * Replaces Bootstrap list items with Material 3 Expressive activity cards featuring:
 * - Organic card shapes with varied corner radius
 * - Dynamic color application based on activity state and theme
 * - Expressive hover and focus states with scale and elevation changes
 * - Contextual action buttons with Material 3 styling
 * - Enhanced visual feedback for running, completed, and idle states
 */
const ActivityButtonMaterial3: React.FC<ActivityButtonMaterial3Props> = ({
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
  const colors = themeColors[colorIndex] || themeColors[0];
  const isInUse = timelineEntries?.some(entry => entry.activityId === id);
  const motionSystem = useMotionSystem();
  
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onSelect(activity);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(id);
    }
  };

  // Determine container state based on activity status
  const getContainerState = () => {
    if (isRunning) return 'active';
    if (isCompleted) return 'success';
    return 'default';
  };

  // Determine color role based on activity status
  const getColorRole = () => {
    if (isRunning) return 'primary';
    if (isCompleted) return 'tertiary';
    return 'surfaceContainer';
  };

  // Get elevation based on state
  const getElevation = () => {
    if (isRunning) return 'level2';
    if (isCompleted) return 'level1';
    return 'level1';
  };

  // Generate dynamic styles based on activity colors and state
  const getDynamicStyles = () => {
    if (!colors) return {};
    
    const baseStyles: React.CSSProperties = {
      '--activity-bg-color': colors.background,
      '--activity-text-color': colors.text,
      '--activity-border-color': colors.border,
    } as React.CSSProperties;

    // Add state-specific color overrides
    if (isRunning) {
      (baseStyles as any)['--activity-accent-color'] = 'var(--md-sys-color-primary)';
    } else if (isCompleted) {
      (baseStyles as any)['--activity-accent-color'] = 'var(--md-sys-color-tertiary)';
    } else {
      (baseStyles as any)['--activity-accent-color'] = colors.border;
    }

    return baseStyles;
  };

  // Status badge component
  const StatusBadge = () => {
    if (isRunning) {
      return (
        <div className={styles.statusBadge} data-status="running">
          <span className={styles.statusText}>
            {formatTime(elapsedTime)}
          </span>
        </div>
      );
    }
    
    if (isCompleted) {
      return (
        <div className={styles.statusBadge} data-status="completed">
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span className={styles.statusText}>Done</span>
        </div>
      );
    }
    
    return null;
  };

  // Action buttons component
  const ActionButtons = () => {
    if (isCompleted) return null;

    return (
      <div className={styles.actionButtons}>
        <Material3Button
          variant={isRunning ? "tonal" : "filled"}
          size="small"
          colorRole={isRunning ? "tertiary" : "primary"}
          onClick={handleClick}
          startIcon={
            isRunning ? (
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            ) : (
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )
          }
          className={styles.primaryAction}
          data-testid={`${isRunning ? 'complete' : 'start'}-activity-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
        >
          {isRunning ? 'Complete' : 'Start'}
        </Material3Button>
        
        {onRemove && (
          <Material3IconButton
            variant="outlined"
            size="small"
            colorRole="error"
            disabled={isInUse}
            onClick={handleRemove}
            icon={
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            }
            aria-label={isInUse ? "Can't remove while activity is in use" : "Remove activity"}
            title={isInUse ? "Can't remove while activity is in use" : "Remove activity"}
            className={styles.removeAction}
            data-testid={`remove-activity-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          />
        )}
      </div>
    );
  };

  return (
    <Material3Container
      variant="elevated"
      elevation={getElevation()}
      shape="activityCard"
      colorRole={getColorRole()}
      contentState={getContainerState()}
      interactive={!isCompleted}
      enableMotion={true}
      className={`${styles.activityCard} ${isCompleted ? styles.completed : ''} ${isRunning ? styles.running : ''}`}
      style={getDynamicStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.cardContent}>
        {/* Activity name and info */}
        <div className={styles.activityInfo}>
          <h6 className={styles.activityName}>
            {name}
          </h6>
          <StatusBadge />
        </div>

        {/* Action buttons */}
        <ActionButtons />
      </div>

      {/* Running indicator */}
      {isRunning && (
        <div className={styles.runningIndicator} aria-hidden="true" />
      )}

      {/* Completed indicator */}
      {isCompleted && (
        <div className={styles.completedIndicator} aria-hidden="true" />
      )}
    </Material3Container>
  );
};

export default ActivityButtonMaterial3;
export { ActivityButtonMaterial3 };