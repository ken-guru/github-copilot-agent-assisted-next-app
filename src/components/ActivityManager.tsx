import { useState, useEffect, useRef } from 'react';
import { useViewport } from '../hooks/useViewport';
import styles from './ActivityManager.module.css';
import mobileStyles from './ActivityManager.mobile.module.css';
import { getNextAvailableColorSet, ColorSet } from '../utils/colors';
import { TimelineEntry } from '../hooks/useTimelineEntries';
import { ActivityButton } from './ActivityButton';
import ActivityForm from './ActivityForm';

export interface Activity {
  id: string;
  name: string;
  completed?: boolean;
  colors?: ColorSet;
  colorIndex?: number;
}

interface ActivityManagerProps {
  onActivitySelect: (activity: Activity | null, justAdd?: boolean) => void;
  onActivityRemove?: (activityId: string) => void;
  currentActivityId: string | null;
  completedActivityIds: string[];
  timelineEntries: TimelineEntry[];
  isTimeUp?: boolean;
  elapsedTime?: number;
}

interface SwipeState {
  activityId: string | null;
  isSwiping: boolean;
  startX: number;
  currentX: number;
}

export default function ActivityManager({ 
  onActivitySelect, 
  onActivityRemove,
  currentActivityId, 
  completedActivityIds,
  timelineEntries,
  isTimeUp = false,
  elapsedTime = 0
}: ActivityManagerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [assignedColorIndices, setAssignedColorIndices] = useState<number[]>([]);
  const [hasInitializedActivities, setHasInitializedActivities] = useState(false);
  
  const getNextColorIndex = (): number => {
    let index = 0;
    while (assignedColorIndices.includes(index)) {
      index++;
    }
    return index;
  };

  useEffect(() => {
    const defaultActivities = [
      { id: '1', name: 'Homework', colorIndex: 0 },
      { id: '2', name: 'Reading', colorIndex: 1 },
      { id: '3', name: 'Play Time', colorIndex: 2 },
      { id: '4', name: 'Chores', colorIndex: 3 }
    ];

    if (!hasInitializedActivities) {
      setAssignedColorIndices(defaultActivities.map(a => a.colorIndex));
      
      // Add activities to the state machine in pending state
      defaultActivities.forEach(activity => {
        const activityWithColors = {
          ...activity,
          colors: getNextAvailableColorSet(activity.colorIndex || 0)
        };
        // Pass true as second argument to just add the activity without starting it
        onActivitySelect(activityWithColors, true);
      });
      
      setActivities(defaultActivities);
      setHasInitializedActivities(true);
    }
  }, [hasInitializedActivities, onActivitySelect]);
  
  useEffect(() => {
    setActivities(currentActivities => 
      currentActivities.map(activity => ({
        ...activity,
        colors: getNextAvailableColorSet(activity.colorIndex || 0)
      }))
    );
  }, []);

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

  const handleAddActivity = (activityName: string) => {
    const nextColorIndex = getNextColorIndex();
    
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: activityName,
      colorIndex: nextColorIndex,
      colors: getNextAvailableColorSet(nextColorIndex)
    };
    
    setAssignedColorIndices([...assignedColorIndices, nextColorIndex]);
    setActivities([...activities, newActivity]);
    // Pass true as second argument to just add the activity without starting it
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
    if (onActivityRemove) {
      onActivityRemove(id);
    }
  };

  const { isMobile, hasTouch } = useViewport();
  const [swipeState, setSwipeState] = useState<SwipeState>({
    activityId: null,
    isSwiping: false,
    startX: 0,
    currentX: 0,
  });
  const touchRippleRef = useRef<HTMLDivElement | null>(null);
  
  // Show touch ripple effect
  const showRipple = (e: React.MouseEvent | React.TouchEvent) => {
    if (!hasTouch || !touchRippleRef.current) return;
    
    // Get coordinates
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    
    // Position the ripple element at the click/touch point
    const ripple = touchRippleRef.current;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Add the animation class
    ripple.classList.add(mobileStyles.touchRipple);
    
    // Remove the class after animation completes
    setTimeout(() => {
      ripple.classList.remove(mobileStyles.touchRipple);
    }, 600);
  };
  
  // Handle swipe start
  const handleTouchStart = (e: React.TouchEvent, activityId: string) => {
    if (!hasTouch) return;
    
    setSwipeState({
      activityId,
      isSwiping: true,
      startX: e.touches[0].clientX,
      currentX: e.touches[0].clientX,
    });
  };
  
  // Handle swipe move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeState.isSwiping) return;
    
    setSwipeState({
      ...swipeState,
      currentX: e.touches[0].clientX,
    });
  };
  
  // Handle swipe end
  const handleTouchEnd = () => {
    if (!swipeState.isSwiping) return;
    
    const swipeDistance = swipeState.startX - swipeState.currentX;
    const SWIPE_THRESHOLD = 100; // Minimum distance to trigger action
    
    if (swipeDistance > SWIPE_THRESHOLD) {
      // Left swipe - reveal actions
      // Actions remain visible until clicked or another item is interacted with
    } else {
      // Reset swipe state if threshold not met
      setSwipeState({
        activityId: null,
        isSwiping: false,
        startX: 0,
        currentX: 0,
      });
    }
  };
  
  // Calculate swipe transform for an activity
  const getSwipeTransform = (activityId: string) => {
    if (swipeState.activityId !== activityId || !swipeState.isSwiping) return {};
    
    const delta = swipeState.startX - swipeState.currentX;
    const maxSwipe = 150; // Maximum swipe distance
    
    // Limit swipe distance
    const swipeX = Math.max(0, Math.min(delta, maxSwipe));
    
    return {
      transform: `translateX(-${swipeX}px)`,
    };
  };
  
  // Check if actions should be visible for an activity
  const areActionsVisible = (activityId: string) => {
    return swipeState.activityId === activityId && 
           !swipeState.isSwiping && 
           swipeState.startX - swipeState.currentX > 100;
  };
  
  // Handle complete action
  const handleComplete = (activity: Activity) => {
    handleActivitySelect(activity);
    resetSwipeState();
  };
  
  // Handle delete action
  const handleDelete = (id: string) => {
    handleRemoveActivity(id);
    resetSwipeState();
  };
  
  // Reset swipe state
  const resetSwipeState = () => {
    setSwipeState({
      activityId: null,
      isSwiping: false,
      startX: 0,
      currentX: 0,
    });
  };
  
  // Get appropriate style classes based on viewport
  const getContainerClass = () => {
    return isMobile ? mobileStyles.mobileContainer : styles.container;
  };
  
  const getHeadingClass = () => {
    return isMobile ? mobileStyles.mobileHeading : styles.heading;
  };
  
  const getActivityListClass = () => {
    return isMobile ? mobileStyles.mobileActivityList : styles.activityList;
  };
  
  const getEmptyStateClass = () => {
    return isMobile ? mobileStyles.mobileEmptyState : styles.emptyState;
  };
  
  const getFormClass = () => {
    return isMobile ? mobileStyles.mobileForm : '';
  };
  
  return (
    <div className={getContainerClass()} data-testid="activity-manager">
      <h2 className={getHeadingClass()}>Activities</h2>
      
      {activities.length === 0 ? (
        <div className={getEmptyStateClass()}>
          No activities defined
        </div>
      ) : (
        <div className={getActivityListClass()} data-testid="activity-list">
          <div className={getFormClass()}>
            <ActivityForm
              onAddActivity={handleAddActivity}
              isDisabled={isTimeUp}
            />
          </div>
          
          {activities.map((activity) => (
            isMobile && hasTouch ? (
              <div 
                key={activity.id}
                className={mobileStyles.swipeContainer}
                data-testid="swipe-container"
                onTouchStart={(e) => handleTouchStart(e, activity.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={(e) => showRipple(e)}
              >
                <div 
                  className={completedActivityIds.includes(activity.id) 
                    ? mobileStyles.mobileCompletedActivityItem 
                    : mobileStyles.mobileActivityItem}
                  style={{
                    ...getSwipeTransform(activity.id),
                    backgroundColor: activity.colors?.background,
                    borderColor: activity.colors?.border,
                  }}
                >
                  <h3 className={completedActivityIds.includes(activity.id)
                    ? mobileStyles.mobileCompletedActivityName
                    : mobileStyles.mobileActivityName}>
                    {activity.name}
                  </h3>
                  
                  <div className={styles.activityStatus}>
                    {activity.id === currentActivityId && (
                      <div className={styles.runningIndicator}>
                        <span className={styles.timerDisplay}>{formatTime(elapsedTime)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div 
                  className={`${mobileStyles.swipeActions} ${areActionsVisible(activity.id) ? mobileStyles.actionsVisible : ''}`}
                  data-testid="swipe-actions"
                >
                  <button 
                    className={`${mobileStyles.actionButton} ${mobileStyles.completeAction}`}
                    onClick={() => handleComplete(activity)}
                    aria-label={`Complete ${activity.name}`}
                  >
                    Complete
                  </button>
                  
                  <button 
                    className={`${mobileStyles.actionButton} ${mobileStyles.deleteAction}`}
                    onClick={() => handleDelete(activity.id)}
                    aria-label={`Delete ${activity.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <ActivityButton
                key={activity.id}
                activity={activity}
                isCompleted={completedActivityIds.includes(activity.id)}
                isRunning={activity.id === currentActivityId}
                onSelect={handleActivitySelect}
                onRemove={onActivityRemove ? handleRemoveActivity : undefined}
                timelineEntries={timelineEntries}
                elapsedTime={elapsedTime}
              />
            )
          ))}
        </div>
      )}
      
      {/* Touch ripple element for feedback */}
      {hasTouch && (
        <div ref={touchRippleRef} className={mobileStyles.touchRipple}></div>
      )}
    </div>
  );
}

// Helper function to format time for display
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};