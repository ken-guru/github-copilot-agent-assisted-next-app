import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityStateMachine } from '@mr-timely/shared';
import type { Activity, ColorSet } from '@mr-timely/types';

const STORAGE_KEY = '@mr-timely:activities';

// Default color sets for activities
const DEFAULT_COLOR_SETS: ColorSet[] = [
  { primary: '#007bff', secondary: '#e7f1ff', border: '#b3d7ff', text: '#004085' },
  { primary: '#28a745', secondary: '#d4edda', border: '#c3e6cb', text: '#155724' },
  { primary: '#dc3545', secondary: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
  { primary: '#ffc107', secondary: '#fff3cd', border: '#ffeeba', text: '#856404' },
  { primary: '#17a2b8', secondary: '#d1ecf1', border: '#bee5eb', text: '#0c5460' },
];

/**
 * Hook for managing activities using shared state machine
 * Demonstrates integration of @mr-timely/shared package
 */
export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stateMachine] = useState(() => new ActivityStateMachine());
  const [loading, setLoading] = useState(true);

  // Load activities from storage
  useEffect(() => {
    const loadActivities = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Activity[];
          setActivities(parsed);
          
          // Initialize state machine
          parsed.forEach(activity => {
            stateMachine.addActivity(activity.id, false);
            if (activity.state === 'RUNNING') {
              // Restore running state
              try {
                stateMachine.startActivity(activity.id);
              } catch {
                // If can't start, likely already running
              }
            }
          });
        }
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [stateMachine]);

  // Save activities to storage
  const saveActivities = useCallback(async (newActivities: Activity[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newActivities));
      setActivities(newActivities);
    } catch (error) {
      console.error('Failed to save activities:', error);
    }
  }, []);

  // Add new activity
  const addActivity = useCallback(
    (name: string, description?: string) => {
      const id = `activity-${Date.now()}`;
      const colorSet = DEFAULT_COLOR_SETS[activities.length % DEFAULT_COLOR_SETS.length];

      const newActivity: Activity = {
        id,
        name,
        description,
        state: 'PENDING',
        colors: colorSet || DEFAULT_COLOR_SETS[0],
        createdAt: new Date().toISOString(),
      };

      stateMachine.addActivity(id);
      const updatedActivities = [...activities, newActivity];
      saveActivities(updatedActivities);
    },
    [activities, stateMachine, saveActivities]
  );

  // Start activity
  const startActivity = useCallback(
    (id: string) => {
      try {
        stateMachine.startActivity(id);
        
        const updatedActivities = activities.map(activity => {
          if (activity.id === id) {
            return { ...activity, state: 'RUNNING' as const, startTime: Date.now() };
          }
          // Complete any other running activity
          if (activity.state === 'RUNNING') {
            return { ...activity, state: 'COMPLETED' as const, endTime: Date.now() };
          }
          return activity;
        });

        saveActivities(updatedActivities);
      } catch (error) {
        console.error('Failed to start activity:', error);
      }
    },
    [activities, stateMachine, saveActivities]
  );

  // Complete activity
  const completeActivity = useCallback(
    (id: string) => {
      try {
        stateMachine.completeActivity(id);
        
        const updatedActivities = activities.map(activity =>
          activity.id === id
            ? { ...activity, state: 'COMPLETED' as const, endTime: Date.now() }
            : activity
        );

        saveActivities(updatedActivities);
      } catch (error) {
        console.error('Failed to complete activity:', error);
      }
    },
    [activities, stateMachine, saveActivities]
  );

  // Remove activity
  const removeActivity = useCallback(
    (id: string) => {
      try {
        stateMachine.removeActivity(id);
        
        const updatedActivities = activities.filter(activity => activity.id !== id);
        saveActivities(updatedActivities);
      } catch (error) {
        console.error('Failed to remove activity:', error);
      }
    },
    [activities, stateMachine, saveActivities]
  );

  // Get current running activity
  const currentActivity = activities.find(a => a.state === 'RUNNING');

  return {
    activities: activities.filter(a => a.state !== 'REMOVED'),
    loading,
    addActivity,
    startActivity,
    completeActivity,
    removeActivity,
    currentActivity,
  };
};
