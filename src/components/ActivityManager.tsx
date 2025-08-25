import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import { getNextAvailableColorSet, ColorSet } from '../utils/colors';
import { TimelineEntry } from '@/types';
import { ActivityButton } from './ActivityButton';
import TimerProgressSection from './TimerProgressSection';
import ActivityFormSection from './ActivityFormSection';
import ShareControls from './ShareControls';
import AddMinuteButton from './AddMinuteButton';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { getActivities, addActivity as persistActivity, deleteActivity as persistDeleteActivity } from '../utils/activity-storage';
import { Activity as CanonicalActivity } from '../types/activity';
import { fetchWithVercelBypass } from '@/utils/fetchWithVercelBypass';
import { useOptionalGlobalTimer } from '@/contexts/GlobalTimerContext';
import { computeProgress } from '@/utils/timerProgress';

// Use canonical Activity type
type Activity = CanonicalActivity & { colors?: ColorSet };

interface ActivityManagerProps {
  onActivitySelect: (activity: Activity | null, justAdd?: boolean) => void;
  onActivityRemove?: (activityId: string) => void;
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
  currentActivityId, 
  completedActivityIds,
  removedActivityIds = [], // eslint-disable-line @typescript-eslint/no-unused-vars
  timelineEntries,
  elapsedTime = 0,
  totalDuration = 0,
  timerActive = false,
  onReset,
  onExtendDuration
}: ActivityManagerProps) {
  // Optional global timer context. If present, prefer it for timer state and actions
  const timerCtx = useOptionalGlobalTimer();

  // Derive effective timer props from context when available, else use provided props
  const effective = useMemo(() => {
    const ctxActive = !!timerCtx?.isTimerRunning;
    const ctxCurrentId = timerCtx?.currentActivity?.id ?? null;
    return {
      timerActive: timerCtx ? ctxActive : timerActive,
      currentActivityId: timerCtx ? ctxCurrentId : currentActivityId,
      totalDuration: timerCtx ? timerCtx.totalDuration : totalDuration,
      // Handlers: prefer props when provided to preserve existing external control
      onReset: onReset ?? (timerCtx ? timerCtx.resetSession : undefined),
      onExtend: onExtendDuration ?? (timerCtx ? timerCtx.addOneMinute : undefined),
      onSelect: onActivitySelect ?? (timerCtx ? (a: Activity | null) => timerCtx.setCurrentActivity(a) : undefined),
    };
  }, [timerCtx, timerActive, currentActivityId, totalDuration, onReset, onExtendDuration, onActivitySelect]);

  const [activities, setActivities] = useState<Activity[]>([]);
  // Unified current activity id used by UI and handlers
  const derivedCurrentActivityId = useMemo(() => effective.currentActivityId ?? currentActivityId, [effective.currentActivityId, currentActivityId]);
  // Completed ids prefer global context when present
  const effectiveCompletedIds = useMemo(
    () => (timerCtx ? timerCtx.completedActivities.map(a => a.id) : completedActivityIds),
    [timerCtx, completedActivityIds]
  );
  
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
      // When using context-backed selection, we only register activities locally
      // and avoid dispatching selection side effects on mount
      if (effective.onSelect && effective.onSelect !== onActivitySelect) {
        // no-op: keep context clean on mount
      } else {
        onActivitySelect(activity, true);
      }
    });
  }, [onActivitySelect, effective.onSelect]);

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
    const isSame = activity.id === derivedCurrentActivityId;
    const target: Activity | null = isSame ? null : {
      ...activity,
      colors: activity.colors || getNextAvailableColorSet(activity.colorIndex || 0)
    };
    if (effective.onSelect && effective.onSelect !== onActivitySelect) {
      // Context-backed selection
      effective.onSelect(target);
    } else {
      onActivitySelect(target);
    }
  }, [derivedCurrentActivityId, effective, onActivitySelect]);

  const handleRemoveActivity = useCallback((id: string) => {
    if (effective.timerActive) {
      // Session-only hide/skip: do NOT persist delete
      if (id === derivedCurrentActivityId) {
        if (effective.onSelect && effective.onSelect !== onActivitySelect) {
          effective.onSelect(null);
        } else {
          onActivitySelect(null);
        }
      }
      if (onActivityRemove) {
        onActivityRemove(id);
      }
    } else {
      // CRUD-like behavior (not typical for this component, but preserve existing logic)
      if (id === derivedCurrentActivityId) {
        if (effective.onSelect && effective.onSelect !== onActivitySelect) {
          effective.onSelect(null);
        } else {
          onActivitySelect(null);
        }
      }
      setActivities(prev => prev.filter(activity => activity.id !== id));
      persistDeleteActivity(id);
      if (onActivityRemove) {
        onActivityRemove(id);
      }
    }
  }, [effective, derivedCurrentActivityId, onActivitySelect, onActivityRemove]);

  const handleExtendDuration = useCallback(() => {
    if (effective.onExtend) {
      effective.onExtend();
    }
  }, [effective]);

  const handleResetSession = useCallback(() => {
    // Clear preserved form values on session reset
    setPreservedFormValues({ name: '', description: '' });
    // Call global reset function to reset timer/session
    if (effective.onReset) {
      effective.onReset();
    }
  }, [effective]);

  // Callback to update preserved form values as user types
  const handleFormValuesChange = useCallback((values: { name: string; description: string }) => {
    setPreservedFormValues(values);
  }, []);

  // Calculate progress and overtime status using shared utility when context is available
  const effectiveTotal = effective.totalDuration ?? totalDuration;
  const contextProgress = timerCtx && timerCtx.sessionStartTime
    ? computeProgress(timerCtx.sessionStartTime, effectiveTotal)
    : null;
  const effectiveElapsed = contextProgress ? contextProgress.elapsed : elapsedTime;
  const isOvertime = effectiveElapsed > effectiveTotal;
  const timeOverage = isOvertime ? Math.floor(effectiveElapsed - effectiveTotal) : 0;

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareControls, setShowShareControls] = useState(false);
  const { addResponsiveToast } = useResponsiveToast();

  const handleCreateShare = useCallback(async () => {
    try {
      setShareLoading(true);
      const payload = {
        sessionData: {
          activities: activities.map(a => ({ id: a.id, name: a.name, description: a.description || '', colorIndex: a.colorIndex })),
          timeline: timelineEntries
        },
        metadata: {
          title: 'Shared session',
          createdBy: 'app'
        }
      };
      const res = await fetchWithVercelBypass('/api/sessions/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error(`Share failed: ${res.status}`);
      }
      const json = await res.json();
      const apiUrl: string | undefined = json?.shareUrl;
      if (apiUrl) {
        setShareUrl(apiUrl);
      } else {
        const id = json?.metadata?.id || json?.id || json?.shareId;
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setShareUrl(id && origin ? `${origin}/shared/${id}` : null);
      }
      setShowShareControls(true);
  } catch {
      addResponsiveToast({ message: 'Failed to create share.', variant: 'error', autoDismiss: true });
      setShowShareModal(false);
    } finally {
      setShareLoading(false);
    }
  }, [activities, timelineEntries, addResponsiveToast]);

  return (
    <Card className="h-100 d-flex flex-column" data-testid="activity-manager">
      <Card.Header className="card-header-consistent">
        <h5 className="mb-0">Activities</h5>
        <div className="d-flex gap-2">
          {(effective.onExtend) && (
            <AddMinuteButton
              onClick={handleExtendDuration}
              variant="outline-primary"
              size="sm"
              title="Add 1 minute to session duration"
            />
          )}
          {effective.onReset && (
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
          {/* Share action - creates a public share of current session
              Only show after the session is complete (summary state). */}
          {/* Summary state heuristic: timer is inactive, we have timeline entries, and there's no running activity */}
          {(!effective.timerActive && timelineEntries.length > 0 && (effective.currentActivityId ?? currentActivityId) == null) && (
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => setShowShareModal(true)}
              className="d-flex align-items-center"
              title="Share session"
              data-testid="open-share-modal"
            >
              <i className="bi bi-share me-2" />
              Share
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body className="d-flex flex-column flex-grow-1 overflow-hidden p-3">
        {/* Timer Progress Section - hidden when GlobalTimerContext is present to avoid duplicate progress UI */}
        {(!timerCtx) && (
          <TimerProgressSection
            entries={timelineEntries}
            totalDuration={effective.totalDuration ?? totalDuration}
            elapsedTime={effectiveElapsed}
            timerActive={effective.timerActive}
          />
        )}
        
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
                  isCompleted={effectiveCompletedIds.includes(activity.id)}
                  isRunning={activity.id === derivedCurrentActivityId}
                  onSelect={handleActivitySelect}
                  onRemove={onActivityRemove ? handleRemoveActivity : undefined}
                  timelineEntries={timelineEntries}
                  elapsedTime={effectiveElapsed}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Card.Body>

      {/* Share confirmation modal */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Share session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Share a read-only copy of the current session. This will create a public URL that anyone can open.</p>
          <p className="text-muted small">The shared session will contain summary and timeline data only.</p>
          {shareLoading && (
            <div className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" /> Creating share...
            </div>
          )}
          {showShareControls && shareUrl && (
            <div className="mt-3">
              <ShareControls shareUrl={shareUrl} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!showShareControls && (
            <>
              <Button variant="secondary" onClick={() => setShowShareModal(false)}>Cancel</Button>
              <Button
                variant="success"
                onClick={handleCreateShare}
              >
                Create share
              </Button>
            </>
          )}
          {showShareControls && (
            <Button variant="primary" onClick={() => setShowShareModal(false)}>Done</Button>
          )}
        </Modal.Footer>
      </Modal>
    </Card>
  );
}