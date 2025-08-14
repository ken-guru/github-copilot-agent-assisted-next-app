import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { getNextAvailableColorSet, ColorSet } from '../utils/colors';
import { TimelineEntry } from '@/types';
import { ActivityButton } from './ActivityButton';
import TimerProgressSection from './TimerProgressSection';
import ActivityFormSection from './ActivityFormSection';
import { getActivitiesInOrder, addActivity as persistActivity, deleteActivity as persistDeleteActivity } from '../utils/activity-storage';
import { Activity as CanonicalActivity } from '../types/activity';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useKeyboardReordering } from '../hooks/useKeyboardReordering';

// Use canonical Activity type
type Activity = CanonicalActivity & { colors?: ColorSet };

interface ActivityManagerProps {
  onActivitySelect: (activity: Activity | null, justAdd?: boolean) => void;
  onActivityRemove?: (activityId: string) => void;
  onActivityRestore?: (activityId: string) => void;
  currentActivityId: string | null;
  completedActivityIds: string[];
  removedActivityIds?: string[];
  timelineEntries: TimelineEntry[];
  isTimeUp?: boolean;
  elapsedTime?: number;
  // Progress bar props
  totalDuration?: number;
  timerActive?: boolean;
  // Reset callback for session/timer reset
  onReset?: () => void;
  // Extend duration callback for adding 1 minute
  onExtendDuration?: () => void;
}

export default function ActivityManager({ 
  onActivitySelect, 
  onActivityRemove,
  onActivityRestore,
  currentActivityId, 
  completedActivityIds,
  removedActivityIds = [],
  timelineEntries,
  elapsedTime = 0,
  totalDuration = 0,
  timerActive = false,
  onReset,
  onExtendDuration
}: ActivityManagerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showHiddenList, setShowHiddenList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReorderingState, setIsReorderingState] = useState(false);
  
  // State preservation for form values during unmount/remount cycles
  const [preservedFormValues, setPreservedFormValues] = useState<{
    name: string;
    description: string;
  }>({
    name: '',
    description: ''
  });

  // Memoize activity IDs to prevent unnecessary re-renders in reordering hooks
  const activityIds = useMemo(() => activities.map(activity => activity.id), [activities]);

  // Memoize visible and hidden activities to prevent unnecessary re-renders
  const { visibleActivities, hiddenActivities } = useMemo(() => {
    const hiddenSet = new Set(removedActivityIds);
    return {
      visibleActivities: activities.filter(a => !hiddenSet.has(a.id)),
      hiddenActivities: activities.filter(a => hiddenSet.has(a.id))
    };
  }, [activities, removedActivityIds]);

  // Memoize reorder callback to prevent unnecessary re-renders
  const handleReorder = useCallback((newOrder: string[]) => {
    setIsReorderingState(true);
    // Re-fetch activities in new order to trigger re-render
    const reorderedActivities = getActivitiesInOrder().filter(a => a.isActive);
    setActivities(reorderedActivities);
    // Add a small delay to show the reordering animation
    setTimeout(() => setIsReorderingState(false), 150);
  }, []);

  // Drag and drop functionality
  const {
    state: dragState,
    handlers: dragHandlers,
    getActivityClasses,
    isActivityDragged,
    isActivityDraggedOver,
    cleanup: cleanupDragAndDrop
  } = useDragAndDrop(activityIds, {
    onReorder: handleReorder
  });

  // Keyboard reordering functionality
  const {
    focusedItem,
    isReordering,
    handleKeyDown,
    setFocusedItem,
    clearAnnouncements
  } = useKeyboardReordering({
    activityIds,
    onReorder: handleReorder
  });

  // Load activities from localStorage on mount using custom order
  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true);
      try {
        const loadedActivities = getActivitiesInOrder().filter(a => a.isActive);
        setActivities(loadedActivities);
        // Register activities in state machine
        loadedActivities.forEach(activity => {
          onActivitySelect(activity, true);
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadActivities();
  }, [onActivitySelect]);

  // Listen for theme changes
  useEffect(() => {
    const updateColors = () => {
      setActivities(currentActivities => 
        currentActivities.map(activity => ({
          ...activity,
          colors: getNextAvailableColorSet(activity.colorIndex)
        }))
      );
    };

    // Update colors when theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateColors);

    // Update colors when manually switching themes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateColors();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      mediaQuery.removeEventListener('change', updateColors);
      observer.disconnect();
    };
  }, []);

  // Cleanup reordering hooks on unmount
  useEffect(() => {
    return () => {
      cleanupDragAndDrop();
      clearAnnouncements();
    };
  }, [cleanupDragAndDrop, clearAnnouncements]);

  const handleAddActivity = useCallback((newActivity: Activity) => {
    // Activity already has smart color selection from the form
    const activityWithColors: Activity = {
      ...newActivity,
      colors: getNextAvailableColorSet(newActivity.colorIndex)
    };
    setActivities(prev => [...prev, activityWithColors]);
    persistActivity(newActivity); // Persist without the colors property which is UI-only
    onActivitySelect(activityWithColors, true);
    
    // Clear preserved form values after successful submission
    setPreservedFormValues({ name: '', description: '' });
  }, [onActivitySelect]);

  const handleActivitySelect = useCallback((activity: Activity) => {
    if (activity.id === currentActivityId) {
      onActivitySelect(null);
    } else {
      onActivitySelect({
        ...activity,
        colors: activity.colors || getNextAvailableColorSet(activity.colorIndex || 0)
      });
    }
  }, [currentActivityId, onActivitySelect]);

  const handleRemoveActivity = useCallback((id: string) => {
    if (timerActive) {
      // Session-only hide/skip: do NOT persist delete
      if (id === currentActivityId) {
        onActivitySelect(null);
      }
      if (onActivityRemove) {
        onActivityRemove(id);
      }
    } else {
      // CRUD-like behavior (not typical for this component, but preserve existing logic)
      if (id === currentActivityId) {
        onActivitySelect(null);
      }
      setActivities(prev => prev.filter(activity => activity.id !== id));
      persistDeleteActivity(id);
      if (onActivityRemove) {
        onActivityRemove(id);
      }
    }
  }, [currentActivityId, onActivitySelect, onActivityRemove, timerActive]);

  const handleRestoreActivity = useCallback((id: string) => {
    onActivityRestore?.(id);
  }, [onActivityRestore]);

  const handleExtendDuration = useCallback(() => {
    if (onExtendDuration) {
      onExtendDuration();
    }
  }, [onExtendDuration]);

  const handleResetSession = useCallback(() => {
    // Clear preserved form values on session reset
    setPreservedFormValues({ name: '', description: '' });
  setShowHiddenList(false);
    // Call global reset function to reset timer/session
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  // Callback to update preserved form values as user types
  const handleFormValuesChange = useCallback((values: { name: string; description: string }) => {
    setPreservedFormValues(values);
  }, []);

  // Calculate overtime status - show overtime if elapsed time exceeds total duration
  // This handles both zero-duration starts and normal overtime scenarios
  const isOvertime = elapsedTime > totalDuration;
  const timeOverage = isOvertime ? Math.floor(elapsedTime - totalDuration) : 0;

  // Memoized activity lists are calculated above to prevent unnecessary re-renders

  return (
    <Card className="h-100 d-flex flex-column" data-testid="activity-manager">
      <Card.Header className="card-header-consistent">
        <h5 className="mb-0">Activities</h5>
        <div className="d-flex gap-2">
          {onExtendDuration && (
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={handleExtendDuration}
              className="d-flex align-items-center"
              title="Add 1 minute to session duration"
            >
              <i className="bi bi-plus-circle me-2"></i>
              1 min
            </Button>
          )}
          {onReset && (
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleResetSession}
              className="d-flex align-items-center"
              title="Reset session and return to time setup"
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Reset
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body className="d-flex flex-column flex-grow-1 overflow-hidden p-3">
        {/* Timer Progress Section - isolated from activity form */}
        <TimerProgressSection
          entries={timelineEntries}
          totalDuration={totalDuration}
          elapsedTime={elapsedTime}
          timerActive={timerActive}
        />
        
        {/* Activity Form Section - isolated from timer updates */}
        <ActivityFormSection
          activities={activities}
          preservedFormValues={preservedFormValues}
          onAddActivity={handleAddActivity}
          onFormValuesChange={handleFormValuesChange}
          showOvertimeWarning={isOvertime}
          timeOverage={timeOverage}
          isSimplified={timerActive || (activities.length > 0 && timelineEntries.length === 0)} // Simplified when timer is active or when activities exist but timer hasn't started
        />
        
        {/* Activities List - scrollable if needed */}
        <div className="flex-grow-1" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
          {isLoading ? (
            // Loading skeleton
            <Row className="gy-3">
              {[1, 2, 3].map((i) => (
                <Col key={i} xs={12}>
                  <div 
                    className="skeleton" 
                    style={{ 
                      height: '80px', 
                      borderRadius: 'var(--radius-md)',
                      animation: `skeleton 1.5s infinite ${i * 0.2}s`
                    }} 
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Row className={`gy-3 ${isReorderingState ? 'reordering' : ''}`} data-testid="activity-list">
              {visibleActivities.map((activity, index) => (
                <Col 
                  key={activity.id} 
                  xs={12}
                  data-testid={`activity-column-${activity.id}`}
                  className={`${getActivityClasses(activity.id)} fadeIn`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                <ActivityButton
                  activity={activity}
                  isCompleted={completedActivityIds.includes(activity.id)}
                  isRunning={activity.id === currentActivityId}
                  onSelect={handleActivitySelect}
                  onRemove={onActivityRemove ? handleRemoveActivity : undefined}
                  timelineEntries={timelineEntries}
                  elapsedTime={elapsedTime}
                  // Drag and drop props
                  draggable={true}
                  onDragStart={() => dragHandlers.handleDragStart(activity.id)}
                  onDragOver={() => dragHandlers.handleDragOver(activity.id)}
                  onDragEnter={() => dragHandlers.handleDragEnter(activity.id)}
                  onDragLeave={() => dragHandlers.handleDragLeave()}
                  onDragEnd={() => dragHandlers.handleDragEnd()}
                  onDrop={() => dragHandlers.handleDrop(activity.id)}
                  isDragging={isActivityDragged(activity.id)}
                  isDraggedOver={isActivityDraggedOver(activity.id)}
                  // Touch event props
                  onTouchStart={(activityId, event) => dragHandlers.handleTouchStart(activityId, event)}
                  onTouchMove={(event) => dragHandlers.handleTouchMove(event)}
                  onTouchEnd={(event) => dragHandlers.handleTouchEnd(event)}
                  onTouchCancel={() => dragHandlers.handleTouchCancel()}
                  // Keyboard reordering props
                  onKeyDown={(e) => handleKeyDown(e, activity.id)}
                  onFocus={() => setFocusedItem(activity.id)}
                  onBlur={() => setFocusedItem(null)}
                  isFocused={focusedItem === activity.id}
                  isReordering={isReordering}
                />
                </Col>
              ))}
            </Row>
          )}

          {/* Hidden activities control */}
          {hiddenActivities.length > 0 && (
            <div className="mt-3">
              <Button
                variant="outline-secondary"
                size="sm"
                className="d-inline-flex align-items-center hidden-activities-toggle"
                onClick={() => setShowHiddenList(v => !v)}
                data-testid="toggle-hidden-activities"
              >
                <i className={`bi ${showHiddenList ? 'bi-eye-slash' : 'bi-eye'} me-2`} />
                {showHiddenList ? 'Hide' : 'Show'} {hiddenActivities.length} hidden {hiddenActivities.length === 1 ? 'activity' : 'activities'}
              </Button>

              {showHiddenList && (
                <div
                  className="hidden-activities-panel bg-body-tertiary border rounded-3 p-2 mt-2"
                  data-testid="hidden-activities-panel"
                >
                  {hiddenActivities.map((activity) => (
                    <div key={activity.id} className="d-flex justify-content-between align-items-center py-1">
                      <span className="text-body-secondary small">{activity.name}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="px-2 py-1"
                        onClick={() => handleRestoreActivity(activity.id)}
                        data-testid={`restore-activity-${activity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      >
                        Restore
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}