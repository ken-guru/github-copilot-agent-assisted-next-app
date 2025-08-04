import { useState, useEffect } from 'react';
import { Card, Row, Col, Alert, Button } from 'react-bootstrap';
import { getNextAvailableColorSet, ColorSet } from '../utils/colors';
import { TimelineEntry } from '@/types';
import { ActivityButton } from './ActivityButton';
import ActivityForm from './feature/ActivityForm';
import OvertimeWarning from './OvertimeWarning';
import ProgressBar from './ProgressBar';
import ClientOnly from './ClientOnly';
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
  isTimeUp = false,
  elapsedTime = 0,
  totalDuration = 0,
  timerActive = false,
  onReset,
  onExtendDuration
}: ActivityManagerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [assignedColorIndices, setAssignedColorIndices] = useState<number[]>([]);

  // Load activities from localStorage on mount
  useEffect(() => {
    const loadedActivities = getActivities().filter(a => a.isActive);
    setActivities(loadedActivities);
    setAssignedColorIndices(loadedActivities.map(a => a.colorIndex));
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

  const handleAddActivity = (newActivity: Activity) => {
    // Activity already has smart color selection from the form
    const activityWithColors: Activity = {
      ...newActivity,
      colors: getNextAvailableColorSet(newActivity.colorIndex)
    };
    setAssignedColorIndices([...assignedColorIndices, newActivity.colorIndex]);
    setActivities([...activities, activityWithColors]);
    persistActivity(newActivity); // Persist without the colors property which is UI-only
    onActivitySelect(activityWithColors, true);
  };

  const handleActivitySelect = (activity: Activity) => {
    if (activity.id === currentActivityId) {
      onActivitySelect(null);
    } else {
      onActivitySelect({
        ...activity,
        colors: activity.colors || getNextAvailableColorSet(activity.colorIndex || 0)
      });
    }
  };

  const handleRemoveActivity = (id: string) => {
    if (id === currentActivityId) {
      onActivitySelect(null);
    }
    const activity = activities.find(a => a.id === id);
    if (activity && typeof activity.colorIndex === 'number') {
      setAssignedColorIndices(assignedColorIndices.filter(i => i !== activity.colorIndex));
    }
    setActivities(activities.filter(activity => activity.id !== id));
    persistDeleteActivity(id);
    if (onActivityRemove) {
      onActivityRemove(id);
    }
  };

  const handleExtendDuration = () => {
    if (onExtendDuration) {
      onExtendDuration();
    }
  };

  const handleResetSession = () => {
    // Call global reset function to reset timer/session
    if (onReset) {
      onReset();
    }
  };

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
        {activities.length === 0 ? (
          <Alert variant="info" className="text-center flex-shrink-0" data-testid="empty-state">
            No activities defined
          </Alert>
        ) : (
          <>
            {/* Progress Bar - always visible at top */}
            <div className="flex-shrink-0 mb-3">
              <ProgressBar 
                entries={timelineEntries}
                totalDuration={totalDuration}
                elapsedTime={elapsedTime}
                timerActive={timerActive}
              />
            </div>
            
            {/* Activity Form or Overtime Warning */}
            <div className="flex-shrink-0 mb-3" data-testid="activity-form-column">
              <ClientOnly fallback={<div style={{ height: '200px' }} />}>
                {isOvertime ? (
                  <OvertimeWarning 
                    timeOverage={timeOverage}
                  />
                ) : (
                  <ActivityForm
                    onAddActivity={handleAddActivity}
                    isDisabled={isTimeUp}
                    isSimplified={true} // Always simplified in timeline context
                    existingActivities={activities}
                  />
                )}
              </ClientOnly>
            </div>
            
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
          </>
        )}
      </Card.Body>
    </Card>
  );
}