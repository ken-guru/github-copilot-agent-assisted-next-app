"use client";

import React, { useState } from 'react';
import { ActivityButtonMaterial3 } from '../ActivityButtonMaterial3';
import { Activity } from '@/types/activity';
import { TimelineEntry } from '@/types';

/**
 * ActivityButton Material 3 Expressive Showcase
 * 
 * Demonstrates the Material 3 Expressive ActivityButton component with:
 * - Organic card shapes with varied corner radius
 * - Dynamic color application based on activity state and theme
 * - Expressive hover and focus states with scale and elevation changes
 * - Contextual action buttons with Material 3 styling
 * - Enhanced visual feedback for running, completed, and idle states
 */
export const ActivityButtonShowcase: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 'activity-1',
      name: 'Design Review',
      colorIndex: 0,
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'activity-2',
      name: 'Code Implementation',
      colorIndex: 1,
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'activity-3',
      name: 'Testing & QA',
      colorIndex: 2,
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'activity-4',
      name: 'Documentation',
      colorIndex: 3,
      createdAt: new Date().toISOString(),
      isActive: true
    }
  ]);

  const [runningActivity, setRunningActivity] = useState<string | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [elapsedTimes, setElapsedTimes] = useState<Record<string, number>>({});
  const [timelineEntries] = useState<TimelineEntry[]>([
    {
      id: 'entry-1',
      activityId: 'activity-1',
      activityName: 'Design Review',
      startTime: Date.now() - 300000, // 5 minutes ago
      endTime: Date.now() - 60000 // 1 minute ago
    }
  ]);

  // Simulate elapsed time for running activity
  React.useEffect(() => {
    if (!runningActivity) return;

    const interval = setInterval(() => {
      setElapsedTimes(prev => ({
        ...prev,
        [runningActivity]: (prev[runningActivity] || 0) + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [runningActivity]);

  const handleActivitySelect = (activity: Activity) => {
    if (runningActivity === activity.id) {
      // Complete the activity
      setCompletedActivities(prev => new Set([...prev, activity.id]));
      setRunningActivity(null);
    } else {
      // Start the activity
      setRunningActivity(activity.id);
      setElapsedTimes(prev => ({ ...prev, [activity.id]: 0 }));
    }
  };

  const handleActivityRemove = (activityId: string) => {
    setActivities(prev => prev.filter(a => a.id !== activityId));
    if (runningActivity === activityId) {
      setRunningActivity(null);
    }
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      newSet.delete(activityId);
      return newSet;
    });
    setElapsedTimes(prev => {
      const { [activityId]: _, ...rest } = prev;
      return rest;
    });
  };

  const resetShowcase = () => {
    setRunningActivity(null);
    setCompletedActivities(new Set());
    setElapsedTimes({});
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontFamily: 'var(--md-sys-typescale-headline-medium-font-family)',
          fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
          fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '8px'
        }}>
          Material 3 Expressive Activity Buttons
        </h2>
        <p style={{ 
          fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
          fontSize: 'var(--md-sys-typescale-body-large-font-size)',
          color: 'var(--md-sys-color-on-surface-variant)',
          marginBottom: '16px'
        }}>
          Interactive showcase demonstrating organic shapes, dynamic colors, and expressive states.
        </p>
        
        <button
          onClick={resetShowcase}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--md-sys-color-secondary-container)',
            color: 'var(--md-sys-color-on-secondary-container)',
            border: 'none',
            borderRadius: 'var(--md-sys-shape-corner-full)',
            cursor: 'pointer',
            fontFamily: 'var(--md-sys-typescale-label-large-font-family)',
            fontSize: 'var(--md-sys-typescale-label-large-font-size)',
            fontWeight: 'var(--md-sys-typescale-label-large-font-weight)'
          }}
        >
          Reset Showcase
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ 
            fontFamily: 'var(--md-sys-typescale-title-medium-font-family)',
            fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
            fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
            color: 'var(--md-sys-color-on-surface)',
            marginBottom: '12px'
          }}>
            Activity States
          </h3>
          <p style={{ 
            fontFamily: 'var(--md-sys-typescale-body-medium-font-family)',
            fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
            color: 'var(--md-sys-color-on-surface-variant)',
            marginBottom: '16px'
          }}>
            Click "Start" to begin an activity, "Complete" to finish it. Notice the organic shapes, 
            dynamic colors, and expressive hover effects.
          </p>
        </div>

        {activities.map((activity) => (
          <ActivityButtonMaterial3
            key={activity.id}
            activity={activity}
            isCompleted={completedActivities.has(activity.id)}
            isRunning={runningActivity === activity.id}
            onSelect={handleActivitySelect}
            onRemove={handleActivityRemove}
            timelineEntries={timelineEntries}
            elapsedTime={elapsedTimes[activity.id] || 0}
          />
        ))}
      </div>

      <div style={{ marginTop: '32px', padding: '16px', backgroundColor: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-sys-shape-corner-medium)' }}>
        <h3 style={{ 
          fontFamily: 'var(--md-sys-typescale-title-small-font-family)',
          fontSize: 'var(--md-sys-typescale-title-small-font-size)',
          fontWeight: 'var(--md-sys-typescale-title-small-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '8px'
        }}>
          Material 3 Expressive Features
        </h3>
        <ul style={{ 
          fontFamily: 'var(--md-sys-typescale-body-small-font-family)',
          fontSize: 'var(--md-sys-typescale-body-small-font-size)',
          color: 'var(--md-sys-color-on-surface-variant)',
          paddingLeft: '16px'
        }}>
          <li>Organic card shapes with varied corner radius for visual interest</li>
          <li>Dynamic color application based on activity state and theme</li>
          <li>Expressive hover states with subtle scale and elevation changes</li>
          <li>Material 3 button variants (filled, tonal, outlined) for different actions</li>
          <li>Enhanced visual feedback with running indicators and completion states</li>
          <li>Contextual action buttons with appropriate Material 3 styling</li>
          <li>Responsive design that adapts to different screen sizes</li>
          <li>Accessibility features including proper ARIA labels and focus management</li>
        </ul>
      </div>
    </div>
  );
};

export default ActivityButtonShowcase;