import { useState, useEffect, useCallback } from 'react';
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
// Import Material 3 components instead of Bootstrap
import Material3Card from '@/design-system/components/Card';
import Material3Button from '@/design-system/components/Button';
import Material3Modal from '@/design-system/components/Modal';
import { getResponsivePadding, getResponsiveGap } from '@/design-system/utils/responsive-layout';
import { getResponsiveSpacing } from '@/design-system/utils/mobile-touch';

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

  // Note: `online` is intentionally included in the handleCreateShare dependency array

  // Get responsive spacing for mobile optimization
  const cardSpacing = getResponsiveSpacing('md');
  const sectionSpacing = getResponsiveSpacing('sm');
  const buttonSpacing = getResponsiveSpacing('xs');

  return (
    <Material3Card className="h-full flex flex-col" data-testid="activity-manager">
      {/* Header with title and action buttons */}
      <div className={`${cardSpacing.padding} pb-3 sm:pb-4 border-b border-outline-variant`}>
        <div className="flex justify-between items-center">
          <h5 className="text-lg font-medium mb-0">Activities</h5>
          <div className={`flex ${buttonSpacing.gap}`}>
            {onExtendDuration && (
              <Material3Button 
                variant="outlined" 
                size="small"
                onClick={handleExtendDuration}
                className="flex items-center"
                title="Add 1 minute to session duration"
              >
                <i className="bi bi-plus-circle mr-2"></i>
                1 min
              </Material3Button>
            )}
            {onReset && (
              <Material3Button 
                variant="outlined"
                color="error"
                size="small"
                onClick={handleResetSession}
                className="flex items-center"
                title="Reset session and return to time setup"
              >
                <i className="bi bi-arrow-clockwise mr-2"></i>
                Reset
              </Material3Button>
            )}
            {/* Share action - creates a public share of current session
                Only show after the session is complete (summary state). */}
            {/* Summary state heuristic: timer is inactive, we have timeline entries, and there's no running activity */}
            {(!timerActive && timelineEntries.length > 0 && currentActivityId == null) && (
              <Material3Button
                variant="outlined"
                size="small"
                onClick={() => setShowShareModal(true)}
                disabled={!online}
                className="flex items-center"
                title="Share session"
                data-testid="open-share-modal"
              >
                <i className="bi bi-share mr-2" />
                Share
              </Material3Button>
            )}
          </div>
        </div>
      </div>
      
      <div className={`flex flex-col flex-grow overflow-hidden ${cardSpacing.padding} pt-3 sm:pt-4`}>
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
        <div className="flex-grow" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
          <div className={`${sectionSpacing.gap} space-y-3 sm:space-y-2`} data-testid="activity-list">
            {visibleActivities.map((activity) => (
              <div 
                key={activity.id}
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

          {/* Hidden activities control */}
          {hiddenActivities.length > 0 && (
            <div className={`${sectionSpacing.margin}t-6`}>
              <Material3Button
                variant="outlined"
                size="small"
                className="flex items-center"
                onClick={() => setShowHiddenList(v => !v)}
                data-testid="toggle-hidden-activities"
              >
                <i className={`bi ${showHiddenList ? 'bi-eye-slash' : 'bi-eye'} mr-2`} />
                {showHiddenList ? 'Hide' : 'Show'} {hiddenActivities.length} hidden {hiddenActivities.length === 1 ? 'activity' : 'activities'}
              </Material3Button>

              {showHiddenList && (
                <div
                  className="bg-surface-container-high border border-outline-variant rounded-lg p-4 mt-3"
                  data-testid="hidden-activities-panel"
                >
                  {hiddenActivities.map((activity) => (
                    <div key={activity.id} className="flex justify-between items-center py-2">
                      <span className="text-on-surface-variant text-sm">{activity.name}</span>
                      <Material3Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleRestoreActivity(activity.id)}
                        data-testid={`restore-activity-${activity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      >
                        Restore
                      </Material3Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share confirmation modal */}
      <Material3Modal 
        open={showShareModal} 
        onClose={() => setShowShareModal(false)}
        title="Share session"
      >
        <div className="space-y-4">
          <p>Share a read-only copy of the current session. This will create a public URL that anyone can open.</p>
          <p className="text-on-surface-variant text-sm">The shared session will contain summary and timeline data only.</p>
          {shareLoading && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              Creating share...
            </div>
          )}
          {!online && (
            <div className="text-on-surface-variant text-sm mt-2" data-testid="activitymanager-share-offline-warning">
              Sharing requires a network connection — you are currently offline.
            </div>
          )}
          {showShareControls && shareUrl && (
            <div className="mt-3">
              <ShareControls shareUrl={shareUrl} />
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          {!showShareControls && (
            <>
              <Material3Button variant="outlined" onClick={() => setShowShareModal(false)}>
                Cancel
              </Material3Button>
              <Material3Button
                variant="filled"
                onClick={handleCreateShare}
                disabled={!online}
              >
                Create share
              </Material3Button>
            </>
          )}
          {showShareControls && (
            <Material3Button variant="filled" onClick={() => setShowShareModal(false)}>
              Done
            </Material3Button>
          )}
        </div>
      </Material3Modal>
    </Material3Card>
  );
}