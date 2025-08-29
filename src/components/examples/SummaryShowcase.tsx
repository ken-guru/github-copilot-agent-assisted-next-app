"use client";

import React, { useState } from 'react';
import SummaryMaterial3 from '../SummaryMaterial3';
import { TimelineEntry } from '@/types';
import { ToastProvider } from '@/contexts/ToastContext';
import { ApiKeyProvider } from '@/contexts/ApiKeyContext';
import { Material3Button } from '../ui/Material3Button';

const mockTimelineEntries: TimelineEntry[] = [
  {
    id: 'entry1',
    activityId: '1',
    activityName: 'Design Review',
    startTime: Date.now() - 3600000, // 1 hour ago
    endTime: Date.now() - 2700000, // 45 minutes ago
    colors: {
      light: { background: 'hsl(210, 70%, 95%)', text: 'hsl(210, 70%, 20%)', border: 'hsl(210, 70%, 80%)' },
      dark: { background: 'hsl(210, 70%, 15%)', text: 'hsl(210, 70%, 90%)', border: 'hsl(210, 70%, 30%)' }
    }
  },
  {
    id: 'entry2',
    activityId: '2',
    activityName: 'Code Implementation',
    startTime: Date.now() - 2700000, // 45 minutes ago
    endTime: Date.now() - 1800000, // 30 minutes ago
    colors: {
      light: { background: 'hsl(120, 60%, 95%)', text: 'hsl(120, 60%, 20%)', border: 'hsl(120, 60%, 80%)' },
      dark: { background: 'hsl(120, 60%, 15%)', text: 'hsl(120, 60%, 90%)', border: 'hsl(120, 60%, 30%)' }
    }
  },
  {
    id: 'entry3',
    activityId: '3',
    activityName: 'Testing & QA',
    startTime: Date.now() - 1800000, // 30 minutes ago
    endTime: Date.now() - 900000, // 15 minutes ago
    colors: {
      light: { background: 'hsl(300, 60%, 95%)', text: 'hsl(300, 60%, 20%)', border: 'hsl(300, 60%, 80%)' },
      dark: { background: 'hsl(300, 60%, 15%)', text: 'hsl(300, 60%, 90%)', border: 'hsl(300, 60%, 30%)' }
    }
  },
  {
    id: 'entry4',
    activityId: '4',
    activityName: 'Documentation',
    startTime: Date.now() - 900000, // 15 minutes ago
    endTime: Date.now() - 300000, // 5 minutes ago
    colors: {
      light: { background: 'hsl(45, 70%, 95%)', text: 'hsl(45, 70%, 20%)', border: 'hsl(45, 70%, 80%)' },
      dark: { background: 'hsl(45, 70%, 15%)', text: 'hsl(45, 70%, 90%)', border: 'hsl(45, 70%, 30%)' }
    }
  }
];

export default function SummaryShowcase() {
  const [scenario, setScenario] = useState<'completed-early' | 'completed-late' | 'time-up' | 'active'>('completed-early');
  const [showSkipped, setShowSkipped] = useState(false);

  const getScenarioProps = () => {
    const baseProps = {
      entries: mockTimelineEntries,
      totalDuration: 3600, // 1 hour planned
      skippedActivityIds: showSkipped ? ['5', '6'] : []
    };

    switch (scenario) {
      case 'completed-early':
        return {
          ...baseProps,
          elapsedTime: 2700, // 45 minutes (15 minutes early)
          timerActive: false,
          allActivitiesCompleted: true,
          isTimeUp: false
        };
      case 'completed-late':
        return {
          ...baseProps,
          elapsedTime: 4200, // 70 minutes (10 minutes late)
          timerActive: false,
          allActivitiesCompleted: true,
          isTimeUp: false
        };
      case 'time-up':
        return {
          ...baseProps,
          elapsedTime: 3600, // Exactly 1 hour
          timerActive: false,
          allActivitiesCompleted: false,
          isTimeUp: true
        };
      case 'active':
        return {
          ...baseProps,
          elapsedTime: 1800, // 30 minutes elapsed
          timerActive: true,
          allActivitiesCompleted: true, // Changed to true so summary renders
          isTimeUp: false
        };
      default:
        return baseProps;
    }
  };

  const handleReset = () => {
    console.log('Reset clicked');
  };

  return (
    <ToastProvider>
      <ApiKeyProvider>
        <div style={{ padding: 'var(--md-sys-spacing-6)', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: 'var(--md-sys-spacing-6)' }}>
            <h1 style={{ 
              fontFamily: 'var(--md-sys-typescale-display-small-font)',
              fontSize: 'var(--md-sys-typescale-display-small-size)',
              fontWeight: 'var(--md-sys-typescale-display-small-weight)',
              color: 'var(--md-sys-color-on-surface)',
              marginBottom: 'var(--md-sys-spacing-4)'
            }}>
              Material 3 Summary Component Showcase
            </h1>
            
            <p style={{ 
              fontFamily: 'var(--md-sys-typescale-body-large-font)',
              fontSize: 'var(--md-sys-typescale-body-large-size)',
              color: 'var(--md-sys-color-on-surface-variant)',
              marginBottom: 'var(--md-sys-spacing-5)'
            }}>
              Explore different states and scenarios of the Material 3 Expressive Summary component.
            </p>

            <div style={{ 
              display: 'flex', 
              gap: 'var(--md-sys-spacing-3)', 
              marginBottom: 'var(--md-sys-spacing-4)',
              flexWrap: 'wrap'
            }}>
              <Material3Button
                variant={scenario === 'completed-early' ? 'filled' : 'outlined'}
                onClick={() => setScenario('completed-early')}
              >
                Completed Early
              </Material3Button>
              <Material3Button
                variant={scenario === 'completed-late' ? 'filled' : 'outlined'}
                onClick={() => setScenario('completed-late')}
              >
                Completed Late
              </Material3Button>
              <Material3Button
                variant={scenario === 'time-up' ? 'filled' : 'outlined'}
                onClick={() => setScenario('time-up')}
              >
                Time Up
              </Material3Button>
              <Material3Button
                variant={scenario === 'active' ? 'filled' : 'outlined'}
                onClick={() => setScenario('active')}
              >
                Active Timer
              </Material3Button>
            </div>

            <div style={{ marginBottom: 'var(--md-sys-spacing-5)' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--md-sys-spacing-2)',
                fontFamily: 'var(--md-sys-typescale-body-medium-font)',
                color: 'var(--md-sys-color-on-surface)'
              }}>
                <input
                  type="checkbox"
                  checked={showSkipped}
                  onChange={(e) => setShowSkipped(e.target.checked)}
                  style={{ accentColor: 'var(--md-sys-color-primary)' }}
                />
                Show skipped activities
              </label>
            </div>
          </div>

          <div style={{ 
            background: 'var(--md-sys-color-surface)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            padding: 'var(--md-sys-spacing-4)',
            border: '1px solid var(--md-sys-color-outline-variant)'
          }}>
            <h2 style={{ 
              fontFamily: 'var(--md-sys-typescale-headline-small-font)',
              fontSize: 'var(--md-sys-typescale-headline-small-size)',
              fontWeight: 'var(--md-sys-typescale-headline-small-weight)',
              color: 'var(--md-sys-color-on-surface)',
              marginBottom: 'var(--md-sys-spacing-4)'
            }}>
              Current Scenario: {scenario.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h2>
            
            <SummaryMaterial3 
              {...getScenarioProps()}
              onReset={handleReset}
            />
          </div>

          <div style={{ 
            marginTop: 'var(--md-sys-spacing-6)',
            padding: 'var(--md-sys-spacing-5)',
            background: 'var(--md-sys-color-surface-container-low)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            border: '1px solid var(--md-sys-color-outline-variant)'
          }}>
            <h3 style={{ 
              fontFamily: 'var(--md-sys-typescale-title-medium-font)',
              fontSize: 'var(--md-sys-typescale-title-medium-size)',
              fontWeight: 'var(--md-sys-typescale-title-medium-weight)',
              color: 'var(--md-sys-color-on-surface)',
              marginBottom: 'var(--md-sys-spacing-3)'
            }}>
              Material 3 Expressive Features
            </h3>
            
            <ul style={{ 
              fontFamily: 'var(--md-sys-typescale-body-medium-font)',
              color: 'var(--md-sys-color-on-surface-variant)',
              lineHeight: '1.6'
            }}>
              <li><strong>Elevated Containers:</strong> Dynamic elevation that responds to hover states</li>
              <li><strong>Organic Shapes:</strong> Varied corner radius for visual interest</li>
              <li><strong>Expressive Typography:</strong> Material 3 type scale with dynamic hierarchy</li>
              <li><strong>Contextual Colors:</strong> Theme-aware color adaptation with semantic roles</li>
              <li><strong>Smooth Animations:</strong> Purposeful transitions with Material 3 motion</li>
              <li><strong>Enhanced Interactions:</strong> Hover effects with scale and elevation changes</li>
              <li><strong>Responsive Design:</strong> Fluid layouts that adapt to different screen sizes</li>
              <li><strong>Accessibility:</strong> Proper ARIA labels and keyboard navigation</li>
            </ul>
          </div>
        </div>
      </ApiKeyProvider>
    </ToastProvider>
  );
}