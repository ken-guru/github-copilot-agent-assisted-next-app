import { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { getNextAvailableColorSet, ColorSet } from '../utils/colors';
import { TimelineEntry } from '@/types';
import { ActivityButton } from './ActivityButton';
import TimerProgressSection from './TimerProgressSection';
import ActivityFormSection from './ActivityFormSection';
import { getActivities, addActivity as persistActivity, deleteActivity as persistDeleteActivity } from '../utils/activity-storage';
import { Activity as CanonicalActivity } from '../types/activity';

// Use canonical Activity type
type Activity = CanonicalActivity & { colors?: ColorSet };

interface ActivityManagerProps {
  onActivitySelect: (activity: Activity | null, justAdd?: boolean) => void;
  onActivityRemove?: (activityId: string) => void;
  currentActivityId: string | null;
  completedActivityIds: string[];
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
  currentActivityId, 
  completedActivityIds,
  timelineEntries,
  // isTimeUp = false,  // Currently unused in this component
  elapsedTime = 0,
  totalDuration = 0,
  timerActive = false,
  onReset,
  onExtendDuration
}: ActivityManagerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  
  // State preservation for form values during unmount/remount cycles
  const [preservedFormValues, setPreservedFormValues] = useState<{
    name: string;
    description: string;
  }>({
    name: '',
    description: ''
  });

  // Load activities from localStorage on mount
  useEffect(() => {
    const loadedActivities = getActivities().filter(a => a.isActive);
    setActivities(loadedActivities);
    // Register activities in state machine
    loadedActivities.forEach(activity => {
      onActivitySelect(activity, true);
    });
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
    if (id === currentActivityId) {
      onActivitySelect(null);
    }
    setActivities(prev => prev.filter(activity => activity.id !== id));
    persistDeleteActivity(id);
    if (onActivityRemove) {
      onActivityRemove(id);
    }
  }, [currentActivityId, onActivitySelect, onActivityRemove]);

  const handleExtendDuration = useCallback(() => {
    if (onExtendDuration) {
      onExtendDuration();
    }
  }, [onExtendDuration]);

  const handleResetSession = useCallback(() => {
    // Clear preserved form values on session reset
    setPreservedFormValues({ name: '', description: '' });
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
          <Row className="gy-3" data-testid="activity-list">
            {activities.map((activity) => (
              <Col 
                key={activity.id} 
                xs={12}
                data-testid={`activity-column-${activity.id}`}
              >
                <ActivityButton
                  activity={activity}
                  isCompleted={completedActivityIds.includes(activity.id)}
                  isRunning={activity.id === currentActivityId}
                  onSelect={handleActivitySelect}
                  onRemove={onActivityRemove ? handleRemoveActivity : undefined}
                  timelineEntries={timelineEntries}
                  elapsedTime={elapsedTime}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
}