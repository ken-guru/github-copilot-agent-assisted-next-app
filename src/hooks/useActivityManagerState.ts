import { useState } from 'react';
import { Activity } from '../components/ActivityManagerCore';
import { getNextAvailableColorSet } from '../utils/colors';

export const useActivityManagerState = () => {
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

  const initializeActivities = (defaultActivities: Activity[], onActivitySelect: (activity: Activity | null, justAdd?: boolean) => void) => {
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

  return {
    activities,
    setActivities,
    assignedColorIndices,
    setAssignedColorIndices,
    hasInitializedActivities,
    setHasInitializedActivities,
    getNextColorIndex,
    initializeActivities
  };
};
