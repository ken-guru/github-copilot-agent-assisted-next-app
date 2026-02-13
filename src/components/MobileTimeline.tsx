'use client';
import React from 'react';
import { Card } from 'react-bootstrap';
import type { TimelineEntry } from '@/types';

interface MobileTimelineProps {
  entries: TimelineEntry[];
  totalDuration: number;
  currentTime: number;
}

export const MobileTimeline: React.FC<MobileTimelineProps> = ({ entries, totalDuration, currentTime }) => {
  const calcPercent = (start: number, end: number | null) => 
    ((end || currentTime) - start) / totalDuration * 100;

  return (
    <Card className="mobile-timeline-card mb-3">
      <Card.Header><h6 className="mb-0">Timeline</h6></Card.Header>
      <Card.Body className="p-2">
        {entries.length === 0 ? (
          <p className="text-muted text-center py-3 mb-0">No activities tracked yet</p>
        ) : (
          <div className="mobile-timeline-stack">
            {entries.map(entry => {
              const percent = calcPercent(entry.startTime, entry.endTime || null);
              const duration = ((entry.endTime || currentTime) - entry.startTime) / 60000;
              
              // Extract colors based on theme-aware or simple structure
              const colors = entry.colors 
                ? ('background' in entry.colors 
                    ? entry.colors 
                    : ('light' in entry.colors ? entry.colors.light : { background: '#e9ecef', border: '#dee2e6' }))
                : { background: '#e9ecef', border: '#dee2e6' };
              
              return (
                <div 
                  key={entry.id} 
                  className={`mobile-timeline-entry ${!entry.endTime ? 'active' : ''}`}
                  style={{ 
                    backgroundColor: colors.background, 
                    borderLeftColor: colors.border 
                  }}
                >
                  <div className="entry-header">
                    <span className="entry-name">{entry.activityName || 'Break'}</span>
                    {!entry.endTime && <span className="badge bg-success">Running</span>}
                  </div>
                  <div className="entry-meta">
                    <span>{Math.round(duration)}min</span>
                    <span>{percent.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
