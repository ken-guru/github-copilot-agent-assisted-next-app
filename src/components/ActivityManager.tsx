import { useState, useEffect } from 'react';
import { Card, Row, Col, Alert, Button } from 'react-bootstrap';
import { getNextAvailableColorSet, ColorSet } from '../utils/colors';
import { TimelineEntry } from '@/types';
import { ActivityButton } from './ActivityButton';
import ActivityForm from './ActivityForm';
import ProgressBar from './ProgressBar';
import { getActivities, addActivity as persistActivity, deleteActivity as persistDeleteActivity, resetActivitiesToDefault } from '../utils/activity-storage';
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
  // Reset callback
  onActivitiesReset?: () => void;
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
  onActivitiesReset
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

  const getNextColorIndex = (): number => {
    let index = 0;
    while (assignedColorIndices.includes(index)) {
      index++;
    }
    return index;
  };

  const handleAddActivity = (activityName: string) => {
    const nextColorIndex = getNextColorIndex();
    const newActivity: Activity = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name: activityName,
      colorIndex: nextColorIndex,
      createdAt: new Date().toISOString(),
      isActive: true,
      colors: getNextAvailableColorSet(nextColorIndex)
    };
    setAssignedColorIndices([...assignedColorIndices, nextColorIndex]);
    setActivities([...activities, newActivity]);
    persistActivity(newActivity);
    onActivitySelect(newActivity, true);
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

  const handleResetActivities = () => {
    // Reset to default activities
    resetActivitiesToDefault();
    
    // Reload activities from storage
    const loadedActivities = getActivities().filter(a => a.isActive);
    setActivities(loadedActivities);
    setAssignedColorIndices(loadedActivities.map(a => a.colorIndex));
    
    // Register activities in state machine
    loadedActivities.forEach(activity => {
      onActivitySelect(activity, true);
    });
    
    // Call parent reset if provided
    if (onActivitiesReset) {
      onActivitiesReset();
    }
  };

  return (
    <Card className="h-100" data-testid="activity-manager">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Activities</h5>
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={handleResetActivities}
          className="d-flex align-items-center"
          title="Reset to default activities"
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Reset
        </Button>
      </Card.Header>
      <Card.Body>
        {/* Progress bar - only show when timer is active and has duration */}
        {totalDuration > 0 && timerActive && (
          <div className="mb-4">
            <ProgressBar 
              entries={timelineEntries}
              totalDuration={totalDuration}
              elapsedTime={elapsedTime}
              timerActive={timerActive}
            />
          </div>
        )}
        
        {activities.length === 0 ? (
          <Alert variant="info" className="text-center" data-testid="empty-state">
            No activities defined
          </Alert>
        ) : (
          <Row className="gy-3" data-testid="activity-list">
            <Col xs={12} className="mb-3" data-testid="activity-form-column">
              <ActivityForm
                onAddActivity={handleAddActivity}
                isDisabled={isTimeUp}
              />
            </Col>
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
        )}
      </Card.Body>
    </Card>
  );
}