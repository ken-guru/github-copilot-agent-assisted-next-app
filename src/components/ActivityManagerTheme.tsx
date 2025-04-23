import { useEffect } from 'react';
import { getNextAvailableColorSet } from '../utils/colors';
import { Activity } from './ActivityManagerCore';

export const useActivityManagerTheme = (activities: Activity[], setActivities: (activities: Activity[]) => void) => {
  useEffect(() => {
    const updateColors = () => {
      setActivities((currentActivities: Activity[]) => 
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
  }, [setActivities]);
};

export const initializeActivities = (defaultActivities: Activity[], onActivitySelect: (activity: Activity, justAdd?: boolean) => void) => {
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
};
