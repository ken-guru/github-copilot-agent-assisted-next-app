import { useState, useEffect, useCallback } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { getNextAvailableColorSet, ColorSet } from '../utils/colors';
import { TimelineEntry } from '@/types';
import { ActivityButton } from './ActivityButton';
import TimerProgressSection from './TimerProgressSection';
import ActivityFormSection from './ActivityFormSection';
import ShareControls from './ShareControls';
import { useResponsiveToast } from '@/hooks/useResponsiveToast';
import { getActivities, addActivity as persistActivity, deleteActivity as persistDeleteActivity } from '../utils/activity-storage';
import { Activity as CanonicalActivity } from '../types/activity';
import { fetchWithVercelBypass } from '@/utils/fetchWithVercelBypass';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import { Material3Container } from './ui/Material3Container';
import { Material3Button, Material3FAB, Material3IconButton } from './ui/Material3Button';
import { useMotionSystem } from '@/hooks/useMotionSystem';
import styles from './ActivityManagerMaterial3.module.css';

// Use canonical Activity type
type Activity = CanonicalActivity & { colors?: ColorSet };

interface ActivityManagerMaterial3Props {
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

export default function ActivityManagerMaterial3({ 
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
}: ActivityManagerMaterial3Props) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showHiddenList, setShowHiddenList] = useState(false);
  const motionSystem = useMotionSystem();
  
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

  // Derived lists
  const hiddenSet = new Set(removedActivityIds);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareControls, setShowShareControls] = useState(false);
  const { addResponsiveToast } = useResponsiveToast();
  const visibleActivities = activities.filter(a => !hiddenSet.has(a.id));
  const hiddenActivities = activities.filter(a => hiddenSet.has(a.id));

  const { online } = useNetworkStatus();

  const handleCreateShare = useCallback(async () => {
    try {
      if (!online) {
        addResponsiveToast({ message: 'Cannot create share: no network connection. Please reconnect and try again.', variant: 'warning', autoDismiss: true });
        return;
      }
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
  }, [activities, timelineEntries, addResponsiveToast, online]);

  // Determine container state based on timer activity
  const getContainerState = () => {
    if (timerActive && currentActivityId) return 'active';
    if (shareLoading) return 'loading';
    return 'default';
  };

  // Determine elevation based on timer state
  const getElevation = () => {
    if (timerActive && currentActivityId) return 'level3';
    if (timerActive) return 'level2';
    return 'level1';
  };

  return (
    <Material3Container
      variant="elevated"
      elevation={getElevation()}
      shape="activityCard"
      colorRole="surfaceContainer"
      contentState={getContainerState()}
      interactive={false}
      responsive={true}
      enableMotion={true}
      className={styles.activityHub}
      data-testid="activity-manager"
    >
      {/* Header with expressive typography and actions */}
      <div className={styles.header}>
        <h2 className={styles.title}>Activities</h2>
        <div className={styles.headerActions}>
          {onExtendDuration && (
            <Material3IconButton
              icon={<i className="bi bi-plus-circle" />}
              variant="tonal"
              size="small"
              colorRole="primary"
              onClick={handleExtendDuration}
              aria-label="Add 1 minute to session duration"
              title="Add 1 minute to session duration"
            />
          )}
          {onReset && (
            <Material3IconButton
              icon={<i className="bi bi-arrow-clockwise" />}
              variant="outlined"
              size="small"
              colorRole="secondary"
              onClick={handleResetSession}
              aria-label="Reset session and return to time setup"
              title="Reset session and return to time setup"
            />
          )}
          {/* Share action - creates a public share of current session
              Only show after the session is complete (summary state). */}
          {(!timerActive && timelineEntries.length > 0 && currentActivityId == null) && (
            <Material3IconButton
              icon={<i className="bi bi-share" />}
              variant="tonal"
              size="small"
              colorRole="tertiary"
              onClick={() => setShowShareModal(true)}
              disabled={!online}
              aria-label="Share session"
              title="Share session"
              data-testid="open-share-modal"
            />
          )}
        </div>
      </div>

      {/* Content area with organic spacing */}
      <div className={styles.content}>
        {/* Timer Progress Section - isolated from activity form */}
        <div className={styles.progressSection}>
          <TimerProgressSection
            entries={timelineEntries}
            totalDuration={totalDuration}
            elapsedTime={elapsedTime}
            timerActive={timerActive}
          />
        </div>
        
        {/* Activity Form Section - isolated from timer updates */}
        <div className={styles.formSection}>
          <ActivityFormSection
            activities={activities}
            preservedFormValues={preservedFormValues}
            onAddActivity={handleAddActivity}
            onFormValuesChange={handleFormValuesChange}
            showOvertimeWarning={isOvertime}
            timeOverage={timeOverage}
            isSimplified={timerActive || (activities.length > 0 && timelineEntries.length === 0)} // Simplified when timer is active or when activities exist but timer hasn't started
          />
        </div>
        
        {/* Activities List - scrollable with organic motion */}
        <div className={styles.activitiesContainer}>
          <div className={styles.activitiesList} data-testid="activity-list">
            {visibleActivities.map((activity) => (
              <div 
                key={activity.id}
                className={styles.activityItem}
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
              </div>
            ))}
          </div>

          {/* Hidden activities control with expressive styling */}
          {hiddenActivities.length > 0 && (
            <div className={styles.hiddenActivitiesSection}>
              <Material3Button
                variant="outlined"
                size="small"
                colorRole="secondary"
                startIcon={<i className={`bi ${showHiddenList ? 'bi-eye-slash' : 'bi-eye'}`} />}
                onClick={() => setShowHiddenList(v => !v)}
                data-testid="toggle-hidden-activities"
              >
                {showHiddenList ? 'Hide' : 'Show'} {hiddenActivities.length} hidden {hiddenActivities.length === 1 ? 'activity' : 'activities'}
              </Material3Button>

              {showHiddenList && (
                <Material3Container
                  variant="filled"
                  elevation="level0"
                  shape="small"
                  colorRole="surfaceContainerLow"
                  className={styles.hiddenActivitiesPanel}
                  data-testid="hidden-activities-panel"
                >
                  {hiddenActivities.map((activity) => (
                    <div key={activity.id} className={styles.hiddenActivityItem}>
                      <span className={styles.hiddenActivityName}>{activity.name}</span>
                      <Material3Button
                        variant="outlined"
                        size="small"
                        colorRole="primary"
                        onClick={() => handleRestoreActivity(activity.id)}
                        data-testid={`restore-activity-${activity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      >
                        Restore
                      </Material3Button>
                    </div>
                  ))}
                </Material3Container>
              )}
            </div>
          )}
        </div>

        {/* Floating Action Button for adding activities */}
        {!timerActive && visibleActivities.length === 0 && (
          <div className={styles.fabContainer}>
            <Material3FAB
              variant="extended"
              icon={<i className="bi bi-plus-lg" />}
              label="Add Activity"
              colorRole="primary"
              onClick={() => {
                // Focus on the activity form input
                const input = document.querySelector('input[name="name"]') as HTMLInputElement;
                if (input) {
                  input.focus();
                }
              }}
              aria-label="Add new activity"
            />
          </div>
        )}
      </div>

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
          {!online && (
            <div className="text-muted small mt-2" data-testid="activitymanager-share-offline-warning">Sharing requires a network connection — you are currently offline.</div>
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
              <Material3Button variant="outlined" onClick={() => setShowShareModal(false)}>Cancel</Material3Button>
              <Material3Button
                variant="filled"
                colorRole="primary"
                onClick={handleCreateShare}
                disabled={!online}
              >
                Create share
              </Material3Button>
            </>
          )}
          {showShareControls && (
            <Material3Button variant="filled" onClick={() => setShowShareModal(false)}>Done</Material3Button>
          )}
        </Modal.Footer>
      </Modal>
    </Material3Container>
  );
}